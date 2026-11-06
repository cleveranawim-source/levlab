// Global site data
export const CATCHPHRASE = "마음이 배움의 중심이 되는 시간";
export const SITE_URL = "https://www.levlab.co.kr";

// 자료실·인사이트는 실제 자료·글이 생길 때 다시 메뉴에 올린다.
export const NAV_ITEMS = [
  { label: "소개", path: "/about" },
  { label: "SEL 수업", path: "/curriculum" },
  { label: "SEL 콘텐츠", path: "/tools" },
  { label: "연수·워크북", path: "/programs" },
  { label: "문의·협업", path: "/contact" },
];

export const CONTACT_EMAIL = "levlabkr@gmail.com";
export const YOUTUBE_URL = "https://www.youtube.com/channel/UCBP83tCojDn0M-HU7s_q7ow";
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mnjwnqaa";

// 커리큘럼 규모 (레브랩 수정 지도안 기준)
export const CURRICULUM = {
  grades: 3,
  lessonsPerGrade: 34,
  totalLessons: 102,
  coreLessonsPerGrade: 15,
  skills: 17,
  domains: 4,
};

// 폼 제출 기록에 함께 남기는 동의 문구 판 (개인정보 처리방침 시행일과 맞춘다)
export const CONSENT_VERSION = "개인정보 수집·이용 동의 (2026-11-06판)";
export const XFER_CONSENT_VERSION = "개인정보 국외 이전 동의 (2026-11-06판)";
