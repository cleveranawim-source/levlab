import { ORIGIN } from "../lib/pageMeta";

export default function robots() {
  // Draft pages stay crawlable so their noindex metadata can be read.
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${ORIGIN}/sitemap.xml` };
}
