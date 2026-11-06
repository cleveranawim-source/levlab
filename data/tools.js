// 인터랙티브 SEL 라이브러리 — 콘텐츠 목록
// url 이 빈 문자열이면 "곧 공개"로 표시됩니다.
// standards: 서울 사회정서교육 중학교 성취기준 코드 뒷자리(예 "02-01" = [9사회정서02-01]). 앱 설명으로 잡은 초안이며 수업 연결 시 확정.
// privacy: 교사가 수업 전에 알아야 할 데이터 처리 한 줄.
// 실시간 데이터베이스를 쓰는 앱(말하지 않은 이유, 마음의 방)은 권한 구조 보강 뒤 등재한다.
// "AI 수업"은 교사 비밀번호·초대 코드로 수업방을 여는 45분 수업 앱. 외부 학교는 레브랩에 개설을 신청한다(AI 비용·학급 격리 관리).
// 교실 코드 모드에서 Firebase 를 쓰는 게임(마음 점프, 밤길 라이더, 공동체 빌더스)도 외부 학교 공개 전 규칙 점검 대상.
export const TOOL_TYPES = ["전체", "AI 수업", "게임", "자기 점검", "활동 도구"];
export const TOOL_AUDIENCES = ["전체", "학생", "교사"];

export const DOMAIN_COLOR = {
  "자기": "var(--self)",
  "대인관계": "var(--inter)",
  "공동체": "var(--comm)",
  "마음건강": "var(--well)",
  "전체": "var(--brand)",
};

