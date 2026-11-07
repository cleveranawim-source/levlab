import { MOTION_CHANGE, motionAllowed } from "../motion/preference";

/** Optional behavior only: all text and final numbers are already server rendered. */
export function enhanceWit(page, reduced) {
  const loops = [...page.querySelectorAll("[data-wit-loop]")];
  const facts = page.querySelector("[data-wit-facts]");
  const sticker = page.querySelector("[data-wit-sticker]");
  if (!loops.length && !facts) return () => {};

  let frame = 0;
  let counted = false;
  let countStarted = false;
  let greetingTimer = 0;
  let greetingEnd = 0;
  let messageIndex = 0;
  const bubble = sticker?.querySelector(".wit-maker-bubble");
  const originalMessage = bubble?.textContent;
  const messages = [originalMessage, "질문 하나면 수업이 열려요", "오늘도 마음 근육을 키워요"];
  const visible = new Set();
  const counts = [...(facts?.querySelectorAll("[data-wit-count]") || [])];
  const finishCount = (bounce = false) => {
    cancelAnimationFrame(frame);
    counts.forEach((element) => { element.textContent = element.dataset.witCount; });
    if (bounce && facts) facts.dataset.witCounted = "true";
    counted = true;
  };
  const countUp = () => {
    if (countStarted || counted || !motionAllowed(reduced)) return;
    countStarted = true;
    counts.forEach((element) => { element.textContent = "0"; });
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / 1050);
      const eased = 1 - (1 - progress) ** 3;
      counts.forEach((element) => { element.textContent = String(Math.round(Number(element.dataset.witCount) * eased)); });
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finishCount(true);
    };
    frame = requestAnimationFrame(tick);
  };
  const clearGreeting = () => {
    clearTimeout(greetingTimer);
    clearTimeout(greetingEnd);
    greetingTimer = greetingEnd = 0;
    if (sticker) delete sticker.dataset.witGreeting;
  };
  const scheduleGreeting = () => {
    if (!sticker || greetingTimer || !motionAllowed(reduced) || !visible.has(sticker)) return;
    greetingTimer = window.setTimeout(() => {
      greetingTimer = 0;
      if (!motionAllowed(reduced) || !visible.has(sticker)) return;
      if (!sticker.matches(":hover, :focus-within") && !sticker.hasAttribute("data-wit-dismissed")) {
        messageIndex = (messageIndex + 1) % messages.length;
        if (bubble) bubble.textContent = messages[messageIndex];
        sticker.dataset.witGreeting = "true";
        greetingEnd = window.setTimeout(() => { delete sticker.dataset.witGreeting; greetingEnd = 0; }, 2400);
      }
      scheduleGreeting();
    }, 12000);
  };
  const sync = () => {
    const running = motionAllowed(reduced);
    loops.forEach((element) => { element.dataset.witPlaying = String(running && visible.has(element)); });
    if (!running || (countStarted && !visible.has(facts))) finishCount();
    else if (visible.has(facts)) countUp();
    if (running && visible.has(sticker)) scheduleGreeting();
    else clearGreeting();
  };
  const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
    });
    sync();
  }) : null;
  if (observer) [...loops, ...(facts ? [facts] : []), ...(sticker ? [sticker] : [])].forEach((element) => observer.observe(element));
  // Without an observer the decoration stays still and numbers keep their totals.
  else finishCount();
  const dismissBubble = (event) => {
    if (event.key === "Escape" && sticker) { sticker.dataset.witDismissed = "true"; clearGreeting(); }
  };
  const showBubble = () => { if (sticker) delete sticker.dataset.witDismissed; };
  document.addEventListener(MOTION_CHANGE, sync);
  document.addEventListener("visibilitychange", sync);
  reduced.addEventListener("change", sync);
  window.addEventListener("beforeprint", sync);
  window.addEventListener("afterprint", sync);
  document.addEventListener("keydown", dismissBubble);
  sticker?.addEventListener("pointerenter", showBubble);
  sticker?.addEventListener("focusin", showBubble);
  sync();

  return () => {
    observer?.disconnect();
    finishCount();
    clearGreeting();
    if (bubble) bubble.textContent = originalMessage;
    loops.forEach((element) => delete element.dataset.witPlaying);
    document.removeEventListener(MOTION_CHANGE, sync);
    document.removeEventListener("visibilitychange", sync);
    reduced.removeEventListener("change", sync);
    window.removeEventListener("beforeprint", sync);
    window.removeEventListener("afterprint", sync);
    document.removeEventListener("keydown", dismissBubble);
    sticker?.removeEventListener("pointerenter", showBubble);
    sticker?.removeEventListener("focusin", showBubble);
  };
}
