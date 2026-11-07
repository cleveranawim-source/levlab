// 수업 찾기 — 교실 말(“친구랑 다퉜을 때”)을 사회정서기술로 잇는 작은 검색. 서버·브라우저 공용.

/** 교실에서 쓰는 말 → 사회정서기술. 앞의 낱말 조각이 검색어에 들어 있으면 뒤의 기술에 점수를 준다. */
export const PHRASES = [
  [["화나", "화날", "화가", "화난", "분노", "짜증", "열받", "빡치", "욱"], ["감정 조절하기", "행동 조절하기"]],
  [["싸움", "싸웠", "싸우", "다퉜", "다툼", "다투", "갈등", "말다툼", "삐졌", "절교"], ["갈등 해결하기"]],
  [["중재", "말리"], ["갈등 해결하기"]],
  [["거절", "싫다고", "안 돼", "안돼", "부탁", "요청"], ["의사소통하기", "건강한 관계 형성하기"]],
  [["경계", "선 긋", "끌려"], ["건강한 관계 형성하기"]],
  [["따돌림", "왕따", "무시", "괴롭"], ["건강한 관계 형성하기", "갈등 해결하기", "공감하기"]],
  [["말하기", "대화", "나전달", "나-전달", "표현", "말투"], ["의사소통하기"]],
  [["스트레스", "시험", "불안", "긴장", "걱정", "압박"], ["스트레스 대처하기"]],
  [["우울", "힘들", "슬프", "슬픔", "지쳤", "지침", "무기력", "외로"], ["마음건강 어려움에 대처하기", "마음건강 이해하기"]],
  [["도움", "상담", "손 뻗", "기댈"], ["마음건강 어려움에 대처하기"]],
  [["행복", "마음건강", "정신건강", "멘탈"], ["마음건강 이해하기"]],
  [["공감", "위로", "들어주", "경청"], ["공감하기"]],
  [["자존감", "자신감", "강점", "약점", "나다움", "정체성", "효능감", "할 수 있"], ["자아존중감 형성하기"]],
  [["포기", "실패", "회복", "다시 일어", "좌절", "작심삼일"], ["회복탄력성 높이기"]],
  [["모둠", "조별", "협동", "협력", "팀", "무임승차"], ["협력하기"]],
  [["학급", "우리 반", "우리반", "공동체", "소속", "학교"], ["공동체와 연결하기"]],
  [["결정", "선택", "책임"], ["책임 있는 의사 결정하기"]],
  [["문제 해결", "해결 방안", "아이디어"], ["문제 해결하기"]],
  [["관점", "오해", "입장", "다르게", "생각 차이"], ["타인의 관점 이해하기"]],
  [["감정 이름", "기분", "감정 인식", "알아차"], ["감정 인식하기"]],
  [["후회", "충동", "참기", "습관"], ["행동 조절하기"]],
];

const PARTICLE = /(을|를|이|가|은|는|에|에서|으로|로|와|과|랑|이랑|하고|할|한|하는|하기|때|법|방법|수업|하려면|해요|요)$/;
const norm = (s) => (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
const squash = (s) => norm(s).replace(/\s/g, "");

/** 빌드 때 만드는 작은 색인(본문 전체를 보내지 않는다) */
export function buildIndex(lessons) {
  return lessons.map((l) => ({
    s: l.slug, g: l.grade, a: l.area, k: l.skill, t: l.title, q: l.keyQuestion || "",
    x: squash([l.title, l.skill, l.keyQuestion, ...(l.objectives || [])].join(" ")),
  }));
}

export function search(index, raw, limit = 6) {
  const q = norm(raw);
  if (!q) return [];
  const qs = q.replace(/\s/g, "");
  const grade = /(중\s?|^)([123])\s?학년|중\s?([123])/.exec(q);
  const g = grade ? Number(grade[2] || grade[3]) : null;
  const boosted = new Map();
  for (const [keys, skills] of PHRASES) {
    if (keys.some((k) => qs.includes(k.replace(/\s/g, "")))) skills.forEach((sk, i) => boosted.set(sk, Math.max(boosted.get(sk) || 0, i === 0 ? 6 : 4)));
  }
  const tokens = q.split(" ").map((t) => t.replace(PARTICLE, "")).filter((t) => t.length >= 2 && !/^중?[123]학년$|^중[123]$/.test(t));
  const scored = index.map((it) => {
    let sc = boosted.get(it.k) || 0;
    for (const t of tokens) {
      if (squash(it.t).includes(t)) sc += 4;
      else if (squash(it.k).includes(t)) sc += 3;
      else if (it.x.includes(t)) sc += 1.5;
    }
    if (sc > 0 && g) sc += it.g === g ? 3 : -2;
    return { it, sc };
  }).filter((r) => r.sc > 0);
  scored.sort((a, b) => b.sc - a.sc || a.it.g - b.it.g);
  return scored.slice(0, limit).map((r) => r.it);
}

export const EXAMPLES = ["화날 때 멈추는 법", "친구랑 다퉜을 때", "거절을 잘 못해요", "시험 스트레스", "모둠에서 무임승차", "중3 갈등 중재", "자존감", "힘들 때 도움 요청"];
