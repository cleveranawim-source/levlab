export const ORIGIN = "https://www.levlab.co.kr";
const page = (title, description) => ({ title: `${title} · Lev Lab 레브랩`, description });
export const PAGE_META = {
  "/": {
    title: "Lev Lab · 레브랩 — 마음이 배움의 중심이 되는 시간",
    description: "서울 사회정서교육 4영역·17개 사회정서기술에 맞춘 중학교 SEL 수업과 웹앱. 마음이 배움의 중심이 되는 시간을 만드는 레브랩입니다.",
  },
  "/about": page("소개", "마음이 배움의 중심이 되는 시간을 만드는 교육 콘텐츠 연구소, 레브랩의 철학과 이야기를 소개합니다."),
  "/tools": page("SEL 콘텐츠", "게임·자기 점검·활동 도구로 사회정서기술을 연습하세요. 학생과 교사를 위한 SEL 웹앱을 유형과 대상별로 찾아볼 수 있습니다."),
  "/programs": page("연수·워크북", "교사 연수, 학부모 특강, 필사 워크북 「마음의 한줄」 등 레브랩의 사회정서교육 프로그램을 안내합니다."),
  "/resources": page("자료실", "레브랩 사회정서교육 수업 자료의 공개 준비 현황과 자료 문의 방법을 안내합니다."),
  "/insights": page("인사이트", "레브랩의 사회정서교육 이야기와 현장 기록을 준비하고 있습니다."),
  "/contact": page("문의·협업", "SEL 수업, 교사 연수, 콘텐츠 협업에 관해 레브랩에 문의하세요."),
  "/privacy": page("개인정보 처리방침", "레브랩 사이트의 개인정보 수집·이용과 문의 정보 처리에 관한 안내입니다."),
};
export const NOT_FOUND = page("페이지를 찾을 수 없어요", "요청하신 페이지를 찾을 수 없습니다. 레브랩 홈이나 SEL 콘텐츠에서 다시 시작해 주세요.");


/** Server metadata shared by statically generated route files. */
export function createPageMetadata(path, { title, description }, { index = true } = {}) {
  const url = new URL(path, ORIGIN).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index, follow: index },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      title,
      description,
      url,
      images: [{ url: `${ORIGIN}/img/hero.jpg`, alt: "Lev Lab 레브랩" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${ORIGIN}/img/hero.jpg`] },
  };
}
