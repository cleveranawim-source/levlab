import HomePage from "../page-content/HomePage";
import { createPageMetadata, PAGE_META } from "../lib/pageMeta";

export const metadata = createPageMetadata("/", PAGE_META["/"]);

export default function Page() {
  return <HomePage />;
}
