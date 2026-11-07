export const MOTION_CHANGE = "levlab:motion-change";

export function motionAllowed(reduced) {
  return !reduced.matches && document.documentElement.dataset.motionPaused !== "true"
    && !document.hidden && !matchMedia("print").matches;
}
