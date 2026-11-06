import { CurriculumIndex } from "../../features/curriculum";
import { createPageMetadata } from "../../lib/pageMeta";

export const metadata = createPageMetadata("/curriculum", {
  title: "SEL 수업 · Lev Lab 레브랩",
  description: "서울 사회정서교육 4영역·17개 사회정서기술에 맞춘 중학교 1–3학년 SEL 수업을 살펴보세요.",
});

export default function Page() {
  return <CurriculumIndex />;
}
