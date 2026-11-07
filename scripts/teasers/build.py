"""차시 여는 영상 만들기 — content/teasers/{slug}.json → public/video/lessons/{slug}.mp4 (+ .webp 포스터)

장면마다 macOS 'say'(기본 유나)로 내레이션을 만들고, 그 길이에 맞춰 HTML 애니메이션을 30fps로 한 장씩 찍어 ffmpeg로 묶는다.
필요: macOS say, ffmpeg, python3 + playwright(chromium) + Pillow
실행: python3 scripts/teasers/build.py [slug ...]
"""
import html, json, shutil, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "video" / "lessons"
AREA = {"자기": "#6D4FC2", "대인관계": "#BF4027", "공동체": "#17784E", "마음건강": "#2F6FB8"}
FPS, W, H = 30, 1920, 1080
FADE = 0.45
SANS = (ROOT / "node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2").as_uri()
SERIF = (PUBLIC / "fonts/gowun-batang/GowunBatang-Bold.woff2").as_uri()
e = lambda s: html.escape(str(s or ""))

def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).strip())

def narrate(spec, tmp):
    lens = []
    for i, sc in enumerate(spec["scenes"]):
        a = tmp / f"n{i}.aiff"
        subprocess.run(["say", "-v", spec.get("voice", "Yuna"), "-r", str(spec.get("rate", 168)), "-o", str(a), sc["say"]], check=True)
        lens.append(dur(a))
    return lens

def scene_html(sc, i, t0, d, L, acc):
    out = f'<section class="sc{" cont" if sc.get("cont") else ""}" style="--t0:{t0}s;--d:{d}s;--bg:{sc.get("bg", "#F5F6F2")}">'
    if sc["kind"] == "image":
        fit = sc.get("fit", "cover")
        out += f'<img class="art {fit}" src="{(PUBLIC / sc["image"].lstrip("/")).as_uri()}" style="object-position:{sc.get("focus", "50% 50%")}">'
        if sc.get("caption"):
            out += f'<p class="cap"><span>{e(sc["caption"])}</span></p>'
        for k, c in enumerate(sc.get("chips", [])):
            out += f'<b class="chip" style="left:{c["x"]}%;top:{c["y"]}%;--k:{k}">{e(c["text"])}</b>'
        for k, b in enumerate(sc.get("bubbles", [])):
            out += f'<b class="bub" style="left:{b["x"]}%;top:{b["y"]}%;--k:{k}">{e(b["text"])}</b>'
    else:  # 제목
        out += f'''<div class="ttl" style="--ac:{acc}"><p class="k">중{L["grade"]} · {e(L["area"])} · {e(L["skill"])}</p>
<h1>{e(L["title"])}</h1><p class="q"><span>{e(L["keyQuestion"])}</span></p><p class="brand">LEV LAB</p></div>'''
    return out + "</section>"

CSS = """
@font-face{font-family:P;src:url('%(sans)s') format('woff2');font-weight:100 900}
@font-face{font-family:G;src:url('%(serif)s') format('woff2');font-weight:700}
*{box-sizing:border-box;margin:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#000;font-family:P,sans-serif;word-break:keep-all}
.sc{position:absolute;inset:0;background:var(--bg);opacity:0;animation:show var(--d) linear var(--t0) both}
@keyframes show{0%%{opacity:0}%(fi)s{opacity:1}100%%{opacity:1}}
.sc.cont{animation-name:showc}
@keyframes showc{0%%{opacity:0}.1%%{opacity:1}100%%{opacity:1}}
.sc.cont .art{animation-name:kb2}
@keyframes kb2{from{transform:scale(1.12)}to{transform:scale(1.2)}}
.art{position:absolute;inset:0;width:100%%;height:100%%;animation:kb var(--d) linear var(--t0) both}
.art.contain{object-fit:contain;padding:120px 280px 200px}
.art.cover{object-fit:cover}
@keyframes kb{from{transform:scale(1.02)}to{transform:scale(1.12)}}
.cap{position:absolute;left:0;right:0;bottom:90px;text-align:center}
.cap span{display:inline-block;font-family:G,serif;font-size:72px;color:#1E2A24;background:rgba(255,255,255,.92);padding:14px 40px 18px;border-radius:24px;box-shadow:0 10px 40px rgba(0,0,0,.12);animation:up .7s cubic-bezier(.2,1.2,.4,1) calc(var(--t0) + .35s) both}
@keyframes up{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
.chip{position:absolute;transform:translate(-50%%,-50%%);font-size:96px;font-weight:900;color:#fff;background:#BF4027;padding:8px 40px 14px;border-radius:999px;box-shadow:8px 8px 0 #1E2A24;animation:pop .55s cubic-bezier(.2,1.6,.4,1) calc(var(--t0) + .5s + var(--k) * 1.1s) both}
.chip:nth-of-type(2){background:#6D4FC2}
@keyframes pop{from{transform:translate(-50%%,-50%%) scale(0) rotate(-12deg)}to{transform:translate(-50%%,-50%%) scale(1) rotate(-3deg)}}
.bub{position:absolute;transform:translate(-50%%,-50%%);font-size:46px;font-weight:800;color:#1E2A24;background:#fff;border:5px solid #1E2A24;padding:10px 28px 14px;border-radius:40px;white-space:nowrap;animation:pop .5s cubic-bezier(.2,1.6,.4,1) calc(var(--t0) + .4s + var(--k) * .9s) both}
.bub::after{content:"";position:absolute;left:50%%;bottom:-26px;width:26px;height:26px;background:#fff;border-right:5px solid #1E2A24;border-bottom:5px solid #1E2A24;transform:translateX(-50%%) rotate(45deg)}
.ttl{position:absolute;inset:0;background:var(--ac);color:#fff;display:flex;flex-direction:column;justify-content:center;padding:0 200px}
.ttl .k{font-size:40px;opacity:.9;animation:up .6s ease calc(var(--t0) + .2s) both}
.ttl h1{font-size:132px;line-height:1.1;margin:22px 0 40px;letter-spacing:-.02em;animation:up .7s cubic-bezier(.2,1.2,.4,1) calc(var(--t0) + .45s) both}
.ttl .q{font-family:G,serif;font-size:58px;line-height:1.45;color:#1E2A24}
.ttl .q span{background:linear-gradient(#FFE45C,#FFE45C) no-repeat 0 0/0%% 100%%;padding:4px 14px;animation:hl 1.1s ease calc(var(--t0) + 1.1s) both;box-decoration-break:clone;-webkit-box-decoration-break:clone}
@keyframes hl{to{background-size:100%% 100%%}}
.ttl .brand{position:absolute;right:120px;bottom:80px;font-weight:800;letter-spacing:.2em;font-size:34px;opacity:.85}
"""

