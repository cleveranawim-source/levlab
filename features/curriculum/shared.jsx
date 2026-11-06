// 커리큘럼 화면 공통 조각 (서버 컴포넌트)
import Link from "next/link";
import { TOOLS, DOMAIN_COLOR } from "../../data/tools";

export const GRADE_THEME = {
  1: { label: "중1", theme: "알아차리기", desc: "다양한 감정과 다른 사람의 감정을 알아차리고, 내 생각과 감정을 분명하게 전하는 첫해." },
  2: { label: "중2", theme: "탐색하기", desc: "상황에 맞는 조절 방법과 관계의 경계를 찾아보며, 다름을 존중하는 법을 익히는 해." },
  3: { label: "중3", theme: "실천하기", desc: "감정의 주도권을 갖고, 또래 갈등을 중재하며, 공동체를 위해 참여하는 마무리 해." },
};

export const areaColor = (area) => DOMAIN_COLOR[area] || "var(--brand)";

/** 이 성취기준에 붙일 수 있는 공개 콘텐츠 */
export function appsForStandard(code) {
  return TOOLS.filter((t) => t.url && t.standards?.includes(code));
}

export function StdChip({ code, small = false }) {
  return (
    <Link href={`/standards/${code}`} className={`std-chip${small ? " small" : ""}`}>
      [9사회정서{code}]
    </Link>
  );
}

export function AreaTag({ area }) {
  return <span className="area-tag" style={{ "--ac": areaColor(area) }}>{area}</span>;
}

export function DraftNotice() {
  return (
    <div className="draft-notice" role="note">
      <b>미리보기</b> — 핵심 15차시 선정을 확정하기 전 화면입니다. 차시 구성과 내용은 바뀔 수 있습니다.
    </div>
  );
}

export function AppList({ apps }) {
  if (!apps.length) return <p className="muted">이 성취기준에 맞춘 레브랩 콘텐츠는 준비 중입니다.</p>;
  return (
    <ul className="app-list">
      {apps.map((a) => (
        <li key={a.n}>
          <a href={a.url} target="_blank" rel="noopener noreferrer">
            <span className="app-em" aria-hidden="true">{a.em}</span>
            <span className="app-main">
              <b>{a.n}</b>
              <span>{a.d}</span>
              {a.privacy && <span className="app-privacy">{a.privacy}</span>}
            </span>
            <span className="app-go" aria-hidden="true">열기 ↗</span>
            <span className="sr-only">(새 창)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="현재 위치" className="crumbs">
      <ol>
        {items.map((it, i) => (
          <li key={it.label}>
            {it.href && i < items.length - 1 ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
