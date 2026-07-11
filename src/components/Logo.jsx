import { useId } from "react";

const LEFT = "M110 10 Q70 50 58 100 Q46 155 70 190 Q90 220 110 220 L110 10Z";
const RIGHT = "M110 10 Q150 50 162 100 Q174 155 150 190 Q130 220 110 220 L110 10Z";
const HEART = "M110 112 Q96 98 86 104 Q74 112 80 126 Q86 144 110 162 Q134 144 140 126 Q146 112 134 104 Q124 98 110 112 Z";

/** 레브랩 심볼 (잎 + 중앙 하트 음각). white 시 어두운 배경용. */
export default function Logo({ white = false, className }) {
  const raw = useId();
  const id = "lgm" + raw.replace(/[^a-zA-Z0-9]/g, "");
  const lc = white ? "rgba(255,255,255,0.55)" : "#7bc67e";
  const rc = white ? "rgba(255,255,255,0.95)" : "#2d6b4a";
  return (
    <svg viewBox="0 0 220 220" fill="none" aria-hidden="true" className={className}>
      <defs>
        <mask id={id}>
          <rect width="220" height="220" fill="white" />
          <path d={HEART} fill="black" />
        </mask>
      </defs>
      <path d={LEFT} fill={lc} mask={`url(#${id})`} />
      <path d={RIGHT} fill={rc} mask={`url(#${id})`} />
    </svg>
  );
}
