import Link from "next/link";
import PageShell from "../components/PageShell";
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
      title="연수 · 워크북"
      sub="수업 밖에서도 사회정서교육을 이어 가도록, 교사 연수와 학부모 특강, 필사 워크북 「마음의 한줄」을 함께 운영합니다."
    >
      <section className="content-section" id="workshop" aria-labelledby="workshop-h">
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
          <Link className="btn btn-solid" href="/contact">연수·특강 문의하기 →</Link>
        </div>
      </section>

      <section className="content-section" id="workbook" aria-labelledby="workbook-h">
        <h2 className="content-h2" id="workbook-h">「마음의 한줄」 필사 워크북</h2>
        <p className="content-lead">
          매일 한 줄을 손으로 쓰며 마음을 정리하는 34주 루틴. 학년별 3권으로, 1학년은 자기, 2학년은 관계, 3학년은 공동체 주제를 깊게 다룹니다.
          수업 차시와 함께 쓰면 배운 기술을 날마다 되새길 수 있습니다.
        </p>
      </section>

      <section className="content-section" aria-labelledby="full-h">
        <h2 className="content-h2" id="full-h">학교 단위 전체 {CURRICULUM.lessonsPerGrade}차시 과정</h2>
        <p className="content-lead">
          공개한 핵심 15차시 밖의 전체 과정(학년별 {CURRICULUM.lessonsPerGrade}차시, 총 {CURRICULUM.totalLessons}차시)은
          학교 교육과정 편성, 교사 연수, 교원학습공동체와 함께 운영합니다.
        </p>
        <div className="cta-row-plain">
          <Link className="btn btn-solid" href="/curriculum">핵심 15차시 보기 →</Link>
          <Link className="btn btn-ghost" href="/contact">전체 과정 문의</Link>
        </div>
      </section>
    </PageShell>
  );
}
