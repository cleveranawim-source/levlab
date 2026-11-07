// A modest safety net, not moderation by a person. Teachers can hide any post.
const blockedWords = new RegExp("씨발|시발|씨빨|씹새|개새끼|새끼야|병신|븅신|좆|지랄|꺼져|닥쳐|죽어|죽여|한남충|한녀충|맘충|틀딱|찐따|장애인새끼|ㅅㅂ|ㅆㅂ|ㅂㅅ".normalize("NFKC"), "iu");
const privatePatterns = [
  /[A-Z0-9._%+-]+\s*(?:@|골뱅이)\s*[A-Z0-9.-]+\s*(?:\.|닷)\s*[A-Z]{2,}/iu,
  /(?:\+?82[\s().-]*)?0?1[016789](?:[\s().-]*\d){7,8}/u,
  /0[2-6]\d?(?:[\s().-]*\d){7,8}/u,
  /\d{6}\s*[-–]\s*[1-4]\d{6}/u,
  /[가-힣]{2,}(?:대로|로|길)\s*\d+(?:\s*[-–]\s*\d+)?/u,
  /[가-힣]{2,}(?:동|읍|면|리)\s*\d+(?:\s*[-–]\s*\d+)?/u,
  /\d{1,4}\s*동\s*\d{1,4}\s*호/u,
];

export function cleanPost(input, max = 60) {
  if (typeof input !== "string") return null;
  const value = input.normalize("NFKC").replace(/[\p{Cc}\p{Cf}]/gu, "").replace(/\s+/gu, " ").trim();
  if (!value || [...value].length > max) return null;
  const compact = value.replace(/[\s\p{P}\p{S}]/gu, "");
  if (blockedWords.test(compact) || privatePatterns.some((pattern) => pattern.test(value))) return null;
  return value;
}
