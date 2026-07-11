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

/** 모바일 여부 감지 */
export function useIsMobile(breakpoint = 900) {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
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
    return localStorage.getItem("levlab-theme");
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
  }, [theme]);
  const toggle = () => {
    setTheme((cur) => {
      const eff = cur || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = eff === "dark" ? "light" : "dark";
      localStorage.setItem("levlab-theme", next);
      return next;
    });
  };
  return { theme, toggle };
}
