import ContactPage from "../../page-content/ContactPage";
import { createPageMetadata, PAGE_META } from "../../lib/pageMeta";

export const metadata = createPageMetadata("/contact", PAGE_META["/contact"]);

export default function Page() {
  return <ContactPage />;
}
