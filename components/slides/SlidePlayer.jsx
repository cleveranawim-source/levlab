"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SlideContent, { AREA_COLORS, STAGES, revealCount, slideHeading } from "./SlideContent";

function ControlIcon({ kind }) {
  const paths = {
    prev: "m15 5-7 7 7 7", next: "m9 5 7 7-7 7", notes: "M5 3h14v18H5zM8 7h8M8 11h8M8 15h5",
    fullscreen: "M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5", exit: "M9 4H4v16h5M12 12h9m-5-5 5 5-5 5",
    close: "m6 6 12 12M18 6 6 18",
  };
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind]} /></svg>;
}
const clockText = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const fromHash = (total) => {
  const value = /^#([1-9]\d*)$/.exec(location.hash);
  return value ? Math.min(total - 1, Number(value[1]) - 1) : 0;
};

export default function SlidePlayer({ deck }) {
  const { slides, lesson } = deck;
  const total = slides.length;
  const root = useRef(null);
  const touch = useRef(null);
  const hideControls = useRef(null);
  const notesHeading = useRef(null);
  const previousFocus = useRef(null);
  const [ready, setReady] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ index: 0, revealed: 1 });
  const [notesOpen, setNotesOpen] = useState(false);
  const [controls, setControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");
  const [choices, setChoices] = useState({});
  const [timers, setTimers] = useState({});
  const { index, revealed } = position;
  const slide = slides[index];
  const presentation = ready && viewport.width >= 768;
  const availableWidth = viewport.width - (notesOpen && presentation ? 400 : 0);
  const scale = Math.max(.1, Math.min(availableWidth / 1920, (viewport.height - 22) / 1080));
  const timerSeconds = Math.max(0, Math.round((slide.timer || 0) * 60));
  const timer = timers[index] || { remaining: timerSeconds, running: false };

  useEffect(() => {
    setPosition({ index: fromHash(total), revealed: 1 });
    setReady(true);
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    const hash = () => setPosition({ index: fromHash(total), revealed: 1 });
    const full = () => setFullscreen(Boolean(document.fullscreenElement));
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("hashchange", hash);
    document.addEventListener("fullscreenchange", full);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("hashchange", hash);
      document.removeEventListener("fullscreenchange", full);
      clearTimeout(hideControls.current);
    };
  }, [total]);

  useEffect(() => {
    if (!ready) return;
    history.replaceState(history.state, "", `#${index + 1}`);
    setNotice("");
    // Stop a previous slide's clock on navigation; retain its remaining time.
    setTimers((all) => Object.fromEntries(Object.entries(all).map(([key, value]) => [key, { ...value, running: false, remaining: value.running ? Math.max(0, Math.ceil((value.endsAt - Date.now()) / 1000)) : value.remaining }])));
    if (!presentation) document.getElementById(String(index + 1))?.scrollIntoView({ block: "start" });
    else if (document.activeElement?.closest(".slide-page")) root.current?.focus({ preventScroll: true });
  }, [index, ready, presentation]);

  const wake = useCallback(() => {
    setControls(true);
    clearTimeout(hideControls.current);
    hideControls.current = setTimeout(() => setControls(false), 2400);
  }, []);
  useEffect(() => { if (ready) wake(); }, [ready, wake]);
  useEffect(() => { if (ready) document.dispatchEvent(new Event("levlab:motion-refresh")); }, [ready]);

  const navigate = useCallback((direction) => {
    wake();
    setPosition((current) => {
      const count = revealCount(slides[current.index]);
      if (presentation && direction > 0 && current.revealed < count) return { ...current, revealed: current.revealed + 1 };
      if (presentation && direction < 0 && current.revealed > 1) return { ...current, revealed: current.revealed - 1 };
      const next = Math.max(0, Math.min(total - 1, current.index + direction));
      return { index: next, revealed: next === current.index ? current.revealed : direction < 0 ? revealCount(slides[next]) : 1 };
    });
  }, [slides, total, presentation, wake]);

  const toggleTimer = useCallback(() => {
    if (!timerSeconds) return;
    setTimers((all) => {
      const current = all[index] || { remaining: timerSeconds, running: false };
      const remaining = current.running ? Math.max(0, Math.ceil((current.endsAt - Date.now()) / 1000)) : current.remaining || timerSeconds;
      return { ...all, [index]: { remaining, running: !current.running, endsAt: Date.now() + remaining * 1000 } };
    });
    wake();
  }, [index, timerSeconds, wake]);

  useEffect(() => {
    if (!timer.running) return;
    const tick = () => setTimers((all) => {
      const current = all[index];
      if (!current?.running) return all;
      const remaining = Math.max(0, Math.ceil((current.endsAt - Date.now()) / 1000));
      return { ...all, [index]: { ...current, remaining, running: remaining > 0 } };
    });
    const interval = setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", tick); };
  }, [index, timer.running]);

  const toggleNotes = useCallback(() => { wake(); setNotesOpen((open) => !open); }, [wake]);
  useEffect(() => {
    if (notesOpen) {
      previousFocus.current = document.activeElement;
      notesHeading.current?.focus({ preventScroll: true });
    } else if (previousFocus.current) {
      if (previousFocus.current.isConnected) previousFocus.current.focus({ preventScroll: true });
      else root.current?.focus({ preventScroll: true });
      previousFocus.current = null;
    }
  }, [notesOpen]);

  const toggleFullscreen = useCallback(async () => {
    wake();
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else setNotice("이 브라우저에서는 전체 화면을 지원하지 않아요.");
    } catch { setNotice("전체 화면을 열 수 없어요. 브라우저의 전체 화면 메뉴를 이용해 주세요."); }
  }, [wake]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input, textarea, select, [contenteditable='true']")) return;
      const key = event.key.toLowerCase();
      if (key === "escape") { event.preventDefault(); location.assign(`/lessons/${lesson.slug}`); return; }
      if (key === "n") { event.preventDefault(); toggleNotes(); return; }
      if (key === "f") { event.preventDefault(); toggleFullscreen(); return; }
      if (!presentation) return;
      if (key === "t") { event.preventDefault(); toggleTimer(); return; }
      // Space continues to activate a focused native control.
      if (key === " " && event.target.closest("button, a, summary")) return;
      if (["arrowright", "pagedown", " "].includes(key)) { event.preventDefault(); navigate(1); }
      else if (["arrowleft", "pageup"].includes(key)) { event.preventDefault(); navigate(-1); }
      else if (key === "home" || key === "end") { event.preventDefault(); setPosition({ index: key === "home" ? 0 : total - 1, revealed: 1 }); wake(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presentation, lesson.slug, total, navigate, toggleNotes, toggleFullscreen, toggleTimer, wake]);

  const currentStage = STAGES.indexOf(slide.stage);
  const done = timerSeconds > 0 && timer.remaining === 0;
  return <div ref={root} tabIndex={-1} className={`lesson-slides${presentation ? " is-presenting" : " is-reading"}${notesOpen ? " has-notes" : ""}`} style={{ "--slide-accent": AREA_COLORS[lesson.area] || "#1F5C3F", "--slide-scale": scale, "--slide-width": `${1920 * scale}px`, "--slide-height": `${1080 * scale}px` }}
    onPointerMove={wake} onPointerDown={wake}
    onTouchStart={(event) => { if (!event.target.closest("button, a, aside")) touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
    onTouchEnd={(event) => { const start = touch.current; touch.current = null; if (!start || !presentation) return; const dx = event.changedTouches[0].clientX - start.x; const dy = event.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx < 0 ? 1 : -1); }}>
    <div className="slide-reading-intro"><a href={`/lessons/${lesson.slug}`}>차시 페이지로 돌아가기</a><p>수업 화면 · 세로 읽기</p><span>넓은 화면에서는 발표 모드로 열립니다.</span></div>
    <div className="slide-viewport">
      <div className="slide-stage">
        {slides.map((item, number) => <section key={number} id={String(number + 1)} className={`slide-page slide-type-${item.type}`} role="group" aria-roledescription="slide" aria-label={`${number + 1} / ${total}`} hidden={presentation && number !== index}>
          <div className="slide-topline"><span>LEV LAB</span><span>{item.stage} <span aria-hidden="true">·</span> 중{lesson.grade}</span></div>
          <div className="slide-content"><SlideContent slide={item} deck={deck} interactive={presentation} revealed={number === index ? revealed : 1} choice={choices[number]} onChoose={ready ? (selected) => setChoices((all) => ({ ...all, [number]: all[number] === selected ? null : selected })) : undefined} /></div>
          {item.timer > 0 && <div className="slide-timer-slot">{presentation && number === index ? <button className={`slide-timer${done ? " is-done" : ""}`} type="button" onClick={toggleTimer} aria-label={done ? "시간 끝, 타이머 다시 시작" : `타이머 ${timer.running ? "정지" : "시작"}, ${clockText(timer.remaining)} 남음`} aria-pressed={timer.running}><span>{done ? "시간 끝" : clockText(timer.remaining)}</span><small>{done ? "다시 시작" : timer.running ? "잠시 멈추기" : "시작하기 · T"}</small><span className="slide-timer-track" aria-hidden="true"><span style={{ transform: `scaleX(${timer.remaining / timerSeconds})` }} /></span></button> : <span className="slide-duration">{item.timer}분</span>}</div>}
          <div className="slide-bottomline"><span>{lesson.title}</span><span>{presentation && number === index && revealCount(item) > 1 ? `${revealed} / ${revealCount(item)} ${item.type === "ask" ? "질문" : "내용"} · ` : ""}{number + 1} / {total}</span></div>
        </section>)}
      </div>
    </div>
    {ready && <>
      <div className={`slide-controls${controls ? " is-awake" : ""}`} aria-label="발표 조작" role="group" onFocusCapture={wake}>
        <button type="button" onClick={() => navigate(-1)} disabled={index === 0 && revealed === 1} aria-label="이전 내용 (왼쪽 화살표)" title="이전 · ←"><ControlIcon kind="prev" /></button>
        <span className="slide-control-count">{index + 1} / {total}</span>
        <button type="button" onClick={() => navigate(1)} disabled={index === total - 1 && revealed >= revealCount(slide)} aria-label="다음 내용 (오른쪽 화살표)" title="다음 · → / Space"><ControlIcon kind="next" /></button>
        <button type="button" onClick={toggleNotes} aria-expanded={notesOpen} aria-controls="slide-notes" aria-label="교사 메모 (N)" title="교사 메모 · N"><ControlIcon kind="notes" /></button>
        <button type="button" onClick={toggleFullscreen} aria-pressed={fullscreen} aria-label="전체 화면 (F)" title="전체 화면 · F"><ControlIcon kind="fullscreen" /></button>
        <button type="button" data-wit-toggle aria-pressed="false" className="slide-motion-toggle">움직임 멈추기</button>
        <a href={`/lessons/${lesson.slug}`} aria-label="차시 페이지로 나가기 (Esc)" title="나가기 · Esc"><ControlIcon kind="exit" /></a>
      </div>
      <aside id="slide-notes" className="slide-notes" aria-labelledby="slide-notes-heading" hidden={!notesOpen}>
        <div className="slide-notes-heading"><h2 id="slide-notes-heading" ref={notesHeading} tabIndex={-1}>교사 메모</h2><button type="button" onClick={toggleNotes} aria-label="교사 메모 닫기"><ControlIcon kind="close" /></button></div>
        <p className="slide-notes-current">{index + 1} / {total} · {slide.stage}</p><h3>{slideHeading(slide, lesson)}</h3>
        <p className="slide-notes-text">{Array.isArray(slide.notes) ? slide.notes.join("\n") : slide.notes || "이 화면에 따로 적힌 교사 메모가 없습니다."}</p>
        {slide.ask?.length > 0 && <><h3>이렇게 물어보세요</h3><ul>{slide.ask.map((ask, i) => <li key={i}>{ask}</li>)}</ul></>}
        {timerSeconds > 0 && <div className="slide-notes-timer"><button type="button" onClick={toggleTimer}>{timer.running ? "타이머 정지" : "타이머 시작"}</button><button type="button" onClick={() => setTimers((all) => ({ ...all, [index]: { remaining: timerSeconds, running: false } }))}>시간 초기화</button><p>{clockText(timer.remaining)} 남음 · 화면을 넘기면 멈춥니다.</p></div>}
        <details className="slide-shortcuts"><summary>발표 조작 안내</summary><dl><div><dt>← → / Space</dt><dd>내용을 하나씩 넘기기</dd></div><div><dt>PageUp / PageDown</dt><dd>이전 / 다음 내용</dd></div><div><dt>Home / End</dt><dd>첫 화면 / 마지막 화면</dd></div><div><dt>N / T / F</dt><dd>메모 / 타이머 / 전체 화면</dd></div><div><dt>Esc</dt><dd>차시 페이지로 나가기</dd></div><div><dt>화면을 좌우로 밀기</dt><dd>이전 / 다음 내용</dd></div></dl><p>메모는 현재 화면에도 보입니다. 학생에게 보여도 되는 때에 열어 주세요.</p></details>
      </aside>
      {presentation && <nav className="slide-progress" aria-label="수업 단계">{STAGES.map((stage, i) => { const first = slides.findIndex((item) => item.stage === stage); return <button type="button" key={stage} className={`slide-stage-${i}`} aria-label={`${stage} 단계로 이동`} aria-current={currentStage === i ? "step" : undefined} disabled={first === -1} onClick={() => { setPosition({ index: first, revealed: 1 }); wake(); }}><span>{stage}</span><span className="slide-progress-fill" style={{ transform: `scaleX(${i < currentStage ? 1 : i > currentStage ? 0 : (index - first + 1) / slides.filter((item) => item.stage === stage).length})` }} /></button>; })}</nav>}
    </>}
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{ready ? `${index + 1} / ${total}. ${slideHeading(slide, lesson)}${presentation && slide.type === "ask" ? `. ${slide.ask[revealed - 1]}` : ""}` : ""}</p>
    <p className="slide-notice" role="status" aria-live="polite">{notice || (done ? "정해 둔 시간이 끝났어요." : "")}</p>
  </div>;
}
