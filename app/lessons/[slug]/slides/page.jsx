import { notFound } from "next/navigation";
import { getLessonSlides, getSlideSlugs } from "../../../../features/slides/data";
import SlidePlayer from "../../../../components/slides/SlidePlayer";

export const dynamicParams = false;
export function generateStaticParams() {
  return getSlideSlugs().map((slug) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const deck = getLessonSlides(slug);
  if (!deck) notFound();
  return {
    title: `${deck.lesson.title} · 수업 화면 · Lev Lab 레브랩`,
    description: `중${deck.lesson.grade} ${deck.lesson.title} 수업 화면`,
    robots: { index: false, follow: false },
    alternates: { canonical: `/lessons/${slug}/slides` },
  };
}
export default async function SlidesPage({ params }) {
  const { slug } = await params;
  const deck = getLessonSlides(slug);
  if (!deck) notFound();
  return <SlidePlayer deck={deck} />;
}
