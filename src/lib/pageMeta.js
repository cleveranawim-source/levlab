import { useEffect } from "react";

const ORIGIN = "https://www.levlab.co.kr";
const page = (title, description) => ({ title: `${title} · Lev Lab 레브랩`, description });
export const PAGE_META = {
  "/": {
    title: "Lev Lab · 레브랩 — 마음이 배움의 중심이 되는 시간",
    description: "서울 사회정서교육 4영역·17개 사회정서기술에 맞춘 중학교 SEL 수업과 웹앱. 마음이 배움의 중심이 되는 시간을 만드는 레브랩입니다.",
  },
  "/about": page("소개", "마음이 배움의 중심이 되는 시간을 만드는 교육 콘텐츠 연구소, 레브랩의 철학과 이야기를 소개합니다."),
  "/tools": page("SEL 콘텐츠", "게임·자기 점검·활동 도구로 사회정서기술을 연습하세요. 학생과 교사를 위한 SEL 웹앱을 유형과 대상별로 찾아볼 수 있습니다."),
  "/programs": page("SEL 수업", "서울 사회정서교육 17개 사회정서기술에 맞춘 중학교 3년 SEL 수업. 학년별 34차시 과정과 먼저 공개하는 핵심 15차시, 교사 연수를 안내합니다."),
  "/resources": page("자료실", "레브랩 사회정서교육 수업 자료의 공개 준비 현황과 자료 문의 방법을 안내합니다."),
  "/insights": page("인사이트", "레브랩의 사회정서교육 이야기와 현장 기록을 준비하고 있습니다."),
  "/contact": page("문의·협업", "SEL 수업, 교사 연수, 콘텐츠 협업에 관해 레브랩에 문의하세요."),
  "/privacy": page("개인정보 처리방침", "레브랩 사이트의 개인정보 수집·이용과 문의 정보 처리에 관한 안내입니다."),
};
const NOT_FOUND = page("페이지를 찾을 수 없어요", "요청하신 페이지를 찾을 수 없습니다. 레브랩 홈이나 SEL 콘텐츠에서 다시 시작해 주세요.");

function setMeta(attribute, name, content) {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.append(tag);
  }
  tag.setAttribute("content", content);
}

export function usePageMeta(pathname) {
  useEffect(() => {
    // React Router accepts a trailing slash and case-insensitive route matches.
    const path = pathname.replace(/\/+$/, "").toLowerCase() || "/";
    const known = Object.prototype.hasOwnProperty.call(PAGE_META, path);
    const meta = known ? PAGE_META[path] : NOT_FOUND;
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:url", `${ORIGIN}${path}`);
    setMeta("name", "robots", known ? "index, follow" : "noindex, follow");
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = `${ORIGIN}${path}`;
  }, [pathname]);
}
