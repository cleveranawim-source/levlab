import PageShell, { ComingSoon } from "../components/PageShell";

export default function ResourcesPage() {
  return (
    <PageShell
      title="수업 자료"
      sub="지도안·활동지·수업 슬라이드는 따로 모아 두지 않고, 각 수업 페이지에서 웹앱과 함께 받을 수 있게 공개합니다."
    >
      <ComingSoon
        title="수업 페이지에서 만나세요"
        note="핵심 15차시의 수업 흐름과 교사 발문은 SEL 수업 메뉴에 공개했습니다. 원본 파일은 준비되는 대로 각 차시 페이지에 올립니다."
        actions={[{ to: "/curriculum", label: "SEL 수업 보기" }, { to: "/tools", label: "SEL 콘텐츠 체험" }]}
      />
    </PageShell>
  );
}
