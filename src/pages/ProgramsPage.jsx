import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { SEL_DOMAINS, SEL_SOURCE } from "../data/sel";
import { SKILL_TOPICS } from "../data/curriculum";
import { CURRICULUM } from "../data/site";

const TEACHER_TRAINING = [
  "서울 사회정서교육 4영역·17개 사회정서기술 이해",
  "교과 수업 안에서 사회정서기술을 반복 실습하는 수업 설계",
  "게임·웹앱을 쓰는 SEL 수업 실습",
  "「마음의 한줄」 필사 활용법",
];
const PARENT_TALK = [
  "사회정서교육이란 무엇인가 — 학부모 입문",
  "자녀의 감정 읽기와 반영적 경청",
  "사춘기 자녀와 소통하는 언어",
  "가정에서 시작하는 필사 루틴",
];

export default function ProgramsPage() {
  return (
    <PageShell
      eyebrow="SEL Curriculum"
      title="중학교 3년, 사회정서교육 수업"
      sub={`서울 사회정서교육의 ${CURRICULUM.domains}개 영역과 ${CURRICULUM.skills}개 사회정서기술에 맞춰, 학년마다 ${CURRICULUM.lessonsPerGrade}차시 수업을 설계했습니다. 명지중학교 교실에서 먼저 돌려 보고 다듬습니다.`}
    >
      {/* 두 과정 */}
      <section className="content-section" aria-labelledby="tracks-h">
        <p className="eyebrow">Tracks</p>
        <h2 className="content-h2" id="tracks-h">핵심 15차시부터 공개합니다</h2>
        <p className="content-lead">
          서울시교육청은 학년마다 사회정서교육 15차시 이상을 권장합니다. 그 기준에 맞춰 학년별 핵심 15차시를 먼저 공개하고,
          전체 34차시 과정은 연수와 협력 학교를 통해 함께 나눕니다.
        </p>
        <div className="track-grid" style={{ marginTop: 26 }}>
          <div className="track-card">
            <span className="kick">CORE 15</span>
            <h3>학년별 핵심 15차시</h3>
            <p>네 영역을 고루 담은 학년별 15차시. 지도안·활동지·수업 슬라이드와, 차시에 맞는 레브랩 웹앱을 함께 묶어 무료로 공개합니다.</p>
            <span className="status">공개 준비 중 · 중1·중2·중3 총 {CURRICULUM.coreLessonsPerGrade * CURRICULUM.grades}차시</span>
          </div>
          <div className="track-card">
            <span className="kick">FULL 34</span>
            <h3>학년별 전체 34차시</h3>
            <p>17개 사회정서기술을 한 해 동안 모두 다루는 전체 과정. 학교 교육과정 편성, 교사 연수, 교원학습공동체와 함께 운영합니다.</p>
            <span className="status">연수·협력 학교 대상 · 총 {CURRICULUM.totalLessons}차시</span>
          </div>
        </div>
        <div className="cta-row-plain">
          <Link className="btn btn-solid" to="/#newsletter">공개되면 소식 받기</Link>
          <Link className="btn btn-ghost" to="/contact">전체 과정 문의</Link>
        </div>
      </section>

      {/* 4영역 17기술 */}
      <section className="content-section" aria-labelledby="skills-h">
        <p className="eyebrow">Framework</p>
        <h2 className="content-h2" id="skills-h">4개 영역, 17개 사회정서기술</h2>
        <p className="content-lead">모든 차시는 서울 사회정서교육의 사회정서기술 하나와 성취기준 코드 하나에 연결됩니다.</p>
        <div className="skill-grid" style={{ marginTop: 26 }}>
          {SEL_DOMAINS.map((d) => (
            <div className="skill-col" key={d.key} style={{ "--dc": d.color }}>
              <h3>{d.nm}</h3>
              <span className="codes">{d.codes}</span>
              <ul>{d.items.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          ))}
        </div>
        <p className="content-lead" style={{ fontSize: 14 }}>출처: {SEL_SOURCE}</p>
      </section>

      {/* 학년별 학습 주제 */}
      <section className="content-section" aria-labelledby="years-h">
        <p className="eyebrow">Three Years</p>
        <h2 className="content-h2" id="years-h">같은 기술이 학년마다 깊어집니다</h2>
        <p className="content-lead">
          서울 사회정서교육이 정한 학년별 학습 주제입니다. 중1은 알아차리고, 중2는 탐색하고, 중3은 계획하고 실천합니다.
          레브랩의 34차시는 이 주제를 학년마다 모두 다룹니다.
        </p>
        <div className="table-scroll" style={{ marginTop: 22 }} tabIndex={0} role="region" aria-labelledby="years-h">
          <table className="year-table">
            <caption className="sr-only">사회정서기술별 중학교 학년별 학습 주제</caption>
            <thead>
              <tr><th scope="col">사회정서기술</th><th scope="col">중1</th><th scope="col">중2</th><th scope="col">중3</th></tr>
            </thead>
            <tbody>
              {SKILL_TOPICS.map(([area, skill, code, g1, g2, g3]) => (
                <tr key={skill}>
                  <th scope="row">{skill}<br /><span style={{ fontWeight: 500, fontSize: 13, color: "var(--ink-soft)" }}>{area} · {code}</span></th>
                  <td>{g1}</td><td>{g2}</td><td>{g3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 워크북 */}
      <section className="content-section" id="workbook" aria-labelledby="workbook-h">
        <p className="eyebrow">Workbook</p>
        <h2 className="content-h2" id="workbook-h">「마음의 한줄」 필사 워크북</h2>
        <p className="content-lead">
          매일 한 줄을 손으로 쓰며 마음을 정리하는 34주 루틴. 학년별 3권으로, 1학년은 자기, 2학년은 관계, 3학년은 공동체 주제를 깊게 다룹니다.
          수업 차시와 함께 쓰면 배운 기술을 날마다 되새길 수 있습니다.
        </p>
      </section>

      {/* 연수 */}
      <section className="content-section" id="workshop" aria-labelledby="workshop-h">
        <p className="eyebrow">Workshop</p>
        <h2 className="content-h2" id="workshop-h">교사 연수 · 학부모 특강</h2>
        <p className="content-lead">「학교로 찾아가는 사회정서교육」 연수 강사로 현장에서 나눈 내용을 바탕으로, 학교 상황에 맞춰 설계합니다.</p>
        <div className="offer-list" style={{ marginTop: 22 }}>
          <div className="offer">
            <h3>교사 연수</h3>
            <ul>{TEACHER_TRAINING.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="offer">
            <h3>학부모 특강</h3>
            <ul>{PARENT_TALK.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
        <div className="cta-row-plain">
          <Link className="btn btn-solid" to="/contact">연수·특강 문의하기 →</Link>
          <Link className="btn btn-ghost" to="/tools">수업에 쓰는 콘텐츠 보기</Link>
        </div>
      </section>
    </PageShell>
  );
}
