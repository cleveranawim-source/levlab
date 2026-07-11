import { useState, useEffect } from "react";

/** prefers-reduced-motion 감지 */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

/** hover 가능한 기기(마우스)인지 */
export function useHoverable() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  return ok;
}
