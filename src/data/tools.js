// 인터랙티브 SEL 라이브러리 — 콘텐츠 목록
// url 이 빈 문자열이면 "곧 공개"로 표시됩니다.
export const TOOL_TYPES = ["전체", "게임", "자기진단", "활동 도구"];
export const TOOL_AUDIENCES = ["전체", "학생", "교사"];

export const DOMAIN_COLOR = {
  "자기": "var(--self)",
  "대인관계": "var(--inter)",
  "공동체": "var(--comm)",
  "마음건강": "var(--well)",
  "전체": "var(--brand)",
};

export const TOOLS = [
  { n: "마음 점프", d: "SEL 4역량을 담은 마리오식 2D 플랫포머. 관문마다 감정 미션을 풀며 스테이지를 클리어합니다.", t: "게임", dom: "전체", aud: "학생", em: "🕹️", url: "https://cleveranawim-source.github.io/mind-jump" },
  { n: "마음의 밤길 라이더", d: "1인칭 라이딩으로 달리며 SEL 네 영역을 여행하는 밤길 게임.", t: "게임", dom: "전체", aud: "학생", em: "🌙", url: "https://cleveranawim-source.github.io/mind-rider" },
  { n: "마음의 협곡", d: "틸트 관리와 심호흡을 배우는 LOL 스타일 SEL MOBA.", t: "게임", dom: "마음건강", aud: "학생", em: "⚔️", url: "" },
  { n: "감정 캐치", d: "떨어지는 감정을 받아내며 감정 조절을 연습하는 리듬 게임.", t: "게임", dom: "자기", aud: "학생", em: "🎵", url: "https://cleveranawim-source.github.io/emotion-catch" },
  { n: "공동체 빌더스", d: "복셀 세계를 탐험하며 공동체 역량을 키우는 3D 미션 게임.", t: "게임", dom: "공동체", aud: "학생", em: "🧱", url: "https://cleveranawim-source.github.io/Community_builders" },
  { n: "뒤센 미소 대회", d: "웹캠으로 ‘진짜 미소(뒤센 미소)’를 채점하는 SEL 키오스크 게임.", t: "게임", dom: "자기", aud: "학생", em: "😊", url: "https://cleveranawim-source.github.io/real_smile/" },
  { n: "감정 내려놓기", d: "“친구는 감정쓰레기통이 아니에요” — 감정을 건강하게 내려놓는 교실 활동.", t: "활동 도구", dom: "대인관계", aud: "학생", em: "🫧", url: "https://cleveranawim-source.github.io/emotion-release" },
  { n: "관점의 방", d: "추리 형식으로 타인의 관점을 전환해 보는 45분 활동.", t: "활동 도구", dom: "대인관계", aud: "학생", em: "🔍", url: "https://cleveranawim-source.github.io/perspective-room" },
  { n: "학급 관계지도", d: "교우관계 설문을 소시오메트리로 분석하는 교사용 도구.", t: "활동 도구", dom: "대인관계", aud: "교사", em: "🕸️", url: "https://mjms-classmap.vercel.app" },
  { n: "마음 안부", d: "교사를 위한 6영역 마음건강 셀프체크와 맞춤 리포트.", t: "자기진단", dom: "마음건강", aud: "교사", em: "🌱", url: "https://cleveranawim-source.github.io/mind-check-in" },
  { n: "마음 렌즈", d: "표정을 힌트 삼아 내 감정을 확인하고 기록하는 자기인식 도구.", t: "자기진단", dom: "자기", aud: "학생", em: "🪞", url: "https://cleveranawim-source.github.io/emotion_lens/" },
  { n: "분노버튼 측정소", d: "나의 분노 유형을 진단하고 실천 모드로 조절을 연습.", t: "자기진단", dom: "자기", aud: "학생", em: "🔥", url: "https://anger-button.vercel.app/" },
];
