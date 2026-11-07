"""활동지·이야기 카드 만들기 — content/worksheets/{slug}.json + content/lessons.json
→ public/files/worksheets/{slug}-worksheet.pdf (A4 2쪽), {slug}-cards.pdf (A4, 자르는 선), {slug}-worksheet.docx (고쳐 쓰기용)

필요: python3 + playwright(chromium) + python-docx + Pillow
실행: python3 scripts/worksheets/build.py [slug ...]
"""
import html, json, os, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "files" / "worksheets"
AREA = {"자기": "#6D4FC2", "대인관계": "#BF4027", "공동체": "#17784E", "마음건강": "#2F6FB8"}
STAGE_NO = {"도입": 1, "이해하기": 2, "연습하기": 3, "적용하기": 4, "정리": 5}
FONT_SANS = (ROOT / "node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2").as_uri()
FONT_SERIF = (PUBLIC / "fonts/gowun-batang/GowunBatang-Bold.woff2").as_uri()
e = lambda s: html.escape(str(s or ""))
_TMP = Path(tempfile.mkdtemp(prefix="levlab-ws-"))
def img(src, max_px=1100):
    """PDF가 무겁지 않게 그림을 줄여 JPEG로 넣는다"""
    from PIL import Image
    path = PUBLIC / src.lstrip("/")
    out = _TMP / (path.stem + f"-{max_px}.jpg")
    if not out.exists():
        im = Image.open(path).convert("RGB"); im.thumbnail((max_px, max_px)); im.save(out, "JPEG", quality=82)
    return out.as_uri()

