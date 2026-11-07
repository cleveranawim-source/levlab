"use client";
import { useEffect, useState } from "react";

/** 이 차시를 A4로 인쇄 — 인쇄 스타일은 curriculum.css 의 @media print. 누르면 작은 토스트가 뜬다. */
export default function PrintButton() {
  const [toast, setToast] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <>
      <button type="button" className="btn btn-ghost print-btn" onClick={() => { setToast(true); setTimeout(() => window.print(), 60); }}>
        수업 카드 인쇄하기
      </button>
      <p className={`print-toast${toast ? " on" : ""}`} role="status" aria-live="polite">
        {toast && <><code>print(수업_카드)</code> 인쇄 창을 열었어요</>}
      </p>
    </>
  );
}
