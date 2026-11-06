// 차시 상세 — 교사가 이 화면 하나로 45분 수업을 준비할 수 있게
import Link from "next/link";
import PageShell from "../../components/PageShell";
import { getLesson, getLessonsByGrade, getStandard } from "./data";
import { GRADE_THEME, StdChip, AreaTag, DraftNotice, AppList, Breadcrumb, appsForStandard } from "./shared";

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

  return (
    <PageShell
      eyebrow={`${g.label} · 핵심 ${L.coreOrder}차시 · 전체 과정 ${L.sourceLesson}차시`}
      title={L.title}
      sub={L.keyQuestion ? `핵심 질문: “${L.keyQuestion}”` : undefined}
    >
      <Breadcrumb items={[
        { label: "SEL 수업", href: "/curriculum" },
        { label: `${g.label} ${g.theme}`, href: `/curriculum/grade-${L.grade}` },
        { label: L.title },
      ]} />
      {L.status !== "published" && <DraftNotice />}

      <dl className="lesson-facts">
        <div><dt>영역</dt><dd><AreaTag area={L.area} /></dd></div>
        <div><dt>사회정서기술</dt><dd>{L.skill}</dd></div>
        <div><dt>성취기준</dt><dd><StdChip code={L.standard} /></dd></div>
        <div><dt>시간</dt><dd>{L.minutes}분 · 1차시</dd></div>
        <div><dt>전체 34차시 과정에서</dt><dd>{L.sourceLesson}차시</dd></div>
        {L.subjects?.length > 0 && <div><dt>관련 교과</dt><dd>{L.subjects.join(", ")}</dd></div>}
        {L.materials && <div><dt>준비물</dt><dd>{L.materials}</dd></div>}
      </dl>

      {std && (
        <p className="std-text"><StdChip code={std.code} small /> {std.text}</p>
      )}

      <section className="content-section" aria-labelledby="obj-h">
        <h2 className="content-h2" id="obj-h">학습 목표</h2>
        <ol className="obj-list">{L.objectives.map((o) => <li key={o}>{o}</li>)}</ol>
      </section>

      <section className="content-section" aria-labelledby="flow-h">
        <h2 className="content-h2" id="flow-h">수업 흐름 <span className="h-sub">{total}분</span></h2>
        <p className="muted small">본문의 ‘다음 시간’·‘지난 시간’ 안내는 34차시 전체 과정 순서를 기준으로 합니다. 핵심 15차시만 하실 때는 학급 상황에 맞게 바꿔 주세요.</p>
        <div className="flow-bar" aria-hidden="true">
          {L.flow.map((f) => <span key={f.stage} style={{ flexGrow: f.minutes }}>{f.stage} {f.minutes}′</span>)}
        </div>
        <ol className="flow">
          {L.flow.map((f, i) => (
            <li key={f.stage} className="flow-step">
              <div className="flow-head">
                <span className="flow-n" aria-hidden="true">{i + 1}</span>
                <h3>{f.stage} <span className="flow-min">{f.minutes}분</span></h3>
              </div>
              {f.title && <p className="flow-title">{f.title}</p>}
              {f.steps.length > 0 && <ul className="flow-steps">{f.steps.map((s) => <li key={s}>{s}</li>)}</ul>}
              {f.questions.length > 0 && (
                <div className="flow-qs">
                  <p className="flow-label">교사 발문</p>
                  <ul>{f.questions.map((q) => <li key={q}>{q}</li>)}</ul>
                </div>
              )}
              {(f.materials.length > 0 || f.tips.length > 0 || f.cautions.length > 0) && (
                <div className="flow-notes">
                  {f.materials.length > 0 && <p><b>자료</b> {f.materials.join(" · ")}</p>}
                  {f.tips.length > 0 && <p><b>교사 팁</b> {f.tips.join(" · ")}</p>}
                  {f.cautions.length > 0 && <p><b>유의</b> {f.cautions.join(" · ")}</p>}
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="content-section" aria-labelledby="apps-h">
        <h2 className="content-h2" id="apps-h">이 차시에 쓸 수 있는 레브랩 콘텐츠</h2>
        {apps.length > 0 && <p className="content-lead">수업 흐름의 외부 에듀테크 활동 대신, 또는 함께 쓸 수 있습니다. 학생 계정이 필요 없습니다.</p>}
        <AppList apps={apps} />
      </section>

      {L.assessment?.length > 0 && (
        <section className="content-section" aria-labelledby="eval-h">
          <h2 className="content-h2" id="eval-h">평가</h2>
          <div className="table-scroll" tabIndex={0} role="region" aria-labelledby="eval-h">
            <table className="year-table">
              <thead><tr><th scope="col">평가 요소</th><th scope="col">기준</th><th scope="col">방법</th></tr></thead>
              <tbody>{L.assessment.map((a) => <tr key={a.area}><th scope="row">{a.area}</th><td>{a.criteria}</td><td>{a.method}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {L.safety?.length > 0 && (
        <section className="content-section" aria-labelledby="safe-h">
          <h2 className="content-h2" id="safe-h">감정 안전 가이드</h2>
          <ul className="safety-list">{L.safety.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>
      )}

      <section className="content-section" aria-labelledby="bg-h">
        <h2 className="content-h2" id="bg-h">교사를 위한 배경</h2>
        {L.background && <details className="more"><summary>왜 지금 이 기술인가요?</summary><p>{L.background}</p></details>}
        {L.intent && <details className="more"><summary>수업 설계 의도</summary><p>{L.intent}</p></details>}
        {L.models?.length > 0 && <details className="more"><summary>적용한 수업 모형</summary><ul>{L.models.map((m) => <li key={m}>{m}</li>)}</ul></details>}
      </section>

      <section className="content-section" aria-labelledby="files-h">
        <h2 className="content-h2" id="files-h">수업 자료</h2>
        {L.files?.length > 0 ? (
          <ul className="file-list">
            {L.files.map((f) => <li key={f.href}><a href={f.href} download>{f.label} <span className="muted">{f.meta}</span></a></li>)}
          </ul>
        ) : (
          <p className="muted">지도안·활동지·수업 슬라이드 원본 파일은 핵심 15차시 공개 때 이 자리에서 받을 수 있습니다.</p>
        )}
      </section>

      <nav className="lesson-pager" aria-label={`${g.label} 핵심 차시 이동`}>
        {prev ? <Link href={`/lessons/${prev.slug}`} rel="prev"><span>이전 차시</span>{prev.title}</Link> : <span />}
        {next ? <Link href={`/lessons/${next.slug}`} rel="next"><span>다음 차시</span>{next.title}</Link> : <span />}
      </nav>
    </PageShell>
  );
}
