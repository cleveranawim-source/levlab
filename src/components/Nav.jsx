import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useScrolled, useIsMobile } from "../hooks";
import { COLORS, NAV_ITEMS } from "../styles/tokens";

export default function Nav() {
  const scrolled = useScrolled();
  const mobile = useIsMobile();
  const { pathname } = useLocation();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLabel = NAV_ITEMS.find((n) => n.path === pathname)?.label;

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: mobile ? "0 16px" : "0 clamp(16px, 4vw, 48px)",
          height: 64,
          background: scrolled || menuOpen ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${COLORS.gray100}` : "1px solid transparent",
          transition: "all 0.35s ease",
        }}
      >
        <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src="/favicon.svg" alt="Lev Lab" style={{ height: 28 }} />
          <span style={{ fontSize: 18, fontWeight: 600, color: COLORS.gray800, letterSpacing: -0.3 }}>Lev Lab</span>
          {!mobile && pathname !== "/" && currentLabel && (
            <>
              <span style={{ fontSize: 13, color: COLORS.gray200, marginLeft: 4 }}>/</span>
              <span style={{ fontSize: 13, color: COLORS.teal600, fontWeight: 500 }}>{currentLabel}</span>
            </>
          )}
        </Link>

        {!mobile && (
          <div style={{ display: "flex", gap: 28 }}>
            {NAV_ITEMS.map((item, i) => {
              const isActive = item.path === pathname;
              const isHovered = hoveredIdx === i;
              return (
                <Link key={item.path} to={item.path} style={{ fontSize: 14, color: isActive || isHovered ? COLORS.teal600 : COLORS.gray600, fontWeight: isActive ? 600 : 400, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {mobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ width: 40, height: 40, borderRadius: 10, border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: menuOpen ? 0 : 5, cursor: "pointer", position: "relative" }}>
            <span style={{ display: "block", width: 20, height: 2, background: COLORS.gray800, borderRadius: 1, transition: "all 0.3s ease", transform: menuOpen ? "rotate(45deg)" : "rotate(0)", position: menuOpen ? "absolute" : "relative" }} />
            <span style={{ display: "block", width: 20, height: 2, background: COLORS.gray800, borderRadius: 1, transition: "all 0.3s ease", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 20, height: 2, background: COLORS.gray800, borderRadius: 1, transition: "all 0.3s ease", transform: menuOpen ? "rotate(-45deg)" : "rotate(0)", position: menuOpen ? "absolute" : "relative" }} />
          </button>
        )}
      </nav>

      {mobile && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, background: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)", zIndex: 99, borderBottom: menuOpen ? `1px solid ${COLORS.gray100}` : "none", transform: menuOpen ? "translateY(0)" : "translateY(-120%)", opacity: menuOpen ? 1 : 0, transition: "transform 0.35s cubic-bezier(.16,1,.3,1), opacity 0.3s ease", padding: "12px 0" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === pathname;
            return (
              <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "14px 24px", fontSize: 16, fontWeight: isActive ? 600 : 400, color: isActive ? COLORS.teal600 : COLORS.gray800, textDecoration: "none", borderLeft: isActive ? `3px solid ${COLORS.teal600}` : "3px solid transparent", transition: "all 0.2s" }}>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
