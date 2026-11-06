import ToolsPage from "../../page-content/ToolsPage";
import { createPageMetadata, PAGE_META } from "../../lib/pageMeta";

export const metadata = createPageMetadata("/tools", PAGE_META["/tools"]);

export default function Page() {
  return <ToolsPage />;
}
