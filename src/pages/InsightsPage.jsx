import PageShell, { ComingSoon } from "../components/PageShell";

export default function InsightsPage() {
  return (
    <PageShell
      eyebrow="Insights"
      title="마음을 읽는 교실의 기록"
      sub="SEL 칼럼, 현장 이야기, 교목 에세이. 22년째 이어온 아침의 관찰을 나눕니다."
    >
      <ComingSoon note="블로그 글 목록과 개별 글 페이지를 준비 중입니다. (블로그 구축 방식 확정 후 연동)" />
    </PageShell>
  );
}
