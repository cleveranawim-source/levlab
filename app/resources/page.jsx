import ResourcesPage from "../../page-content/ResourcesPage";
import { createPageMetadata, PAGE_META } from "../../lib/pageMeta";

export const metadata = createPageMetadata("/resources", PAGE_META["/resources"]);

export default function Page() {
  return <ResourcesPage />;
}
