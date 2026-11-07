# Lesson presentations

`content/slides/{slug}.json` is the deck source. Only matching lesson slugs are statically generated at `/lessons/{slug}/slides`; routes are noindex and omitted from the public sitemap. The curriculum loader remains the source of truth for titles, standards, goals, flow and the next core lesson.

- `data.js` reads deck JSON and checks local image/video/poster/PPT files at build time. Add assets before building; absent images retain a labeled space rather than a broken image request. The final core lesson automatically omits `next`.
- `SlideContent.jsx` renders the teaching content. Supported types: title, video, question, goals, journey, picture, story, cards, activity, ask, compare, exit, next, end.
- `SlidePlayer.jsx` progressively enhances the complete server-rendered deck. At widths below 768px, and without JavaScript, all slides remain in a vertical reading flow. At wider widths a 1920×1080 stage scales to fit the viewport. No deck-specific slug or slide count lives in the player.
- `SiteChrome.jsx` removes existing navigation/footer only on a presentation route. The existing root template still supplies the one `main` landmark. `app/layout.jsx` loads the scoped stylesheet and wraps existing chrome; the site motion preference remains active.
- `styles/slides.css` inherits Pretendard/Gowun Batang and Lev Lab colors, fixes the presentation to light colors, and hides only the new lesson entry when printing. All other presentation styles are scoped to `.lesson-slides`.

`steps` reveal one item per forward action; compare rows reveal as pairs, or flip individually when `toy.kind` is `flip`; ask questions replace one another. Back reverses these builds before changing slides. Home/End jump to the first/last slide. The URL fragment is a one-based slide number; build positions and choices are not persisted. A clock pauses when its slide is left and preserves its remaining time during this visit. Notes are deliberately visible on the same screen when opened with N.

The slide source, image assets and PPT generator are managed separately. Adding a deck or updating a file requires a fresh build. An operator preview is still required before publishing.
- `journey.titles`: 단계별 학생용 제목(없으면 lessons.json flow.title)


## Classroom tools

`SlideToys.jsx` reads optional `toy.kind` values from the deck:

- `hint`: `hints: [{label, spots: [{x,y,r,text}]}]`. Coordinates are percentages of the actual image; radius is a percentage of image width. A second press closes the current hint. Portrait labels alternate sides to avoid hiding the drawing.
- `tally`: local counts beneath story choices, with minus/plus and reset. Bars share one color and use the total as denominator. Counts persist for this mounted deck only.
- `roulette`: `label` and `items`. R or the button runs a roughly 2.5-second decelerating slot, excludes already selected items, and offers reset. Reduced motion and the site motion toggle produce an immediate result; changing preference during a spin settles it.
- `flip`: click/Enter/Space toggles a card; next reveals the first unflipped card, previous reverses the latest flip. Three-dimensional flips become short fades when motion is reduced or paused.

The player places `LiveControl` beside teacher notes. Story places `LiveSlot` after the choice cards; the DOM wrapper is empty when the component returns null, which leaves local tally controls visible. A nonempty slot replaces them. Compare/exit reserve a right column only when the wall renders. These components import the live module but own none of its files.

`SlideVideo.jsx` uses `video: {src, poster, captions}`. Assets must exist at build time; missing video falls back to a poster or labeled space. Video uses `preload="none"`, never autoplay, and starts with sound only after the play button/P. P toggles playback, while next/Space during playback advances the slide and pauses the old video. Without JavaScript the poster and teaching content remain readable.

Browser evidence and repeatable checks are in `docs/audit/slides/toys-verify.py`, `toys-live-verify.py`, and `TOYS-REPORT.md`. The audit directory is gitignored in this repository; deliberately include evidence when integrating if needed.

## Building all core lesson kits

The shared schema is `docs/rollout/AUTHORING.md`. These commands accept multiple
slugs; omitting slugs selects every JSON file in the relevant source directory:

