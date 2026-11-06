import Link from "next/link";
import Logo from "./Logo";
import ContentImage from "./ContentImage";
import { CATCHPHRASE } from "../data/site";

/** Nav, Footer and main are provided by the root layout and template. */
export default function PageShell({ title, sub, showSlogan = false, image, children }) {
  return (
    <>
      <section className={`tools-hero${image ? " has-image" : ""}`}>
        <div className="wrap">
          <div className="page-heading">
            {showSlogan && <p className="slogan"><Logo /> {CATCHPHRASE}</p>}
            <h1>{title}</h1>
            {sub && <p className="sub">{sub}</p>}
          </div>
          {image && <ContentImage {...image} className="page-hero-image" priority />}
        </div>
      </section>
      <section className="band page-body"><div className="wrap">{children}</div></section>
    </>
  );
}

export function ComingSoon({ title = "준비하고 있어요", note, actions = [] }) {
  return (
    <div className="coming-soon">
      <h2>{title}</h2>
      <p>{note}</p>
      {actions.length > 0 && <div className="cta-row">
        {actions.map((a, i) => <Link key={a.to} href={a.to} className={`btn ${i === 0 ? "btn-solid" : "btn-ghost"}`}>{a.label}</Link>)}
      </div>}
    </div>
  );
}
