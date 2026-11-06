import { notFound } from "next/navigation";
import { LessonPage } from "../../../features/curriculum";
import { getLessons, getLesson, getStandard } from "../../../features/curriculum/data";
import { createPageMetadata } from "../../../lib/pageMeta";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLessons().map(({ slug }) => ({ slug }));
}

async function readLesson(params) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return lesson;
}

export async function generateMetadata({ params }) {
  const lesson = await readLesson(params);
  const standard = getStandard(lesson.standard);
  return createPageMetadata(`/lessons/${lesson.slug}`, {
    title: `${lesson.title} · 중${lesson.grade} SEL 수업 · Lev Lab 레브랩`,
    description: `중학교 ${lesson.grade}학년 SEL 수업 ‘${lesson.title}’. [9사회정서${lesson.standard}] ${standard?.skill || "사회정서기술"} 성취기준과 연결된 수업입니다.`,
  }, { index: lesson.status === "published" });
}

export default async function Page({ params }) {
  const lesson = await readLesson(params);
  return <LessonPage slug={lesson.slug} />;
}
