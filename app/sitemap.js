import { GRADES, getStandards, getLessons } from "../features/curriculum/data";
import { ORIGIN, PAGE_META } from "../lib/pageMeta";

export default function sitemap() {
  const paths = [
    ...Object.keys(PAGE_META),
    "/curriculum",
    ...GRADES.map((grade) => `/curriculum/grade-${grade}`),
    ...getStandards().map(({ code }) => `/standards/${code}`),
    ...getLessons().filter(({ status }) => status === "published").map(({ slug }) => `/lessons/${slug}`),
  ];
  return paths.map((path) => ({ url: new URL(path, ORIGIN).href }));
}
