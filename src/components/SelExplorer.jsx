import { useId, useRef, useState } from "react";
import { SEL_DOMAINS } from "../data/sel";
import { useIsMobile } from "../lib/hooks";
import { domainInk } from "../lib/colors";

function Panel({ d, inline = false, ...props }) {
  return (
    <div className={`sel-panel ${inline ? "inline" : ""}`} style={{ "--dc": d.color }} {...props}>
      <div className="halo" style={{ background: d.color }} aria-hidden="true" />
      <div className="fade" key={d.key}>
        <div className="pen" style={{ color: domainInk(d.color) }}>{d.en}</div>
        <div className="pn">
          {d.nm} <span style={{ color: d.color }}>·</span>{" "}
          <span style={{ fontSize: ".62em", color: "var(--ink-soft)", fontWeight: 700 }}>{d.tagline}</span>
        </div>
        <div className="pd">{d.pd}</div>
        <ul>
          {d.items.map((t) => (
            <li key={t}>
              <span className="tick" style={{ background: `color-mix(in srgb, ${d.color} 14%, transparent)` }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={domainInk(d.color)} strokeWidth="3" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** SEL 4영역 탐색기 — 데스크탑은 탭+패널, 모바일은 누른 탭 아래 펼침(아코디언) */
export default function SelExplorer() {
  const [i, setI] = useState(0);
  const [expanded, setExpanded] = useState(0);
  const mobile = useIsMobile();
  const id = useId();
  const tabs = useRef([]);
  const tabId = (index) => `${id}-tab-${index}`;
  const panelId = (index) => `${id}-panel-${index}`;
  const onKeyDown = (event, index) => {
    let next;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % SEL_DOMAINS.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + SEL_DOMAINS.length) % SEL_DOMAINS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = SEL_DOMAINS.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setI(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="sel">
      <div className="sel-tabs" role={mobile ? undefined : "tablist"} aria-label={mobile ? undefined : "사회정서교육 영역"} aria-orientation={mobile ? undefined : "vertical"}>
        {SEL_DOMAINS.map((dm, idx) => (
          <div key={dm.key} className="sel-item" role={mobile ? undefined : "presentation"}>
            <button
              type="button"
              id={tabId(idx)}
              ref={(element) => { tabs.current[idx] = element; }}
              className="sel-tab"
              role={mobile ? undefined : "tab"}
              tabIndex={mobile || idx === i ? 0 : -1}
              aria-selected={mobile ? undefined : idx === i}
              aria-expanded={mobile ? idx === expanded : undefined}
              aria-controls={panelId(idx)}
              style={{ "--dc": dm.color }}
              onClick={() => mobile ? setExpanded((current) => current === idx ? null : idx) : setI(idx)}
              onKeyDown={mobile ? undefined : (event) => onKeyDown(event, idx)}
            >
              <span className="num" style={{ background: domainInk(dm.color) }}>{dm.num}</span>
              <span>
                <span className="nm">{dm.nm}</span>
                <br />
                <span className="en">{dm.en}</span>
              </span>
              <span className="chev" aria-hidden="true">{mobile ? (idx === expanded ? "−" : "+") : "→"}</span>
            </button>
            {mobile && <Panel d={dm} inline id={panelId(idx)} role="region" aria-labelledby={tabId(idx)} hidden={idx !== expanded} />}
          </div>
        ))}
      </div>
      {!mobile && SEL_DOMAINS.map((domain, index) => (
        <Panel key={domain.key} d={domain} id={panelId(index)} role="tabpanel" aria-labelledby={tabId(index)} tabIndex={0} hidden={index !== i} />
      ))}
    </div>
  );
}
