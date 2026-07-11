import { useRef, useState, useEffect, Fragment } from "react";

/** 스크롤 진입 시 단어들이 마스크 뒤에서 솟아오르는 헤딩 */
export default function KineticReveal({ text, as: Tag = "h2", className = "", step = 0.06 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.unobserve(el); } },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={`kr ${seen ? "in" : ""} ${className}`.trim()} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="kr-w" aria-hidden="true">
            <span className="kr-i" style={{ transitionDelay: `${(i * step).toFixed(2)}s` }}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
