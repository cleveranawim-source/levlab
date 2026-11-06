// SEL 수업 첫 화면 — 학년으로 찾기, 기술로 찾기, 3년 학습 주제
import Link from "next/link";
import PageShell from "../../components/PageShell";
import { getLessons, getLessonsByGrade, getStandards, getStandardsSource, AREAS, GRADES } from "./data";
import { GRADE_THEME, AreaTag, DraftNotice, areaColor } from "./shared";

export default function CurriculumIndex() {
  const standards = getStandards();
  const anyDraft = getLessons().some((l) => l.status !== "published");

  return (
    <PageShell
      eyebrow="SEL Curriculum"
      title="중학교 3년, 사회정서교육 수업"
      sub="서울 사회정서교육의 4개 영역과 17개 사회정서기술에 맞춘 학년별 34차시 가운데, 학년별 핵심 15차시를 공개합니다. 학년으로 찾거나, 가르치고 싶은 기술로 찾아보세요."
    >
      {anyDraft && <DraftNotice />}

      <section className="content-section" aria-labelledby="by-grade-h">
        <p className="eyebrow">By Grade</p>
        <h2 className="content-h2" id="by-grade-h">학년으로 찾기</h2>
        <div className="grade-grid" style={{ marginTop: 22 }}>
          {GRADES.map((n) => {
            const g = GRADE_THEME[n];
            const ls = getLessonsByGrade(n);
            return (
              <Link key={n} href={`/curriculum/grade-${n}`} className="grade-card">
                <span className="grade-g">{g.label}</span>
                <h3>{g.theme}</h3>
                <p>{g.desc}</p>
                <ul>{ls.slice(0, 3).map((l) => <li key={l.slug}>{l.title}</li>)}</ul>
                <span className="grade-meta">핵심 {ls.length}차시 보기 <span aria-hidden="true">→</span></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="content-section" aria-labelledby="by-skill-h">
        <p className="eyebrow">By Skill</p>
        <h2 className="content-h2" id="by-skill-h">기술로 찾기</h2>
        <p className="content-lead">기술을 누르면 성취기준 원문, 3년 동안의 학습 주제, 핵심 차시, 연결된 콘텐츠를 볼 수 있습니다.</p>
        <div className="skill-grid" style={{ marginTop: 22 }}>
          {AREAS.map((a) => (
            <div className="skill-col" key={a} style={{ "--dc": areaColor(a) }}>
              <h3>{a}</h3>
              <ul>
                {standards.filter((s) => s.area === a).map((s) => (
                  <li key={s.code}><Link href={`/standards/${s.code}`}>{s.skill}<span className="codes">[9사회정서{s.code}]</span></Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="years-h">
        <p className="eyebrow">Three Years</p>
        <h2 className="content-h2" id="years-h">같은 기술이 학년마다 깊어집니다</h2>
        <p className="content-lead">중1은 알아차리고, 중2는 탐색하고, 중3은 계획하고 실천합니다. 전체 34차시 과정은 이 주제를 학년마다 모두 다룹니다.</p>
        <div className="table-scroll" style={{ marginTop: 22 }} tabIndex={0} role="region" aria-labelledby="years-h">
          <table className="year-table">
            <thead><tr><th scope="col">사회정서기술</th><th scope="col">중1</th><th scope="col">중2</th><th scope="col">중3</th></tr></thead>
            <tbody>
              {standards.slice().sort((x, y) => AREAS.indexOf(x.area) - AREAS.indexOf(y.area) || x.code.localeCompare(y.code)).map((s) => (
                <tr key={s.code}>
                  <th scope="row"><Link href={`/standards/${s.code}`}>{s.skill}</Link><br /><span className="muted small"><AreaTag area={s.area} /> {s.code}</span></th>
                  <td>{s.topics[1]}</td><td>{s.topics[2]}</td><td>{s.topics[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="source-note">출처: {getStandardsSource()}</p>
      </section>

      <section className="content-section" aria-labelledby="full-h">
        <h2 className="content-h2" id="full-h">전체 34차시 과정이 필요하신가요?</h2>
        <p className="content-lead">학년별 전체 과정은 학교 교육과정 편성, 교사 연수, 교원학습공동체와 함께 운영합니다.</p>
        <div className="cta-row-plain">
          <Link className="btn btn-solid" href="/contact">전체 과정 문의</Link>
          <Link className="btn btn-ghost" href="/programs">연수·워크북 보기</Link>
        </div>
      </section>
    </PageShell>
  );
}
