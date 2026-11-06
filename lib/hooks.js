import { useState, useEffect } from "react";

/** 스크롤 위치 감지 (네비게이션 테두리 전환용) */
export function useScrolled(offset = 10) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > offset);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [offset]);
  return scrolled;
}

/** 모바일 여부 감지 — theme.css의 max-width: 900px와 같은 포함 경계 */
export function useIsMobile(breakpoint = 900) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [breakpoint]);
  return mobile;
}

/** 라이트/다크 테마 토글 (data-theme 속성 + localStorage) */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = window.localStorage.getItem("levlab-theme");
      return saved === "light" || saved === "dark" ? saved : null;
    } catch {
      const current = document.documentElement.getAttribute("data-theme");
      return current === "light" || current === "dark" ? current : null;
    }
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
    if (theme) {
      try { window.localStorage.setItem("levlab-theme", theme); } catch { /* 세션 내 토글은 유지 */ }
    }
  }, [theme]);
  const toggle = () => {
    setTheme((cur) => {
      const eff = cur || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = eff === "dark" ? "light" : "dark";
      return next;
    });
  };
  return { theme, toggle };
}
