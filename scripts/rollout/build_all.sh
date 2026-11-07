#!/usr/bin/env bash
# Run from any directory. Teaser credentials are read by the teaser builder.
set -euo pipefail
cd "$(dirname "$0")/../.."
WORKSHEET_PYTHON="${WORKSHEET_PYTHON:-$HOME/.claude/skills/webapp-testing/.venv/bin/python}"
TEASER_PYTHON="${TEASER_PYTHON:-$HOME/.claude/skills/webapp-testing/.venv/bin/python}"
PPT_PYTHON="${PPT_PYTHON:-/private/tmp/claude-501/-Users-yeopro14-orca-workspaces-levlab-danio/8f5aadfa-7605-4f33-b837-904ec3ef88cd/scratchpad/venv/bin/python}"
for interpreter in "$WORKSHEET_PYTHON" "$TEASER_PYTHON" "$PPT_PYTHON"; do
  if ! command -v "$interpreter" >/dev/null 2>&1; then
    printf 'Missing Python interpreter: %s\nOverride WORKSHEET_PYTHON, TEASER_PYTHON, or PPT_PYTHON.\n' "$interpreter" >&2
    exit 1
  fi
done
# Resolve once so all builders receive the same lesson set, even during authoring.
slugs=("$@")
if [ "${#slugs[@]}" -eq 0 ]; then
  while IFS= read -r slug; do slugs+=("$slug"); done < <(node --input-type=module -e '
    import fs from "node:fs";
    for (const lesson of JSON.parse(fs.readFileSync("content/lessons.json", "utf8")).lessons)
      if (["published", "core"].includes(lesson.status)) console.log(lesson.slug);
  ')
fi
if [ "${#slugs[@]}" -eq 0 ]; then printf 'No core lessons found.\n' >&2; exit 1; fi
node scripts/rollout/validate.mjs "${slugs[@]}"
"$WORKSHEET_PYTHON" scripts/worksheets/build.py "${slugs[@]}"
"$TEASER_PYTHON" scripts/teasers/build.py "${slugs[@]}"
"$PPT_PYTHON" scripts/slides/build_pptx.py "${slugs[@]}"
npm run check
