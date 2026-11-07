import PageShell from "../components/PageShell";
import ToolsGallery from "../components/ToolsGallery";
import TeaserReel from "../components/TeaserReel";
import { TOOLS } from "../data/tools";

const PUBLIC_COUNT = TOOLS.filter((t) => t.url).length;

export default function ToolsPage() {
  return (
    <PageShell title="플레이로 배우는 SEL 라이브러리"
      sub="AI 수업 · 게임 · 자기 점검 · 활동 도구 — 학생이 직접 만지고 플레이하며 배우는 레브랩의 인터랙티브 SEL 콘텐츠. 학생 계정 없이 웹 브라우저에서 바로 열리고, 서울 사회정서교육 네 영역에 맞춰 만들었습니다.">
      <p className="library-facts">공개 콘텐츠 {PUBLIC_COUNT}개 <span aria-hidden="true">·</span> SEL 4영역 <span aria-hidden="true">·</span> 학생 로그인 없이</p>
      <TeaserReel />
      <h2 className="sr-only">SEL 콘텐츠</h2>
      <ToolsGallery full />
    </PageShell>
  );
}
