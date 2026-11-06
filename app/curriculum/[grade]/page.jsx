import { notFound } from "next/navigation";
import { GradePage } from "../../../features/curriculum";
import { GRADES } from "../../../features/curriculum/data";
import { createPageMetadata } from "../../../lib/pageMeta";

export const dynamicParams = false;

// Next dynamic segments occupy the entire directory name: "grade-1" is the param.
export function generateStaticParams() {
  return GRADES.map((grade) => ({ grade: `grade-${grade}` }));
}

async function readGrade(params) {
  const { grade: segment } = await params;
  const grade = GRADES.find((value) => segment === `grade-${value}`);
  if (!grade) notFound();
  return grade;
}

export async function generateMetadata({ params }) {
  const grade = await readGrade(params);
  return createPageMetadata(`/curriculum/grade-${grade}`, {
    title: `중${grade} SEL 수업 · Lev Lab 레브랩`,
    description: `중학교 ${grade}학년을 위한 사회정서교육 수업. 서울 사회정서교육 성취기준과 연결된 SEL 수업을 살펴보세요.`,
  });
}

export default async function Page({ params }) {
  return <GradePage grade={await readGrade(params)} />;
}
