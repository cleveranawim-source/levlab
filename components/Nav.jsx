"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useScrolled, useIsMobile } from "../lib/hooks";
import { NAV_ITEMS } from "../data/site";

export default function Nav() {
  const pathname = usePathname();
  const isActive = (path) => path === "/curriculum"
    ? /^\/(curriculum|standards|lessons)(\/|$)/.test(pathname)
    : pathname === path || pathname.startsWith(`${path}/`);
  const scrolled = useScrolled();
  const mobile = useIsMobile(1040);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const headerRef = useRef(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { if (!mobile) setOpen(false); }, [mobile]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault(); setOpen(false); toggleRef.current?.focus();
    };
    const outside = (event) => { if (!headerRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  const menuLinks = NAV_ITEMS.map((it) => (
    <Link key={it.path} href={it.path} aria-current={isActive(it.path) ? "page" : undefined} onClick={() => setOpen(false)}>{it.label}</Link>
  ));
  return (
    <header ref={headerRef} className={`top${scrolled ? " scrolled" : ""}`}>
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Lev Lab 홈" onClick={() => setOpen(false)}><Logo /><span className="wm">LEV&nbsp;LAB</span></Link>
        <nav className="menu" aria-label="주 메뉴">{menuLinks}</nav>
        <div className="top-actions">
          <ThemeToggle />
          <Link className="btn btn-solid nav-cta" href="/curriculum">수업 찾기</Link>
          <button className="tog menu-toggle" ref={toggleRef} type="button" aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav className="wrap" aria-label="모바일 주 메뉴">{menuLinks}<Link className="btn btn-solid" href="/curriculum" onClick={() => setOpen(false)}>수업 찾기</Link></nav>
      </div>
    </header>
  );
}
