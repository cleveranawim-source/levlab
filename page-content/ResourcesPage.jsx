"use client";

import PageShell, { ComingSoon } from "../components/PageShell";

export default function ResourcesPage() {
  return (
    <PageShell
      eyebrow="Resources"
      title="수업 자료"
      sub="지도안·활동지·수업 슬라이드는 따로 모아 두지 않고, 각 수업 페이지에서 웹앱과 함께 받을 수 있게 공개합니다."
    >
      <ComingSoon
        title="핵심 15차시와 함께 공개합니다"
        note="학년별 핵심 15차시를 공개할 때 자료도 함께 열립니다. 지금은 수업 구성과 웹앱을 먼저 둘러보세요."
        actions={[{ to: "/curriculum", label: "SEL 수업 보기" }, { to: "/tools", label: "SEL 콘텐츠 체험" }]}
      />
    </PageShell>
  );
}
