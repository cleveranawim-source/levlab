"use client";
import { useEffect, useRef, useState } from "react";
import { deviceId, liveRequest } from "../../features/live/client.js";
import "../../styles/live.css";

export default function StudentRoom() {
  const [code, setCode] = useState("");
  const [joined, setJoined] = useState("");
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [connection, setConnection] = useState("");
  const [text, setText] = useState("");
  const [disabled, setDisabled] = useState(false);
  const version = useRef(0);
  const lastActive = useRef(null);
  const heading = useRef(null);
  const participant = useRef(null);
  const mutation = useRef(false);
  const latest = useRef({ code: null, revision: 0 });
  useEffect(() => {
    participant.current = deviceId();
    const initial = new URLSearchParams(location.search).get("c") || "";
    if (/^\d{4,6}$/.test(initial)) setCode(initial);
    let cancelled = false;
    fetch("/api/live", { cache: "no-store" }).then((res) => res.json()).then((data) => { if (!cancelled) setDisabled(data.enabled === false); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);
  const active = state?.active;
  const result = active ? state?.results?.[active.id] : null;
  function accept(data) {
    if (latest.current.code === data.code && data.revision < latest.current.revision) return;
    latest.current = { code: data.code, revision: data.revision };
    if (data.active?.id !== lastActive.current) { lastActive.current = data.active?.id; setText(""); setMessage(""); setError(""); }
    setState(data); setConnection("");
  }
  function handleError(problem) {
    if (problem.code === "room_closed" || problem.code === "disabled") {
      version.current++; setJoined(""); setState(null); setMessage(""); setError(problem.message);
      if (problem.code === "disabled") setDisabled(true);
    } else setError(problem.message);
  }
  useEffect(() => {
    if (!joined) return;
    let cancelled = false, timer;
    const currentVersion = version.current;
    async function poll() {
      if (!mutation.current) {
        try {
          const data = await liveRequest({ action: "state", code: joined, deviceId: participant.current });
          if (!cancelled && version.current === currentVersion && !mutation.current) accept(data);
        } catch (problem) {
          if (!cancelled) {
            if (["room_closed", "disabled"].includes(problem.code)) { handleError(problem); return; }
            setConnection("연결을 다시 확인하고 있어요. 잠시만 기다려 주세요.");
          }
        }
      }
      if (!cancelled) timer = setTimeout(poll, 1800);
    }
    timer = setTimeout(poll, 1800);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [joined]);
  useEffect(() => { if (joined) heading.current?.focus({ preventScroll: true }); }, [joined, active?.id]);
  async function join(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { const data = await liveRequest({ action: "state", code, deviceId: participant.current || deviceId() }); version.current++; accept(data); setJoined(code); }
    catch (problem) { handleError(problem); }
    finally { setBusy(false); }
  }
  async function send(action, payload) {
    if (mutation.current) return;
    mutation.current = true; setBusy(true); setError(""); setMessage("");
    try {
      const data = await liveRequest({ action, code: joined, itemId: active.id, deviceId: participant.current, ...payload });
      accept(data);
      if (action === "post") setText("");
      setMessage(action === "vote" ? "내 생각을 보냈어요. 다른 보기를 누르면 바꿀 수 있어요." : "문장이 큰 화면에 붙었어요.");
    } catch (problem) { handleError(problem); }
    finally { mutation.current = false; setBusy(false); }
  }
  const remaining = 3 - (result?.mineCount ?? 0);
  return <div className="live-student live-ui">
    <header className="live-student-header"><a href="/" aria-label="레브랩 홈">LEV LAB</a><span>우리 반 수업방</span></header>
    <div className="live-student-main">
      {!joined ? <>
        <h1>생각은 달라도,<br />함께 나누어요.</h1><p className="live-student-intro">선생님 화면에 있는 방 코드를 넣어요.<br />이름이나 번호는 필요 없어요.</p>
        {disabled ? <p className="live-waiting" role="status">수업방은 준비 중이에요</p> : <form className="live-join-form" onSubmit={join}>
          <label htmlFor="live-code">방 코드</label><input id="live-code" name="code" type="text" inputMode="numeric" pattern="[0-9]{4,6}" autoComplete="off" required minLength={4} maxLength={6} placeholder="숫자 6자리" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} aria-describedby="live-code-help" />
          <p id="live-code-help">QR로 왔다면 코드가 미리 채워져 있어요.</p><button type="submit" className="live-primary" disabled={busy || !/^\d{4,6}$/.test(code)}>{busy ? "들어가는 중…" : "수업방 들어가기"}</button>
        </form>}
      </> : <>
        <div className="live-student-roomline"><span>수업방 <b>{joined}</b></span><button type="button" className="live-text-button" onClick={() => { version.current++; setJoined(""); setState(null); setError(""); setMessage(""); }} disabled={busy}>나가기</button></div>
        {active ? <>
          <h1 ref={heading} tabIndex={-1}>{active.prompt}</h1>
          {active.kind === "vote" ? <>
            <p className="live-student-intro">정답은 없어요. 내 생각에 가까운 것을 골라요.</p>
            <div className="live-vote-options" role="group" aria-label="내 생각 고르기">{active.choices.map((choice, i) => <button type="button" key={`${active.id}-${i}`} className={`live-vote-option live-choice-color-${i % 4}`} aria-pressed={result?.mine === i} disabled={busy} onClick={() => send("vote", { choice: i })}><span className="live-option-number" aria-hidden="true">{i + 1}</span><span>{choice}</span>{result?.mine === i && <span className="live-selected">선택함</span>}</button>)}</div>
            <p className="live-response-note">한 기기에서 한 표 · 선택은 바꿀 수 있어요.</p>
          </> : <form className="live-post-form" onSubmit={(event) => { event.preventDefault(); send("post", { text }); }}>
            <label htmlFor="live-sentence">내가 보내는 한 문장</label><textarea id="live-sentence" value={text} maxLength={active.max} disabled={busy || remaining <= 0} onChange={(event) => setText(event.target.value)} placeholder={active.placeholder || "친구에게 들려주고 싶은 생각을 적어요."} rows={4} aria-describedby="live-writing-help live-writing-count" required />
            <div className="live-writing-meta"><span id="live-writing-count">{[...text].length} / {active.max}자</span><span>{Math.max(0, remaining)}번 더 보낼 수 있어요</span></div>
            <p id="live-writing-help" className="live-response-note">이름·연락처·주소는 쓰지 않아요.<br />친구를 존중하는 말로 적어 주세요.</p><button type="submit" className="live-primary" disabled={busy || remaining <= 0 || !text.trim()}>{busy ? "보내는 중…" : remaining <= 0 ? "세 문장을 모두 보냈어요" : "큰 화면에 문장 보내기"}</button>
          </form>}
        </> : <div className="live-waiting"><svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><rect x="5" y="7" width="46" height="31" rx="4" /><path d="M17 49h22M28 38v11M18 22h20" /></svg><h1 ref={heading} tabIndex={-1}>선생님 화면을<br />봐 주세요</h1><p>활동이 열리면 여기에 나타나요.<br />이 화면을 그대로 두어도 괜찮아요.</p></div>}
      </>}
      <p className="live-success" role="status">{message}</p><p className="live-error" role="alert">{error}</p><p className="live-connection" role="status">{connection}</p>
    </div>
    <footer className="live-student-footer"><p>보낸 생각은 선생님과 우리 반이 함께 봐요.<br />응답은 방을 연 뒤 3시간, 닫으면 즉시 삭제해요.</p><a href="/privacy">개인정보 처리방침</a></footer>
  </div>;
}
