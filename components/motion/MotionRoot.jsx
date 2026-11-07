"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Progressive enhancement: the document is always readable before this mounts. */
export default function MotionRoot() {
  const pathname = usePathname();
  const router = useRouter();
  const navigation = useRef(null);

  useLayoutEffect(() => {
    if (navigation.current?.pathname === pathname) navigation.current.resolve();
  }, [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      html.classList.toggle("js-motion", !reduced.matches);
      if (reduced.matches) navigation.current?.transition?.skipTransition();
    };
    syncPreference();
    reduced.addEventListener("change", syncPreference);

    // Next still owns routing, prefetch, history and focus. Only the snapshot is new.
    const onClick = (event) => {
      if (reduced.matches || !document.startViewTransition || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
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
      document.removeEventListener("click", onClick, true);
      navigation.current?.resolve();
      navigation.current?.transition?.skipTransition();
      html.classList.remove("js-motion");
      delete html.dataset.motionNavigation;
    };
  }, [router]);
  return null;
}
