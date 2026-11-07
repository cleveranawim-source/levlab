# Lesson presentations

`content/slides/{slug}.json` is the deck source. Only matching lesson slugs are statically generated at `/lessons/{slug}/slides`; routes are noindex and omitted from the public sitemap. The curriculum loader remains the source of truth for titles, standards, goals, flow and the next core lesson.

- `data.js` reads deck JSON and checks local image/PPT files at build time. Add assets before building; absent images retain a labeled space rather than a broken image request. The final core lesson automatically omits `next`.
- `SlideContent.jsx` renders the teaching content. Supported types: title, question, goals, journey, picture, story, cards, activity, ask, compare, exit, next, end.
- `SlidePlayer.jsx` progressively enhances the complete server-rendered deck. At widths below 768px, and without JavaScript, all slides remain in a vertical reading flow. At wider widths a 1920×1080 stage scales to fit the viewport. No deck-specific slug or slide count lives in the player.
- `SiteChrome.jsx` removes existing navigation/footer only on a presentation route. The existing root template still supplies the one `main` landmark. `app/layout.jsx` loads the scoped stylesheet and wraps existing chrome; the site motion preference remains active.
- `styles/slides.css` inherits Pretendard/Gowun Batang and Lev Lab colors, fixes the presentation to light colors, and hides only the new lesson entry when printing. All other presentation styles are scoped to `.lesson-slides`.

`steps` reveal one item per forward action; compare rows reveal as pairs; ask questions replace one another. Back reverses these builds before changing slides. Home/End jump to the first/last slide. The URL fragment is a one-based slide number; build positions and choices are not persisted. A clock pauses when its slide is left and preserves its remaining time during this visit. Notes are deliberately visible on the same screen when opened with N.

The slide source, image assets and PPT generator are managed separately. Adding a deck or updating a file requires a fresh build. An operator preview is still required before publishing.
- `journey.titles`: 단계별 학생용 제목(없으면 lessons.json flow.title)
