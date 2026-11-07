"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { enhanceWit } from "../wit/enhanceWit";

// Existing editorial pages opt in by their established semantic classes; their
// content stays server-rendered and no component needs to become client-only.
const REVEALS = "[data-motion], .sec-head, .sec-title, .tools-hero h1, .tools-hero .sub, .page-hero-image, .cur-head h1, .ch-desc, .ch-img, .lh-img, .lh-body h1, .content-h2, .founder-quote, .news, .track-card, .offer, .lev-trio > div, .about-timeline > li, .collab, .maker-card, .maker-sign, .maker-classes > li, .note-box, .faq details, .std-links > li";
let previousGrade;

export default function MotionPage({ children }) {
  const pathname = usePathname();
  // Root templates can survive changes of a deeper dynamic segment (grade/slug).
  // Key the enhancement scope as well, so observers and tab state start afresh.
  return <MotionSurface key={pathname}>{children}</MotionSurface>;
}

function MotionSurface({ children }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const page = root.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const seen = new WeakSet();
    const cleanups = [];
    const frames = new Set();
    const preparations = new Map();
    let pointerFrame = 0;
    let activeCard;
    const nextFrame = (callback) => {
      const id = requestAnimationFrame(() => { frames.delete(id); callback(); });
      frames.add(id);
    };
    const reveal = (element) => {
      element.classList.add("motion-seen");
      observer?.unobserve(element);
    };
    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => { if (isIntersecting) reveal(target); });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" }) : null;

    const scan = () => {
      page.querySelectorAll(REVEALS).forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        element.classList.add("motion-target");
        const group = element.closest("[data-motion-stagger], .year-steps, .about-timeline, .maker-classes, .std-links");
        if (group) {
          const items = [...group.querySelectorAll(REVEALS)].filter((item) => item.closest("[data-motion-stagger], .year-steps, .about-timeline, .maker-classes, .std-links") === group);
          element.style.setProperty("--motion-delay", `${Math.min(items.indexOf(element) % 4, 3) * 65}ms`);
        }
        if (observer && !reduced.matches) observer.observe(element);
        else reveal(element);
      });
      page.querySelectorAll("[data-motion-check]").forEach((item) => {
        const box = item.querySelector(".box");
        if (!box || box.hasAttribute("role")) return;
        box.removeAttribute("aria-hidden");
        box.setAttribute("role", "checkbox");
        box.setAttribute("tabindex", "0");
        box.setAttribute("aria-checked", "false");
        box.setAttribute("aria-label", `${item.textContent.trim()} 준비 완료`);
        item.classList.add("motion-check");
        cleanups.push(() => {
          ["role", "tabindex", "aria-checked", "aria-label"].forEach((name) => box.removeAttribute(name));
          box.setAttribute("aria-hidden", "true");
          item.classList.remove("motion-check");
        });
      });
      page.querySelectorAll(".prep:has([data-motion-check])").forEach((prep) => {
        if (preparations.has(prep)) return;
        const stamp = document.createElement("span");
        stamp.className = "motion-prep-stamp";
        stamp.textContent = "수업 준비 완료!";
        stamp.setAttribute("aria-hidden", "true");
        stamp.hidden = true;
        const live = document.createElement("span");
        live.className = "motion-prep-status";
        live.setAttribute("role", "status");
        live.setAttribute("aria-live", "polite");
        live.setAttribute("aria-atomic", "true");
        preparations.set(prep, { stamp, live, complete: false });
        prep.classList.add("motion-prep");
        prep.append(stamp, live);
        cleanups.push(() => { stamp.remove(); live.remove(); prep.classList.remove("motion-prep"); });
      });
    };
    scan();
    page.classList.add("motion-page");
    page.querySelector(".home-hero")?.classList.add("motion-hero");
    const mutations = new MutationObserver((records) => {
      // Counter text and live announcements do not introduce reveal targets.
      if (records.some((record) => [...record.addedNodes].some((node) => node.nodeType === 1))) scan();
    });
    mutations.observe(page, { childList: true, subtree: true });
    cleanups.push(enhanceWit(page, reduced));

    const resetCard = () => {
      cancelAnimationFrame(pointerFrame);
      if (!activeCard) return;
      activeCard.style.removeProperty("--tilt-x");
      activeCard.style.removeProperty("--tilt-y");
      activeCard.removeAttribute("data-motion-pointer");
      activeCard = null;
    };
    const onPointerMove = (event) => {
      if (!fine.matches || reduced.matches || event.pointerType !== "mouse") return;
      const card = event.target.closest("[data-motion-card]");
      if (!card || !page.contains(card)) { resetCard(); return; }
      if (card !== activeCard) resetCard();
      activeCard = card;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
        const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
        card.style.setProperty("--tilt-x", `${-y * 4}deg`);
        card.style.setProperty("--tilt-y", `${x * 4}deg`);
        card.dataset.motionPointer = "active";
      });
    };
    const onPointerOut = (event) => {
      if (activeCard && !activeCard.contains(event.relatedTarget)) resetCard();
    };
    const toggleCheck = (item) => {
      const box = item?.querySelector('.box[role="checkbox"]');
      if (!box) return;
      box.setAttribute("aria-checked", box.getAttribute("aria-checked") === "true" ? "false" : "true");
      const prep = item.closest(".prep");
      const state = preparations.get(prep);
      if (!state) return;
      const boxes = [...prep.querySelectorAll('.box[role="checkbox"]')];
      const complete = boxes.length > 0 && boxes.every((checkbox) => checkbox.getAttribute("aria-checked") === "true");
      if (complete === state.complete) return;
      state.complete = complete;
      state.stamp.hidden = !complete;
      state.live.textContent = complete ? "준비물을 모두 챙겼어요" : "";
    };
    const onClick = (event) => toggleCheck(event.target.closest("[data-motion-check]"));
    const onKey = (event) => {
      if (event.target.matches('.box[role="checkbox"]') && (event.key === " " || event.key === "Enter")) {
        event.preventDefault();
        toggleCheck(event.target.closest("[data-motion-check]"));
      }
    };
    // Focus and fragment navigation must never wait for a staggered entrance.
    const onFocus = (event) => {
      const target = event.target.closest(".motion-target");
      if (target) {
        reveal(target);
        target.classList.add("motion-focused");
      }
    };

    const gradeSwitch = page.querySelector("[data-motion-grade-switch]");
    if (gradeSwitch) {
      const current = gradeSwitch.querySelector('[aria-current="page"]');
      const move = (link) => {
        if (!link) return;
        gradeSwitch.style.setProperty("--grade-x", `${link.offsetLeft + 12}px`);
        gradeSwitch.style.setProperty("--grade-width", `${Math.max(1, link.offsetWidth - 24)}`);
      };
      move([...gradeSwitch.querySelectorAll("a")].find((a) => a.getAttribute("href") === previousGrade) || current);
      gradeSwitch.classList.add("motion-grade-ready");
      nextFrame(() => nextFrame(() => move(current)));
      previousGrade = current?.getAttribute("href");
      const over = (event) => move(event.target.closest("a") || current);
      const out = () => move(gradeSwitch.querySelector("a:focus-visible") || current);
      gradeSwitch.addEventListener("pointerover", over);
      gradeSwitch.addEventListener("focusin", over);
      gradeSwitch.addEventListener("pointerleave", out);
      gradeSwitch.addEventListener("focusout", out);
      const resize = new ResizeObserver(() => move(current));
      resize.observe(gradeSwitch);
      cleanups.push(() => {
        resize.disconnect();
        gradeSwitch.removeEventListener("pointerover", over);
        gradeSwitch.removeEventListener("focusin", over);
        gradeSwitch.removeEventListener("pointerleave", out);
        gradeSwitch.removeEventListener("focusout", out);
      });
    }

    const preferenceChanged = () => {
      resetCard();
      if (reduced.matches) {
        observer?.disconnect();
        page.querySelectorAll(".motion-target").forEach(reveal);
      }
    };
    const beforePrint = () => {
      resetCard();
      page.querySelectorAll(".motion-target").forEach(reveal);
    };
    page.addEventListener("pointermove", onPointerMove, { passive: true });
    page.addEventListener("pointerout", onPointerOut, { passive: true });
    page.addEventListener("click", onClick);
    page.addEventListener("keydown", onKey);
    page.addEventListener("focusin", onFocus);
    reduced.addEventListener("change", preferenceChanged);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("blur", resetCard);
    return () => {
      observer?.disconnect();
      mutations.disconnect();
      resetCard();
      frames.forEach(cancelAnimationFrame);
      cleanups.forEach((cleanup) => cleanup());
      page.removeEventListener("pointermove", onPointerMove);
      page.removeEventListener("pointerout", onPointerOut);
      page.removeEventListener("click", onClick);
      page.removeEventListener("keydown", onKey);
      page.removeEventListener("focusin", onFocus);
      reduced.removeEventListener("change", preferenceChanged);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("blur", resetCard);
    };
  }, []);

  return <main ref={root} id="main" tabIndex={-1} aria-label="본문">{children}</main>;
}