```sh
python scripts/worksheets/build.py g1-09 g1-03
python scripts/slides/build_pptx.py g1-09 g1-03
python scripts/teasers/build.py g1-09 g1-03
python scripts/art/gen.py --dry g1-09 g1-03
node scripts/rollout/validate.mjs g1-09 g1-03
bash scripts/rollout/build_all.sh g1-09 g1-03
```

Worksheet and teaser Python: `~/.claude/skills/webapp-testing/.venv/bin/python`.
PPT Python defaults to the authoring scratchpad's python-pptx environment; see
`build_all.sh` for its full path. Set `WORKSHEET_PYTHON`, `TEASER_PYTHON`, and
`PPT_PYTHON` to other interpreter paths when needed. Worksheets need Playwright
with Chromium, python-docx, Pillow and pypdfium2; PPT needs python-pptx and Pillow.
Teasers additionally need ffmpeg/ffprobe. The runner validates, builds worksheets,
teasers, and PPTs in that order, then runs `npm run check`. With no arguments it
uses published/core lessons from `content/lessons.json` for every builder. It does
not deploy or commit. Teaser credentials remain in the builder's existing key
lookup; the runner never reads or echoes them.

Worksheet outputs are `public/files/worksheets/{slug}-worksheet.pdf` and
`{slug}-worksheet.docx`. Optional story cards produce `{slug}-cards.pdf`; optional
word/strategy card sets produce **`{slug}-cardsets.pdf`** in the same directory.
Empty/absent `cards` and `cardSets` remove stale corresponding generated PDFs.
Every PDF reports its page count; worksheets above two pages emit a warning.
Generic sections are measured with the actual print fonts before choosing the
page split. When needed, generic sections use smaller gaps and writing-cell
heights while preserving font sizes; excess content still produces a warning.
`--source-dir` and `--out` on worksheet/PPT builders support temporary fixtures
without editing content or replacing production downloads.

`boxes`, `table`, `pairs`, `choose`, `scale`, `lines`, and `exit` render in PDF
and editable DOCX. Legacy `illusion`, `reasons`, `frames`, `convert` retain the
sample layout. `cardTip` is an optional worksheet **top-level** string printed on
each story card. Card roles `a`/`b`/`c` are optional. `cardSets` is an array of
`{title, note?, cards: [{front, back?}]}`; each set has 2–60 cards, with front text
of at most 20 characters. Card sets use equal 4×5 cut-out cells per A4 page;
`back` is a small hint beneath the front on the same side, not duplex printing.

Activity `frames` can have optional `rows` (0–4 strings); omitted rows leave empty
writing boxes. Flip instructions use `toy.prompt`, or a generic instruction
using the left/right labels. Wall headings use `live.title`, then “우리 반의 한
문장” for exit or “우리 반의 생각” otherwise. Ask/activity slides support the
same classroom wall as compare/exit. Two to four concept cards use the available
width. Missing optional activity images leave readable content.

PPTs include all story choices (including five/six-choice layouts), optional
activity frames/apps/rows and teacher notes. Interactive browser tools remain in
the browser deck. Missing slide images, video files and video posters warn and
are skipped; a missing video can retain its poster. Missing teaser `clip` files
warn and use the scene's still `image`; `clipPrompt` is authoring metadata only.

Art manifests are `content/art/{slug}.json` arrays of `{out,prompt}`. The ported
generator retains the reference image and prompt wrapper/rules, skips existing
outputs, and logs each result from four workers. `--dry` prints planned work
without invoking Codex or using image quota. Omit `--dry` only for an intended
image-generation run. `CODEX_IMAGE_CLI` overrides the Codex binary path.

The validator checks parsed/versioned documents, schema fields, planned/existing
image paths, live IDs and limits, allowed toys, worksheet fields/card sets, and
teaser scenes/clip paths. Planned art satisfies validation before images exist;
PASS does not mean assets have been generated. Student-text length and 2–3 live
items are recommendations (WARN); errors cause exit 1. Regression checks:
`node --test scripts/rollout/test_validate.mjs`. Rendering evidence and operational
notes for this rollout are recorded in `scripts/rollout/REPORT.txt`.
