// 성취기준별 페이지 — 원문, 3년 심화, 핵심 차시, 연결 콘텐츠
import Link from "next/link";
import ContentImage from "../../components/ContentImage";
import { getStandard, getStandards, getLessonsByStandard, getStandardsSource } from "./data";
import { GRADE_THEME, AreaTag, AppList, Breadcrumb, LessonCard, appsForStandard, areaImage, areaKey } from "./shared";

export default function StandardPage({ code }) {
  const s = getStandard(code);
  if (!s) return null;
  const lessons = getLessonsByStandard(code);
  const apps = appsForStandard(code);
  const sameArea = getStandards().filter((x) => x.area === s.area && x.code !== s.code);

  return (
    <div className={`a-${areaKey(s.area)}`}>
      <section className="cur-head std-head">
        <div className="wrap">
          <Breadcrumb items={[{ label: "SEL 수업", href: "/curriculum" }, { label: `${s.area} · ${s.skill}` }]} />
          <div className="ch-grid">
            <div>
              <p className="lh-tags"><AreaTag area={s.area} /> <span className="std-code">[9사회정서{s.code}]</span></p>
              <h1>{s.skill}</h1>
              <p className="std-quote serif">{s.text}</p>
            </div>
            <ContentImage {...areaImage(s.area)} className="ch-img" priority />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="sec-title" id="years-h">3년 동안 이렇게 깊어집니다</h2>
          <ol className="year-steps" data-motion-stagger>
            {[1, 2, 3].map((g) => (
              <li key={g} data-motion="year"><span className="ys-g">{GRADE_THEME[g].label} {GRADE_THEME[g].theme}</span><span className="ys-t">{s.topics[g]}</span></li>
            ))}
          </ol>

          <h2 className="sec-title" id="lessons-h">레브랩 핵심 차시</h2>
          {lessons.length ? (
            <ol className="lesson-grid" data-motion-stagger>{lessons.map((l) => <li key={l.slug}><LessonCard l={l} showGrade /></li>)}</ol>
          ) : (
            <p className="muted">이 기술은 이번 핵심 15차시에 들어가지 않은 학년이 있습니다. 전체 34차시 과정에서는 모든 학년이 다룹니다.</p>
          )}

          <h2 className="sec-title" id="apps-h">연결된 레브랩 콘텐츠</h2>
          <AppList apps={apps} />

          <h2 className="sec-title" id="area-h">{s.area} 영역의 다른 기술</h2>
          <ul className="std-links">
            {sameArea.map((x) => <li key={x.code}><Link href={`/standards/${x.code}`}>{x.skill}<span>[9사회정서{x.code}]</span></Link></li>)}
          </ul>
          <p className="source-note">출처: {getStandardsSource()}</p>
        </div>
      </section>
    </div>
  );
}
