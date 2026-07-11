import { useState } from "react";
import { SEL_DOMAINS } from "../data/sel";

export default function SelExplorer() {
  const [i, setI] = useState(0);
  const d = SEL_DOMAINS[i];
  const hoverable = typeof window !== "undefined" && window.matchMedia("(hover:hover)").matches;

  return (
    <div className="sel">
      <div className="sel-tabs" role="tablist">
        {SEL_DOMAINS.map((dm, idx) => (
          <button
            key={dm.key}
            className="sel-tab"
            role="tab"
            aria-selected={idx === i}
            style={{ "--dc": dm.color }}
            onClick={() => setI(idx)}
            onMouseEnter={() => hoverable && setI(idx)}
          >
            <span className="num" style={{ background: dm.color }}>{dm.num}</span>
            <span>
              <span className="nm">{dm.nm}</span>
              <br />
              <span className="en">{dm.en}</span>
            </span>
            <span className="chev">→</span>
          </button>
        ))}
      </div>

      <div className="sel-panel" style={{ "--dc": d.color }}>
        <div className="halo" style={{ background: d.color }} />
        <div className="fade" key={d.key}>
          <div className="pen" style={{ color: d.color }}>{d.en}</div>
          <div className="pn">
            {d.nm} <span style={{ color: d.color }}>·</span>{" "}
            <span style={{ fontSize: ".62em", color: "var(--ink-soft)", fontWeight: 700 }}>{d.tagline}</span>
          </div>
          <div className="pd">{d.pd}</div>
          <ul>
            {d.items.map((t) => (
              <li key={t}>
                <span className="tick" style={{ background: `color-mix(in srgb, ${d.color} 14%, transparent)` }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
