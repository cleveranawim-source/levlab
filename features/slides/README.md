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
