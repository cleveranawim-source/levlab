import { useRef } from "react";
import { usePrefersReducedMotion, useHoverable } from "../lib/motion";

/** 마우스 위치에 따라 3D로 기울어지는 래퍼 */
export default function Tilt({ children, className = "", strength = 7, ...rest }) {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();
  const hover = useHoverable();
  const active = !reduce && hover;

  const onMove = (e) => {
    if (!active) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };
  return (
    <div ref={ref} className={`tilt ${className}`.trim()} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </div>
  );
}
