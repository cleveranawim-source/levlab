"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "../lib/motion";

const TARGETS = ".tcard, .pcard, .sel-tab, .ipost, .rrow";

/** 마우스 위치를 카드에 --mx/--my 로 전달 → CSS 스포트라이트·테두리 빛 (마우스 기기 전용) */
export default function Spotlight() {
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let last = null;
    const onMove = (e) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = last.target instanceof Element ? last.target.closest(TARGETS) : null;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${last.clientX - r.left}px`);
        el.style.setProperty("--my", `${last.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);
  return null;
}
