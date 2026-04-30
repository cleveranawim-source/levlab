// Lev Lab Design Tokens
// Teal-primary brand system with semantic color mapping

export const COLORS = {
  // Brand — Teal
  teal50: "#E1F5EE",
  teal100: "#9FE1CB",
  teal200: "#5DCAA5",
  teal400: "#1D9E75",
  teal600: "#0F6E56",
  teal800: "#085041",
  teal900: "#04342C",

  // Accent — Purple (자기 영역)
  purple50: "#EEEDFE",
  purple100: "#CECBF6",
  purple600: "#534AB7",
  purple800: "#3C3489",

  // Accent — Coral (대인관계 영역)
  coral50: "#FAECE7",
  coral100: "#F5C4B3",
  coral600: "#993C1D",
  coral800: "#712B13",

  // Accent — Blue (마음건강 영역)
  blue50: "#E6F1FB",
  blue100: "#B5D4F4",
  blue600: "#185FA5",
  blue800: "#0C447C",

  // Accent — Amber
  amber50: "#FAEEDA",
  amber100: "#FAC775",
  amber600: "#854F0B",
  amber800: "#633806",

  // Neutral
  gray50: "#F7F6F3",
  gray100: "#ECEAE3",
  gray200: "#D3D1C7",
  gray600: "#5F5E5A",
  gray800: "#2C2C2A",
};

// SEL 4개 영역 컬러 매핑
export const SEL_DOMAINS = [
  {
    key: "self",
    name: "자기",
    desc: "자기이해 · 자기관리",
    bg: COLORS.purple50,
    accent: COLORS.purple600,
    color: COLORS.purple800,
  },
  {
    key: "interpersonal",
    name: "대인관계",
    desc: "공감 · 소통 · 갈등해결",
    bg: COLORS.coral50,
    accent: COLORS.coral600,
    color: COLORS.coral800,
  },
  {
    key: "community",
    name: "공동체",
    desc: "책임 · 시민성 · 협력",
    bg: COLORS.teal50,
    accent: COLORS.teal600,
    color: COLORS.teal800,
  },
  {
    key: "wellbeing",
    name: "마음건강",
    desc: "스트레스 · 회복탄력성",
    bg: COLORS.blue50,
    accent: COLORS.blue600,
    color: COLORS.blue800,
  },
];

// 내비게이션 항목
export const NAV_ITEMS = [
  { label: "소개", path: "/about" },
  { label: "프로그램", path: "/programs" },
  { label: "자료실", path: "/resources" },
  { label: "인사이트", path: "/insights" },
  { label: "문의·협업", path: "/contact" },
];

// 소셜 링크
export const SOCIAL_LINKS = [
  { label: "Instagram", url: "#" },
  { label: "YouTube (TOV)", url: "#" },
  { label: "Newsletter", url: "#" },
];
