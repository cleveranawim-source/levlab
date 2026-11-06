import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** 경로 이동 시 스크롤과 초점 복원. 필터 query 변경은 초점을 유지한다. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const previous = useRef(pathname);
  useEffect(() => {
    const changed = previous.current !== pathname;
    previous.current = pathname;
    const frame = requestAnimationFrame(() => {
      let anchor;
      try { anchor = hash && document.getElementById(decodeURIComponent(hash.slice(1))); } catch { /* 잘못된 fragment */ }
      const target = anchor || (changed && (document.querySelector("#main h1") || document.getElementById("main")));
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      if (anchor) anchor.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
