import ContentImage from "./ContentImage";
import { DOMAIN_COLOR } from "../data/tools";

export default function ToolCard({ tool }) {
  const color = DOMAIN_COLOR[tool.dom] || "var(--forest)";
  const inner = <>
    <span className="tthumb-wrap">
      <ContentImage className="tthumb" src={tool.img} alt={`${tool.n} 콘텐츠 화면`} width={800} height={500} />
      {tool.teaser && <span className="tteaser">예고편 있음</span>}
    </span>
    <div className="tbody">
      <p className="tool-kind">{tool.t} · {tool.aud}</p>
      <h3>{tool.n}</h3>
      <p className="tool-desc">{tool.d}</p>
      {tool.privacy && <p className="tool-privacy">{tool.privacy}</p>}
      <div className="tmeta"><span className="tchip" style={{ color }}>{tool.dom}</span>
        {tool.url ? <span className="topen">열기 <span aria-hidden="true">↗</span><span className="sr-only"> (새 창)</span></span> : <span className="tsoon">곧 공개</span>}
      </div>
    </div>
  </>;
  return tool.url
    ? <a className="tcard" data-motion="card" data-motion-card data-motion-key={tool.n} style={{ "--tool-color": color }} href={tool.url} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <div className="tcard soon" data-motion="card" data-motion-key={tool.n} style={{ "--tool-color": color }}>{inner}</div>;
}
