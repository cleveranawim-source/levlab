"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MOTION_CHANGE, motionAllowed } from "./preference";

/** Progressive enhancement: the document is always readable before this mounts. */
export default function MotionRoot() {
  const pathname = usePathname();
  const router = useRouter();
  const navigation = useRef(null);
  const progress = useRef(null);
  const topButton = useRef(null);

  useLayoutEffect(() => {
    if (navigation.current?.pathname === pathname) navigation.current.resolve();
  }, [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    try { html.dataset.motionPaused = String(sessionStorage.getItem("levlab-motion-paused") === "true"); } catch { /* Optional persistence. */ }
    const syncPreference = () => {
      const paused = html.dataset.motionPaused === "true";
      html.classList.toggle("js-motion", !reduced.matches && !paused);
      html.dataset.motionSuspended = String(document.hidden);
      document.querySelectorAll("[data-wit-toggle]").forEach((button) => {
        button.hidden = reduced.matches;
        button.setAttribute("aria-pressed", String(paused));
        button.textContent = paused ? "움직임 켜기" : "움직임 멈추기";
      });
      if (!motionAllowed(reduced)) navigation.current?.transition?.skipTransition();
      document.dispatchEvent(new Event(MOTION_CHANGE));
    };
    syncPreference();
    reduced.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncPreference);
    document.addEventListener("levlab:motion-refresh", syncPreference);

    // Next still owns routing, prefetch, history and focus. Only the snapshot is new.
    const onClick = (event) => {
      if (event.target.closest?.("[data-wit-toggle]")) {
        html.dataset.motionPaused = String(html.dataset.motionPaused !== "true");
        try { sessionStorage.setItem("levlab-motion-paused", html.dataset.motionPaused); } catch { /* Optional persistence. */ }
        syncPreference();
        return;
      }
      if (!motionAllowed(reduced) || !document.startViewTransition || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.target || link.hasAttribute("download") || link.dataset.motionNavigate === "off") return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || url.hash) return;
      event.preventDefault();
      navigation.current?.transition?.skipTransition();
      navigation.current?.resolve();
      let resolve;
      const committed = new Promise((done) => { resolve = done; });
      const pending = { pathname: url.pathname, resolve };
      navigation.current = pending;
      html.dataset.motionNavigation = "active";
      // A slow/failed route must never keep the browser's snapshot frozen.
      const timeout = window.setTimeout(resolve, 1200);
      try {
        pending.transition = document.startViewTransition(() => {
          router.push(`${url.pathname}${url.search}`);
          return committed;
        });
        pending.transition.finished.catch(() => {}).finally(() => {
          clearTimeout(timeout);
          if (navigation.current === pending) {
            navigation.current = null;
            delete html.dataset.motionNavigation;
          }
        });
      } catch {
        clearTimeout(timeout);
        navigation.current = null;
        delete html.dataset.motionNavigation;
        router.push(`${url.pathname}${url.search}`);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => {
      reduced.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncPreference);
      document.removeEventListener("levlab:motion-refresh", syncPreference);
      document.removeEventListener("click", onClick, true);
      navigation.current?.resolve();
      navigation.current?.transition?.skipTransition();
      html.classList.remove("js-motion");
      delete html.dataset.motionNavigation;
    };
  }, [router]);

  useEffect(() => {
    document.dispatchEvent(new Event("levlab:motion-refresh"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (topButton.current) topButton.current.hidden = scrollY < 500;
      if (!motionAllowed(reduced)) return;
      const distance = document.documentElement.scrollHeight - innerHeight;
      progress.current?.style.setProperty("--scroll-progress", String(distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0));
    };
    const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update); };
    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (target.matches(".foot-maker") && isIntersecting) {
          target.classList.add("motion-wave");
          observer.unobserve(target);
        } else if (target.matches(".wit-controls")) {
          document.documentElement.dataset.motionInline = String(isIntersecting);
        }
      });
    }) : null;
    document.querySelectorAll(".foot-maker, .wit-controls").forEach((element) => observer?.observe(element));
    delete document.documentElement.dataset.motionInline;
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener(MOTION_CHANGE, schedule);
    schedule();
    return () => {
      observer?.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener(MOTION_CHANGE, schedule);
    };
  }, [pathname]);

  return <>
    <div ref={progress} className="motion-scroll-progress" aria-hidden="true" />
    <div className="motion-dock">
      <button type="button" className="motion-global-toggle" data-wit-toggle hidden aria-pressed="false">움직임 멈추기</button>
      <button ref={topButton} type="button" className="motion-to-top" hidden aria-label="맨 위로" onClick={() => {
        const heading = document.querySelector("#main h1");
        heading?.setAttribute("tabindex", "-1");
        heading?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: motionAllowed(matchMedia("(prefers-reduced-motion: reduce)")) ? "smooth" : "instant" });
      }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg></button>
    </div>
  </>;
}
