"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LiveSlot } from "../live";

const choiceText = (item) => typeof item === "string" ? item : item.text || item.label;

export function HintPicture({ image, toy, enabled }) {
  const [selected, setSelected] = useState(null);
  const [ratio, setRatio] = useState(4 / 3);
  const picture = useRef(null);
  useEffect(() => {
    if (picture.current?.naturalWidth) setRatio(picture.current.naturalWidth / picture.current.naturalHeight);
  }, [image.src]);
  const hint = toy.hints?.[selected];
  return <div className="slide-hint">
    <figure className="slide-art">
      <div className={`slide-hint-media${ratio < 1 ? " is-portrait" : ""}`} style={{ "--image-ratio": ratio }}>
        <img ref={picture} src={image.src} alt={image.alt || "수업 그림"} width="1200" height="900" draggable="false" onLoad={(event) => setRatio(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)} />
        {enabled && hint && <div className="slide-hint-overlay" key={selected} aria-hidden="true">{hint.spots.map((spot, i) => <span className="slide-hint-spot" key={i} style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.r * 2}%`, "--spot-order": i }}><span className="slide-hint-ring" /><span className="slide-hint-label">{spot.text}</span></span>)}</div>}
      </div>
      {image.credit && <figcaption>{image.credit}</figcaption>}
    </figure>
    {enabled && <><div className="slide-hint-buttons" role="group" aria-label="그림을 다르게 보는 힌트">{toy.hints?.map((item, i) => <button type="button" key={i} aria-pressed={selected === i} onClick={() => setSelected(selected === i ? null : i)}>{item.label}</button>)}</div><p className="sr-only" role="status">{hint ? `${hint.label}: ${hint.spots.map((spot) => spot.text).join(", ")}. 다시 누르면 힌트가 꺼집니다.` : "힌트 꺼짐"}</p></>}
  </div>;
}

export function StoryChoices({ lesson, slide, index, enabled, choice, onChoose }) {
  const [counts, setCounts] = useState(() => slide.choices.map(() => 0));
  const total = counts.reduce((sum, count) => sum + count, 0);
  const tally = enabled && slide.toy?.kind === "tally";
  const change = (i, amount) => setCounts((all) => all.map((count, n) => n === i ? Math.max(0, count + amount) : count));
  return <div className="slide-voting">
    <div className="slide-choices" role="group" aria-label="이야기의 주인공 고르기">{slide.choices?.map((item, i) => <div className="slide-choice-cell" key={i}>
      {enabled ? <button className="slide-choice" type="button" aria-pressed={choice === i} onClick={() => onChoose?.(i)}><span className="slide-choice-index">{i + 1}</span><span>{choiceText(item)}</span><span className="slide-choice-state">{choice === i ? "선택" : ""}</span></button> : <p className="slide-choice slide-choice-static"><span className="slide-choice-index">{i + 1}</span>{choiceText(item)}</p>}
      {tally && <div className="slide-tally-controls"><div className="slide-tally-track" aria-hidden="true"><span style={{ transform: `scaleX(${total ? counts[i] / total : 0})` }} /></div><div className="slide-tally-counter"><button type="button" onClick={() => change(i, -1)} disabled={counts[i] === 0} aria-label={`${choiceText(item)} 한 표 빼기`}>−</button><span aria-label={`${choiceText(item)} ${counts[i]}표`}>{counts[i]}<small>표</small></span><button type="button" onClick={() => change(i, 1)} aria-label={`${choiceText(item)} 한 표 더하기`}>+</button></div></div>}
    </div>)}</div>
    {slide.live && enabled && <div className="slide-live-slot"><LiveSlot lesson={lesson} slide={slide} index={index} /></div>}
    {tally && <div className="slide-tally-footer"><span>손들기 집계 · 모두 {total}표</span><button type="button" onClick={() => setCounts(slide.choices.map(() => 0))} disabled={total === 0}>0으로 초기화</button><span className="sr-only" role="status">{slide.choices.map((item, i) => `${choiceText(item)} ${counts[i]}표`).join(", ")}</span></div>}
  </div>;
}

export function Roulette({ toy, enabled, active, motion }) {
  const [picked, setPicked] = useState([]);
  const [display, setDisplay] = useState("");
  const [spinning, setSpinning] = useState(false);
  const timeout = useRef(null);
  const target = useRef(null);
  const running = useRef(false);
  const items = toy.items || [];
  const finish = useCallback(() => {
    clearTimeout(timeout.current);
    if (target.current !== null) {
      const result = target.current;
      setDisplay(result);
      setPicked((all) => all.includes(result) ? all : [...all, result]);
    }
    target.current = null;
    running.current = false;
    setSpinning(false);
  }, []);
  const spin = useCallback(() => {
    const remaining = items.filter((item) => !picked.includes(item));
    if (running.current || !remaining.length) return;
    target.current = remaining[Math.floor(Math.random() * remaining.length)];
    if (!motion) { finish(); return; }
    running.current = true;
    setSpinning(true);
    let step = 0;
    const tick = () => {
      setDisplay(remaining[step % remaining.length]);
      step += 1;
      if (step > 16) { finish(); return; }
      timeout.current = setTimeout(tick, 45 + step * step * 1.2);
    };
    tick();
  }, [items, picked, motion, finish]);
  useEffect(() => {
    if ((!active || !motion) && running.current) finish();
  }, [active, motion, finish]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  useEffect(() => {
    if (!enabled || !active) return;
    const key = (event) => {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key.toLowerCase() === "r") { event.preventDefault(); spin(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [enabled, active, spin]);
  if (!enabled) return <p className="slide-roulette-static">{toy.label}: {items.join(" · ")}</p>;
  return <section className={`slide-roulette${spinning ? " is-spinning" : ""}`} aria-label={`${toy.label} 뽑기`}>
    <div className="slide-roulette-main"><div className="slide-roulette-result" aria-hidden="true"><span key={display}>{display || "어느 모둠일까요?"}</span></div><button className="slide-toy-primary" type="button" onClick={spin} disabled={spinning || picked.length === items.length}>{spinning ? "뽑는 중…" : `${toy.label} 뽑기`}<small>R</small></button><button type="button" className="slide-toy-reset" onClick={() => { setPicked([]); setDisplay(""); }} disabled={spinning || !picked.length}>다시 담기</button></div>
    <ul className="slide-roulette-items" aria-label="뽑을 모둠">{items.map((item) => <li key={item} className={picked.includes(item) ? "is-picked" : ""}>{item}{picked.includes(item) && <span className="sr-only"> 뽑힘</span>}</li>)}</ul>
    <p className="sr-only" role="status">{spinning ? "모둠을 뽑고 있어요." : display ? `${toy.label}: ${display}. ${picked.length === items.length ? "모두 뽑았어요. 다시 담기를 누르면 새로 시작해요." : ""}` : "뽑기 버튼이나 R 키를 눌러 주세요."}</p>
  </section>;
}

export function FlipCards({ slide, enabled, flipped = [], onFlip }) {
  if (!enabled) return <div className="slide-flip-static"><div className="slide-compare-head"><h3>{slide.left?.label}</h3><h3>{slide.right?.label}</h3></div><ol className="slide-compare">{slide.left?.items?.map((left, i) => <li key={i}><p>{left}</p><span aria-hidden="true">→</span><p>{slide.right?.items[i]}</p></li>)}</ol></div>;
  return <div className="slide-flip-toy"><p className="slide-toy-instruction">카드를 눌러 ‘다름 말’로 바꿔 보세요.</p><ol className="slide-flip-cards">{slide.left?.items?.map((left, i) => <li key={i}><button type="button" className={`slide-flip-card${flipped.includes(i) ? " is-flipped" : ""}`} aria-pressed={flipped.includes(i)} aria-label={flipped.includes(i) ? `${slide.right?.label}: ${slide.right?.items[i]}. 틀림 말 다시 보기` : `${slide.left?.label}: ${left}. 다름 말 보기`} onClick={() => onFlip(i)}><span className="slide-flip-inner" aria-hidden="true"><span className="slide-flip-front"><small>{slide.left?.label}</small><strong>{left}</strong><span>눌러서 바꾸기 <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 19 19 5M5 5h14v14" /></svg></span></span><span className="slide-flip-back"><small>{slide.right?.label}</small><strong>{slide.right?.items[i]}</strong><span>다시 눌러 비교하기</span></span></span></button></li>)}</ol><p className="sr-only" role="status">{flipped.map((i) => slide.right?.items[i]).join(" ")}</p></div>;
}

export function LiveWall({ lesson, slide, index, enabled }) {
  return enabled && slide.live ? <div className="slide-live-wall"><LiveSlot lesson={lesson} slide={slide} index={index} /></div> : null;
}
