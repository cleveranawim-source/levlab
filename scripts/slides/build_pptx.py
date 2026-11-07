"""수업 화면과 같은 내용으로 .pptx 만들기 — content/slides/{slug}.json + content/lessons.json → public/files/slides/{slug}.pptx

필요: python3 + python-pptx + Pillow  (pip install python-pptx pillow)
실행: python3 scripts/slides/build_pptx.py            # 슬라이드가 있는 모든 차시
      python3 scripts/slides/build_pptx.py g1-09      # 한 차시
글꼴은 학교 PC에 늘 있는 '맑은 고딕'을 쓴다. 교사 메모(notes)는 발표자 노트로 들어간다.
"""
import argparse, io, json, math, os, re, sys, unicodedata
from PIL import Image
from pptx import Presentation
from pptx.util import Emu, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PUBLIC = os.path.join(ROOT, "public")
FONT = "맑은 고딕"
INK, INK2, LINE, PAPER2, HL, FOREST = "1E2A24", "4A5650", "DCE2DC", "F5F6F2", "FFE45C", "1F5C3F"
AREA = {"자기": "6D4FC2", "대인관계": "BF4027", "공동체": "17784E", "마음건강": "2F6FB8"}
STAGES = ["도입", "이해하기", "연습하기", "적용하기", "정리"]
W, H = 13.333, 7.5
IN = 914400

def E(x): return Emu(int(x * IN))
def rgb(h): return RGBColor.from_string(h)

def load():
    lessons = json.load(open(os.path.join(ROOT, "content/lessons.json"), encoding="utf-8"))["lessons"]
    return {l["slug"]: l for l in lessons}, lessons

def box(slide, x, y, w, h, fill=None, line=None, shape=MSO_SHAPE.RECTANGLE, radius=None):
    s = slide.shapes.add_shape(shape, E(x), E(y), E(w), E(h))
    if fill: s.fill.solid(); s.fill.fore_color.rgb = rgb(fill)
    else: s.fill.background()
    if line: s.line.color.rgb = rgb(line); s.line.width = Pt(1.5)
    else: s.line.fill.background()
    if radius is not None and shape == MSO_SHAPE.ROUNDED_RECTANGLE: s.adjustments[0] = radius
    s.shadow.inherit = False
    return s

def text(slide, x, y, w, h, runs, size=24, color=INK, bold=False, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, spacing=1.15):
    """runs: str 또는 문단 목록. 문단은 str 또는 (str, {size,color,bold}) """
    tb = slide.shapes.add_textbox(E(x), E(y), E(w), E(h))
    tf = tb.text_frame; tf.word_wrap = True; tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = E(0.05); tf.margin_top = tf.margin_bottom = E(0.03)
    paras = runs if isinstance(runs, list) else [runs]
    # Reserve full wrapped lines, including paragraph gaps. Short copy keeps its
    # original sizes; crowded boxes shrink together instead of losing text.
    def height_at(scale):
        height = 0
        for i, p in enumerate(paras):
            value, options = (p, {}) if isinstance(p, str) else p
            font = options.get("size", size) * scale
            lines = 0
            for line in value.split("\n"):
                # PowerPoint keeps Korean words together when possible, so a
                # character-count estimate alone undercounts wrapped lines.
                used = 0; lines += 1; width = max(1, (w - .1) * 72)
                for word in re.findall(r"\S+\s*", line):
                    advance = sum(.95 if unicodedata.east_asian_width(c) in "WF" else .28 if c.isspace() else .55 for c in word) * font
                    if used and used + advance > width: lines += 1; used = 0
                    while advance > width: lines += 1; advance -= width
                    used += advance
            height += lines * font * spacing * 1.06 + (options.get("gap", 10) * scale if i else 0)
        return height
    scale = 1.0
    while height_at(scale) > (h - .06) * 72 and scale > .4:
        scale = round(scale - .02, 2)
    if scale < 1:
        tf.auto_size = MSO_AUTO_SIZE.TEXT_TO_FIT_SHAPE
    for i, p in enumerate(paras):
        t, o = (p, {}) if isinstance(p, str) else p
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = align; para.line_spacing = spacing
        if i: para.space_before = Pt(o.get("gap", 10) * scale)
        r = para.add_run(); r.text = t
        f = r.font; f.name = FONT; f.size = Pt(o.get("size", size) * scale); f.bold = o.get("bold", bold)
        f.color.rgb = rgb(o.get("color", color))
    return tb

