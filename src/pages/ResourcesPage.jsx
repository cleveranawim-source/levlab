import PageShell, { ComingSoon } from "../components/PageShell";

export default function ResourcesPage() {
  return (
    <PageShell
      eyebrow="Resources"
      title="교안·활동지를 무료로"
      sub="교사·학부모가 바로 내려받아 쓰는 SEL 자료. 준비된 자료부터 순차 공개합니다."
    >
      <ComingSoon note="교안·워크시트·가이드 목록과 실제 다운로드 연결을 준비 중입니다. (파일 호스팅 방식 확정 후 연동)" />
    </PageShell>
  );
}
