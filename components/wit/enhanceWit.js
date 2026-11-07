/** Optional behavior only: all text and final numbers are already server rendered. */
export function enhanceWit(page, reduced) {
  const loops = [...page.querySelectorAll("[data-wit-loop]")];
  const toggle = page.querySelector("[data-wit-toggle]");
  const facts = page.querySelector("[data-wit-facts]");
  const sticker = page.querySelector("[data-wit-sticker]");
  if (!loops.length && !facts) return () => {};

  let paused = false;
  let frame = 0;
  let counted = false;
  let countStarted = false;
  const visible = new Set();
  const counts = [...(facts?.querySelectorAll("[data-wit-count]") || [])];
  const finishCount = () => {
    cancelAnimationFrame(frame);
    counts.forEach((element) => { element.textContent = element.dataset.witCount; });
    counted = true;
  };
  const countUp = () => {
    if (countStarted || counted || reduced.matches || document.hidden || paused) return;
    countStarted = true;
    counts.forEach((element) => { element.textContent = "0"; });
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / 1050);
      const eased = 1 - (1 - progress) ** 3;
      counts.forEach((element) => { element.textContent = String(Math.round(Number(element.dataset.witCount) * eased)); });
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finishCount();
    };
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    const running = !paused && !reduced.matches && !document.hidden;
    loops.forEach((element) => { element.dataset.witPlaying = String(running && visible.has(element)); });
    if (toggle) {
      toggle.hidden = reduced.matches;
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.textContent = paused ? "움직임 켜기" : "움직임 멈추기";
    }
    if (!running || (countStarted && !visible.has(facts))) finishCount();
    else if (visible.has(facts)) countUp();
  };
  const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
    });
    sync();
  }) : null;
  if (observer) [...loops, ...(facts ? [facts] : [])].forEach((element) => observer.observe(element));
  // Without an observer the decoration stays still and numbers keep their totals.
  else finishCount();
  const onToggle = () => { paused = !paused; sync(); };
  const dismissBubble = (event) => {
    if (event.key === "Escape" && sticker) sticker.dataset.witDismissed = "true";
  };
  const showBubble = () => { if (sticker) delete sticker.dataset.witDismissed; };
  toggle?.addEventListener("click", onToggle);
  document.addEventListener("visibilitychange", sync);
  reduced.addEventListener("change", sync);
  document.addEventListener("keydown", dismissBubble);
  sticker?.addEventListener("pointerenter", showBubble);
  sticker?.addEventListener("focusin", showBubble);
  sync();

  return () => {
    observer?.disconnect();
    finishCount();
    loops.forEach((element) => delete element.dataset.witPlaying);
    if (toggle) toggle.hidden = true;
    toggle?.removeEventListener("click", onToggle);
    document.removeEventListener("visibilitychange", sync);
    reduced.removeEventListener("change", sync);
    document.removeEventListener("keydown", dismissBubble);
    sticker?.removeEventListener("pointerenter", showBubble);
    sticker?.removeEventListener("focusin", showBubble);
  };
}