def image(slide, src, x, y, w, h, mode="contain"):
    if not src: return None
    path = os.path.join(PUBLIC, src.lstrip("/"))
    if not os.path.isfile(path):
        print(f"WARN: missing slide image {src}", file=sys.stderr)
        return None
    im = Image.open(path).convert("RGB")
    if mode == "cover":
        r = w / h
        if im.width / im.height > r:
            nw = int(im.height * r); im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
        else:
            nh = int(im.width / r); im = im.crop((0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh))
        bw, bh = w, h
    else:
        s = min(w / im.width, h / im.height); bw, bh = im.width * s, im.height * s
        x, y = x + (w - bw) / 2, y + (h - bh) / 2
    buf = io.BytesIO(); im.save(buf, "JPEG", quality=88); buf.seek(0)
    return slide.shapes.add_picture(buf, E(x), E(y), E(bw), E(bh))

def chrome(slide, L, n, total, stage=None, minutes=None):
    acc = AREA.get(L["area"], FOREST)
    text(slide, 0.6, 0.32, 9, 0.4, f"중{L['grade']} · {L['area']} · {L['title']}", size=13, color=INK2)
    if stage:
        label = f"{stage}" + (f"  {minutes}분" if minutes else "")
        b = box(slide, W - 2.6, 0.28, 2.0, 0.46, fill=acc, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.5)
        tf = b.text_frame; tf.paragraphs[0].alignment = PP_ALIGN.CENTER
        r = tf.paragraphs[0].add_run(); r.text = label; r.font.name = FONT; r.font.size = Pt(15); r.font.bold = True; r.font.color.rgb = rgb("FFFFFF")
    # 아래 진행 막대: 단계 5칸
    gx, gw, gy = 0.6, W - 1.2, H - 0.32
    seg = (gw - 0.08 * 4) / 5
    cur = STAGES.index(stage) if stage in STAGES else (-1 if n <= 4 else 5)
    for i, s in enumerate(STAGES):
        box(slide, gx + i * (seg + 0.08), gy, seg, 0.08, fill=acc if i <= cur else LINE)
    text(slide, W - 1.6, H - 0.75, 1.0, 0.35, f"{n} / {total}", size=11, color=INK2, align=PP_ALIGN.RIGHT)

def heading(slide, t, y=0.95, size=40):
    return text(slide, 0.6, y, W - 1.2, 1.0, t, size=size, bold=True)

def bullets(slide, items, x, y, w, h, size=26, num=False, color=INK):
    paras = []
    for i, t in enumerate(items):
        paras.append(((f"{i + 1}.  " if num else "·  ") + t, {"size": size, "color": color, "gap": 14}))
    return text(slide, x, y, w, h, paras, size=size)

def ask_box(slide, asks, x, y, w, h, acc, size=21):
    if not asks: return
    box(slide, x, y, w, h, fill=PAPER2, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.08)
    box(slide, x, y, 0.12, h, fill=acc)
    paras = [("생각해 봐요", {"size": 15, "color": acc, "bold": True})] + [(f"“{a}”", {"size": size, "gap": 6}) for a in asks[:3]]
    text(slide, x + 0.35, y + 0.18, w - 0.6, h - 0.18, paras)

def notes(slide, s):
    parts = []
    if s.get("notes"): parts.append(s["notes"])
    if s.get("ask"): parts.append("발문: " + " / ".join(s["ask"]))
    if s.get("timer"): parts.append(f"시간: {s['timer']}분")
    if s.get("image", {}).get("credit"): parts.append("그림 출처: " + s["image"]["credit"])
    if parts: slide.notes_slide.notes_text_frame.text = "\n".join(parts)

