import localFont from "next/font/local";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ScrollToTop from "../components/ScrollToTop";
import Spotlight from "../components/Spotlight";
import { ORIGIN, PAGE_META, createPageMetadata } from "../lib/pageMeta";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "../styles/theme.css";
import "../styles/content.css";

// Preload only the small common-character subset. Other glyphs are fetched from
// the package's local unicode-range faces as needed, all under /_next/static/.
const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2-dynamic-subset/PretendardVariable.subset.91.woff2",
  fallback: ["Pretendard Variable"],
  adjustFontFallback: false,
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+20-22, U+27-2a, U+2c-39, U+3a-3b, U+3f, U+41-4e, U+4f-5d, U+61-7b, U+7d, U+a0-a1, U+ab, U+ad-ae, U+b7, U+bb, U+bf, U+2013-2014, U+201c-201d, U+2122, U+ac00, U+ace0, U+ae30, U+b2e4, U+b85c, U+b9ac, U+c0ac, U+c2a4, U+c2dc, U+c774, U+c778, U+c9c0, U+d558" }],
});

export const metadata = {
  metadataBase: new URL(ORIGIN),
  ...createPageMetadata("/", PAGE_META["/"]),
  icons: { icon: "/logo/levlab-symbol.svg" },
};

export const viewport = { themeColor: "#2D6B4A" };

const themeScript = `(function(){try{var t=localStorage.getItem("levlab-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <SkipLink />
        <ScrollToTop />
        <Spotlight />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
