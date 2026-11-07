#!/usr/bin/env python3
"""Capture local lesson-kit QA without modifying authored content or public assets.

Examples (Python needs playwright, Pillow, pypdfium2; ffmpeg/ffprobe for video):
  python scripts/rollout/qa_shots.py --serve g1-09 g1-05 g1-06 g1-10
  python scripts/rollout/qa_shots.py --base-url http://localhost:3110 g1-09

--serve builds a fresh production snapshot, starts an owned localhost Next server,
and stops it even when capture fails. Otherwise use an already-running server.
No slugs selects published/core lessons. Findings are evidence, not script errors;
--fail-on-findings makes overflow/missing images fail the command as well.
"""
import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
import hashlib
import json
import math
import os
from pathlib import Path
import re
import signal
import socket
import subprocess
import sys
import time
from urllib.parse import urlparse
from urllib.request import urlopen

from PIL import Image, ImageDraw, ImageFont, ImageOps
from playwright.sync_api import sync_playwright
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
DEFAULT_OUT = ROOT / "docs/audit/rollout-qa"
VIEWPORTS = [(1920, 1080), (1366, 768)]

# Runs on the real rendered DOM. Report normalized, unscaled stage coordinates.
# Hidden questions, unrevealed steps, screen-reader text and the reverse side of
# flip cards are intentionally excluded. Every build is checked independently.
INSPECT = r"""async ({number, spec, lesson, nextLesson}) => {
  const page = document.querySelector(`.slide-page[id="${number}"]`);
  if (!page || page.hidden) throw new Error(`Slide ${number} is not active`);
  const stage = page.getBoundingClientRect();
  const sx = stage.width / 1920, sy = stage.height / 1080;
  const norm = r => ({x:(r.left-stage.left)/sx, y:(r.top-stage.top)/sy, width:r.width/sx, height:r.height/sy});
  const round = r => Object.fromEntries(Object.entries(r).map(([k,v]) => [k, Math.round(v*100)/100]));
  const visible = el => {
    if (el.closest('[hidden], .sr-only, .slide-pending')) return false;
    const front = el.closest('.slide-flip-front'), back = el.closest('.slide-flip-back');
    if (front?.closest('.slide-flip-card')?.classList.contains('is-flipped')) return false;
    if (back && !back.closest('.slide-flip-card')?.classList.contains('is-flipped')) return false;
    for (let p = el; p && p !== page.parentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const index = (el, selector) => [...page.querySelectorAll(selector)].indexOf(el.closest(selector));
  function field(el) {
    if (el.closest('.slide-title-copy h1')) return 'lesson.title';
    if (el.closest('.slide-next-title')) return 'nextLesson.title';
    if (el.closest('.slide-next-question')) return 'nextLesson.keyQuestion';
    if (el.closest('.slide-big-question')) return 'lesson.keyQuestion';
    if (el.closest('.slide-skill')) return spec.type === 'next' ? 'nextLesson.skill' : 'lesson.skill';
    if (el.closest('.slide-standard')) return spec.type === 'next' ? 'nextLesson.standard' : 'lesson.standard';
    if (el.closest('.slide-goals li')) return `goals[${index(el,'.slide-goals li')}]`;
    const journey = el.closest('.slide-journey li');
    if (journey) {
      const i = index(el,'.slide-journey li'), stageName = lesson.flow[i]?.stage;
      return el.closest('p') ? `titles.${stageName}` : `lesson.flow[${i}]`;
    }
    if (el.closest('.slide-steps > li')) return `steps[${index(el,'.slide-steps > li')}]`;
    if (el.closest('.slide-story-text')) return 'story';
    if (el.closest('.slide-choice-cell')) return `choices[${index(el,'.slide-choice-cell')}]`;
    const card = el.closest('.slide-concept');
    if (card) {
      const i = index(el,'.slide-concept');
      return `cards[${i}]` + (el.closest('h3') ? '.title' : el.closest('.slide-example') ? '.example' : el.closest('p') ? '.text' : '');
    }
    const frame = el.closest('.slide-frame');
    if (frame) {
      const i = index(el,'.slide-frame'), p = el.closest('p');
      return p ? `rows[${[...frame.querySelectorAll('p')].indexOf(p)}] (frame ${i})` : `frames[${i}]`;
    }
    if (el.closest('.slide-picture-ask')) return `ask[${index(el,'.slide-picture-ask')}]`;
    if (el.closest('.slide-questions > div')) return `ask[${index(el,'.slide-questions > div')}]`;
    const flip = el.closest('.slide-flip-card');
    if (flip) {
      const i = index(el,'.slide-flip-card');
      const side = flip.classList.contains('is-flipped') ? 'right' : 'left';
      return el.closest('small') ? `${side}.label` : `${side}.items[${i}]`;
    }
    if (el.closest('.slide-toy-instruction')) return 'toy.prompt';
    if (el.closest('.slide-compare > li')) {
      const i = index(el,'.slide-compare > li'), row = el.closest('li');
      return `${el.closest('p') === row.querySelector('p') ? 'left' : 'right'}.items[${i}]`;
    }
    if (el.closest('.slide-compare-head h3')) return `${index(el,'.slide-compare-head h3') ? 'right' : 'left'}.label`;
    if (el.closest('.slide-exit-prompt')) return 'prompt';
    if (el.closest('.slide-end-message')) return 'message';
    if (el.closest('.slide-app-link')) return 'app';
    if (el.closest('.slide-roulette')) return 'toy.items';
    if (el.closest('.slide-video-caption')) return 'video.captions';
    if (el.closest('.slide-art figcaption')) return 'image.credit';
    if (el.closest('.slide-content > h2, .slide-video > h2, .slide-question-layout > h2')) return 'heading';
    if (el.closest('.slide-timer-slot')) return 'timer';
    if (el.closest('.slide-topline, .slide-bottomline, .slide-lesson-meta')) return 'ui.lesson-meta';
    return `layout.${el.classList[0] || el.tagName.toLowerCase()}`;
  }
  function selector(el) {
    const pieces = [];
    while (el && el !== page) {
      const tag = el.tagName.toLowerCase();
      const siblings = [...el.parentElement.children].filter(e => e.tagName === el.tagName);
      pieces.unshift(tag + (el.classList[0] ? '.' + CSS.escape(el.classList[0]) : '') + (siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(el)+1})` : ''));
      el = el.parentElement;
    }
    return `[id="${number}"]` + (pieces.length ? ' > ' + pieces.join(' > ') : '');
  }
  const overflows = [], missing = [], footer = page.querySelector('.slide-bottomline').getBoundingClientRect();
  for (const el of [page, ...page.querySelectorAll('*')]) {
    if (!(el instanceof HTMLElement) || !visible(el) || !el.innerText?.trim()) continue;
    const rect = el.getBoundingClientRect(), r = norm(rect), cs = getComputedStyle(el);
    const reasons = [], directText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    // Inline metrics are zero in Chromium; their stage bounds still matter.
    if (el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 2) reasons.push('vertical_box_overflow');
    if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2) reasons.push('horizontal_box_overflow');
    if (r.x < -2 || r.y < -2 || r.x+r.width > 1922 || r.y+r.height > 1082) reasons.push('outside_stage');
    // Extra audit guard: visible text may collide with the footer before it exits
    // the stage. Ignore ancestor layout boxes and intentional flip containers.
    if (directText && el.closest('.slide-content') && !el.classList.contains('slide-flip-inner') && rect.bottom > footer.top+2*sy && rect.top < footer.bottom && rect.right > footer.left && rect.left < footer.right) reasons.push('footer_overlap');
    if (reasons.length) {
      const f = field(el), related = new Set();
      if (f.startsWith('layout.')) for (const child of el.querySelectorAll('h1,h2,h3,p,li,button,figcaption')) {
        if (visible(child)) { const cf = field(child); if (!cf.startsWith('layout.')) related.add(cf); }
      }
      overflows.push({selector:selector(el), field:f, related_fields:[...related], reasons,
        text:el.innerText.trim().slice(0,500), bounds:round(r),
        client:{width:el.clientWidth,height:el.clientHeight}, scroll:{width:el.scrollWidth,height:el.scrollHeight},
        overflow_px:round({vertical_box:Math.max(0,el.scrollHeight-el.clientHeight),horizontal_box:Math.max(0,el.scrollWidth-el.clientWidth),stage_top:Math.max(0,-r.y),stage_left:Math.max(0,-r.x),stage_bottom:Math.max(0,r.y+r.height-1080),stage_right:Math.max(0,r.x+r.width-1920),footer_overlap:reasons.includes('footer_overlap') ? (rect.bottom-footer.top)/sy : 0}),
        intentional_scroll:['auto','scroll'].includes(cs.overflowY) || ['auto','scroll'].includes(cs.overflowX)});
    }
  }
  for (const img of page.querySelectorAll('img')) {
    if (visible(img) && (!img.complete || !img.naturalWidth)) missing.push({field:img.closest('.slide-video') ? 'video.poster' : spec.type === 'title' ? 'lesson.image' : spec.type === 'next' ? 'nextLesson.image' : 'image.src', src:img.getAttribute('src'), reason:'image_load_failed', selector:selector(img)});
  }
  for (const video of page.querySelectorAll('video[poster]')) {
    if (!visible(video)) continue;
    const probe = new Image(); probe.src = video.poster;
    await Promise.race([probe.decode().catch(() => null), new Promise(resolve => setTimeout(resolve,5000))]);
    if (!probe.complete || !probe.naturalWidth) missing.push({field:'video.poster',src:video.getAttribute('poster'),reason:'poster_load_failed',selector:selector(video)});
  }
  const expected = [];
  if (spec.image?.src) expected.push(['image.src',spec.image.src,'.slide-art img, .slide-hint img']);
  if (spec.type === 'title') expected.push(['lesson.image',`/images/lessons/${lesson.slug}.webp`,'.slide-art img']);
  if (spec.type === 'next' && nextLesson) expected.push(['nextLesson.image',`/images/lessons/${nextLesson.slug}.webp`,'.slide-art img']);
  if (spec.video?.poster) expected.push(['video.poster',spec.video.poster,'.slide-video img, .slide-video video[poster]']);
  for (const [f,src,query] of expected) {
    if (!page.querySelector(query)) {
      const placeholder = page.querySelector(f === 'video.poster' ? '.slide-video-placeholder' : '.slide-art-placeholder');
      missing.push({field:f,src,reason:placeholder ? 'rendered_placeholder' : 'declared_image_not_rendered',selector:query.split(',').map(q => `[id="${number}"] ${q.trim()}`).join(', ')});
    }
  }
  return {overflows, missing_images:missing, stage:{width:1920,height:1080,scale_x:sx,scale_y:sy}, pending_steps:page.querySelectorAll('.slide-pending').length};
}"""


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def label_font(size=18):
    for name in ("/System/Library/Fonts/Helvetica.ttc", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default(size=size)


def contact_sheet(tiles, destination, columns=4, tile_size=(480, 270)):
    """tiles: (image path, short ASCII label). Preserve each image's aspect ratio."""
    columns = min(columns, len(tiles))
    width, height = tile_size
    label_height, gap = 32, 10
    rows = math.ceil(len(tiles) / columns)
    sheet = Image.new("RGB", (columns * (width + gap) + gap, rows * (height + label_height + gap) + gap), "#e5e8e4")
    draw = ImageDraw.Draw(sheet)
    font = label_font()
    for i, (filename, label) in enumerate(tiles):
        x, y = gap + i % columns * (width + gap), gap + i // columns * (height + label_height + gap)
        draw.text((x + 6, y + 5), label, fill="#1e2a24", font=font)
        with Image.open(filename) as original:
            thumb = ImageOps.contain(original.convert("RGB"), (width, height), Image.Resampling.LANCZOS)
            sheet.paste(thumb, (x + (width - thumb.width) // 2, y + label_height + (height - thumb.height) // 2))
    sheet.save(destination, "JPEG", quality=90, optimize=True)


def worksheet_shots(slug, output):
    items, rows = [], []
    folder = output / "worksheets"
    folder.mkdir(exist_ok=True)
    for suffix in ("worksheet", "cards", "cardsets"):
        src = PUBLIC / "files/worksheets" / f"{slug}-{suffix}.pdf"
        entry = {"file": str(src.relative_to(ROOT)), "exists": src.is_file(), "pages": 0}
        items.append(entry)
        if not src.is_file():
            continue
        tiles = []
        with pdfium.PdfDocument(str(src)) as pdf:
            entry["pages"] = len(pdf)
            for i, page in enumerate(pdf):
                png = folder / f"{suffix}-{i + 1:02d}.png"
                page.render(scale=1.5).to_pil().convert("RGB").save(png)
                tiles.append((png, f"{suffix} / page {i + 1}"))
        row = folder / f"{suffix}-contact.jpg"
        contact_sheet(tiles, row, columns=len(tiles), tile_size=(400, 566))
        rows.append(row)
    if rows:
        images = [Image.open(row).convert("RGB") for row in rows]
        sheet = Image.new("RGB", (max(im.width for im in images), sum(im.height for im in images)), "#e5e8e4")
        y = 0
        for im in images:
            sheet.paste(im, (0, y)); y += im.height; im.close()
        sheet.save(output / "worksheet.jpg", "JPEG", quality=90, optimize=True)
    else:
        sheet = Image.new("RGB", (900, 140), "#f5f6f2")
        ImageDraw.Draw(sheet).text((28, 50), f"{slug}: worksheet/cards/cardsets PDFs not built yet", font=label_font(22), fill="#4a5650")
        sheet.save(output / "worksheet.jpg", "JPEG", quality=90)
    return items


def teaser_shots(slug, output):
    src = PUBLIC / "video/lessons" / f"{slug}.mp4"
    if not src.is_file():
        (output / "teaser.jpg").unlink(missing_ok=True)
        return {"file": str(src.relative_to(ROOT)), "exists": False}
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(src)], check=True, capture_output=True, text=True, timeout=30)
    duration = float(json.loads(probe.stdout)["format"]["duration"])
    if not math.isfinite(duration) or duration <= 0:
        raise ValueError(f"Invalid teaser duration: {duration}")
    folder = output / "teaser"
    folder.mkdir(exist_ok=True)
    tiles, times = [], []
    for i in range(8):
        when = duration * (i + 0.5) / 8
        filename = folder / f"{i + 1:02d}.jpg"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{when:.6f}", "-i", str(src), "-frames:v", "1", "-vf", "scale=960:-2", "-q:v", "2", str(filename)], check=True, capture_output=True, timeout=40)
        if not filename.is_file():
            raise RuntimeError(f"No teaser frame at {when:.2f}s")
        tiles.append((filename, f"{i + 1} / {when:.2f}s")); times.append(round(when, 3))
    contact_sheet(tiles, output / "teaser.jpg")
    return {"file": str(src.relative_to(ROOT)), "exists": True, "duration": duration, "frame_times": times}


def build_count(slide):
    if slide["type"] == "ask":
        return max(1, len(slide.get("ask", [])))
    if slide["type"] == "compare":
        return max(1, len(slide.get("left", {}).get("items", [])) + (slide.get("toy", {}).get("kind") == "flip"))
    return max(1, len(slide.get("steps", [])))


def settle(page):
    page.evaluate("""async () => {
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll('.slide-page:not([hidden]) img')].map(i => i.decode().catch(() => null)));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }""")


def capture_deck(browser, slug, base_url, output, lessons, timeout):
    source = ROOT / "content/slides" / f"{slug}.json"
    source_bytes = source.read_bytes()
    raw = json.loads(source_bytes)
    lesson = lessons[slug]
    next_lesson = next(iter(sorted((l for l in lessons.values() if l["grade"] == lesson["grade"] and l["coreOrder"] > lesson["coreOrder"]), key=lambda l: l["coreOrder"])), None)
    specs = [(i, s) for i, s in enumerate(raw["slides"]) if s["type"] != "next" or next_lesson]
    result = {"slug": slug, "url": f"{base_url}/lessons/{slug}/slides", "captured_at": datetime.now(timezone.utc).isoformat(), "source": str(source.relative_to(ROOT)), "source_sha256": hashlib.sha256(source_bytes).hexdigest(), "slide_count": len(specs), "viewports": [], "browser_errors": [], "warnings": []}
    context = browser.new_context(viewport={"width": 1920, "height": 1080}, reduced_motion="reduce", device_scale_factor=1)
    try:
        page = context.new_page()
        page.set_default_timeout(timeout * 1000)
        page.on("pageerror", lambda error: result["browser_errors"].append(str(error)))
        response = page.goto(result["url"], wait_until="networkidle", timeout=timeout * 1000)
        if not response or response.status != 200:
            raise RuntimeError(f"Deck HTTP {response.status if response else 'no response'}")
        page.locator(".lesson-slides.is-presenting").wait_for()
        dom_types = page.locator(".slide-page").evaluate_all("els => els.map(el => [...el.classList].find(c => c.startsWith('slide-type-')).slice(11))")
        if dom_types != [s["type"] for _, s in specs]:
            raise RuntimeError("Rendered slide sequence differs from current JSON; rebuild/restart the local server")
        page.add_style_tag(content=".slide-controls { visibility: hidden !important; } nextjs-portal { display:none !important; }")
        for width, height in VIEWPORTS:
            viewport = {"width": width, "height": height, "slides": []}
            result["viewports"].append(viewport)
            page.set_viewport_size({"width": width, "height": height})
            page.locator(".lesson-slides").focus()
            page.keyboard.press("Home")
            page.wait_for_function("document.querySelector('.slide-page:not([hidden])')?.id === '1'")
            folder = output / "slides" / f"{width}x{height}"
            folder.mkdir(parents=True, exist_ok=True)
            tiles = []
            for number, (source_index, spec) in enumerate(specs, 1):
                page.wait_for_function("n => document.querySelector('.slide-page:not([hidden])')?.id === String(n)", arg=number)
                count = build_count(spec)
                record = {"slide": number, "source_index": source_index, "type": spec["type"], "heading": spec.get("heading"), "build_count": count, "builds": []}
                viewport["slides"].append(record)
                for build in range(1, count + 1):
                    settle(page)
                    findings = page.evaluate(INSPECT, {"number": number, "spec": spec, "lesson": lesson, "nextLesson": next_lesson})
                    for issue in findings["overflows"]:
                        issue["source_field"] = issue["field"] if issue["field"].startswith(("lesson.", "nextLesson.")) else f"slides[{source_index}].{issue['field']}"
                    for issue in findings["missing_images"]:
                        src = issue.get("src", "")
                        issue["file_exists"] = (PUBLIC / src.lstrip("/")).is_file() if src.startswith("/") else None
                        issue["source_field"] = issue["field"] if issue["field"].startswith(("lesson.", "nextLesson.")) else f"slides[{source_index}].{issue['field']}"
                    record["builds"].append({"build": build, **findings})
                    # The main contact uses the final state. Keep earlier exclusive
                    # questions and flip states too, since a single tile cannot show them.
                    if build == count or spec["type"] == "ask" or spec.get("toy", {}).get("kind") == "flip":
                        name = f"{number:02d}.jpg" if build == count else f"{number:02d}-build-{build:02d}.jpg"
                        page.screenshot(path=str(folder / name), type="jpeg", quality=85, animations="disabled")
                    if build < count:
                        page.keyboard.press("ArrowRight")
                        page.wait_for_function("""({number,build,count}) => {
                          const active=document.querySelector('.slide-page:not([hidden])');
                          return active?.id===String(number) && active.querySelector('.slide-bottomline').innerText.includes(`${build} / ${count}`);
                        }""", arg={"number": number, "build": build + 1, "count": count})
                if record["builds"][-1]["pending_steps"]:
                    raise RuntimeError(f"Slide {number}: unrevealed steps after {count} builds")
                record["screenshot"] = str((folder / f"{number:02d}.jpg").relative_to(output))
                tiles.append((folder / f"{number:02d}.jpg", f"Slide {number:02d} / {spec['type']}"))
                if number < len(specs):
                    page.keyboard.press("ArrowRight")
            contact_sheet(tiles, output / ("deck.jpg" if width == 1920 else "deck-1366.jpg"))
    finally:
        context.close()
    if source.read_bytes() != source_bytes:
        result["warnings"].append("Source JSON changed during capture; rerun for a consistent snapshot")
    return result


def summarize(result):
    overflows, missing, fields = {}, {}, {}
    for viewport in result["viewports"]:
        size = f"{viewport['width']}x{viewport['height']}"
        for slide in viewport["slides"]:
            for build in slide["builds"]:
                for issue in build["overflows"]:
                    key = (slide["slide"], issue["selector"])
                    overflows[key] = issue
                    fkey = (slide["slide"], issue["field"])
                    item = fields.setdefault(fkey, {"slide": slide["slide"], "source_field": issue["source_field"], "field": issue["field"], "reasons": set(), "viewports": set(), "builds": set(), "text": issue["text"], "related_fields": issue["related_fields"]})
                    item["reasons"].update(issue["reasons"]); item["viewports"].add(size); item["builds"].add(build["build"])
                for issue in build["missing_images"]:
                    missing[(slide["slide"], issue["field"], issue.get("src"))] = {"slide": slide["slide"], **issue}
    return {"slides": result["slide_count"], "overflow_count": len(overflows), "overflow_count_definition": "Unique slide/element selectors across both viewports and all builds", "missing_images": len(missing), "findings": [{**item, "reasons": sorted(item["reasons"]), "viewports": sorted(item["viewports"]), "builds": sorted(item["builds"])} for item in fields.values()], "missing_image_details": list(missing.values())}


@contextmanager
def server(args):
    """Never reuse or terminate someone else's server, nor touch its dev lock."""
    if not args.serve:
        yield args.base_url.rstrip("/")
        return
    with socket.socket() as sock:
        if sock.connect_ex(("127.0.0.1", args.port)) == 0:
            raise RuntimeError(f"Port {args.port} is already occupied; choose another --port")
    args.out.mkdir(parents=True, exist_ok=True)
    with (args.out / "server.log").open("w") as log:
        if not args.no_build:
            print("Building fresh local snapshot (log: server.log)", flush=True)
            subprocess.run(["npm", "run", "build"], cwd=ROOT, stdout=log, stderr=subprocess.STDOUT, check=True)
        process = subprocess.Popen(["node", "node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", str(args.port)], cwd=ROOT, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        base = f"http://127.0.0.1:{args.port}"
        try:
            deadline = time.monotonic() + args.timeout
            while time.monotonic() < deadline:
                if process.poll() is not None:
                    raise RuntimeError("Next server exited; see server.log")
                try:
                    with urlopen(base, timeout=1) as response:
                        if response.status == 200:
                            break
                except OSError:
                    time.sleep(.2)
            else:
                raise RuntimeError("Next server did not become ready; see server.log")
            yield base
        finally:
            if process.poll() is None:
                os.killpg(process.pid, signal.SIGTERM)
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    os.killpg(process.pid, signal.SIGKILL); process.wait()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slugs", nargs="*")
    parser.add_argument("--base-url", default="http://localhost:3227")
    parser.add_argument("--serve", action="store_true", help="Build/start/stop an owned local production server")
    parser.add_argument("--no-build", action="store_true", help="With --serve, reuse the existing production build (may contain stale image placeholders)")
    parser.add_argument("--port", type=int, default=3227)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--timeout", type=int, default=60)
    parser.add_argument("--fail-on-findings", action="store_true")
    args = parser.parse_args()
    if args.no_build and not args.serve:
        parser.error("--no-build requires --serve")
    if args.timeout < 1 or not 1 <= args.port <= 65535:
        parser.error("Use a positive timeout and port 1–65535")
    if not args.serve and urlparse(args.base_url).hostname not in {"localhost", "127.0.0.1", "::1"}:
        parser.error("Use a local server URL")
    lessons = {l["slug"]: l for l in json.loads((ROOT / "content/lessons.json").read_text())["lessons"]}
    slugs = list(dict.fromkeys(args.slugs or [l["slug"] for l in lessons.values() if l.get("status") in {"published", "core"}]))
    if any(not re.fullmatch(r"[a-z0-9-]+", slug) or slug not in lessons for slug in slugs):
        parser.error("Every slug must identify a lesson in content/lessons.json")
    args.out = args.out.resolve(); args.out.mkdir(parents=True, exist_ok=True)
    results, failures = [], []
    with server(args) as base, sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            for slug in slugs:
                print(f"Capturing {slug}: both viewports and every reveal build", flush=True)
                output = args.out / slug; output.mkdir(exist_ok=True)
                try:
                    result = capture_deck(browser, slug, base, output, lessons, args.timeout)
                    result["media"] = {"teaser": teaser_shots(slug, output), "worksheets": worksheet_shots(slug, output)}
                    result["summary"] = summarize(result)
                    write_json(output / "overflow.json", result)
                    (output / "capture-error.json").unlink(missing_ok=True)
                    results.append(result)
                    if result["browser_errors"]:
                        failures.append({"slug": slug, "error": "Browser errors: " + "; ".join(result["browser_errors"])})
                except Exception as error:
                    failures.append({"slug": slug, "error": str(error)})
                    write_json(output / "capture-error.json", failures[-1])
                    print(f"ERROR {slug}: {error}", file=sys.stderr, flush=True)
        finally:
            browser.close()
    print("\nSLUG         SLIDES  OVERFLOW  MISSING IMAGES")
    for r in results:
        s = r["summary"]
        print(f"{r['slug']:<12} {s['slides']:>6}  {s['overflow_count']:>8}  {s['missing_images']:>14}")
    for f in failures:
        print(f"{f['slug']:<12} ERROR   {f['error']}")
    summary = {"captured_at": datetime.now(timezone.utc).isoformat(), "lessons": [{"slug": r["slug"], **r["summary"]} for r in results], "errors": failures}
    write_json(args.out / "summary.json", summary)
    print(f"Evidence: {args.out}")
    return 1 if failures or (args.fail_on_findings and any(r["summary"]["overflow_count"] or r["summary"]["missing_images"] for r in results)) else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, subprocess.SubprocessError, RuntimeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
