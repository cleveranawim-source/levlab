import { useState } from "react";
import { useInView } from "../hooks";
import { COLORS } from "../styles/tokens";

/**
 * 스크롤 진입 시 fade-up 애니메이션
 */
export function FadeIn({ children, delay = 0, style = {}, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * 호버 시 스타일 전환 래퍼
 */
export function Hover({ children, style = {}, hoverStyle = {}, className = "" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      style={{ ...style, ...(hovered ? hoverStyle : {}), transition: "all 0.25s ease" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}

/**
 * 섹션 상단 영문 라벨 (예: "ABOUT LEV LAB")
 */
export function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: COLORS.teal600,
        letterSpacing: 1.5,
        marginBottom: 8,
      }}
    >
      {children}
    </p>
  );
}

/**
 * 섹션 제목
 */
export function SectionTitle({ children, style = {} }) {
  return (
    <h2
      style={{
        fontSize: 28,
        fontWeight: 700,
        color: COLORS.gray800,
        letterSpacing: -0.5,
        marginBottom: 32,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

/**
 * 태그/뱃지 pill
 */
export function Pill({ children, bg, color }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 12,
        fontWeight: 600,
        padding: "5px 14px",
        borderRadius: 20,
        background: bg,
        color: color,
      }}
    >
      {children}
    </span>
  );
}

/**
 * 호버 리프트 카드
 */
export function Card({ children, style = {} }) {
  return (
    <Hover
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 28,
        border: `1px solid ${COLORS.gray100}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
      hoverStyle={{
        transform: "translateY(-4px)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </Hover>
  );
}
