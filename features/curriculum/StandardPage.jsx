// 성취기준별 페이지 — 원문, 3년 심화, 핵심 차시, 연결 콘텐츠
import Link from "next/link";
import PageShell from "../../components/PageShell";
import { getStandard, getStandards, getLessonsByStandard, getStandardsSource } from "./data";
import { GRADE_THEME, AreaTag, AppList, Breadcrumb, DraftNotice, appsForStandard } from "./shared";

export default function StandardPage({ code }) {
  const s = getStandard(code);
  if (!s) return null;
  const lessons = getLessonsByStandard(code);
  const apps = appsForStandard(code);
  const sameArea = getStandards().filter((x) => x.area === s.area && x.code !== s.code);

  return (
    <PageShell eyebrow={`[9사회정서${s.code}] · ${s.area}`} title={s.skill} sub={s.text}>
      <Breadcrumb items={[{ label: "SEL 수업", href: "/curriculum" }, { label: `${s.area} · ${s.skill}` }]} />

      <section className="content-section" aria-labelledby="years-h">
        <h2 className="content-h2" id="years-h">3년 동안 이렇게 깊어집니다</h2>
        <p className="content-lead">서울 사회정서교육이 정한 학년별 학습 주제입니다.</p>
        <ol className="year-steps">
          {[1, 2, 3].map((g) => (
            <li key={g}>
              <span className="ys-g">{GRADE_THEME[g].label}</span>
              <span className="ys-t">{s.topics[g]}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="content-section" aria-labelledby="lessons-h">
        <h2 className="content-h2" id="lessons-h">레브랩 핵심 차시</h2>
        {lessons.some((l) => l.status !== "published") && <DraftNotice />}
        {lessons.length ? (
          <ul className="mini-lessons">
            {lessons.map((l) => (
              <li key={l.slug}>
                <Link href={`/lessons/${l.slug}`}>
                  <span className="ml-g">{GRADE_THEME[l.grade].label}</span>
                  <b>{l.title}</b>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">이 기술은 이번 핵심 15차시에 들어가지 않은 학년이 있습니다. 전체 34차시 과정에서는 모든 학년이 다룹니다.</p>
        )}
      </section>

      <section className="content-section" aria-labelledby="apps-h">
        <h2 className="content-h2" id="apps-h">연결된 레브랩 콘텐츠</h2>
        <AppList apps={apps} />
      </section>

      <section className="content-section" aria-labelledby="area-h">
        <h2 className="content-h2" id="area-h"><AreaTag area={s.area} /> 영역의 다른 기술</h2>
        <ul className="std-links">
          {sameArea.map((x) => <li key={x.code}><Link href={`/standards/${x.code}`}>{x.skill} <span className="muted">[9사회정서{x.code}]</span></Link></li>)}
        </ul>
        <p className="source-note">출처: {getStandardsSource()}</p>
      </section>
    </PageShell>
  );
}
