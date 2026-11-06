import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function NotFoundPage() {
  return (
    <PageShell title="페이지를 찾을 수 없어요" sub="주소가 변경되었거나 더 이상 제공하지 않는 페이지예요. 주소를 확인하거나 아래에서 다시 시작해 주세요.">
      <div className="not-found-actions">
        <Link className="btn btn-solid" to="/">홈으로 돌아가기</Link>
        <Link className="btn btn-ghost" to="/tools">SEL 콘텐츠 살펴보기</Link>
      </div>
    </PageShell>
  );
}