CSS = """
@font-face { font-family: P; src: url('%(sans)s') format('woff2'); font-weight: 100 900; }
@font-face { font-family: G; src: url('%(serif)s') format('woff2'); font-weight: 700; }
@page { size: A4; margin: 12mm 13mm 12mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: P, sans-serif; color: #1E2A24; font-size: 10.5pt; line-height: 1.5; word-break: keep-all; }
.page { page-break-after: always; }
.page:last-child { page-break-after: auto; }
.head { display: grid; grid-template-columns: 1fr auto; gap: 4mm; align-items: start; border-bottom: 2.5pt solid var(--ac); padding-bottom: 3mm; margin-bottom: 4mm; }
.kicker { display: flex; gap: 2mm; align-items: center; font-size: 8.5pt; color: #4A5650; }
.tag { background: var(--ac); color: #fff; font-weight: 700; padding: .3mm 2.2mm; border-radius: 99px; }
h1 { font-size: 19pt; line-height: 1.2; margin: 1.5mm 0 1.5mm; letter-spacing: -.01em; }
.kq { font-family: G, serif; font-size: 11.5pt; margin: 0; }
.kq mark { background: linear-gradient(transparent 55%%, #FFE45C 55%%); color: inherit; padding: 0 .5mm; }
.who { display: grid; grid-template-columns: repeat(4, auto); gap: 1.5mm; }
.head-r { display: grid; gap: 2mm; justify-items: end; }
.head-r img { width: 44mm; height: 26mm; object-fit: cover; border-radius: 2.5mm; }
.p2-art { display: grid; grid-template-columns: 1fr 52mm; gap: 5mm; align-items: center; margin-bottom: 4mm; }
.p2-art img { width: 52mm; height: 34mm; object-fit: cover; border-radius: 3mm; }
.p2-art p { margin: 0; font-family: G, serif; font-size: 12pt; line-height: 1.7; }
.who span { border: 1pt solid #DCE2DC; border-radius: 2mm; padding: 1.2mm 2mm; font-size: 8.5pt; color: #4A5650; min-width: 17mm; }
.sec { break-inside: avoid; margin-bottom: 4.2mm; }
.sec-h { display: flex; align-items: center; gap: 2.2mm; margin-bottom: 1.6mm; }
.no { width: 6.5mm; height: 6.5mm; border-radius: 50%%; background: var(--ac); color: #fff; font-weight: 800; display: grid; place-items: center; font-size: 9.5pt; flex: none; }
.sec-h b { font-size: 12.5pt; }
.sec-h small { color: #4A5650; font-size: 8.5pt; margin-left: auto; }
.lead { margin: 0 0 2mm; color: #4A5650; font-size: 9.5pt; }
.line { border-bottom: .8pt solid #B9C4BC; height: 7.5mm; }
.ill { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
.ill figure { margin: 0; display: grid; grid-template-columns: 30mm 1fr; gap: 3mm; align-items: center; border: 1pt solid #DCE2DC; border-radius: 3mm; padding: 2.5mm; }
.ill img { width: 30mm; height: 22mm; object-fit: contain; }
.opt { display: flex; align-items: center; gap: 2mm; margin: 1.2mm 0; font-size: 10pt; }
.circle { width: 6mm; height: 6mm; border: 1pt solid #1E2A24; border-radius: 50%%; flex: none; }
.reasons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; margin-top: 2mm; }
.box { border: 1pt solid #DCE2DC; border-radius: 3mm; padding: 2.5mm 3mm; min-height: 27mm; }
.box b { color: var(--ac); font-size: 11.5pt; display: block; }
.box i { font-style: normal; color: #4A5650; font-size: 8.5pt; }
.chose { font-size: 10.5pt; margin: 0; }
.frames { display: grid; grid-template-columns: 22mm repeat(3, 1fr); border: 1.2pt solid var(--ac); border-radius: 3mm; overflow: hidden; }
.frames > div { border-right: .8pt solid #DCE2DC; border-bottom: .8pt solid #DCE2DC; padding: 1.8mm 2.2mm; min-height: 19mm; }
.frames > div:nth-child(4n) { border-right: 0; }
.frames .fh { min-height: auto; background: color-mix(in srgb, var(--ac) 12%%, #fff); font-weight: 700; text-align: center; }
.frames .rh { background: #F5F6F2; font-weight: 700; font-size: 9pt; display: flex; align-items: center; }
.frames .eye { display: inline-block; width: 3.4mm; height: 2.2mm; border: 1pt solid var(--ac); border-radius: 50%%; margin-right: 1.2mm; vertical-align: middle; position: relative; }
.check { margin: 2mm 0 0; font-size: 9.5pt; }
.conv { display: grid; grid-template-columns: 1fr 9mm 1fr; border-top: 1.2pt solid #1E2A24; }
.conv > div { border-bottom: .8pt solid #DCE2DC; padding: 1.6mm 2.4mm; min-height: 12.5mm; display: flex; align-items: center; }
.conv .h { font-weight: 800; font-size: 9.5pt; min-height: auto; }
.conv .h.r { color: var(--ac); }
.conv .ar { justify-content: center; color: var(--ac); font-weight: 800; }
.conv .ex { color: #4A5650; }
.conv .ex.r { color: var(--ac); font-weight: 700; }
.cut { margin: 5mm 0 3mm; border-top: 1.2pt dashed #1E2A24; position: relative; }
.cut span { position: absolute; top: -3.2mm; left: 0; background: #fff; padding-right: 2mm; font-size: 8.5pt; color: #4A5650; }
.ticket { border: 1.5pt solid var(--ac); border-radius: 3mm; padding: 4mm 5mm; }
.ticket .p { font-family: G, serif; font-size: 13pt; line-height: 2; margin: 0 0 3mm; }
.meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; }
.meta .box { min-height: 34mm; }
.foot { margin-top: 4mm; display: flex; justify-content: space-between; font-size: 7.5pt; color: #6B776F; border-top: .8pt solid #DCE2DC; padding-top: 1.5mm; }
/* 이야기 카드 */
.cards { display: grid; grid-template-rows: repeat(3, 1fr); height: 271mm; }
.card { border: 1.2pt dashed #9AA59D; padding: 5mm; display: grid; grid-template-columns: 86mm 1fr; gap: 6mm; align-items: center; margin-top: -1.2pt; }
.card img { width: 86mm; height: 64mm; object-fit: cover; border-radius: 3mm; }
.card .n { color: var(--ac); font-weight: 800; font-size: 9pt; }
.card h2 { margin: .5mm 0 2.5mm; font-size: 18pt; }
.card p { margin: 0 0 4mm; font-size: 12pt; line-height: 1.65; }
.card .tip { margin: 3mm 0 0; font-size: 9pt; color: #4A5650; }
.roles { display: flex; gap: 2mm; flex-wrap: wrap; }
.roles span { border: 1pt solid var(--ac); border-radius: 99px; padding: .8mm 3mm; font-size: 10pt; }
.roles b { color: var(--ac); margin-right: 1mm; }
""" % {"sans": FONT_SANS, "serif": FONT_SERIF}

def header(L, sub):
    lp = PUBLIC / f"images/lessons/{L['slug']}.webp"
    art = f'<img src="{lp.as_uri()}" alt="">' if lp.exists() else ""
    return f"""<header class="head"><div>
<div class="kicker"><span class="tag">{e(L['area'])}</span><span>중{L['grade']} · {e(L['skill'])} · [9사회정서{e(L['standard'])}] · {sub}</span></div>
<h1>{e(L['title'])}</h1><p class="kq"><mark>{e(L['keyQuestion'])}</mark></p></div>
<div class="head-r"><div class="who"><span>반</span><span>번호</span><span>이름</span><span>모둠</span></div>{art}</div></header>"""

