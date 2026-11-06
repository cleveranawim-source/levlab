import AboutPage from "../../page-content/AboutPage";
import { createPageMetadata, PAGE_META } from "../../lib/pageMeta";

export const metadata = createPageMetadata("/about", PAGE_META["/about"]);

export default function Page() {
  return <AboutPage />;
}
