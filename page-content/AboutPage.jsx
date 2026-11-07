import Link from "next/link";
import PageShell from "../components/PageShell";

const LEV = [
  { ko: "마음", en: "Heart", d: "감정을 알아차리는 힘" },
  { ko: "지성", en: "Mind", d: "판단하고 성찰하는 힘" },
  { ko: "의지", en: "Will", d: "책임 있게 결정하는 힘" },
];

const MISSION = [
  { t: "미션", h: "마음을 읽는 교육", d: "사회정서교육 콘텐츠로 학생·교사·학부모의 정서적 성장을 돕습니다." },
  { t: "비전", h: "모든 교실에 SEL을", d: "사회정서교육이 학교 수업 안에 자연스럽게 스며드는 환경을 만듭니다." },
  { t: "핵심 가치", h: "현장 · 통합 · 필사", d: "교실에서 먼저 돌려 본 수업, 교과와 이어지는 설계, 디지털 너머의 손글씨 실천." },
];

const TIMELINE = [
  { y: "2023", h: "사회정서교육 수업 연구 시작", d: "명지중학교에서 사회정서교육과 교과를 잇는 수업 설계를 시작했습니다." },
  { y: "2025", h: "「마음의 한줄」 완성", d: "필사 기반 SEL 워크북 3권 시리즈를 편집했습니다." },
  { y: "2026", h: "레브랩 출범 · 현장지원단", d: "서울 사회정서교육 현장지원단과 「학교로 찾아가는 사회정서교육」 연수 강사로 활동하며 레브랩을 시작했습니다." },
  { y: "2026", h: "중학교 1~3학년 102차시 · SEL 웹앱", d: "서울 사회정서교육 성취기준에 맞춘 학년별 34차시와, 수업에 쓰는 게임·웹앱을 만들었습니다." },
  { y: "2026", h: "「AI와 함께하는 사회정서교육」 공개수업 설계", d: "AI를 ‘틀리는 거울’과 ‘연습 상대’로 쓰는 중1 수업과 교실 웹앱을, 다른 학교 선생님들께 공개하는 수업으로 설계했습니다." },
  { y: "NOW", h: "핵심 15차시 공개", d: "학년별 핵심 15차시를 수업 흐름·교사 발문·웹앱과 함께 공개했습니다. 원본 자료와 새 웹앱을 차례로 더합니다." },
  { y: "NEXT", h: "고등학교 1~3학년 수업 공개 예정", d: "중학교에 이어 고등학교 1~3학년 사회정서교육 수업도 같은 틀로 만들어 공개합니다." },
];

// 서울특별시교육청 디지털 배지 (Open Badges 2.0, 발급처 서버에서 누구나 진위 확인)
const OB = "https://nlp.netlearning.co.jp/api/v1.0/openbadge/v2/Assertion/";
const BADGES = [
  { img: "ai-convergence", name: "인공지능 창의융합교육", on: "2026-11-01", id: "RWN5VXIvS1NMQU1HVWtuNUtOTDBCQT09" },
  { img: "ai-digital-content", name: "AI·디지털 교육자료", on: "2026-11-01", id: "cndFTHJib0FPMEJXZnlQUmFNcjF2dz09" },
  { img: "digital-lms", name: "디지털 교수학습", on: "2024-12-16", id: "UzBwRHhtVTNqY083SVQyVmdTYjlCUT09" },
];
const fmtDate = (d) => d.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, m, day) => `${y}. ${Number(m)}. ${Number(day)}.`);

const DIFFS = [
  { h: "교실에서 태어난 수업", d: "명지중학교 교실에서 먼저 돌려 보고, 학생 반응을 보며 고칩니다." },
  { h: "공식 체계에 맞춘 설계", d: "모든 차시가 서울 사회정서교육의 사회정서기술과 성취기준 코드에 연결됩니다." },
  { h: "플레이로 배우는 SEL", d: "게임·자기 점검·활동 도구를 수업 흐름 안에 넣어, 학생이 직접 해 보며 배웁니다." },
  { h: "아날로그와 디지털", d: "「마음의 한줄」 필사와 웹앱·AI 활용 수업이 함께 갑니다." },
];

