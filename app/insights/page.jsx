import InsightsPage from "../../page-content/InsightsPage";
import { createPageMetadata, PAGE_META } from "../../lib/pageMeta";

export const metadata = createPageMetadata("/insights", PAGE_META["/insights"]);

export default function Page() {
  return <InsightsPage />;
}
