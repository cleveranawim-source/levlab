import { useState, useMemo } from "react";
import { TOOLS, TOOL_TYPES, TOOL_AUDIENCES, DOMAIN_COLOR } from "../data/tools";

function ToolCard({ a }) {
  const c = DOMAIN_COLOR[a.dom] || "var(--brand)";
  const inner = (
    <>
      <div
        className="tthumb"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${c} 34%, var(--surface)), color-mix(in srgb, ${c} 9%, var(--surface)))`,
        }}
      >
        <span className="em">{a.em}</span>
      </div>
      <div className="tbody">
        <span className="ttype" style={{ color: c }}>{a.t}</span>
        <h3>{a.n}</h3>
        <p>{a.d}</p>
        <div className="tmeta">
          <div className="chips">
            <span className="tchip" style={{ background: `color-mix(in srgb, ${c} 15%, transparent)`, color: c }}>{a.dom}</span>
            <span className="aud">{a.aud}</span>
          </div>
          {a.url ? <span className="topen row">열기 →</span> : <span className="tsoon">곧 공개</span>}
        </div>
      </div>
    </>
  );
  return a.url ? (
    <a className="tcard" href={a.url} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <div className="tcard soon">{inner}</div>
  );
}

/** full=true → 유형+대상 이중 필터 + 개수 표시 (전용 페이지용) */
export default function ToolsGallery({ full = false }) {
  const [type, setType] = useState("전체");
  const [aud, setAud] = useState("전체");

  const list = useMemo(
    () =>
      TOOLS.filter(
        (a) =>
          (type === "전체" || a.t === type) &&
          (!full || aud === "전체" || a.aud.indexOf(aud) >= 0)
      ),
    [type, aud, full]
  );

  const TypeFilters = (
    <div className="tool-filters" style={full ? { margin: 0 } : undefined}>
      {TOOL_TYPES.map((t) => {
        const cnt = t === "전체" ? TOOLS.length : TOOLS.filter((a) => a.t === t).length;
        return (
          <button key={t} className="tfilter" aria-pressed={type === t} onClick={() => setType(t)}>
            {t} <span className="cnt">{cnt}</span>
          </button>
        );
      })}
    </div>
  );

  if (!full) {
    return (
      <>
        {TypeFilters}
        <div className="tool-grid">
          {list.map((a) => <ToolCard key={a.n} a={a} />)}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="filterbar">
        <div className="fgroup"><span className="fglabel">유형</span>{TypeFilters}</div>
        <div className="fgroup">
          <span className="fglabel">대상</span>
          <div className="tool-filters" style={{ margin: 0 }}>
            {TOOL_AUDIENCES.map((v) => (
              <button key={v} className="tfilter" aria-pressed={aud === v} onClick={() => setAud(v)}>{v}</button>
            ))}
          </div>
        </div>
      </div>
      <p className="count-note"><b>{list.length}개</b> 콘텐츠</p>
      <div className="tool-grid">
        {list.length ? list.map((a) => <ToolCard key={a.n} a={a} />) : <p className="empty">해당하는 콘텐츠가 없어요.</p>}
      </div>
    </>
  );
}
