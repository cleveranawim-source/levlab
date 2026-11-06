import { notFound } from "next/navigation";
import { StandardPage } from "../../../features/curriculum";
import { getStandards, getStandard } from "../../../features/curriculum/data";
import { createPageMetadata } from "../../../lib/pageMeta";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStandards().map(({ code }) => ({ code }));
}

async function readStandard(params) {
  const { code } = await params;
  const standard = getStandard(code);
  if (!standard) notFound();
  return standard;
}

export async function generateMetadata({ params }) {
  const standard = await readStandard(params);
  return createPageMetadata(`/standards/${standard.code}`, {
    title: `[9사회정서${standard.code}] ${standard.skill} · Lev Lab 레브랩`,
    description: standard.text || `서울 사회정서교육 ${standard.area} 영역의 ${standard.skill} 성취기준과 관련 SEL 수업을 살펴보세요.`,
  });
}

export default async function Page({ params }) {
  const standard = await readStandard(params);
  return <StandardPage code={standard.code} />;
}
