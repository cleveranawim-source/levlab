import { useRef, useState, useEffect } from "react";

/** 스크롤 진입 시 fade-up 리빌 (JS 미동작 시에도 콘텐츠는 보임) */
export default function Reveal({ children, d, className = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.unobserve(el); } },
      { threshold: 0.14 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} data-d={d} className={`rv ${seen ? "in" : ""} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
