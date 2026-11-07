import { readFileSync } from "node:fs";

// 핵심 15차시만 공개하므로 차시 번호는 34차시 전체 과정 번호를 따른다(중2 1차시 = g2-01 은 비공개).
// 비공개 차시 주소로 들어오면 404 대신 그 학년 핵심 15차시 목록으로 보낸다. 나중에 공개하면 자동으로 빠진다.
const lessons = JSON.parse(readFileSync(new URL("./content/lessons.json", import.meta.url), "utf8"));
const lessonList = Array.isArray(lessons) ? lessons : lessons.lessons;
const published = new Set(lessonList.map((l) => l.slug));
const unpublishedLessonRedirects = [1, 2, 3].flatMap((g) =>
  Array.from({ length: 34 }, (_, i) => `g${g}-${String(i + 1).padStart(2, "0")}`)
    .filter((slug) => !published.has(slug))
    .map((slug) => ({ source: `/lessons/${slug}`, destination: `/curriculum/grade-${g}`, permanent: false })),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Store links use both forms. Serve both without a redirect round trip.
  skipTrailingSlashRedirect: true,
  // 페이지가 빌드 때 public/ 파일이 있는지 fs 로 확인하므로, 추적기가 public/·영상 원본까지 서버 함수에 넣지 않게 뺀다
  // (안 빼면 함수 하나가 600MB를 넘어 Vercel 배포가 실패한다). 서버에서 실제로 읽는 것은 content/slides 뿐이다.
  outputFileTracingExcludes: {
    "*": ["public/**", "content/teasers/**", "content/art/**", "content/worksheets/**", "docs/**", "scripts/**"],
  },
  async redirects() {
    return [
      // 목록 페이지가 따로 없는 상위 주소
      { source: "/lessons", destination: "/curriculum", permanent: false },
      { source: "/lessons/", destination: "/curriculum", permanent: false },
      { source: "/standards", destination: "/curriculum#by-skill-h", permanent: false },
      { source: "/standards/", destination: "/curriculum#by-skill-h", permanent: false },
      { source: "/index.html", destination: "/", permanent: true },
      ...unpublishedLessonRedirects,
    ];
  },
  async rewrites() {
    return [
      { source: "/gangdannote/:page(support|privacy)", destination: "/gangdannote/:page/index.html" },
      { source: "/gangdannote/:page(support|privacy)/", destination: "/gangdannote/:page/index.html" },
    ];
  },
};

export default nextConfig;
