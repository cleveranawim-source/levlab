"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Route changes focus the new content; query-only filter changes retain focus. */
export default function ScrollToTop() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  useEffect(() => {
    const changed = previous.current !== pathname;
    previous.current = pathname;
    let frame;
    const restore = (focusPage = false) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let anchor;
        try { anchor = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); } catch { /* Invalid fragment. */ }
        const target = anchor || (focusPage && (document.querySelector("#main h1") || document.getElementById("main")));
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
        if (anchor) anchor.scrollIntoView({ block: "start" });
        else if (focusPage) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    };
    restore(changed);
    const onHash = () => restore();
    // Next Link can update the hash through pushState without hashchange.
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === pathname && url.hash) restore();
    };
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick, true);
    };
  }, [pathname]);
  return null;
}
