"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import ScrollProgress from "./ScrollProgress";
import { useScrolled, useIsMobile } from "../lib/hooks";
import { NAV_ITEMS } from "../data/site";

export default function Nav() {
  const pathname = usePathname();
  const isActive = (path) => path === "/curriculum"
    ? /^\/(curriculum|standards|lessons)(\/|$)/.test(pathname)
    : pathname === path || pathname.startsWith(`${path}/`);
  const scrolled = useScrolled();
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { if (!mobile) setOpen(false); }, [mobile]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <ScrollProgress />
    <header className={`top ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Lev Lab 홈" onClick={() => setOpen(false)}>
          <Logo />
          <span className="wm">LEV&nbsp;LAB</span>
        </Link>

        {!mobile && (
          <nav className="menu" aria-label="주 메뉴">
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.path}
                href={it.path}
                aria-current={isActive(it.path) ? "page" : undefined}
                style={isActive(it.path) ? { color: "var(--brand)", fontWeight: 600 } : undefined}
              >
                {it.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="top-actions">
          <ThemeToggle />
          {!mobile && (
            <Link className="btn btn-solid" href="/contact">협업 문의</Link>
          )}
          {mobile && (
            <button
              className="tog"
              ref={toggleRef}
              type="button"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {mobile && (
        <div
          id="mobile-menu"
          hidden={!open}
          style={{
            overflow: "hidden",
            maxHeight: open ? 460 : 0,
            transition: "max-height .35s cubic-bezier(.2,.8,.2,1)",
            borderTop: open ? "1px solid var(--line)" : "1px solid transparent",
            background: "var(--ground)",
          }}
        >
          <nav aria-label="주 메뉴" style={{ display: "flex", flexDirection: "column", padding: "8px 0" }}>
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.path}
                href={it.path}
                onClick={() => setOpen(false)}
                aria-current={isActive(it.path) ? "page" : undefined}
                style={{
                  padding: "13px clamp(20px,5vw,56px)",
                  fontSize: 16,
                  fontWeight: isActive(it.path) ? 700 : 500,
                  color: isActive(it.path) ? "var(--brand)" : "var(--ink)",
                  borderLeft: isActive(it.path) ? "3px solid var(--brand)" : "3px solid transparent",
                }}
              >
                {it.label}
              </Link>
            ))}
            <Link
              href="/contact"
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
