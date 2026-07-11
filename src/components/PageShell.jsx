import Nav from "./Nav";
import Footer from "./Footer";
import Logo from "./Logo";
import { CATCHPHRASE } from "../data/site";

/** 하위 페이지 공통 셸: 네비 + 페이지 히어로 + 본문 + 푸터 */
export default function PageShell({ eyebrow, title, sub, showSlogan = false, children }) {
  return (
    <>
      <Nav />
      <section className="tools-hero">
        <div className="wrap">
          {showSlogan && <p className="slogan"><Logo /> {CATCHPHRASE}</p>}
          {eyebrow && <p className="eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</p>}
          <h1>{title}</h1>
          {sub && <p className="sub">{sub}</p>}
        </div>
      </section>
      <section className="band" style={{ paddingTop: "clamp(40px,5vw,60px)" }}>
        <div className="wrap">{children}</div>
      </section>
      <Footer />
    </>
  );
}

/** 아직 재구축 중인 섹션 안내 카드 */
export function ComingSoon({ note }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18,
      padding: "40px 32px", textAlign: "center", boxShadow: "var(--shadow-s)",
    }}>
      <div style={{ fontSize: 34, marginBottom: 10 }}>🌱</div>
      <h3 style={{ fontSize: 20, marginBottom: 8 }}>이 페이지는 곧 채워집니다</h3>
      <p style={{ color: "var(--ink-soft)", fontSize: 15, maxWidth: "48ch", margin: "0 auto" }}>{note}</p>
    </div>
  );
}
