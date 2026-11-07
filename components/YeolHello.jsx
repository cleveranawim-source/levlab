"use client";
import { useEffect } from "react";

/** 개발자 도구를 연 선생님께 — 앱 서명(yeol-sign.js)과 같은 인사 */
export default function YeolHello() {
  useEffect(() => {
    if (window.__yeolSignSaid) return;
    window.__yeolSignSaid = true;
    try {
      console.log("%c made by Yeol %c 교사개발자 2호 Yeol이 만든 사이트예요. 코드가 궁금하면 levlabkr@gmail.com 으로 물어봐 주세요.",
        "background:#1E2A24;color:#FFE45C;font-weight:800;padding:3px 6px;border-radius:4px", "color:inherit;padding:3px 6px");
    } catch { /* 콘솔이 없어도 괜찮다 */ }
  }, []);
  return null;
}
