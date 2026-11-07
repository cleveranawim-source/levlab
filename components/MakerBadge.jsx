// 만든 사람 배지 — AI 수업 웹앱(깡통이·하린이)에 남긴 서명 스티커와 같은 그림
import Link from "next/link";
import "../styles/maker.css";

/** size: "sm" 바닥글·구석, "md" 홈 첫 화면, "lg" 소개 페이지 */
export default function MakerBadge({ size = "md", href = "/about#maker", className = "" }) {
  const h = { sm: 40, md: 64, lg: 168 }[size] || 64;
  const body = (
    <>
      <img src="/images/maker/sen-dev-sticker.webp" alt="" width={Math.round(h * 0.9206)} height={h} decoding="async" draggable={false} />
      <span className="mb-t">
        <span className="mb-l">만든 사람</span>
        <span className="mb-n">교사개발자 2호 <b>Yeol</b></span>
      </span>
    </>
  );
  const cls = `maker-badge mb-${size} ${className}`.trim();
  return href
    ? <Link href={href} className={cls} aria-label="만든 사람: 교사개발자 2호 Yeol, 소개 보기">{body}</Link>
    : <span className={cls}>{body}</span>;
}
