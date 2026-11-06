export default function Template({ children }) {
  return <main id="main" tabIndex={-1} className="page-in" aria-label="본문">{children}</main>;
}
