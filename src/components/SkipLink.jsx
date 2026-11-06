export default function SkipLink() {
  return (
    <a className="skip-link" href="#main" onClick={(event) => {
      const main = document.getElementById("main");
      const target = main?.querySelector("h1") || main;
      if (!target) return;
      event.preventDefault();
      // The page's header currently lives inside main: skip directly to its heading.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start" });
    }}>본문으로 건너뛰기</a>
  );
}
