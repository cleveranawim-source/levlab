// 수업 찾기 검색창 (서버 쪽): 45차시에서 작은 색인만 만들어 브라우저로 보낸다
import { getLessons } from "../features/curriculum/data";
import { buildIndex } from "../features/search/searchIndex";
import LessonSearchBox from "./LessonSearchBox";

export default function LessonSearch({ variant = "page" }) {
  return <LessonSearchBox index={buildIndex(getLessons())} variant={variant} />;
}
