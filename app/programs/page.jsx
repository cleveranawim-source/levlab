import ProgramsPage from "../../page-content/ProgramsPage";
import { createPageMetadata, PAGE_META } from "../../lib/pageMeta";

export const metadata = createPageMetadata("/programs", PAGE_META["/programs"]);

export default function Page() {
  return <ProgramsPage />;
}
