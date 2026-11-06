// 커리큘럼 화면 공통 조각 (서버 컴포넌트)
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import ContentImage from "../../components/ContentImage";
import { TOOLS } from "../../data/tools";
import "../../styles/curriculum.css";

export const GRADE_THEME = {
  1: { label: "중1", theme: "알아차리기", desc: "다양한 감정과 다른 사람의 감정을 알아차리고, 내 생각과 감정을 분명하게 전하는 첫해." },
  2: { label: "중2", theme: "탐색하기", desc: "상황에 맞는 조절 방법과 관계의 경계를 찾아보며, 다름을 존중하는 법을 익히는 해." },
  3: { label: "중3", theme: "실천하기", desc: "감정의 주도권을 갖고, 또래 갈등을 중재하며, 공동체를 위해 참여하는 마무리 해." },
};

export const AREA_KEY = { "자기": "self", "대인관계": "inter", "공동체": "comm", "마음건강": "well" };
export const areaKey = (area) => AREA_KEY[area] || "self";

/** 빌드 시점에 public/ 에 실제로 있는 그림만 쓴다 (없으면 자리만 잡는다) */
const existing = (src) => (fs.existsSync(path.join(process.cwd(), "public", src)) ? src : null);
export const lessonImage = (slug, title) => ({ src: existing(`/images/lessons/${slug}.webp`), alt: `「${title}」 수업 장면 그림`, width: 1200, height: 900 });
export const gradeImage = (n) => ({ src: existing(`/images/grades/g${n}.webp`), alt: `${GRADE_THEME[n].label} ${GRADE_THEME[n].theme} 수업 장면 그림`, width: 1200, height: 900 });
export const areaImage = (area) => ({ src: existing(`/images/domains/${areaKey(area)}.webp`), alt: `${area} 영역을 나타내는 그림`, width: 1200, height: 900 });

/** 이 성취기준에 붙일 수 있는 공개 콘텐츠 */
export function appsForStandard(code) {
  return TOOLS.filter((t) => t.url && t.standards?.includes(code));
}

export function StdChip({ code, small = false }) {
  return (
    <Link href={`/standards/${code}`} className={`std-chip${small ? " small" : ""}`}>
      <span className="sr-only">성취기준 </span>[9사회정서{code}]
    </Link>
  );
}

/** 영역 색인 탭 — 교과서 옆면의 색 탭처럼 영역을 알려 준다 */
export function AreaTag({ area }) {
  return <span className={`area-tab a-${areaKey(area)}`}>{area}</span>;
}

export function GradeTag({ grade }) {
  return <span className="grade-tab">{GRADE_THEME[grade].label}</span>;
}

export function AppList({ apps }) {
  if (!apps.length) return <p className="muted">이 성취기준에 맞춘 레브랩 콘텐츠는 준비 중입니다.</p>;
  return (
    <ul className="app-cards">
      {apps.map((a) => (
        <li key={a.n}>
          <a href={a.url} target="_blank" rel="noopener noreferrer" className={`app-card a-${areaKey(a.dom)}`}>
            {a.img && <ContentImage src={a.img} alt={`${a.n} 첫 화면`} width={960} height={600} className="app-shot" />}
            <span className="app-body">
              <span className="app-type">{a.t}</span>
              <b>{a.n}<span className="sr-only"> (새 창)</span></b>
              <span className="app-desc">{a.d}</span>
              {a.privacy && <span className="app-privacy">{a.privacy}</span>}
            </span>
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

/** 학년 패널 — 그림 + 학년 + 주제 */
export function GradePanel({ n, lessons }) {
  const g = GRADE_THEME[n];
  return (
    <Link href={`/curriculum/grade-${n}`} className="grade-panel">
      <ContentImage {...gradeImage(n)} className="gp-img" />
      <span className="gp-body">
        <span className="gp-label">{g.label}</span>
        <b className="gp-theme">{g.theme}</b>
        <span className="gp-desc">{g.desc}</span>
        <span className="gp-meta">핵심 {lessons.length}차시 보기</span>
      </span>
    </Link>
  );
}

/** 차시 카드 — 학년·영역 목록에서 쓰는 그림 카드 */
export function LessonCard({ l, showGrade = false }) {
  return (
    <Link href={`/lessons/${l.slug}`} className={`lesson-card2 a-${areaKey(l.area)}`}>
      <ContentImage {...lessonImage(l.slug, l.title)} className="lc2-img" />
      <span className="lc2-body">
        <span className="lc2-tags">
          {showGrade && <GradeTag grade={l.grade} />}
          <AreaTag area={l.area} />
          <span className="lc2-skill">{l.skill}</span>
        </span>
        <b className="lc2-title">{l.title}</b>
        {l.keyQuestion && <span className="lc2-q serif">{l.keyQuestion}</span>}
      </span>
    </Link>
  );
}
