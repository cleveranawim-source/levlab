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
  return (
    <section className="vshow" id="showcase">
      <div className="vshow-bg">
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