def sec_head(s):
    return f'<div class="sec-h"><span class="no">{STAGE_NO.get(s["stage"], "")}</span><b>{e(s["title"])}</b><small>{e(s["stage"])}</small></div>'

def render_section(s):
    t = s["type"]; h = sec_head(s); lead = f'<p class="lead">{e(s.get("lead"))}</p>' if s.get("lead") else ""
    if t == "illusion":
        figs = "".join(f'<figure><img src="{img(p["src"])}" alt=""><div>' + "".join(f'<div class="opt"><span class="circle"></span>{e(o)}</div>' for o in p["options"]) + "</div></figure>" for p in s["pictures"])
        return f'<section class="sec">{h}{lead}<div class="ill">{figs}</div><p class="lead" style="margin-top:2mm">{e(s["reflect"])}</p><div class="line"></div></section>'
    if t == "reasons":
        boxes = "".join(f'<div class="box"><b>{e(b["title"])}</b><i>{e(b["hint"])}</i></div>' for b in s["boxes"])
        return f'<section class="sec">{h}{lead}<p class="chose">{e(s["chose"])}</p><div class="reasons">{boxes}</div></section>'
    if t == "frames":
        cells = '<div class="fh"></div>' + "".join(f'<div class="fh"><span class="eye"></span>{e(f)}</div>' for f in s["frames"])
        for r in s["rows"]:
            cells += f'<div class="rh">{e(r)}</div>' + "<div></div>" * len(s["frames"])
        return f'<section class="sec">{h}{lead}<div class="frames">{cells}</div><p class="check">{e(s["check"])}</p><div class="line"></div></section>'
    if t == "convert":
        rows = '<div class="h">틀림 말</div><div class="h ar"></div><div class="h r">다름 말</div>'
        for a, b in s["examples"]:
            rows += f'<div class="ex">{e(a)}</div><div class="ar">→</div><div class="ex r">{e(b)}</div>'
        rows += '<div></div><div class="ar">→</div><div></div>' * s.get("blank", 5)
        return f'<section class="sec">{h}{lead}<div class="conv">{rows}</div></section>'
    if t == "exit":
        p = e(s["prompt"]).replace("__________", '<span style="display:inline-block;min-width:38mm;border-bottom:1pt solid #1E2A24">&nbsp;</span>')
        meta = "".join(f'<div class="box"><b>{e(m["title"])}</b><i>{e(m["hint"])}</i></div>' for m in s["meta"])
        return f'<div class="cut"><span>✂ 잘라서 내요</span></div><section class="sec ticket">{h}<p class="p">{p}</p><div class="meta">{meta}</div></section>'
    return ""

def worksheet_html(L, W):
    acc = AREA.get(L["area"], "#1F5C3F")
    secs = [render_section(s) for s in W["sections"]]
    foot = f'<div class="foot"><span>Lev Lab 레브랩 · www.levlab.co.kr</span><span>중{L["grade"]} {e(L["title"])} 활동지</span></div>'
    p1 = f'<div class="page">{header(L, "활동지")}{"".join(secs[:3])}{foot}</div>'
    quote = W.get("quote")
    art = W.get("art")
    top = f'<div class="p2-art"><p>{e(quote)}</p><img src="{img(art)}" alt=""></div>' if quote and art else ""
    p2 = f'<div class="page">{top}{"".join(secs[3:])}{foot}</div>'
    return f'<!doctype html><html lang="ko"><meta charset="utf-8"><style>{CSS}</style><body style="--ac:{acc}">{p1}{p2}</body></html>'

def cards_html(L, W):
    acc = AREA.get(L["area"], "#1F5C3F")
    cards = "".join(f"""<article class="card"><img src="{img(c['image'])}" alt=""><div>
<div class="n">이야기 카드 {c['no']}</div><h2>{e(c['title'])}</h2><p>{e(c['story'])}</p>
<div class="roles"><span><b>A</b>{e(c['a'])}</span><span><b>B</b>{e(c['b'])}</span><span><b>지켜본 사람</b>{e(c['c'])}</span></div><p class="tip">세 사람이 되어 활동지 3번 칸을 채워요.</p></div></article>""" for c in W["cards"])
    return f'<!doctype html><html lang="ko"><meta charset="utf-8"><style>{CSS}</style><body style="--ac:{acc}"><div class="cards">{cards}</div></body></html>'

def to_pdf(page, html_text, out):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(html_text); tmp = f.name
    page.goto(Path(tmp).as_uri()); page.wait_for_load_state("networkidle")
    page.evaluate("document.fonts.ready")
    page.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True)
    os.unlink(tmp)

