// SEL 수업 첫 화면 — 학년으로 찾기, 영역·기술로 찾기, 3년 학습 주제
import Link from "next/link";
import ContentImage from "../../components/ContentImage";
import { getLessonsByGrade, getStandards, getStandardsSource, AREAS, GRADES } from "./data";
import { AreaTag, GradePanel, areaImage, areaKey } from "./shared";

export default function CurriculumIndex() {
  const standards = getStandards();
  return (
    <>
      <section className="cur-head">
        <div className="wrap">
          <h1>중학교 3년, 사회정서교육 수업</h1>
          <p className="ch-desc">서울 사회정서교육의 4개 영역·17개 사회정서기술에 맞춘 학년별 34차시 가운데, <b>학년별 핵심 15차시</b>를 공개합니다. 학년으로 찾거나, 가르치고 싶은 기술로 찾아보세요.</p>
          <div className="grade-panels" data-motion-stagger>
            {GRADES.map((n) => <GradePanel key={n} n={n} lessons={getLessonsByGrade(n)} />)}
          </div>
        </div>
      </section>

      <section className="band band-alt">
        <div className="wrap">
          <h2 className="sec-title" id="by-skill-h">기술로 찾기</h2>
          <p className="muted">기술을 누르면 성취기준 원문, 3년 동안의 학습 주제, 핵심 차시, 연결된 콘텐츠를 볼 수 있습니다.</p>
          <div className="area-blocks" data-motion-stagger>
            {AREAS.map((a) => (
              <section key={a} className={`area-block a-${areaKey(a)}`} data-motion="domain" aria-labelledby={`ab-${areaKey(a)}`}>
                <ContentImage {...areaImage(a)} className="ab-img" />
                <div className="ab-body">
                  <h3 id={`ab-${areaKey(a)}`}>{a}</h3>
                  <ul>
                    {standards.filter((s) => s.area === a).map((s) => (
                      <li key={s.code}><Link href={`/standards/${s.code}`}>{s.skill}</Link></li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="sec-title" id="years-h">같은 기술이 학년마다 깊어집니다</h2>
          <p className="muted">중1은 알아차리고, 중2는 탐색하고, 중3은 계획하고 실천합니다.</p>
          <div className="table-scroll" tabIndex={0} role="region" aria-labelledby="years-h">
            <table className="year-table">
              <thead><tr><th scope="col">사회정서기술</th><th scope="col">중1</th><th scope="col">중2</th><th scope="col">중3</th></tr></thead>
              <tbody>
                {standards.slice().sort((x, y) => AREAS.indexOf(x.area) - AREAS.indexOf(y.area) || x.code.localeCompare(y.code)).map((s) => (
                  <tr key={s.code} className={`a-${areaKey(s.area)}`}>
                    <th scope="row"><Link href={`/standards/${s.code}`}>{s.skill}</Link><span className="yt-area"><AreaTag area={s.area} /> {s.code}</span></th>
                    <td>{s.topics[1]}</td><td>{s.topics[2]}</td><td>{s.topics[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="source-note">출처: {getStandardsSource()}</p>

          <div className="full-course">
            <h2 className="sec-title" id="full-h">전체 34차시 과정이 필요하신가요?</h2>
            <p className="muted">학년별 전체 과정은 학교 교육과정 편성, 교사 연수, 교원학습공동체와 함께 운영합니다.</p>
            <div className="cur-cta">
              <Link className="btn btn-solid" href="/contact">전체 과정 문의</Link>
              <Link className="btn btn-ghost" href="/programs">연수·워크북 보기</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
