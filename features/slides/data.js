// Server-only build-time source for the browser deck and lesson resource links.
import fs from "node:fs";
import path from "node:path";
import { getLesson, getLessonsByGrade } from "../curriculum/data";

const directory = path.join(process.cwd(), "content/slides");
const validSlug = (slug) => typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
const deckPath = (slug) => path.join(directory, `${slug}.json`);
export const SLIDE_STAGES = ["도입", "이해하기", "연습하기", "적용하기", "정리"];

export function hasLessonSlides(slug) {
  return validSlug(slug) && fs.existsSync(deckPath(slug));
}

export function getSlideSlugs() {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -5)).filter((slug) => validSlug(slug) && getLesson(slug)).sort();
}

function existingAsset(src) {
  const file = typeof src === "string" && src.startsWith("/")
    ? path.resolve(process.cwd(), "public", `.${src}`) : null;
  const publicRoot = path.resolve(process.cwd(), "public") + path.sep;
  return file?.startsWith(publicRoot) && fs.existsSync(file) ? src : null;
}

function existingImage(image) {
  return image ? { ...image, src: existingAsset(image.src) } : null;
}

export function getSlideDownload(slug) {
  if (!validSlug(slug)) return null;
  const href = `/files/slides/${slug}.pptx`;
  const file = path.join(process.cwd(), "public", href);
  if (!fs.existsSync(file)) return null;
  const size = fs.statSync(file).size;
  return { href, label: "PPT 받기 (.pptx)", meta: size >= 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB` };
}

export function getLessonSlides(slug) {
  const lesson = getLesson(slug);
  if (!lesson || !hasLessonSlides(slug)) return null;
  const source = JSON.parse(fs.readFileSync(deckPath(slug), "utf8"));
  const nextLesson = getLessonsByGrade(lesson.grade).find((candidate) => candidate.coreOrder > lesson.coreOrder) || null;
  const lessonArt = (item) => existingImage({ src: `/images/lessons/${item.slug}.webp`, alt: `「${item.title}」 수업 장면 그림` });
  const slides = (Array.isArray(source) ? source : source.slides).filter((slide) => slide.type !== "next" || nextLesson).map((slide) => ({
    ...slide,
    stage: slide.stage || (["next", "end"].includes(slide.type) ? "정리" : "도입"),
    image: existingImage(slide.image),
    ...(slide.video ? { video: { ...slide.video, src: existingAsset(slide.video.src), poster: existingAsset(slide.video.poster) } } : {}),
    ...(slide.type === "goals" ? { goals: slide.goals?.length ? slide.goals : lesson.objectives } : {}),
  }));
  return { lesson, nextLesson, image: lessonArt(lesson), nextImage: nextLesson ? lessonArt(nextLesson) : null, slides };
}
