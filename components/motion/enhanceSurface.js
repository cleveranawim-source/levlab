import { MOTION_CHANGE, motionAllowed } from "./preference";

const TITLES = ".sec-head h2, .sec-title, .content-h2, .tools-hero h1, .cur-head h1, .ag-title, [data-motion-title]";

/** One scheduled frame reads the latest pointer, then updates only local layers. */
export function enhanceSurface(page, reduced) {
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const seen = new WeakSet();
  const loops = new Set();
  const visible = new Set();
  const art = page.querySelector("[data-motion-parallax]");
  const scene = art?.closest(".home-hero-scene");
  const layouts = new Map();
  const animations = new Set();
  let frame = 0;
  let pointer;
  let activeCard;
  let activeButton;
  let layoutChanged = false;

  const resetTarget = (target, props) => {
    if (!target) return;
    props.forEach((property) => target.style.removeProperty(property));
    delete target.dataset.motionPointer;
  };
  const resetPointer = () => {
    pointer = null;
    resetTarget(activeCard, ["--tilt-x", "--tilt-y", "--sheen-x"]);
    resetTarget(activeButton, ["--magnet-x", "--magnet-y"]);
    activeCard = activeButton = null;
    art?.style.removeProperty("--parallax-x");
    art?.style.removeProperty("--parallax-y");
  };

  // Opt-in FLIP: persistent group ID + stable direct-child item keys. This also
  // supports React replacing a keyed grid. Never move focus or reorder the DOM.
  const captureLayouts = (animate) => {
    const next = new Map();
    page.querySelectorAll("[data-motion-layout]").forEach((group) => {
      const groupKey = group.dataset.motionLayout;
      const previous = layouts.get(groupKey);
      const items = new Map();
      [...group.children].filter((item) => item.hasAttribute("data-motion-key")).forEach((item) => {
        const rect = item.getBoundingClientRect();
        const key = item.dataset.motionKey;
        const current = { left: rect.left + scrollX, top: rect.top + scrollY };
        const old = previous?.get(key);
        items.set(key, current);
        if (!animate || !old || rect.bottom < 0 || rect.top > innerHeight || !item.animate) return;
        const x = old.left - current.left;
        const y = old.top - current.top;
        if (Math.abs(x) + Math.abs(y) < 1) return;
        const animation = item.animate([{ translate: `${x}px ${y}px` }, { translate: "0px 0px" }], {
          duration: 380, easing: "cubic-bezier(.16,1,.3,1)",
        });
        animations.add(animation);
        animation.finished.catch(() => {}).finally(() => animations.delete(animation));
      });
      next.set(groupKey, items);
    });
    layouts.clear();
    next.forEach((value, key) => layouts.set(key, value));
  };

  const render = () => {
    frame = 0;
    const allowed = motionAllowed(reduced);
    if (layoutChanged) { captureLayouts(allowed); layoutChanged = false; }
    if (!allowed) return;
    const card = fine.matches ? pointer?.target.closest?.("[data-motion-card]") : null;
    const button = fine.matches ? pointer?.target.closest?.(".btn-solid, [data-motion-magnetic]") : null;
    if (activeCard !== card) resetTarget(activeCard, ["--tilt-x", "--tilt-y", "--sheen-x"]);
    if (activeButton !== button) resetTarget(activeButton, ["--magnet-x", "--magnet-y"]);
    activeCard = card;
    activeButton = button;
    // Read the boxes together before changing styles.
    const cardRect = card?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    const sceneRect = scene && visible.has(art) ? scene.getBoundingClientRect() : null;
    const ratio = (value, origin, size) => Math.max(-.5, Math.min(.5, (value - origin) / Math.max(1, size) - .5));
    if (cardRect) {
      const x = ratio(pointer.x, cardRect.left, cardRect.width);
      const y = ratio(pointer.y, cardRect.top, cardRect.height);
      card.style.setProperty("--tilt-x", `${-y * 4}deg`);
      card.style.setProperty("--tilt-y", `${x * 4}deg`);
      card.style.setProperty("--sheen-x", `${(x + .5) * 220 - 70}%`);
      card.dataset.motionPointer = "active";
    }
    if (buttonRect) {
      button.style.setProperty("--magnet-x", `${ratio(pointer.x, buttonRect.left, buttonRect.width) * 8}px`);
      button.style.setProperty("--magnet-y", `${ratio(pointer.y, buttonRect.top, buttonRect.height) * 6}px`);
      button.dataset.motionPointer = "active";
    }
    if (sceneRect) {
      const inScene = fine.matches && pointer && scene.contains(pointer.target);
      art.style.setProperty("--parallax-x", `${inScene ? ratio(pointer.x, sceneRect.left, sceneRect.width) * 14 : 0}px`);
      art.style.setProperty("--parallax-y", `${inScene ? ratio(pointer.y, sceneRect.top, sceneRect.height) * 10 : 0}px`);
      const distance = Math.max(0, Math.min(1, scrollY / (sceneRect.height + innerHeight * .5)));
      art.style.setProperty("--parallax-scroll", `${distance * -18}px`);
      art.style.setProperty("--parallax-scale", String(1 + distance * .035));
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
  const sync = () => {
    const allowed = motionAllowed(reduced);
    loops.forEach((element) => { element.dataset.motionPlaying = String(allowed && visible.has(element)); });
    if (!allowed) {
      cancelAnimationFrame(frame);
      frame = 0;
      resetPointer();
      art?.style.removeProperty("--parallax-scroll");
      art?.style.removeProperty("--parallax-scale");
      animations.forEach((animation) => animation.cancel());
    } else schedule();
  };
  const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
      if (target.matches(TITLES) && isIntersecting) {
        target.classList.add("motion-title-seen");
        observer.unobserve(target);
      }
    });
    sync();
  }) : null;
  const scan = () => {
    page.querySelectorAll(`${TITLES}, [data-motion-loop], [data-motion-parallax]`).forEach((element) => {
      if (seen.has(element)) return;
      seen.add(element);
      if (element.matches(TITLES)) element.classList.add("motion-title");
      if (element.hasAttribute("data-motion-loop")) loops.add(element);
      if (observer) observer.observe(element);
      else if (element.matches(TITLES)) element.classList.add("motion-title-seen");
    });
  };
  scan();
  captureLayouts(false);
  const mutations = new MutationObserver((records) => {
    if (!records.some((record) => [...record.addedNodes, ...record.removedNodes].some((node) => node.nodeType === 1))) return;
    scan();
    layoutChanged = true;
    animations.forEach((animation) => animation.cancel());
    schedule();
  });
  mutations.observe(page, { childList: true, subtree: true });
  const onPointer = (event) => {
    if (!fine.matches || !motionAllowed(reduced) || event.pointerType !== "mouse") return;
    pointer = { x: event.clientX, y: event.clientY, target: event.target };
    schedule();
  };
  const onLeave = () => { resetPointer(); schedule(); };
  const onScroll = () => { if (motionAllowed(reduced) && (visible.has(art) || pointer)) schedule(); };
  const onResize = () => { captureLayouts(false); onScroll(); };
  page.addEventListener("pointermove", onPointer, { passive: true });
  page.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("beforeprint", sync);
  window.addEventListener("afterprint", sync);
  document.addEventListener(MOTION_CHANGE, sync);
  reduced.addEventListener("change", sync);
  fine.addEventListener("change", onLeave);
  sync();
  return () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
    mutations.disconnect();
    animations.forEach((animation) => animation.cancel());
    resetPointer();
    page.removeEventListener("pointermove", onPointer);
    page.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("blur", onLeave);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("beforeprint", sync);
    window.removeEventListener("afterprint", sync);
    document.removeEventListener(MOTION_CHANGE, sync);
    reduced.removeEventListener("change", sync);
    fine.removeEventListener("change", onLeave);
  };
}
