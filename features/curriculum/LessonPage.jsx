// 차시 상세 — 한 장 수업 카드: 그림, 핵심 질문, 목표, 45분 흐름이 한눈에
import Link from "next/link";
import ContentImage from "../../components/ContentImage";
import { StageIcon, NoteIcon } from "../../components/icons/StageIcon";
import PrintButton from "./PrintButton";
import { getLesson, getLessonsByGrade, getStandard } from "./data";
import { GRADE_THEME, StdChip, AreaTag, GradeTag, AppList, Breadcrumb, appsForStandard, lessonImage, areaKey } from "./shared";

/** 준비물 문자열을 항목으로 — 괄호 안의 쉼표는 나누지 않는다 */
function splitMaterials(s) {
  const out = []; let cur = ""; let depth = 0;
  for (const ch of s || "") {
    if (ch === "(" || ch === "（") depth++;
    if (ch === ")" || ch === "）") depth = Math.max(0, depth - 1);
    if ((ch === "," || ch === "·") && depth === 0) { if (cur.trim()) out.push(cur.trim()); cur = ""; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export default function LessonPage({ slug }) {
  const L = getLesson(slug);
  if (!L) return null;
  const std = getStandard(L.standard);
  const g = GRADE_THEME[L.grade];
  const siblings = getLessonsByGrade(L.grade);
  const idx = siblings.findIndex((x) => x.slug === L.slug);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];
  const apps = appsForStandard(L.standard);
  const total = L.flow.reduce((s, f) => s + f.minutes, 0) || 45;
  const materials = splitMaterials(L.materials);

  return (
    <article className={`lesson a-${areaKey(L.area)}`}>
      <section className="lesson-head">
        <div className="wrap">
          <Breadcrumb items={[
            { label: "SEL 수업", href: "/curriculum" },
            { label: `${g.label} ${g.theme}`, href: `/curriculum/grade-${L.grade}` },
            { label: L.title },
          ]} />
          <div className="lh-grid">
            <ContentImage {...lessonImage(L.slug, L.title)} className="lh-img" priority />
            <div className="lh-body">
              <p className="lh-tags">
                <GradeTag grade={L.grade} />
                <AreaTag area={L.area} />
                <span className="lh-skill">{L.skill}</span>
                <StdChip code={L.standard} small />
              </p>
              <h1>{L.title}</h1>
              {L.keyQuestion && (
                <p className="key-q serif" data-motion="highlight"><span className="motion-question-mark" aria-hidden="true">“</span><span className="sr-only">핵심 질문: </span><mark>{L.keyQuestion.split(" ").map((word, i, words) => <span key={i}><span className="motion-ink" style={{ "--ink-word": i }}>{word}</span>{i < words.length - 1 ? " " : ""}</span>)}</mark></p>
              )}
              <h2 className="lh-sub">이 시간이 끝나면</h2>
              <ol className="goals">{L.objectives.map((o) => <li key={o}>{o}</li>)}</ol>
              <p className="lh-meta">
                <span>{L.minutes}분 · 1차시</span>
                <span>핵심 {L.coreOrder}차시 · 전체 과정 {L.sourceLesson}차시</span>
                {L.subjects?.length > 0 && <span>관련 교과 {L.subjects.join(", ")}</span>}
              </p>
            </div>
          </div>

          <div className="lesson-timeline" data-motion="timeline" role="img" aria-label={`45분 수업 흐름: ${L.flow.map((f) => `${f.stage} ${f.minutes}분`).join(", ")}`}>
            {L.flow.map((f, i) => (
              <span key={f.stage} className={`tl-seg s${i}`} style={{ flexGrow: f.minutes }}>
                <StageIcon stage={f.stage} size={20} />
                <b>{f.stage}</b>
                <span>{f.minutes}분</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="band lesson-main">
        <div className="wrap lm-grid">
          <div className="lm-flow">
            <h2 className="sec-title" id="flow-h">수업 흐름 <span className="h-sub">{total}분</span></h2>
            <p className="muted small">본문의 ‘다음 시간’·‘지난 시간’ 안내는 34차시 전체 과정 순서 기준입니다. 핵심 15차시로 하실 때는 학급에 맞게 바꿔 주세요.</p>
            <ol className="steps" data-motion-stagger>
              {L.flow.map((f, i) => (
                <li key={f.stage} className={`step s${i}`} data-motion="step">
                  <div className="step-head">
                    <span className="step-icon"><StageIcon stage={f.stage} /></span>
                    <h3>{f.stage}</h3>
                    <span className="step-min">{f.minutes}분</span>
                  </div>
                  {f.title && <p className="step-title">{f.title}</p>}
                  {f.steps.length > 0 && <ul className="step-list">{f.steps.map((s) => <li key={s}>{s}</li>)}</ul>}
                  {f.questions.length > 0 && (
                    <div className="asks">
                      <p className="asks-label">이렇게 물어보세요</p>
                      <ul>{f.questions.map((q) => <li key={q} className="serif">{q}</li>)}</ul>
                    </div>
                  )}
                  {(f.materials.length > 0 || f.tips.length > 0 || f.cautions.length > 0) && (
                    <dl className="step-notes">
                      {f.materials.length > 0 && <div><dt><NoteIcon kind="자료" /> 자료</dt><dd>{f.materials.join(" · ")}</dd></div>}
                      {f.tips.length > 0 && <div><dt><NoteIcon kind="팁" /> 교사 팁</dt><dd>{f.tips.join(" · ")}</dd></div>}
                      {f.cautions.length > 0 && <div className="caution"><dt><NoteIcon kind="유의" /> 유의</dt><dd>{f.cautions.join(" · ")}</dd></div>}
                    </dl>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <aside className="lm-side" aria-label="수업 준비">
            <div className="prep">
              <h2 className="prep-title">준비물</h2>
              {materials.length ? (
                <ul className="checklist">{materials.map((m) => <li key={m} data-motion-check><span className="box" aria-hidden="true" />{m}</li>)}</ul>
              ) : <p className="muted small">따로 준비할 것이 없습니다.</p>}
              {L.edutech && <p className="prep-note"><b>세안의 에듀테크</b> {L.edutech}</p>}
              <PrintButton />
            </div>
            {std && (
              <div className="prep std-box">
                <h2 className="prep-title">성취기준</h2>
                <StdChip code={std.code} />
                <p>{std.text}</p>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="band lesson-more">
        <div className="wrap">
          <h2 className="sec-title" id="apps-h">이 차시에 쓸 수 있는 레브랩 콘텐츠</h2>
          {apps.length > 0 && <p className="muted">세안의 외부 에듀테크 활동 대신, 또는 함께 쓸 수 있습니다. 학생 계정이 필요 없습니다.</p>}
          <AppList apps={apps} />

          <div className="more-grid">
            {L.assessment?.length > 0 && (
              <div>
                <h2 className="sec-title" id="eval-h">평가</h2>
                <ul className="assess">
                  {L.assessment.map((a) => (
                    <li key={a.area}><b>{a.area}</b><span>{a.criteria}</span><span className="muted small">{a.method}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {L.safety?.length > 0 && (
              <div>
                <h2 className="sec-title" id="safe-h">감정 안전 가이드</h2>
                <ul className="safety">{L.safety.map((s) => {
                  const [head, ...rest] = s.split(":");
                  return <li key={s}>{rest.length ? <><b>{head}</b>{rest.join(":")}</> : s}</li>;
                })}</ul>
              </div>
            )}
          </div>

          <h2 className="sec-title" id="bg-h">교사를 위한 배경</h2>
          {L.background && <details className="more"><summary>왜 지금 이 기술인가요?</summary><p>{L.background}</p></details>}
          {L.intent && <details className="more"><summary>수업 설계 의도</summary><p>{L.intent}</p></details>}
          {L.models?.length > 0 && <details className="more"><summary>적용한 수업 모형</summary><ul>{L.models.map((m) => <li key={m}>{m}</li>)}</ul></details>}

          <h2 className="sec-title" id="files-h">수업 자료</h2>
          {L.files?.length > 0 ? (
            <ul className="file-list">{L.files.map((f) => <li key={f.href}><a href={f.href} download>{f.label} <span className="muted">{f.meta}</span></a></li>)}</ul>
          ) : (
            <p className="muted">지도안·활동지·수업 슬라이드 원본 파일은 준비되는 대로 이 자리에 올립니다. 먼저 필요하시면 <Link href="/contact">문의</Link>해 주세요.</p>
          )}

          <nav className="lesson-pager" aria-label={`${g.label} 핵심 차시 이동`}>
            {prev ? <Link href={`/lessons/${prev.slug}`} rel="prev"><span>이전 차시</span>{prev.title}</Link> : <span />}
            {next ? <Link href={`/lessons/${next.slug}`} rel="next"><span>다음 차시</span>{next.title}</Link> : <span />}
          </nav>
        </div>
      </section>
    </article>
  );
}
