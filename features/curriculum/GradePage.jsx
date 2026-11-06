// 학년별 핵심 15차시 목록
import Link from "next/link";
import PageShell from "../../components/PageShell";
import { getLessonsByGrade, AREAS, GRADES } from "./data";
import { GRADE_THEME, StdChip, AreaTag, DraftNotice, Breadcrumb, appsForStandard } from "./shared";

export default function GradePage({ grade }) {
  const n = Number(grade);
  const g = GRADE_THEME[n];
  const lessons = getLessonsByGrade(n);
  const counts = AREAS.map((a) => [a, lessons.filter((l) => l.area === a).length]);
  const anyDraft = lessons.some((l) => l.status !== "published");

  return (
    <PageShell
      eyebrow={`${g.label} · ${g.theme}`}
      title={`${g.label} 사회정서교육 핵심 15차시`}
      sub={g.desc}
    >
      <Breadcrumb items={[{ label: "SEL 수업", href: "/curriculum" }, { label: `${g.label} ${g.theme}` }]} />
      {anyDraft && <DraftNotice />}

      <nav className="grade-switch" aria-label="학년 바꾸기">
        {GRADES.map((x) => (
          <Link key={x} href={`/curriculum/grade-${x}`} aria-current={x === n ? "page" : undefined}>{GRADE_THEME[x].label}</Link>
        ))}
      </nav>

      <p className="area-counts">
        {counts.map(([a, c]) => <span key={a}><AreaTag area={a} /> {c}차시</span>)}
      </p>

      <ol className="lesson-list">
        {lessons.map((l) => {
          const apps = appsForStandard(l.standard);
          return (
            <li key={l.slug}>
              <Link href={`/lessons/${l.slug}`} className="lesson-card">
                <span className="lc-n" aria-hidden="true">{l.coreOrder}</span>
                <span className="lc-main">
                  <span className="lc-meta"><AreaTag area={l.area} /> {l.skill}</span>
                  <b className="lc-title">{l.title}</b>
                  {l.keyQuestion && <span className="lc-q">“{l.keyQuestion}”</span>}
                  {apps.length > 0 && <span className="lc-apps">레브랩 콘텐츠: {apps.map((a) => a.n).join(", ")}</span>}
                </span>
                <span className="lc-go" aria-hidden="true">→</span>
              </Link>
              <StdChip code={l.standard} small />
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}
