import PageShell, { ComingSoon } from "../components/PageShell";

export default function AboutPage() {
  return (
    <PageShell
      showSlogan
      eyebrow="About Lev Lab"
      title="마음(לֵב)에서 시작하는 교육"
      sub="히브리어 레브(לֵב)는 마음이자 지성이자 의지입니다. 레브랩은 이 한 단어에 교육철학 전체를 담아, 사회정서학습을 교실의 중심에 놓습니다."
    >
      <ComingSoon note="레브(לֵב)의 의미, 미션·비전, 대표 이승열 소개, 걸어온 길 타임라인을 이 디자인으로 옮기는 중입니다." />
    </PageShell>
  );
}