def build(slug, by, all_lessons, source_dir=None, out_dir=None):
    L = by[slug]
    source_dir = source_dir or os.path.join(ROOT, "content/slides")
    spec = json.load(open(os.path.join(source_dir, f"{slug}.json"), encoding="utf-8"))
    acc = AREA.get(L["area"], FOREST)
    flow = {f["stage"]: f for f in L["flow"]}
    same = sorted([x for x in all_lessons if x["grade"] == L["grade"]], key=lambda x: x["coreOrder"])
    nxt = next((x for x in same if x["coreOrder"] > L["coreOrder"]), None)
    slides = [s for s in spec["slides"] if not (s["type"] == "next" and not nxt)]
    prs = Presentation(); prs.slide_width, prs.slide_height = E(W), E(H)
    blank = prs.slide_layouts[6]
    total = len(slides)
    for n, s in enumerate(slides, 1):
        sl = prs.slides.add_slide(blank)
        t = s["type"]; st = s.get("stage"); mins = flow.get(st, {}).get("minutes") if st else None
        if t == "title":
            box(sl, 0, 0, W, H, fill="FFFFFF")
            image(sl, f"/images/lessons/{slug}.webp", W * 0.52, 0, W * 0.48, H, mode="cover")
            box(sl, 0.6, 1.2, 1.9, 0.5, fill=acc, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.5)
            text(sl, 0.6, 1.24, 1.9, 0.45, L["area"], size=16, bold=True, color="FFFFFF", align=PP_ALIGN.CENTER)
            text(sl, 2.65, 1.26, 4.5, 0.7, f"중{L['grade']} · {L['skill']}", size=16, color=INK2)
            text(sl, 0.6, 2.0, W * 0.52 - 1.0, 2.4, L["title"], size=36 if len(L["title"]) > 25 else 42 if len(L["title"]) > 15 else 48, bold=True, spacing=1.05)
            title_question = text(sl, 0.6, 4.6, W * 0.52 - 0.9, 1.5, L.get("keyQuestion", ""), size=22, color=INK2)
            title_question.text_frame.margin_right = E(.15)
            text(sl, 0.6, 6.4, 6, 0.4, f"[9사회정서{L['standard']}]  ·  {L['minutes']}분", size=14, color=INK2)
        elif t == "question":
            chrome(sl, L, n, total)
            text(sl, 1.0, 1.4, W - 2.0, 0.5, "오늘의 질문", size=20, bold=True, color=acc, align=PP_ALIGN.CENTER)
            q = L.get("keyQuestion", "")
            box(sl, 1.4, 3.55, W - 2.8, 0.5, fill=HL)
            question = text(sl, 0.5, 2.2, W - 1.0, 3.0, q, size=36 if len(q) > 52 else 40 if len(q) > 36 else 44, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=1.2)
            # Preserve the original wrap width, with room for punctuation
            # overhang in PowerPoint and substitute fonts in LibreOffice.
            question.text_frame.margin_left = question.text_frame.margin_right = E(.55)
        elif t == "goals":
            chrome(sl, L, n, total); heading(sl, "이 시간이 끝나면")
            goals = s.get("goals") or L["objectives"]
            for i, g in enumerate(goals[:3]):
                y = 2.2 + i * 1.5
                box(sl, 0.6, y, W - 1.2, 1.25, fill=PAPER2, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.12)
                text(sl, 0.9, y + 0.18, 0.8, 0.9, str(i + 1), size=40, bold=True, color=acc)
                text(sl, 1.8, y + 0.1, W - 3.0, 1.05, g, size=26, anchor=MSO_ANCHOR.MIDDLE)
        elif t == "journey":
            chrome(sl, L, n, total); heading(sl, "오늘의 여정  45분")
            x = 0.6; tw = W - 1.2; tot = sum(f["minutes"] for f in L["flow"]) or 45
            for i, f in enumerate(L["flow"]):
                w = tw * f["minutes"] / tot
                shade = [acc, acc, acc, acc, acc][i]
                b = box(sl, x + 0.04, 2.3, w - 0.08, 1.1, fill=shade if i % 2 == 0 else "FFFFFF", line=acc, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.15)
                text(sl, x + 0.1, 2.38, w - 0.2, 1.0, [(f["stage"], {"size": 18, "bold": True, "color": "FFFFFF" if i % 2 == 0 else acc}), (f"{f['minutes']}분", {"size": 15, "color": "FFFFFF" if i % 2 == 0 else INK2, "gap": 2})], align=PP_ALIGN.CENTER)
                journey_title = text(sl, x + 0.01, 3.6, w - 0.02, 2.8, (s.get("titles") or {}).get(f["stage"], f.get("title", "")), size=16, color=INK, align=PP_ALIGN.CENTER)
                journey_title.text_frame.margin_left = journey_title.text_frame.margin_right = E(.09)
                x += w
        elif t == "picture":
            chrome(sl, L, n, total, st, mins); heading(sl, s.get("heading", ""))
            image(sl, s.get("image", {}).get("src"), W * 0.5, 1.9, W * 0.5 - 0.6, 4.6)
            if s.get("image", {}).get("credit"): text(sl, W * 0.5, 6.55, W * 0.5 - 0.6, 0.3, s["image"]["credit"], size=10, color=INK2, align=PP_ALIGN.RIGHT)
            copy_w = W * 0.5 - 1.0 if s.get("image") else W - 1.2
            bullets(sl, s.get("steps", []), 0.6, 2.0, copy_w, 2.2, size=26)
            ask_box(sl, s.get("ask"), 0.6, 4.25, copy_w, 2.25, acc, size=20)
        elif t == "story":
            chrome(sl, L, n, total, st, mins); heading(sl, s.get("heading", ""))
            ch = s.get("choices", [])
            compact = len(ch) > 4 or any(len(c) > 12 for c in ch) or len(s.get("story", "")) > 50 or sum(map(len, s.get("steps", []))) > 90 or sum(map(len, ch)) > 60
            iw = W * (.32 if compact else .48)
            image(sl, s.get("image", {}).get("src"), 0.6, 1.9, iw, 3.3 if compact else 3.7, mode="cover")
            rx = iw + 1.0 if s.get("image") else 0.6; rw = W - rx - 0.6
            text(sl, rx, 1.9, rw, 1.7, s.get("story", ""), size=24 if compact else 26, bold=True, spacing=1.25)
            columns = 3 if len(ch) > 4 else 2
            pitch = min(1.0, 2.1 / max(1, math.ceil(len(ch) / columns)))
            for i, c in enumerate(ch):
                cx = rx + (i % columns) * (rw / columns + 0.05); cy = 3.7 + (i // columns) * pitch
                box(sl, cx, cy, rw / columns - 0.1, pitch - 0.15, fill="FFFFFF", line=acc, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.2)
                text(sl, cx, cy + 0.06 if len(ch) > 4 else cy + 0.12, rw / columns - 0.1, pitch - 0.25 if len(ch) > 4 else 0.6, c, size=19 if compact else 22, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
            bullets(sl, s.get("steps", []), 0.6, 5.75, W - 1.2, 1.0, size=20, color=INK2)
        elif t == "cards":
            chrome(sl, L, n, total, st, mins); heading(sl, s.get("heading", ""))
            cards = s.get("cards", []); cw = (W - 1.2 - 0.4 * (len(cards) - 1)) / max(1, len(cards))
            for i, c in enumerate(cards):
                x = 0.6 + i * (cw + 0.4)
                compact = len(c["title"]) > 6 or len(c["text"]) + len(c.get("example", "")) > 70
                dense_card = len(cards) == 4 and (len(c["title"]) > 12 or len(c["text"]) + len(c.get("example", "")) > 55)
                box(sl, x, 2.0, cw, 3.0, fill=PAPER2, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.08)
                box(sl, x, 2.0, cw, 0.12, fill=acc)
                title_size = (20 if len(cards) == 4 else 26) if compact else (26 if len(cards) == 4 else 34)
                body_size = (16 if len(cards) == 4 else 19) if compact else (19 if len(cards) == 4 else 22)
                if dense_card: title_size, body_size = 18, 15
                text(sl, x + 0.3, 2.25, cw - 0.6, 2.7 if compact else 3.0, [(c["title"], {"size": title_size, "bold": True, "color": acc}), (c["text"], {"size": body_size, "gap": 8 if dense_card else 10 if compact else 12}), (c.get("example", ""), {"size": 13 if dense_card else 14 if compact else 17, "color": INK2, "gap": 8 if dense_card else 10 if compact else 14})])
            if s.get("steps"):
                bullets(sl, s["steps"], 0.6, 5.2, W - 1.2, 1.7, size=20)
            else:
                ask_box(sl, s.get("ask"), 0.6, 5.2, W - 1.2, 1.7, acc, size=19)
        elif t == "activity":
            chrome(sl, L, n, total, st, mins); heading(sl, s.get("heading", ""))
            fr = s.get("frames", [])
            copy_w = W * 0.55 if fr or s.get("image") else W - 1.2
            thumbnail = bool(fr and s.get("image"))
            bullets(sl, s.get("steps", []), 0.6, 1.95, copy_w - 1.8 if thumbnail else copy_w, 3.5, size=20 if thumbnail else 22 if sum(map(len, s.get("steps", []))) > 120 else 24, num=True)
            if thumbnail: image(sl, s["image"].get("src"), copy_w - 1.0, 1.95, 1.5, 1.5)
            if s.get("image") and not fr: image(sl, s["image"].get("src"), W * 0.6, 1.95, W * 0.4 - 0.6, 3.5)
            fx = W * 0.6; fw = W - fx - 0.6
            for i, f in enumerate(fr):
                pitch = min(1.45, 4.35 / max(1, len(fr)))
                y = 1.95 + i * pitch
                box(sl, fx, y, fw, pitch - 0.15, fill="FFFFFF", line=acc, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.1)
                text(sl, fx + 0.25, y + 0.12, fw - 0.5, 0.45, f if isinstance(f, str) else f["title"], size=20, bold=True, color=acc)
                if s.get("rows"): text(sl, fx + 0.25, y + 0.62, fw - 0.5, min(0.5, pitch - 0.8), "  ·  ".join(s["rows"]), size=14, color=INK2)
            if s.get("ask") and not s.get("app"):
                ask_box(sl, s["ask"], 0.6, 5.1, copy_w, 1.6, acc, size=17)
            if s.get("app"):
                text(sl, 0.6, 5.7, W * 0.55, 0.8, [("레브랩 앱으로 해도 돼요", {"size": 15, "bold": True, "color": acc}), (f"{s['app']['name']}  {s['app']['url']}", {"size": 15, "color": INK2, "gap": 4})])
        elif t == "ask":
            chrome(sl, L, n, total, st, mins); heading(sl, s.get("heading", ""))
            instructions = s.get("steps", [])
            has_art = bool(s.get("image"))
            copy_w = W - (4.5 if has_art else 1.2)
            if has_art: image(sl, s["image"].get("src"), W - 3.5, 2.0, 2.9, 2.4)
            if instructions:
                text(sl, 0.6, 1.95, copy_w, 1.1, [(f"{i + 1}.  {step}", {"size": 17, "gap": 5, "color": INK2}) for i, step in enumerate(instructions)])
            for i, a in enumerate(s.get("ask", [])[:4]):
                y = 3.15 + i * .85 if instructions else 2.0 + i * 1.15
                box(sl, 0.6, y, 0.12, .65 if instructions else 0.9, fill=acc)
                text(sl, 1.0, y, copy_w - .6, .75 if instructions else 0.95, f"“{a}”", size=24 if instructions else 28, anchor=MSO_ANCHOR.MIDDLE)
        elif t == "compare":
            chrome(sl, L, n, total, st, mins); heading(sl, s.get("heading", ""))
            lw = (W - 1.2 - 1.0) / 2
            for side, x, fill, col in (("left", 0.6, "FFFFFF", INK2), ("right", 0.6 + lw + 1.0, PAPER2, acc)):
                d = s[side]
                box(sl, x, 1.95, lw, 0.6, fill=col, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.3)
                text(sl, x, 2.0, lw, 0.5, d["label"], size=20, bold=True, color="FFFFFF", align=PP_ALIGN.CENTER)
                for i, it in enumerate(d["items"][:4]):
                    y = 2.75 + i * 0.95
                    box(sl, x, y, lw, 0.8, fill=fill, line=LINE, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.2)
                    text(sl, x + 0.3, y + 0.08, lw - 0.6, 0.65, it, size=24, bold=side == "right", anchor=MSO_ANCHOR.MIDDLE)
            for i in range(min(len(s["left"]["items"]), 4)):
                ar = sl.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, E(0.6 + lw + 0.25), E(2.95 + i * 0.95), E(0.5), E(0.4))
                ar.fill.solid(); ar.fill.fore_color.rgb = rgb(acc); ar.line.fill.background()
            bullets(sl, s.get("steps", []), 0.6, 5.9, W - (3.4 if s.get("image") else 1.2), 1.0, size=17, color=INK2)
            if s.get("image"): image(sl, s["image"].get("src"), W - 2.6, 5.55, 2.0, 1.25)
        elif t == "exit":
            chrome(sl, L, n, total, st, mins); heading(sl, s.get("heading", ""))
            compact = len(s.get("steps", [])) > 2 or sum(map(len, s.get("steps", []))) > 90 or len(s.get("prompt", "")) > 55
            box(sl, 0.6, 2.2, W - 1.2, 1.6 if compact else 2.4, fill=PAPER2, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.08)
            text(sl, 1.0, 2.3, W - 2.0, 1.4 if compact else 2.2, s.get("prompt", "").replace("____", "__________"), size=30 if compact else 34, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=1.3)
            bullets(sl, s.get("steps", []), 0.6, 4.0 if compact else 5.0, W - 1.2, 1.5 if compact else 0.7, size=18 if compact else 22)
            ask_box(sl, s.get("ask"), 0.6, 5.7, W - 1.2, 1.15, acc)
        elif t == "next":
            chrome(sl, L, n, total, "정리")
            heading(sl, "다음 시간")
            image(sl, f"/images/lessons/{nxt['slug']}.webp", W - 5.6, 1.9, 5.0, 3.75, mode="cover")
            text(sl, 0.6, 2.1, W - 6.8, 3.6, [(f"{nxt['area']}  ·  {nxt['skill']}  ·  [9사회정서{nxt['standard']}]", {"size": 16, "color": AREA.get(nxt["area"], acc), "bold": True}), (nxt["title"], {"size": 38, "bold": True, "gap": 12}), (nxt.get("keyQuestion", ""), {"size": 22, "color": INK2, "gap": 16})])
        elif t == "video":
            chrome(sl, L, n, total)
            v = s.get("video", {})
            vp = os.path.join(PUBLIC, v.get("src", "").lstrip("/")); pp = os.path.join(PUBLIC, v.get("poster", "").lstrip("/"))
            vw = W - 2.4; vh = vw * 9 / 16
            if v.get("src") and os.path.isfile(vp):
                poster = None
                if v.get("poster") and os.path.isfile(pp):
                    buf = io.BytesIO(); Image.open(pp).convert("RGB").save(buf, "PNG"); buf.seek(0); poster = buf
                elif v.get("poster"):
                    print(f"WARN: {slug}: missing video poster {v['poster']}", file=sys.stderr)
                sl.shapes.add_movie(vp, E(1.2), E(0.85), E(vw), E(vh), poster_frame_image=poster, mime_type="video/mp4")
                caption = "영상을 누르면 재생돼요 · 소리를 켜 주세요"
            else:
                print(f"WARN: {slug}: missing video {v.get('src', '(unspecified)')}", file=sys.stderr)
                image(sl, v.get("poster"), 1.2, 0.85, vw, vh)
                caption = "여는 영상 준비 중"
            text(sl, 1.2, 0.85 + vh + 0.08, vw, 0.4, caption, size=13, color=INK2, align=PP_ALIGN.CENTER)
        elif t == "end":
            box(sl, 0, 0, W, H, fill=acc)
            text(sl, 1.0, 2.0, W - 2.0, 2.6, s.get("message", ""), size=40, bold=True, color="FFFFFF", align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=1.25)
            text(sl, 1.0, 5.0, W - 2.0, 0.6, "오늘 수업에 함께해 주어 고마워요", size=22, color="FFFFFF", align=PP_ALIGN.CENTER)
            text(sl, 1.0, 6.6, W - 2.0, 0.4, "Lev Lab 레브랩 · www.levlab.co.kr", size=13, color="FFFFFF", align=PP_ALIGN.CENTER)
        else:
            raise ValueError(f"{slug}: unknown slide type {t}")
        notes(sl, s)
    prs.core_properties.title = f"중{L['grade']} {L['title']} — 수업 슬라이드"
    prs.core_properties.author = "Lev Lab 레브랩 (서울시교육청 교사개발자 2호 Yeol)"
    out = os.path.join(out_dir or os.path.join(PUBLIC, "files/slides"), f"{slug}.pptx")
    os.makedirs(os.path.dirname(out), exist_ok=True); prs.save(out)
    print(f"{slug}: {total}장 → {os.path.relpath(out, ROOT)} ({os.path.getsize(out) // 1024}KB)")

if __name__ == "__main__":
    by, all_lessons = load()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slugs", nargs="*")
    parser.add_argument("--source-dir", default=os.path.join(ROOT, "content/slides"))
    parser.add_argument("--out", default=os.path.join(PUBLIC, "files/slides"))
    args = parser.parse_args()
    slugs = args.slugs or sorted(f[:-5] for f in os.listdir(args.source_dir) if f.endswith(".json"))
    for sl in slugs: build(sl, by, all_lessons, args.source_dir, args.out)
