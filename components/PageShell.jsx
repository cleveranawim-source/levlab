import Link from "next/link";
import Logo from "./Logo";
import { CATCHPHRASE } from "../data/site";

/** 하위 페이지 히어로와 본문. Nav·Footer·main은 루트 레이아웃과 template에서 제공한다. */
export default function PageShell({ eyebrow, title, sub, showSlogan = false, children }) {
  return (
    <>
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
    </>
  );
}

/** 아직 공개 전인 영역 안내 카드 — 막다른 길이 되지 않도록 다음 행동을 함께 준다 */
export function ComingSoon({ title = "준비하고 있어요", note, actions = [] }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18,
      padding: "40px 32px", textAlign: "center", boxShadow: "var(--shadow-s)",
    }}>
      <div style={{ fontSize: 34, marginBottom: 10 }} aria-hidden="true">🌱</div>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>{title}</h2>
      <p style={{ color: "var(--ink-soft)", fontSize: 15, maxWidth: "48ch", margin: "0 auto" }}>{note}</p>
      {actions.length > 0 && (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 22 }}>
          {actions.map((a, i) => (
            <Link key={a.to} href={a.to} className={`btn ${i === 0 ? "btn-solid" : "btn-ghost"}`}>{a.label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
