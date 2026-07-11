import { useState, useEffect } from "react";
import Logo from "./Logo";
import { CATCHPHRASE } from "../data/site";

/** 세션당 1회 보여주는 브랜드 인트로 로더 */
export default function Loader() {
  const [phase, setPhase] = useState("in"); // in → leaving → gone

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("levlab-intro") === "1"; } catch (e) {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setPhase("gone");
      try { sessionStorage.setItem("levlab-intro", "1"); } catch (e) {}
      return;
    }
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase("leaving"), 1700);
    const t2 = setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = "";
      try { sessionStorage.setItem("levlab-intro", "1"); } catch (e) {}
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); document.body.style.overflow = ""; };
  }, []);

  if (phase === "gone") return null;
  return (
    <div className={`loader ${phase === "leaving" ? "leaving" : ""}`} aria-hidden="true">
      <div className="loader-inner">
        <div className="loader-mark"><Logo white /></div>
        <div className="loader-wm">LEV&nbsp;LAB</div>
        <div className="loader-slogan">{CATCHPHRASE}</div>
      </div>
    </div>
  );
}
