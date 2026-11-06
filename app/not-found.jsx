import NotFoundPage from "../page-content/NotFoundPage";
import { NOT_FOUND, createPageMetadata } from "../lib/pageMeta";

const fallbackMetadata = createPageMetadata("/", NOT_FOUND, { index: false });
export const metadata = {
  ...fallbackMetadata,
  // An unknown path must not inherit the homepage's canonical or Open Graph URL.
  alternates: { canonical: null },
  openGraph: { ...fallbackMetadata.openGraph, url: null },
};

export default function NotFound() {
  return <NotFoundPage />;
}
