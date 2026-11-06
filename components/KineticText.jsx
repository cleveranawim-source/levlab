import { Fragment } from "react";

/** 단어별로 순차 등장하는 키네틱 텍스트 (above-the-fold 등장 애니메이션) */
export default function KineticText({ words, offset = 0, start = 0.15, step = 0.07, className = "" }) {
  return (
    <span className={`kin ${className}`.trim()}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" style={{ animationDelay: `${(start + (offset + i) * step).toFixed(2)}s` }}>{w}</span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}
