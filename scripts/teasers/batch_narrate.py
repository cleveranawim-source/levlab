"""여는 영상 내레이션을 Gemini Batch API 로 한꺼번에 만든다 — 하루 요청 수(RPD) 제한을 피할 때 쓴다.

python3 scripts/teasers/batch_narrate.py [slug ...]   # 기본: 내레이션이 빠진 모든 차시
만든 음성은 build.py 와 같은 자리(content/teasers/audio/{slug}/NN.wav)에 저장되고, build.py 는 그 파일을 그대로 쓴다.
"""
import base64, json, subprocess, sys, time, urllib.request, urllib.error
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import build

API = "https://generativelanguage.googleapis.com/v1beta"

def call(url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body else None, method="POST" if body else "GET",
                                 headers={"x-goog-api-key": build.api_key(), "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.load(r)
    except urllib.error.HTTPError as err:
        sys.exit(f"Batch API 오류 {err.code}: {err.read().decode()[:600]}")

def missing(slugs):
    todo = []
    for p in sorted((build.ROOT / "content/teasers").glob("*.json")):
        spec = json.load(open(p, encoding="utf-8"))
        if slugs and spec["slug"] not in slugs:
            continue
        cfg = {**build.TTS, **spec.get("tts", {})}
        adir = build.AUDIO / spec["slug"]
        for i, sc in enumerate(spec["scenes"]):
            n = f"{i + 1:02d}"
            if not any((adir / f"{n}.{ext}").exists() for ext in ("wav", "mp3", "m4a", "flac")):
                todo.append({"key": f"{spec['slug']}/{n}", "text": sc["say"], "cfg": cfg})
    return todo

def main():
    slugs = [a for a in sys.argv[1:] if not a.startswith("--")]
    todo = missing(slugs)
    if not todo:
        print("빠진 내레이션이 없습니다."); return
    models = {t["cfg"]["model"] for t in todo}
    assert len(models) == 1, models
    model = models.pop()
    reqs = [{"request": {"contents": [{"role": "user", "parts": [{"text": t["text"], "speech_metadata": {"style": t["cfg"]["style"]}}]}],
                         "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"voice": t["cfg"]["voice"]}}}},
             "metadata": {"key": t["key"]}} for t in todo]
    job = call(f"{API}/models/{model}:batchGenerateContent",
               {"batch": {"display_name": f"levlab-teasers-{int(time.time())}", "input_config": {"requests": {"requests": reqs}}}})
    name = job.get("name") or job.get("metadata", {}).get("name")
    print(f"배치 {name}: {len(reqs)}줄 제출", flush=True)
    while True:
        st = call(f"{API}/{name}")
        meta = st.get("metadata", st)
        state = meta.get("state") or st.get("state")
        if st.get("done") or state in ("JOB_STATE_SUCCEEDED", "BATCH_STATE_SUCCEEDED", "JOB_STATE_FAILED", "BATCH_STATE_FAILED",
                                       "JOB_STATE_CANCELLED", "JOB_STATE_EXPIRED"):
            break
        print(time.strftime("%H:%M:%S"), state, flush=True)
        time.sleep(30)
    resp = st.get("response") or st
    inl = (resp.get("inlinedResponses") or resp.get("dest", {}).get("inlinedResponses") or {})
    items = inl.get("inlinedResponses", inl) if isinstance(inl, dict) else inl
    ok = bad = 0
    for k, it in enumerate(items or []):
        key = (it.get("metadata") or {}).get("key") or todo[k]["key"]
        if "response" not in it:
            print("실패", key, json.dumps(it.get("error"))[:200]); bad += 1; continue
        part = it["response"]["candidates"][0]["content"]["parts"][0]["inlineData"]
        raw = base64.b64decode(part["data"])
        slug, n = key.split("/")
        out = build.AUDIO / slug / f"{n}.wav"; out.parent.mkdir(parents=True, exist_ok=True)
        if raw[:4] == b"RIFF":
            out.write_bytes(raw)
        else:
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "pipe:0", str(out)], input=raw, check=True)
        ok += 1
    print(f"끝: 상태 {state}, 저장 {ok}줄, 실패 {bad}줄")
    if not items:
        print(json.dumps(st)[:1500])

if __name__ == "__main__":
    main()
