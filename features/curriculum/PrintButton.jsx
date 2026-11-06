"use client";

/** 이 차시를 A4로 인쇄 — 인쇄 스타일은 curriculum.css 의 @media print */
export default function PrintButton() {
  return (
    <button type="button" className="btn btn-ghost print-btn" onClick={() => window.print()}>
      수업 카드 인쇄하기
    </button>
  );
}
