import Link from "next/link";
import PageShell from "../components/PageShell";
import LessonSearch from "../components/LessonSearch";

export default function NotFoundPage() {
  return (
    <PageShell title="ERR! 이 페이지는 못 찾았어요" sub="주소가 바뀌었거나 아직 공개하지 않은 페이지예요. 찾던 수업이 있었다면 교실에서 쓰는 말로 찾아보세요.">
      <pre className="nf-term" aria-hidden="true"><code>{`> open(이_페이지)
ERR! 404  길을 잃었어요
// 괜찮아요. 길 잃은 마음도 이름을 붙이면 다시 찾을 수 있어요.
> 다시_해_볼까요?`}<span className="nf-cursor">▌</span></code></pre>
      <div className="nf-search"><LessonSearch variant="page" /></div>
      <div className="not-found-actions">
        <Link className="btn btn-solid" href="/">홈으로 돌아가기</Link>
        <Link className="btn btn-ghost" href="/curriculum">SEL 수업 보기</Link>
      </div>
    </PageShell>
  );
}
