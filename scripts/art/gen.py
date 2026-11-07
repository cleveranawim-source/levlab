"""Generate lesson art from content/art/{slug}.json. --dry never invokes Codex.

Usage: python3 scripts/art/gen.py [--dry] [slug ...]
Needs Pillow for real generation. CODEX_IMAGE_CLI can override the Codex binary.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[2]
REF = Path(__file__).with_name("style-ref.png")
CODEX = os.environ.get("CODEX_IMAGE_CLI", "/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex")
WRAP=("첨부한 참고 그림은 그림체 기준이다(선·채색·인물 비례·팔레트를 똑같이). 이미지 생성 도구로 그림 1장만 만들어라. "
      "다른 작업(파일 수정, 설명)은 하지 말고, 생성된 이미지 파일의 경로만 마지막 줄에 출력해라.\n\n")
RULES=("\n[공통 규칙] 한국 중학교, 교복 입은 중학생(13~15세, 남녀 섞임), 따뜻하고 안전한 분위기. 참고 그림과 같은 플랫 일러스트·진한 남색 선·밝은 바탕. "
       "팔레트 포인트: 보라 #6D4FC2, 산호 #BF4027, 초록 #17784E, 파랑 #2F6FB8, 숲 초록 #1F5C3F, 형광 노랑 #FFE45C.\n"
       "[금지] 글자·숫자·로고·말풍선 속 글자·화면 속 글자 절대 없음. 실존 인물·브랜드·종교 상징 금지. 고통·폭력 장면 금지.\n"
       "[비율] 가로 16:9 (수업 슬라이드용). 화면 한쪽(왼쪽이나 오른쪽 1/3)은 비교적 비워 두어 글자를 얹을 수 있게.")

def one(task, dry=False):
    out, prompt = task["out"], task["prompt"]
    dst = ROOT / out
    if dst.is_file():
        return out, "skip", "already exists"
    if dry:
        return out, "dry", prompt
    started = time.monotonic()
    try:
        from PIL import Image
        result = subprocess.run(
            [CODEX, "exec", "--skip-git-repo-check", "-i", str(REF), "-"],
            input=WRAP + prompt + RULES, capture_output=True, text=True, timeout=900,
            cwd=ROOT,
        )
        if result.returncode:
            return out, "fail", f"Codex exited {result.returncode}: {result.stderr[-300:].strip()}"
        pngs = [p for p in re.findall(r"(/[^\s`'\"()]+\.png)", result.stdout) if Path(p).is_file()]
        if not pngs:
            return out, "fail", (result.stdout + result.stderr).strip()[-300:].replace("\n", " ")
        with Image.open(pngs[-1]) as image:
            image = image.convert("RGB")
            image.thumbnail((1600, 1600))
            dst.parent.mkdir(parents=True, exist_ok=True)
            image.save(dst, "WEBP", quality=82, method=6)
            return out, "ok", f"{time.monotonic() - started:.0f}s {image.size} {dst.stat().st_size // 1024}KB"
    except (OSError, ValueError, subprocess.TimeoutExpired) as error:
        return out, "fail", str(error)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slugs", nargs="*")
    parser.add_argument("--dry", action="store_true")
    parser.add_argument("--source-dir", type=Path, default=ROOT / "content/art")
    args = parser.parse_args()
    slugs = args.slugs or sorted(path.stem for path in args.source_dir.glob("*.json"))
    tasks, seen = [], set()
    for slug in slugs:
        if not re.fullmatch(r"[a-z0-9-]+", slug):
            parser.error(f"invalid slug: {slug}")
        spec = json.loads((args.source_dir / f"{slug}.json").read_text())
        if not isinstance(spec, list):
            parser.error(f"{slug}: expected an art list")
        for task in spec:
            if not isinstance(task, dict) or not isinstance(task.get("out"), str) or not isinstance(task.get("prompt"), str) or not task["prompt"].strip():
                parser.error(f"{slug}: each art entry needs out and prompt strings")
            out = task["out"]
            prefix = ROOT / "public/images/slides" / slug
            if not (ROOT / out).resolve().is_relative_to(prefix) or Path(out).suffix != ".webp":
                parser.error(f"{slug}: output must be public/images/slides/{slug}/*.webp: {out}")
            if out in seen:
                parser.error(f"duplicate output: {out}")
            seen.add(out)
            tasks.append(task)
    if not REF.is_file():
        parser.error(f"missing style reference: {REF}")
    failed = 0
    with ThreadPoolExecutor(max_workers=4) as pool:
        for future in as_completed([pool.submit(one, task, args.dry) for task in tasks]):
            out, status, message = future.result()
            print(time.strftime("%H:%M:%S"), out, status, message, flush=True)
            failed += status == "fail"
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
