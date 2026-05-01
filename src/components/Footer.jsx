import { useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, NAV_ITEMS, SOCIAL_LINKS } from "../styles/tokens";

function SocialLink({ href, external, children, dim = false }) {
  const [hovered, setHovered] = useState(false);
  const style = {
    fontSize: dim ? 12 : 13,
    color: hovered && !dim ? "#fff" : COLORS.teal200,
    opacity: dim ? 0.5 : 1,
    textDecoration: "none",
    transition: "color 0.2s",
  };
  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style} {...handlers}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} style={style} {...handlers}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        padding: "36px clamp(16px, 4vw, 48px)",
        background: COLORS.teal900,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 24,
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            textDecoration: "none",
          }}
        >
          <img src="/favicon.svg" alt="Lev Lab" style={{ height: 28 }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
            Lev Lab
          </span>
        </Link>
        <p style={{ fontSize: 13, color: COLORS.teal200 }}>마음을 읽는 교육</p>
        <p
          style={{
            fontSize: 12,
            color: COLORS.teal200,
            opacity: 0.5,
            marginTop: 8,
          }}
        >
          &copy; 2026 Lev Lab. All rights reserved.
        </p>
      </div>

      <div style={{ textAlign: "right" }}>
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "flex-end",
            marginBottom: 12,
          }}
        >
          {SOCIAL_LINKS.map((s) => (
            <SocialLink key={s.label} href={s.url} external={s.external}>
              {s.label}
            </SocialLink>
          ))}
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "flex-end" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                fontSize: 12,
                color: COLORS.teal200,
                opacity: 0.5,
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
