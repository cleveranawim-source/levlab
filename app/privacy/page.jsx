import PrivacyPage from "../../page-content/PrivacyPage";
import { createPageMetadata, PAGE_META } from "../../lib/pageMeta";

export const metadata = createPageMetadata("/privacy", PAGE_META["/privacy"]);

export default function Page() {
  return <PrivacyPage />;
}
