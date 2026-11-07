import Link from "next/link";
import PageShell from "../components/PageShell";
import MakerBadge from "../components/MakerBadge";
import { TOOLS } from "../data/tools";

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
  { y: "2026", h: "중학교 3년 102차시 · SEL 웹앱", d: "서울 사회정서교육 성취기준에 맞춘 학년별 34차시와, 수업에 쓰는 게임·웹앱을 만들었습니다." },
  { y: "2026", h: "「AI와 함께하는 사회정서교육」 공개수업 설계", d: "AI를 ‘틀리는 거울’과 ‘연습 상대’로 쓰는 중1 수업과 교실 웹앱을, 다른 학교 선생님들께 공개하는 수업으로 설계했습니다." },
  { y: "NOW", h: "핵심 15차시 공개", d: "학년별 핵심 15차시를 수업 흐름·교사 발문·웹앱과 함께 공개했습니다. 원본 자료와 새 웹앱을 차례로 더합니다." },
];

// 스티커 네 칸 — 그림 속 아이콘 그대로
const CLASSES = [
  { k: "bible", h: "교목", d: "아침묵상으로 학교의 하루를 엽니다" },
  { k: "board", h: "교사", d: "교실에서 사회정서교육 수업을 합니다" },
  { k: "code", h: "개발자", d: "수업에 쓸 웹앱과 게임을 직접 만듭니다" },
  { k: "heart", h: "마음", d: "모든 작업이 사회정서교육으로 모입니다" },
];

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
              <span>교사개발자 2호</span>
              <span>LevLab 유튜브</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section maker" id="maker" aria-labelledby="maker-h">
        <h2 className="content-h2" id="maker-h">교사개발자 2호</h2>
        <div className="maker-card">
          <figure className="maker-sticker">
            <img src="/images/maker/sen-dev-sticker.webp" alt="픽셀 그림 스티커. 위에 ‘멀티클래스’, 가운데 지팡이를 든 목자와 양, ‘YEOL Lv.MAX’ 글자와 성경·칠판·코드·하트 네 칸, 아래에 큰 숫자 2와 ‘교사개발자 SEN DEV’." width={228} height={256} />
            <figcaption>서명 스티커</figcaption>
          </figure>
          <div className="maker-copy">
            <p className="maker-lead serif">교실에서 쓸 앱은, 교실을 아는 사람이 만듭니다.</p>
            <p>레브랩의 웹앱과 게임 {TOOLS.filter((t) => t.url).length}개는 모두 대표가 <b>교사개발자 2호 Yeol</b>로서 직접 기획하고 만들었습니다. 수업에서 막힌 순간을 앱으로 풀고, 다음 수업에서 학생들과 다시 고칩니다.</p>
            <ul className="maker-classes" aria-label="스티커 네 칸이 뜻하는 것">
              {CLASSES.map((c) => <li key={c.k} className={`mc-${c.k}`}><b>{c.h}</b><span>{c.d}</span></li>)}
            </ul>
          </div>
        </div>

        <div className="maker-sign">
          <div>
            <h3>앱마다 남기는 디지털 배지</h3>
            <p>「AI와 함께하는 사회정서교육」 깡통이·하린이 수업을 만들면서, 앱 첫 화면과 끝 인사에 이 스티커를 서명으로 붙였습니다. 수업 중인 화면에는 넣지 않고, 학생 시작 화면과 선생님 화면 바닥에만 작게 남깁니다. 레브랩 사이트 맨 아래에도 같은 배지가 있습니다.</p>
            <p><a href="https://ai-sel.vercel.app/" target="_blank" rel="noopener noreferrer">깡통이 수업 첫 화면에서 보기<span className="sr-only"> (새 창)</span></a> · <Link href="/tools">레브랩 콘텐츠 전체</Link></p>
          </div>
          <div className="maker-demo" aria-label="앱 바닥글에 붙는 배지 예시">
            <span className="md-bar" aria-hidden="true"><i /><i /><i /></span>
            <span className="md-screen" aria-hidden="true">선생님이세요? 수업 열기</span>
            <MakerBadge size="md" href={null} />
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
