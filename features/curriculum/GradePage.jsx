// 학년별 핵심 15차시 — 그림 카드 목록, 영역별로 묶어 보기
import Link from "next/link";
import ContentImage from "../../components/ContentImage";
import { getLessonsByGrade, AREAS, GRADES } from "./data";
import { GRADE_THEME, AreaTag, Breadcrumb, LessonCard, gradeImage, areaKey } from "./shared";

export default function GradePage({ grade }) {
  const n = Number(grade);
  const g = GRADE_THEME[n];
  const lessons = getLessonsByGrade(n);

  return (
    <>
      <section className="cur-head">
        <div className="wrap">
          <Breadcrumb items={[{ label: "SEL 수업", href: "/curriculum" }, { label: `${g.label} ${g.theme}` }]} />
          <div className="ch-grid">
            <div>
              <nav className="grade-switch" data-motion-grade-switch aria-label="학년 바꾸기">
                {GRADES.map((x) => (
                  <Link key={x} href={`/curriculum/grade-${x}`} aria-current={x === n ? "page" : undefined}>{GRADE_THEME[x].label}</Link>
                ))}
              </nav>
              <h1>{g.label} 사회정서교육 <span className="nowrap">핵심 15차시</span></h1>
              <p className="ch-theme serif">{g.theme}</p>
              <p className="ch-desc">{g.desc}</p>
              <p className="area-counts">
                {AREAS.map((a) => <span key={a}><AreaTag area={a} /> {lessons.filter((l) => l.area === a).length}차시</span>)}
              </p>
            </div>
            <ContentImage {...gradeImage(n)} className="ch-img" priority />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          {AREAS.map((a) => {
            const ls = lessons.filter((l) => l.area === a);
            if (!ls.length) return null;
            return (
              <section key={a} className={`area-group a-${areaKey(a)}`} aria-labelledby={`ag-${areaKey(a)}`}>
                <h2 id={`ag-${areaKey(a)}`} className="ag-title" data-motion="stripe"><AreaTag area={a} /> <span>{ls.length}차시</span></h2>
                <ol className="lesson-grid" data-motion-stagger>
                  {ls.map((l) => <li key={l.slug}><LessonCard l={l} /></li>)}
                </ol>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
