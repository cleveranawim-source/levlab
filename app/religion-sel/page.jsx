import { notFound } from "next/navigation";
import ReligionSelPage from "../../page-content/ReligionSelPage";
import { createPageMetadata, PAGE_META } from "../../lib/pageMeta";
import { RELIGION_SEL_PUBLIC } from "../../data/site";

export function generateMetadata() {
  if (!RELIGION_SEL_PUBLIC) notFound();
  return createPageMetadata("/religion-sel", PAGE_META["/religion-sel"]);
}

export default function Page() {
  if (!RELIGION_SEL_PUBLIC) notFound();
  return <ReligionSelPage />;
}
