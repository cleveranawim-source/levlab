import Link from "next/link";
import { CURRICULUM } from "../../data/site";
import { TOOLS } from "../../data/tools";

const HEART_CODE = [
  "if (화남) 숨쉬기(4);",
  "const 마음 = 알아차리기();",
  "친구.감정 !== 내.감정",
  "while (갈등) 들어주기();",
  'console.log("괜찮아?")',
  "await 쉬는시간();",
  "try { 말하기(나전달법) } catch { 다시(); }",
  'return "고마워";',
  "거절.정중하게()",
  '도움.요청("담임쌤")',
];

export function HeartCode() {
  return <div className="heart-code" aria-hidden="true" data-wit-loop data-nosnippet>
    {HEART_CODE.map((line, index) => <div key={line} className="heart-code-line" style={{ "--code-line": index }}>{line}</div>)}
  </div>;
}

export function WitControls() {
  return <div className="wit-controls" data-wit-loop>
    <div className="wit-terminal" aria-hidden="true">&gt; 교사개발자_2호<span className="wit-cursor">_</span></div>
    <button type="button" className="wit-motion-toggle" data-wit-toggle hidden aria-pressed="false">움직임 멈추기</button>
  </div>;
}

export function YeolSticker() {
  return <Link className="wit-maker" href="/about#maker" data-wit-sticker aria-describedby="yeol-hello">
    <img className="wit-maker-image" src="/images/maker/sen-dev-sticker.webp" alt="" width={471} height={512} decoding="async" draggable={false} />
    <span className="wit-maker-caption"><span>만든 사람</span><strong>교사개발자 2호 <b>Yeol</b></strong><span className="wit-maker-link">소개 보기 <span aria-hidden="true">↗</span></span></span>
    <span className="wit-maker-bubble" id="yeol-hello" role="tooltip">서울시교육청 교사개발자 2호가 만들었어요</span>
  </Link>;
}

function Count({ value }) {
  // Screen readers get the stable sentence below, never the changing digits.
  return <span className="wit-count" data-wit-count={value} style={{ "--digits": String(value).length }}>{value}</span>;
}

export function HomeFacts() {
  const tools = TOOLS.filter((tool) => tool.url).length;
  const coreTotal = CURRICULUM.grades * CURRICULUM.coreLessonsPerGrade;
  const facts = [
    { domain: "self", label: `중1~중3 전체 과정 ${CURRICULUM.totalLessons}차시`, body: <><span><Count value={CURRICULUM.totalLessons} />차시</span><small>중1~중3 전체 과정</small></> },
    { domain: "inter", label: `${CURRICULUM.skills}개 사회정서기술`, body: <><span><Count value={CURRICULUM.skills} />개</span><small>사회정서기술</small></> },
    { domain: "comm", label: `학년별 핵심 ${CURRICULUM.coreLessonsPerGrade}차시, 총 ${coreTotal}차시`, body: <><span><Count value={CURRICULUM.coreLessonsPerGrade} />차시 <small className="wit-fact-total">× {CURRICULUM.grades}개 학년 = {coreTotal}</small></span><small>학년별 핵심 수업</small></> },
    { domain: "well", label: `웹앱·게임 ${tools}개`, body: <><span><Count value={tools} />개</span><small>웹앱·게임</small></> },
  ];
  return <ul className="home-facts wit-facts" aria-label="레브랩 수업과 콘텐츠" data-wit-facts>
    {facts.map(({ domain, label, body }) => <li className={`domain-${domain}`} key={domain}><span className="wit-sr-only">{label}</span><div aria-hidden="true">{body}</div></li>)}
  </ul>;
}

const TAPE = ['감정 == 정보', '화나도 괜찮아, 행동은 골라', 'git commit -m "오늘도 한 뼘"', '교사개발자 2호가 만들었어요', '질문 하나면 수업이 열려요'];

export function WitTape() {
  return <div className="wit-tape" aria-hidden="true" data-wit-loop data-nosnippet>
    {[0, 1].map((row) => <div className={`wit-tape-strip${row ? " wit-tape-reverse" : ""}`} key={row}>
      <div className="wit-tape-track">{[0, 1].map((copy) => <div className="wit-tape-copy" key={copy}>
        {(row ? [...TAPE].reverse() : TAPE).map((line) => <span key={line}>{line}<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M6 0 7.7 4.3 12 6 7.7 7.7 6 12 4.3 7.7 0 6 4.3 4.3Z" fill="currentColor" /></svg></span>)}
      </div>)}</div>
    </div>)}
  </div>;
}
