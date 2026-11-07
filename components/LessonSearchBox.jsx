"use client";
// 수업 찾기 — 교실 말로 찾는 콤보박스. JS 가 없으면 /curriculum?q= 로 보내는 평범한 폼.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { search, EXAMPLES } from "../features/search/searchIndex";

const AREA = { "자기": "self", "대인관계": "inter", "공동체": "comm", "마음건강": "well" };

export default function LessonSearchBox({ index, variant = "page" }) {
  const router = useRouter();
  const uid = useId();
  const listId = `${uid}-list`;
  const inputRef = useRef(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [focused, setFocused] = useState(false);
  const [ph, setPh] = useState(`예: ${EXAMPLES[0]}`);
  const results = useMemo(() => search(index, q), [index, q]);

  // /curriculum?q=… 로 들어오면 그대로 찾아 준다
  useEffect(() => {
    if (variant !== "page") return;
    const v = new URLSearchParams(window.location.search).get("q");
    if (v) { setQ(v); setOpen(true); }
  }, [variant]);

  // 예시 문구를 한 글자씩 쓰고 지운다 — 비어 있고 포커스가 없을 때만
  useEffect(() => {
    if (q || focused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0, n = 0, dir = 1, t;
    const tick = () => {
      const word = EXAMPLES[i % EXAMPLES.length];
      n += dir;
      setPh(`예: ${word.slice(0, n)}`);
      let wait = dir > 0 ? 90 : 35;
      if (dir > 0 && n >= word.length) { dir = -1; wait = 1600; }
      else if (dir < 0 && n <= 0) { dir = 1; i++; wait = 350; }
      t = setTimeout(tick, document.hidden ? 1000 : wait);
    };
    t = setTimeout(tick, 900);
    return () => { clearTimeout(t); setPh(`예: ${EXAMPLES[0]}`); };
  }, [q, focused]);

  const go = (it) => { if (it) { setOpen(false); router.push(`/lessons/${it.s}`); } };
  const pick = (word) => { setQ(word); setOpen(true); setActive(-1); inputRef.current?.focus(); };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
    else if (e.key === "Escape") { if (open) { e.preventDefault(); setOpen(false); setActive(-1); } else setQ(""); }
  };
  const onSubmit = (e) => { e.preventDefault(); go(results[active >= 0 ? active : 0]); };

  const showList = open && q.trim().length > 0;
  return (
    <div className={`lsearch lsearch-${variant}`}>
      <form role="search" action="/curriculum" method="get" onSubmit={onSubmit} className="ls-form">
        <label htmlFor={`${uid}-in`} className="sr-only">수업 찾기: 교실에서 쓰는 말로 검색</label>
        <span className="ls-prompt" aria-hidden="true">&gt;_</span>
        <input
          ref={inputRef} id={`${uid}-in`} name="q" type="search" autoComplete="off" spellCheck={false}
          value={q} placeholder={ph}
          role="combobox" aria-autocomplete="list" aria-expanded={showList} aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${uid}-o${active}` : undefined}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => { setFocused(false); setTimeout(() => setOpen(false), 150); }}
          onKeyDown={onKey}
        />
        <button type="submit" className="ls-go">찾기</button>
      </form>

      <div className="ls-pop" hidden={!showList}>
        <ul id={listId} role="listbox" aria-label="찾은 수업" className="ls-list">
          {results.map((it, i) => (
            <li
              key={it.s} id={`${uid}-o${i}`} role="option" aria-selected={i === active}
              className={`ls-opt ls-${AREA[it.a] || "self"}`}
              onMouseDown={(e) => { e.preventDefault(); go(it); }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="ls-tags"><span className="ls-grade">중{it.g}</span><span className="ls-area">{it.a}</span><span className="ls-skill">{it.k}</span></span>
              <b className="ls-title">{it.t}</b>
              <span className="ls-q">{it.q}</span>
            </li>
          ))}
        </ul>
        {results.length === 0 && (
          <div className="ls-empty">
            <p><code>404</code> 이 말로는 딱 맞는 수업을 못 찾았어요. 이런 말로 찾아보세요.</p>
            <p className="ls-chips">{EXAMPLES.slice(0, 5).map((w) => <button type="button" key={w} onMouseDown={(e) => { e.preventDefault(); pick(w); }}>{w}</button>)}</p>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">{showList ? (results.length ? `수업 ${results.length}개를 찾았어요. 위아래 화살표로 고르고 Enter.` : "찾은 수업이 없어요.") : ""}</p>
      {variant === "page" && (
        <p className="ls-hint">이렇게 찾아보세요 {EXAMPLES.slice(0, 6).map((w) => <button type="button" key={w} onClick={() => pick(w)}>{w}</button>)}</p>
      )}
    </div>
  );
}
