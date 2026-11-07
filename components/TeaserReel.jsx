"use client";
// 예고편 영상관 — 큰 화면 하나 + 고르는 목록. 누르기 전에는 영상을 받지 않는다.
import { useEffect, useRef, useState } from "react";
import { TOOLS } from "../data/tools";

const NOTE = {
  kkangtong: "AI 로봇 깡통이에게 사람의 마음을 가르치는 중1 AI 수업",
  harin: "늘 웃던 하린이가 보낸 밤의 메시지, AI와 친구의 위로를 견주는 수업",
  "mind-rider": "감정을 연료 삼아 밤길을 달리는 게임",
  community: "작은 공감 하나로 안개를 걷어 내는 공동체 게임",
  "mind-rift": "다섯 그림자와 맞서는 마음의 협곡",
};
const REELS = TOOLS.filter((t) => t.teaser).map((t) => ({ key: t.teaser, n: t.n, t: t.t, url: t.url, note: NOTE[t.teaser] || t.d }));
const src = (k, ext) => `/video/teasers/${k}.${ext}`;

export default function TeaserReel() {
  const [cur, setCur] = useState(0);
  const [hover, setHover] = useState(null);
  const stage = useRef(null);
  const wantPlay = useRef(false);
  const r = REELS[cur];

  // 고르면 큰 화면에서 바로 재생 (사용자가 누른 것이므로 소리도 켜진 채로)
  useEffect(() => {
    const v = stage.current;
    if (!v || !wantPlay.current) return;
    wantPlay.current = false;
    v.load();
    v.play().catch(() => {});
  }, [cur]);

  const pick = (i) => {
    wantPlay.current = true;
    if (i === cur) { stage.current?.play().catch(() => {}); return; }
    setCur(i);
    stage.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  };
  const canPreview = () => typeof window !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches && document.documentElement.dataset.motionPaused !== "true";

  return (
    <section className="treel" aria-labelledby="treel-h">
      <div className="treel-head">
        <h2 id="treel-h">예고편으로 먼저 보기</h2>
        <p>수업을 열기 전에 학생들과 함께 보면 좋은 짧은 영상입니다. 소리가 있어요.</p>
      </div>
      <div className="treel-grid">
        <figure className="treel-stage">
          <video
            ref={stage} key={r.key} controls playsInline preload="none"
            poster={src(r.key, "webp")} aria-label={`${r.n} 예고편`}
          >
            <source src={src(r.key, "mp4")} type="video/mp4" />
          </video>
          <figcaption>
            <span className="treel-kind">{r.t}{!r.url && " · 곧 공개"}</span>
            <b>{r.n}</b>
            <span className="treel-note">{r.note}</span>
            {r.url
              ? <a className="treel-open" href={r.url} target="_blank" rel="noopener noreferrer">열어 보기<span aria-hidden="true"> ↗</span><span className="sr-only"> (새 창)</span></a>
              : <span className="treel-soon">공개 준비 중</span>}
          </figcaption>
        </figure>
        <ol className="treel-list" aria-label="예고편 고르기">
          {REELS.map((x, i) => (
            <li key={x.key}>
              <button
                type="button" className="treel-item" aria-current={i === cur ? "true" : undefined}
                onClick={() => pick(i)}
                onMouseEnter={() => canPreview() && setHover(i)} onMouseLeave={() => setHover(null)}
              >
                <span className="treel-thumb">
                  <img src={src(x.key, "webp")} alt="" width={960} height={540} loading="lazy" />
                  {hover === i && <video src={src(x.key, "mp4")} muted autoPlay loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} />}
                  <span className="treel-play" aria-hidden="true" />
                </span>
                <span className="treel-txt"><span>{x.t}{!x.url && " · 곧 공개"}</span><b>{x.n}</b></span>
                <span className="sr-only">{i === cur ? "(지금 화면)" : "예고편 보기"}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
