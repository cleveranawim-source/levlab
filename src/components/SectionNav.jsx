import { useState, useEffect } from "react";
import { useIsMobile } from "../lib/hooks";

const SECTIONS = [
  { id: "home", label: "홈" },
  { id: "about", label: "SEL이란" },
  { id: "tools", label: "SEL 콘텐츠" },
  { id: "programs", label: "프로그램" },
  { id: "insights", label: "인사이트" },
  { id: "resources", label: "자료실" },
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
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
