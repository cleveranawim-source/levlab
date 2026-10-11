import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { usePrefersReducedMotion } from "../lib/motion";
import { TOOLS } from "../data/tools";

const GAMES = TOOLS.filter((t) => t.t === "게임").map((t) => t.n);
const COUNTS = ["게임", "자기진단", "활동 도구"]
  .map((t) => `${t} ${TOOLS.filter((x) => x.t === t).length}`)
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

  // 스크롤 패럴랙스: 배경 영상이 본문보다 느리게 움직여 깊이감
  useEffect(() => {
    if (reduce) return;
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
    };
  }, [reduce]);

  return (
    <section className="vshow" id="showcase">
      <div className={`vshow-bg ${reduce ? "" : "para"}`} ref={bgRef}>
        {reduce ? (
          <img className="vshow-media" src="/video/sel-showcase-poster.jpg" alt="" aria-hidden="true" />
        ) : (
          <video className="vshow-media" autoPlay muted loop playsInline preload="metadata" poster="/video/sel-showcase-poster.jpg">
            <source src="/video/sel-showcase.mp4" type="video/mp4" />
          </video>
        )}
        <div className="vshow-overlay" />
      </div>

      <div className="wrap vshow-inner">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{titleLead}<span className="hl">{titleHl}</span></h2>
          <p className="vshow-sub">{sub}</p>
          <div className="vshow-cta">
            <Link className="btn btn-solid" to={ctaTo}>{ctaLabel}</Link>
            {meta && <span className="vshow-meta">{meta}</span>}
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
