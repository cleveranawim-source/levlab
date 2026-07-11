import PageShell, { ComingSoon } from "../components/PageShell";
import { CONTACT_EMAIL } from "../data/site";

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="함께 만들어가는 교육"
      sub="학교·기관 SEL 콘텐츠 도입, 연수, 협업 문의를 환영합니다."
    >
      <ComingSoon note={`협업 유형 안내와 문의 폼을 준비 중입니다. 지금은 ${CONTACT_EMAIL} 로 연락 주세요.`} />
    </PageShell>
  );
}