def to_docx(L, W, out):
    from docx import Document
    from docx.shared import Pt, Mm, RGBColor
    from docx.enum.table import WD_TABLE_ALIGNMENT
    d = Document()
    for s in d.sections: s.left_margin = s.right_margin = Mm(15); s.top_margin = s.bottom_margin = Mm(13)
    st = d.styles["Normal"]; st.font.name = "맑은 고딕"; st.font.size = Pt(10.5)
    st.element.rPr.rFonts.set("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}eastAsia", "맑은 고딕")
    acc = RGBColor.from_string(AREA.get(L["area"], "#1F5C3F")[1:])
    t = d.add_table(rows=1, cols=4); t.style = "Table Grid"
    for c, label in zip(t.rows[0].cells, ["반 :", "번호 :", "이름 :", "모둠 :"]): c.text = label
    p = d.add_paragraph(); r = p.add_run(f"중{L['grade']} · {L['area']} · {L['skill']} · [9사회정서{L['standard']}]"); r.font.size = Pt(9)
    h = d.add_paragraph(); r = h.add_run(L["title"]); r.bold = True; r.font.size = Pt(18)
    q = d.add_paragraph(); r = q.add_run(L["keyQuestion"]); r.italic = True
    for s in W["sections"]:
        hp = d.add_paragraph(); r = hp.add_run(f"{STAGE_NO.get(s['stage'], '')}. {s['title']}  ({s['stage']})"); r.bold = True; r.font.size = Pt(12.5); r.font.color.rgb = acc
        if s.get("lead"): d.add_paragraph(s["lead"])
        ty = s["type"]
        if ty == "illusion":
            tb = d.add_table(rows=1, cols=2); tb.style = "Table Grid"
            for c, pic in zip(tb.rows[0].cells, s["pictures"]):
                c.text = "  ".join(f"(   ) {o}" for o in pic["options"])
            d.add_paragraph(s["reflect"]); d.add_paragraph("_" * 70)
        elif ty == "reasons":
            d.add_paragraph(s["chose"])
            tb = d.add_table(rows=2, cols=3); tb.style = "Table Grid"
            for c, b in zip(tb.rows[0].cells, s["boxes"]): c.text = f"{b['title']} — {b['hint']}"
            for c in tb.rows[1].cells: c.text = "\n\n"
        elif ty == "frames":
            tb = d.add_table(rows=len(s["rows"]) + 1, cols=len(s["frames"]) + 1); tb.style = "Table Grid"
            for i, f in enumerate(s["frames"], 1): tb.cell(0, i).text = f
            for j, rw in enumerate(s["rows"], 1): tb.cell(j, 0).text = rw; [setattr(tb.cell(j, i), "text", "\n\n") for i in range(1, len(s["frames"]) + 1)]
            d.add_paragraph(s["check"]); d.add_paragraph("_" * 70)
        elif ty == "convert":
            n = len(s["examples"]) + s.get("blank", 5) + 1
            tb = d.add_table(rows=n, cols=2); tb.style = "Table Grid"
            tb.cell(0, 0).text = "틀림 말"; tb.cell(0, 1).text = "다름 말"
            for i, (a, b) in enumerate(s["examples"], 1): tb.cell(i, 0).text = a; tb.cell(i, 1).text = b
        elif ty == "exit":
            d.add_paragraph("- - - - - - - - - - - - ✂ 잘라서 내요 - - - - - - - - - - - -")
            d.add_paragraph(s["prompt"])
            tb = d.add_table(rows=2, cols=3); tb.style = "Table Grid"
            for c, m in zip(tb.rows[0].cells, s["meta"]): c.text = f"{m['title']} ({m['hint']})"
            for c in tb.rows[1].cells: c.text = "\n\n"
    f = d.add_paragraph(); r = f.add_run("Lev Lab 레브랩 · www.levlab.co.kr"); r.font.size = Pt(8)
    d.save(out)

def main():
    from playwright.sync_api import sync_playwright
    lessons = {l["slug"]: l for l in json.load(open(ROOT / "content/lessons.json", encoding="utf-8"))["lessons"]}
    slugs = sys.argv[1:] or sorted(p.stem for p in (ROOT / "content/worksheets").glob("*.json"))
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        b = pw.chromium.launch(); page = b.new_page()
        for slug in slugs:
            L = lessons[slug]; W = json.load(open(ROOT / f"content/worksheets/{slug}.json", encoding="utf-8"))
            to_pdf(page, worksheet_html(L, W), OUT / f"{slug}-worksheet.pdf")
            if W.get("cards"): to_pdf(page, cards_html(L, W), OUT / f"{slug}-cards.pdf")
            to_docx(L, W, OUT / f"{slug}-worksheet.docx")
            print(slug, [f"{p.name} {p.stat().st_size // 1024}KB" for p in sorted(OUT.glob(f'{slug}-*'))])
        b.close()

if __name__ == "__main__":
    main()