def build(slug, lessons, page):
    spec = json.load(open(ROOT / f"content/teasers/{slug}.json", encoding="utf-8"))
    L = lessons[slug]; acc = AREA.get(L["area"], "#1F5C3F")
    tmp = Path(tempfile.mkdtemp(prefix=f"teaser-{slug}-"))
    lens = narrate(spec, tmp)
    durs = [max(2.8, n + 0.9) for n in lens]; durs[-1] += 1.6
    starts, t = [], 0.0
    for i, d in enumerate(durs):
        if i and spec["scenes"][i].get("cont"): t += FADE  # 같은 그림이 이어지면 겹치지 않고 바로 이어 붙인다
        starts.append(t); t += d - FADE
    total = starts[-1] + durs[-1]
    scenes = "".join(scene_html(sc, i, starts[i], durs[i], L, acc) for i, sc in enumerate(spec["scenes"]))
    doc = f'<!doctype html><html lang="ko"><meta charset="utf-8"><style>{CSS % {"sans": SANS, "serif": SERIF, "fi": "8%", "fo": "92%"}}</style><body>{scenes}</body></html>'
    hp = tmp / "t.html"; hp.write_text(doc, encoding="utf-8")
    page.set_viewport_size({"width": W, "height": H})
    page.goto(hp.as_uri()); page.wait_for_load_state("networkidle"); page.evaluate("document.fonts.ready")
    page.evaluate("document.getAnimations().forEach(a => a.pause())")
    frames = tmp / "f"; frames.mkdir()
    n = int(total * FPS)
    for i in range(n):
        page.evaluate(f"document.getAnimations().forEach(a => a.currentTime = {i * 1000 / FPS})")
        page.screenshot(path=str(frames / f"{i:05d}.jpg"), type="jpeg", quality=90)
    # 내레이션을 장면 시작 0.35초 뒤에 깐다
    ins, flt = [], []
    for i, st in enumerate(starts):
        ins += ["-i", str(tmp / f"n{i}.aiff")]
        ms = int((st + 0.35) * 1000); flt.append(f"[{i + 1}:a]adelay={ms}|{ms}[a{i}]")
    mix = "".join(f"[a{i}]" for i in range(len(starts))) + f"amix=inputs={len(starts)}:normalize=0,apad=whole_dur={total:.2f},loudnorm=I=-16:TP=-1.5[a]"
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"{slug}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(frames / "%05d.jpg"), *ins,
                    "-filter_complex", ";".join(flt) + ";" + mix, "-map", "0:v", "-map", "[a]",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p", "-vf", "scale=1280:-2",
                    "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-shortest", str(out)], check=True)
    from PIL import Image
    Image.open(frames / f"{int((starts[-1] + 2.2) * FPS):05d}.jpg").convert("RGB").resize((1280, 720)).save(OUT / f"{slug}.webp", "WEBP", quality=82)
    shutil.rmtree(tmp)
    print(f"{slug}: {total:.1f}s, {len(starts)} scenes → {out.relative_to(ROOT)} ({out.stat().st_size // 1024}KB)")

def main():
    from playwright.sync_api import sync_playwright
    lessons = {l["slug"]: l for l in json.load(open(ROOT / "content/lessons.json", encoding="utf-8"))["lessons"]}
    slugs = sys.argv[1:] or sorted(p.stem for p in (ROOT / "content/teasers").glob("*.json"))
    with sync_playwright() as pw:
        b = pw.chromium.launch(); page = b.new_page()
        for s in slugs: build(s, lessons, page)
        b.close()

if __name__ == "__main__":
    main()
