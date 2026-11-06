// 커리큘럼 데이터 로더 — 페이지·sitemap 이 쓰는 유일한 입구 (Claude 소유)
// content/*.json 은 빌드 때 정적으로 읽는다.
import standardsData from "../../content/standards.json";
import lessonsData from "../../content/lessons.json";

export const GRADES = [1, 2, 3];
export const AREAS = ["자기", "대인관계", "공동체", "마음건강"];

export function getStandards() { return standardsData.standards; }
export function getStandard(code) { return standardsData.standards.find((s) => s.code === code) || null; }
export function getStandardsSource() { return standardsData.source; }

export function getLessons() { return lessonsData.lessons; }
export function getLesson(slug) { return lessonsData.lessons.find((l) => l.slug === slug) || null; }
export function getLessonsByGrade(grade) {
  return lessonsData.lessons.filter((l) => l.grade === Number(grade)).sort((a, b) => a.coreOrder - b.coreOrder);
}
export function getLessonsByStandard(code) {
  return lessonsData.lessons.filter((l) => l.standard === code).sort((a, b) => a.grade - b.grade);
}
