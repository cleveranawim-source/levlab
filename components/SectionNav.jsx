"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "../lib/hooks";

const SECTIONS = [
  { id: "home", label: "홈" },
  { id: "about", label: "SEL이란" },
  { id: "tools", label: "SEL 콘텐츠" },
  { id: "curriculum", label: "3년 수업" },
  { id: "programs", label: "프로그램" },
  { id: "newsletter", label: "소식 받기" },
];

/** 우측 섹션 도트 내비게이션 (스크롤 위치 추적 + 점프) */
export default function SectionNav() {
  const [active, setActive] = useState("home");
  const mobile = useIsMobile(1040);

  useEffect(() => {
    if (mobile) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mobile]);

  if (mobile) return null;

  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }
  };

  return (
    <nav className="secnav" aria-label="섹션 이동">
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={active === s.id ? "on" : ""} onClick={(e) => go(e, s.id)}>
          <span className="lbl">{s.label}</span>
          <span className="dot" />
        </a>
      ))}
    </nav>
  );
}
