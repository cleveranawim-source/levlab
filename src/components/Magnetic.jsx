import { useRef } from "react";
import { usePrefersReducedMotion, useHoverable } from "../lib/motion";

/** 커서를 향해 살짝 끌려가는 자석 효과 (버튼용) */
export default function Magnetic({ as: Tag = "span", children, className = "", strength = 0.28, ...rest }) {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();
  const hover = useHoverable();
  const active = !reduce && hover;

  const onMove = (e) => {
    if (!active) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(x * strength).toFixed(1)}px, ${(y * strength).toFixed(1)}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };
  return (
    <Tag ref={ref} className={`mag ${className}`.trim()} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </Tag>
  );
}
