import PageShell, { ComingSoon } from "../components/PageShell";

export default function InsightsPage() {
  return (
    <PageShell
      eyebrow="Insights"
      title="마음을 읽는 교실의 기록"
      sub="SEL 칼럼과 현장 이야기를 나눌 공간입니다."
    >
      <ComingSoon
        title="첫 글을 준비하고 있어요"
        note="실제 수업 이야기와 칼럼이 준비되면 이곳에 올립니다. 새 글 소식은 홈 화면 아래에서 신청하실 수 있어요."
        actions={[{ to: "/programs", label: "SEL 수업 보기" }, { to: "/about", label: "레브랩 소개" }]}
      />
    </PageShell>
  );
}
