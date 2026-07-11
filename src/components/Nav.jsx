import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import ScrollProgress from "./ScrollProgress";
import { useScrolled, useIsMobile } from "../lib/hooks";
import { NAV_ITEMS } from "../data/site";

export default function Nav() {
  const scrolled = useScrolled();
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <>
    <ScrollProgress />
    <header className={`top ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap">
        <Link to="/" className="logo" aria-label="Lev Lab 홈" onClick={() => setOpen(false)}>
          <Logo />
          <span className="wm">LEV&nbsp;LAB</span>
        </Link>

        {!mobile && (
          <nav className="menu">
            {NAV_ITEMS.map((it) => (
              <NavLink
                key={it.path}
                to={it.path}
                style={({ isActive }) =>
                  isActive ? { color: "var(--brand)", fontWeight: 600 } : undefined
                }
              >
                {it.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="top-actions">
          <ThemeToggle />
          {!mobile && (
            <Link className="btn btn-solid" to="/contact">협업 문의</Link>
          )}
          {mobile && (
            <button
              className="tog"
              aria-label="메뉴 열기"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {mobile && (
        <div
          style={{
            overflow: "hidden",
            maxHeight: open ? 460 : 0,
            transition: "max-height .35s cubic-bezier(.2,.8,.2,1)",
            borderTop: open ? "1px solid var(--line)" : "1px solid transparent",
            background: "var(--ground)",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", padding: "8px 0" }}>
            {NAV_ITEMS.map((it) => (
              <NavLink
                key={it.path}
                to={it.path}
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  padding: "13px clamp(20px,5vw,56px)",
                  fontSize: 16,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--brand)" : "var(--ink)",
                  borderLeft: isActive ? "3px solid var(--brand)" : "3px solid transparent",
                })}
              >
                {it.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-solid"
              style={{ margin: "10px clamp(20px,5vw,56px)", justifyContent: "center" }}
            >
              협업 문의
            </Link>
          </nav>
        </div>
      )}
    </header>
    </>
  );
}
