"use client";

import { useRef, useEffect, useId, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { usePrefersReducedMotion } from "../lib/motion";
import { useInViewport, usePageVisible } from "../lib/visibility";
import { TOOLS, TOOL_TYPES } from "../data/tools";

const GAMES = TOOLS.filter((t) => t.t === "게임" && t.url).map((t) => t.n);
const COUNTS = TOOL_TYPES.filter((type) => type !== "전체")
  .map((t) => `${t} ${TOOLS.filter((x) => x.t === t && x.url).length}`)
  .join(" · ");

/** 게임 실사 영상이 배경으로 흐르는 시네마틱 쇼케이스 밴드 */
export default function VideoShowcase({
  eyebrow = "Play & Learn",
  titleLead = "마음공부가 ",
  titleHl = "게임이 되는 순간",
  sub = "레브랩의 SEL 게임 세계에서 학생들은 플레이하며 감정을 다루고 관계를 배웁니다. 밤의 숲을 달리고, 공동체를 짓고, 감정을 붙잡으면서.",
  ctaLabel = "SEL 콘텐츠 체험하기 →",
  ctaTo = "/tools",
  meta = COUNTS,
  showBadges = true,
}) {
  const reduce = usePrefersReducedMotion();
  const bgRef = useRef(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const videoId = useId();
  const canLoad = useInViewport(sectionRef, { rootMargin: "240px", once: true });
  const visible = useInViewport(sectionRef);
  const pageVisible = usePageVisible();
  const [wantsPlay, setWantsPlay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  // A still poster is the default. Only an explicit play starts motion.
  useEffect(() => { if (reduce) setWantsPlay(false); }, [reduce]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    if (canLoad && wantsPlay && visible && pageVisible) {
      video.play().catch((reason) => {
        if (cancelled || reason.name === "AbortError") return;
        setWantsPlay(false);
        setError("영상을 재생하지 못했어요. 다시 재생해 주세요.");
      });
    } else video.pause();
    return () => { cancelled = true; };
  }, [canLoad, wantsPlay, visible, pageVisible]);

  // 스크롤 패럴랙스: 배경 영상이 본문보다 느리게 움직여 깊이감
  useEffect(() => {
    if (reduce || !visible || !pageVisible) return;
    const bg = bgRef.current;
    const sec = bg?.parentElement;
    if (!bg || !sec) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // 1 → -1
      bg.style.setProperty("--py", `${(progress * -42).toFixed(1)}px`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      bg.style.removeProperty("--py");
    };
  }, [reduce, visible, pageVisible]);

  return (
    <section className="vshow" id="showcase" ref={sectionRef}>
      <div className={`vshow-bg ${reduce ? "" : "para"}`} ref={bgRef}>
        <video
          ref={videoRef} id={videoId} className="vshow-media" muted loop playsInline
          preload={canLoad ? "metadata" : "none"} poster="/video/sel-showcase-poster.jpg"
          src={canLoad ? "/video/sel-showcase.mp4" : undefined} aria-hidden="true"
          onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onError={() => { setWantsPlay(false); setPlaying(false); setError("영상을 불러오지 못했어요. 다시 재생해 주세요."); }}
        />
        <div className="vshow-overlay" />
      </div>

      <div className="wrap vshow-inner">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{titleLead}<span className="hl">{titleHl}</span></h2>
          <p className="vshow-sub">{sub}</p>
          <div className="vshow-cta">
            <Link className="btn btn-solid" href={ctaTo}>{ctaLabel}</Link>
            {meta && <span className="vshow-meta">{meta}</span>}
          </div>
          <div className="vshow-controls">
            <button type="button" className="btn vshow-toggle" aria-controls={videoId} onClick={() => {
              if (error) videoRef.current?.load();
              setError("");
              setWantsPlay((current) => !current);
            }}>{playing || wantsPlay ? "배경 영상 일시정지" : "배경 영상 재생"}</button>
            {error && <p role="status">{error}</p>}
          </div>
          {showBadges && (
            <div className="vshow-badges">
              {GAMES.map((g) => <span className="vshow-badge" key={g}>{g}</span>)}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