export const TOOLS = [
  { n: "깡통이를 가르쳐라", d: "감정을 모르는 로봇 깡통이에게 ‘괜찮아’의 속뜻, 해결책보다 먼저 할 말을 가르치며 공감을 정리하는 중1 45분 AI 수업.", t: "AI 수업", dom: "대인관계", aud: "학생", em: "🤖",
    standards: ["02-01"], privacy: "학생은 출석번호만 입력 · 깡통이와의 대화 글은 AI(Anthropic)로 보내 답을 만듦, 위기·욕설 글은 보내지 않음 · 교실 기록 8시간 뒤 삭제 · 수업방 개설은 레브랩에 신청", img: "/images/apps/ai-sel-robot.webp", url: "https://ai-sel.vercel.app/" },
  { n: "AI의 위로 vs 친구의 위로", d: "가상의 친구 하린이에게 위로 답장을 쓰고, AI 답장과 섞어 눈 가리고 고르며 ‘친구만 할 수 있는 위로’를 찾는 중1 45분 AI 수업.", t: "AI 수업", dom: "대인관계", aud: "학생", em: "💌",
    standards: ["02-01"], privacy: "학생은 출석번호만 입력 · 학생 답장은 AI 답장 만들기에 쓰지 않음(이름 없이 안전 살피기만) · 교실 기록 8시간 뒤 삭제 · 수업방 개설은 레브랩에 신청", img: "/images/apps/ai-sel-comfort.webp", url: "https://ai-sel.vercel.app/" },
  { n: "마음 연습실", d: "AI가 친구의 짧은 답장을 자신 있게 잘못 읽는 장면에서 출발해, AI를 가르치고 AI 친구에게 서운한 마음을 전해 보는 중1 45분 수업. 학생 태블릿·선생님 휴대폰·교실 칠판 세 화면으로 진행합니다.", t: "AI 수업", dom: "대인관계", aud: "학생", em: "💬",
    standards: ["02-01", "02-04"], privacy: "학생 이름·로그인 없음, 무작위 별명 · 학생 글은 AI로 보내 답장을 만듦 · 기록은 마지막 활동 하루 뒤 삭제 · 수업방 개설은 초대 코드가 필요해 레브랩에 신청", img: "/images/apps/sel-ai-lesson.webp", url: "https://sel-ai-lesson.vercel.app/" },
  { n: "마음 점프", d: "SEL 네 영역을 담은 2D 플랫포머. 관문마다 감정 미션을 풀며 스테이지를 넘어갑니다.", t: "게임", dom: "전체", aud: "학생", em: "🕹️",
    standards: [], privacy: "교실 코드를 넣으면 닉네임·진행 기록을 온라인 저장소(Firebase)에 저장 · 넣지 않으면 전송 없음", img: "/images/apps/mind-jump.webp", url: "https://cleveranawim-source.github.io/mind-jump" },
  { n: "마음의 밤길 라이더", d: "속도가 곧 마음의 온도. 1인칭으로 밤길을 달리며 감정의 각성을 몸으로 조절해 봅니다.", t: "게임", dom: "자기", aud: "학생", em: "🌙",
    standards: ["01-02", "03-02"], privacy: "교실 코드를 넣으면 닉네임·진행 기록·성찰 글을 온라인 저장소(Firebase)에 저장 · 넣지 않으면 전송 없음", img: "/images/apps/mind-rider.webp", url: "https://cleveranawim-source.github.io/mind-rider" },
  { n: "마음의 협곡", d: "그림자 군단에 맞서 마음의 힘으로 협곡을 지키는 협동 전략 게임. 긴장 속 호흡과 협력을 연습합니다.", t: "게임", dom: "마음건강", aud: "학생", em: "⚔️",
    standards: ["01-04", "03-02"], privacy: "", img: "/images/apps/mind-rift.webp", url: "" },
  { n: "감정 캐치", d: "떨어지는 감정을 받아내며 감정 조절을 연습하는 리듬 게임.", t: "게임", dom: "자기", aud: "학생", em: "🎵",
    standards: ["01-02"], privacy: "서버 전송 없음", img: "/images/apps/emotion-catch.webp", url: "https://cleveranawim-source.github.io/emotion-catch" },
  { n: "공동체 빌더스", d: "안개에 갇힌 마을을 깨우는 3D 탐험. 16개 공동체 미션으로 듣기·잇기·함께 짓기를 연습합니다.", t: "게임", dom: "공동체", aud: "학생", em: "🧱",
    standards: ["03-01", "03-02"], privacy: "교실 코드를 넣으면 닉네임·진행 기록을 온라인 저장소(Firebase)에 저장 · 넣지 않으면 전송 없음", img: "/images/apps/community-builders.webp", url: "https://cleveranawim-source.github.io/Community_builders" },
  { n: "뒤센 미소 대회", d: "입과 눈이 함께 웃는 ‘뒤센 미소’의 원리를 카메라로 실험해 보는 교실 놀이. 감정을 판정하지 않습니다.", t: "게임", dom: "자기", aud: "학생", em: "😊",
    standards: ["01-01"], privacy: "카메라 사용 · 영상은 기기 안에서만 처리", img: "/images/apps/real-smile.webp", url: "https://cleveranawim-source.github.io/real_smile/" },
  { n: "감정 내려놓기", d: "내 감정을 안전하게 표현하고, 친구의 여유도 살피는 법을 배우는 교실 활동.", t: "활동 도구", dom: "대인관계", aud: "학생", em: "🫧",
    standards: ["02-03"], privacy: "글은 저장·전송 없음 · 반 집계는 감정 종류별 개수만", img: "/images/apps/emotion-release.webp", url: "https://cleveranawim-source.github.io/emotion-release" },
  { n: "관점의 방", d: "추리 형식으로 다른 사람의 관점으로 옮겨 서 보는 45분 수업 활동.", t: "활동 도구", dom: "대인관계", aud: "학생", em: "🔍",
    standards: ["02-02"], privacy: "서버 전송 없음", img: "/images/apps/perspective-room.webp", url: "https://cleveranawim-source.github.io/perspective-room" },
  { n: "행복한 삶을 위한 가치관", d: "밸런스 게임과 가치 카드로 내가 바라는 행복한 삶을 그려 보는 수업 앱. 교사용 결과판이 함께 있습니다.", t: "활동 도구", dom: "마음건강", aud: "학생", em: "🌤️",
    standards: ["04-01"], privacy: "고른 답만 익명으로 결과판에 전송 · 글·사진은 기기에만", img: "/images/apps/happy-values.webp", url: "https://cleveranawim-source.github.io/happy-values/" },
  { n: "마음 렌즈", d: "표정을 참고용 힌트로만 보여 주고, 내 감정은 스스로 골라 기록하는 자기인식 도구.", t: "자기 점검", dom: "자기", aud: "학생", em: "🪞",
    standards: ["01-01"], privacy: "카메라 사용 · 감정 기록과 고른 얼굴 캡처가 이 기기 브라우저에 남음 · 공용 기기는 ‘다음 사람’으로 지우기", img: "/images/apps/emotion-lens.webp", url: "https://cleveranawim-source.github.io/emotion_lens/" },
  { n: "분노버튼 측정소", d: "나를 화나게 하는 버튼을 살펴보고, 실천 모드로 조절 방법을 연습합니다.", t: "자기 점검", dom: "자기", aud: "학생", em: "🔥",
    standards: ["01-03"], privacy: "서버 전송 없음 · 결과와 연습 기록은 이 기기 브라우저에 남음", img: "/images/apps/anger-button.webp", url: "https://anger-button.vercel.app/" },
  { n: "미래진로 나침반", d: "직업 하나를 고르는 대신 진로 가설과 다음 행동을 찾는 자기 점검 2종. 표준화 검사가 아닙니다.", t: "자기 점검", dom: "자기", aud: "학생", em: "🧭",
    standards: ["01-06"], privacy: "서버 전송 없음 · 탭을 닫으면 사라짐", img: "/images/apps/career-compass.webp", url: "https://cleveranawim-source.github.io/career-compass/" },
  { n: "선생님의 마음안부", d: "교사를 위한 마음건강 셀프체크와 맞춤 리포트. 진단이 아니라 회복 과제를 보여 줍니다.", t: "자기 점검", dom: "마음건강", aud: "교사", em: "🌱",
    standards: [], privacy: "서버 전송 없음 · 응답과 결과는 화면에서만 처리", img: "/images/apps/mind-check-in.webp", url: "https://cleveranawim-source.github.io/mind-check-in" },
  { n: "선생님의 분노버튼 연구소", d: "교사가 자신의 분노버튼을 살펴보고 마음 안정 버튼과 캐릭터를 만들어 보는 연수용 앱.", t: "자기 점검", dom: "마음건강", aud: "교사", em: "🧯",
    standards: [], privacy: "서버 전송 없음", img: "/images/apps/teacher-anger.webp", url: "https://teacher-anger.vercel.app" },
];

