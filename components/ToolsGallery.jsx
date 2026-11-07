"use client";

import { Suspense, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { TOOLS, TOOL_TYPES, TOOL_AUDIENCES } from "../data/tools";
import ToolCard from "./ToolCard";

/** full=true → 유형+대상 이중 필터 + 개수 표시 (전용 페이지용) */
function FilteredGallery({ full }) {
  const params = useSearchParams();
  return <Gallery full={full} params={params} />;
}

export default function ToolsGallery({ full = false }) {
  return (
    <Suspense fallback={<Gallery full={full} params={new URLSearchParams()} />}>
      <FilteredGallery full={full} />
    </Suspense>
  );
}

function Gallery({ full, params }) {
  const firstFilter = useRef(null);
  const type = TOOL_TYPES.includes(params.get("type")) ? params.get("type") : "전체";
  const aud = full && TOOL_AUDIENCES.includes(params.get("aud")) ? params.get("aud") : "전체";
  const matchesType = (item, value) => value === "전체" || item.t === value;
  const matchesAudience = (item, value) => value === "전체" || item.aud?.includes(value);

  const list = useMemo(
    () =>
      TOOLS.filter(
        (a) =>
          matchesType(a, type) && matchesAudience(a, aud)
      ),
    [type, aud, full]
  );

  const updateFilters = (changes) => {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value === "전체") next.delete(key);
      else next.set(key, value);
    }
    const query = next.toString();
    // Next integrates native history with useSearchParams; no route scroll/focus reset.
    window.history.pushState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  };
  const pickType = (t) => t !== type && updateFilters({ type: t });
  const pickAud = (v) => v !== aud && updateFilters({ aud: v });

  const TypeFilters = (
    <div className="tool-filters" role="group" aria-label="콘텐츠 유형" style={full ? { margin: 0 } : undefined}>
      {TOOL_TYPES.map((t) => {
        const cnt = TOOLS.filter((a) => matchesType(a, t) && matchesAudience(a, aud)).length;
        return (
          <button type="button" ref={t === "전체" ? firstFilter : undefined} key={t} className="tfilter" aria-pressed={type === t} onClick={() => pickType(t)}>
            {t} <span className="cnt">{cnt}</span>
          </button>
        );
      })}
    </div>
  );

  const grid = (
    <div className="tool-grid" data-motion-stagger key={`${type}:${aud}`}>
      {list.length
        ? list.map((a) => <ToolCard key={a.n} tool={a} />)
        : <div className="empty"><p>해당하는 콘텐츠가 없어요.</p><button type="button" className="btn btn-ghost" onClick={() => { updateFilters({ type: "전체", aud: "전체" }); firstFilter.current?.focus(); }}>필터 초기화</button></div>}
    </div>
  );

  if (!full) {
    return (
      <>
        {TypeFilters}
        {grid}
      </>
    );
  }

  return (
    <>
      <div className="filterbar">
        <div className="fgroup"><span className="fglabel">유형</span>{TypeFilters}</div>
        <div className="fgroup">
          <span className="fglabel">대상</span>
          <div className="tool-filters" role="group" aria-label="콘텐츠 대상" style={{ margin: 0 }}>
            {TOOL_AUDIENCES.map((v) => (
              <button type="button" key={v} className="tfilter" aria-pressed={aud === v} onClick={() => pickAud(v)}>{v} <span className="cnt">{TOOLS.filter((a) => matchesType(a, type) && matchesAudience(a, v)).length}</span></button>
            ))}
          </div>
        </div>
      </div>
      <div className="gallery-summary">
        <p className="count-note" aria-live="polite"><b>{list.length}개</b> 콘텐츠</p>
        {(type !== "전체" || aud !== "전체") && <button className="filter-reset" type="button" onClick={() => { updateFilters({ type: "전체", aud: "전체" }); firstFilter.current?.focus(); }}>필터 초기화</button>}
      </div>
      {grid}
    </>
  );
}