export default function AboutPage() {
  return (
    <PageShell
      showSlogan
      title="마음(לֵב)에서 시작하는 교육"
      sub="히브리어 레브(לֵב)는 마음이자 지성이자 의지입니다. 레브랩은 이 한 단어에 교육철학을 담아, 사회정서교육을 교실의 중심에 놓습니다."
    >
      <section className="content-section" aria-labelledby="name-h">
        <h2 className="content-h2" id="name-h">왜 ‘레브’인가요?</h2>
        <div className="about-two" style={{ marginTop: 20 }}>
          <div>
            <p>히브리어 <b>לֵב(레브)</b>는 ‘마음’이자 ‘지성’이자 ‘의지’입니다. 성경에서 레브는 감정만이 아니라 판단하고 결정하고 방향을 잡는 중심을 뜻합니다.</p>
            <p>사회정서교육이 추구하는 것도 같습니다. <b>감정</b>을 알아차리고, <b>관계</b>를 돌보고, 공동체 안에서 책임 있는 <b>결정</b>을 내리는 힘. 레브랩은 이 한 단어에 교육철학 전체를 담았습니다.</p>
          </div>
          <div className="note-box">
            레브랩의 공개 수업과 콘텐츠는 <b>특정 종교를 전제하지 않습니다.</b> 어느 학교에서나 쓸 수 있도록 서울 사회정서교육의 공식 체계에 맞춰 설계합니다.
          </div>
        </div>
        <div className="lev-trio">
          {LEV.map((l) => <div key={l.ko}><b>{l.ko}</b><span>{l.en} · {l.d}</span></div>)}
        </div>
      </section>

      <section className="content-section" aria-labelledby="mission-h">
        <h2 className="content-h2" id="mission-h">레브랩이 지향하는 것</h2>
        <div className="track-grid" style={{ marginTop: 22, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {MISSION.map((m) => (
            <div className="track-card" key={m.t}>
              <span className="kick">{m.t}</span>
              <h3>{m.h}</h3>
              <p>{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="founder-h">
        <h2 className="content-h2" id="founder-h">대표 소개</h2>
        <div className="founder-card" style={{ marginTop: 22 }}>
          <img src="/founder.png" alt="레브랩 대표 이승열" width={440} height={550} loading="lazy" />
          <div>
            <h3>이승열</h3>
            <p className="role">명지중학교 교목 · 레브랩 대표</p>
            <p>명지중학교에서 학생들의 아침을 열어 온 교목입니다. 아침묵상 방송과 수업을 이어 가며, ‘마음의 교육’이 매일의 수업 안에 자연스럽게 녹아드는 구조를 연구해 왔습니다.</p>
            <p>필사와 AI를 함께 쓰는 아날로그·디지털 교육 콘텐츠를 만들고, 직접 만든 웹앱과 게임으로 사회정서교육 수업을 합니다.</p>
            <div className="tag-row">
              <span>2026 서울 사회정서교육 현장지원단</span>
              <span>학교로 찾아가는 사회정서교육 강사</span>
              <span>「마음의 한줄」 저자</span>
              <span>서울시교육청 교사개발자 2호</span>
              <span>LevLab 유튜브</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section maker" id="maker" aria-labelledby="maker-h">
        <div className="maker-card">
          <img className="maker-sticker" src="/images/maker/sen-dev-sticker.webp" alt="교사개발자 2호 서명 스티커" width={471} height={512} />
          <div className="maker-copy">
            <h2 className="content-h2" id="maker-h">서울시교육청 교사개발자 2호</h2>
            <ul className="maker-badges">
              {BADGES.map((b) => (
                <li key={b.id}>
                  <a href={`${OB}${b.id}`} target="_blank" rel="noopener noreferrer">
                    <img src={`/images/maker/badges/${b.img}.webp`} alt="" width={250} height={250} loading="lazy" />
                    <b>{b.name}</b>
                    <span>{fmtDate(b.on)}<span className="sr-only"> 발급, 발급 기록 보기 (새 창)</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="timeline-h">
        <h2 className="content-h2" id="timeline-h">레브랩이 되기까지</h2>
        <ol className="about-timeline" style={{ marginTop: 24 }}>
          {TIMELINE.map((t) => (
            <li key={t.h}>
              <span className="y">{t.y}</span>
              <h3>{t.h}</h3>
              <p>{t.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="content-section" aria-labelledby="diff-h">
        <h2 className="content-h2" id="diff-h">레브랩이 다른 점</h2>
        <div className="offer-list" style={{ marginTop: 22 }}>
          {DIFFS.map((x) => (
            <div className="offer" key={x.h}>
              <h3>{x.h}</h3>
              <p style={{ color: "var(--ink-soft)", margin: 0 }}>{x.d}</p>
            </div>
          ))}
        </div>
        <div className="cta-row-plain">
          <Link className="btn btn-solid" href="/curriculum">SEL 수업 살펴보기 →</Link>
          <Link className="btn btn-ghost" href="/contact">협업 문의하기</Link>
        </div>
      </section>
    </PageShell>
  );
}
