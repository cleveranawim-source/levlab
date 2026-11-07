// 차시 자료 꾸러미 — 빌드 때 public/ 에 실제로 있는 파일만 보여 준다
import fs from "node:fs";
import path from "node:path";

const KINDS = [
  { file: (s) => `/files/slides/${s}.pptx`, label: "수업 슬라이드", type: "PPT", note: "수업 화면과 같은 내용, 발표자 노트에 교사 메모" },
  { file: (s) => `/files/worksheets/${s}-worksheet.pdf`, label: "활동지", type: "PDF", note: "A4 2쪽, 바로 인쇄" },
  { file: (s) => `/files/worksheets/${s}-worksheet.docx`, label: "활동지 (고쳐 쓰기용)", type: "Word", note: "우리 반에 맞게 고쳐 쓰기" },
  { file: (s) => `/files/worksheets/${s}-cards.pdf`, label: "이야기 카드", type: "PDF", note: "A4 1장, 잘라서 모둠에 한 장씩" },
  { file: (s) => `/video/lessons/${s}.mp4`, label: "여는 영상", type: "MP4", note: "도입에 트는 짧은 영상" },
];
const size = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export function lessonFiles(slug) {
  if (!/^g[1-3]-\d{2}$/.test(slug)) return [];
  return KINDS.flatMap((k) => {
    const href = k.file(slug);
    const p = path.join(process.cwd(), "public", href);
    return fs.existsSync(p) ? [{ href, label: k.label, type: k.type, note: k.note, meta: size(fs.statSync(p).size) }] : [];
  });
}
