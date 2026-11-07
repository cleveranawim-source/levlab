"use client";

import { usePathname } from "next/navigation";

/** Keep the existing site shell everywhere except the classroom presentation. */
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  return /^\/lessons\/[^/]+\/slides\/?$/.test(pathname) ? null : children;
}
