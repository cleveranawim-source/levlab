"use client";

import Logo from "../components/Logo";
import LeafField from "../components/LeafField";
import KineticText from "../components/KineticText";
import ToolsGallery from "../components/ToolsGallery";
import VideoShowcase from "../components/VideoShowcase";
import { CATCHPHRASE } from "../data/site";
import { TOOLS } from "../data/tools";

const PUBLIC_COUNT = TOOLS.filter((t) => t.url).length;

export default function ToolsPage() {
  return (
    <>

      <section className="tools-hero">
        <div className="aurora" />
        <LeafField />
        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <p className="slogan"><Logo /> {CATCHPHRASE}</p>
          <h1>
            <KineticText words={["플레이로", "배우는"]} />{" "}
            <span className="g"><KineticText words={["SEL", "라이브러리"]} offset={2} /></span>
          </h1>
          <p className="sub">
            게임 · 자기 점검 · 활동 도구 — 학생이 직접 만지고 플레이하며 배우는 레브랩의 인터랙티브 SEL 콘텐츠와,
            수업·학급 행사에 쓰는 교실 도구. 학생 계정 없이 웹 브라우저에서 바로 열립니다.
          </p>
          <div className="stat-row">
            <div className="s"><span className="n">{PUBLIC_COUNT}</span><span className="l">공개 콘텐츠</span></div>
            <div className="div" />
            <div className="s"><span className="n">4</span><span className="l">SEL 영역</span></div>
            <div className="div" />
            <div className="s"><span className="n">0</span><span className="l">학생 로그인</span></div>
          </div>
        </div>
      </section>

      <VideoShowcase
        eyebrow="Play & Learn"
        titleLead="게임 세계로 "
        titleHl="직접 들어가 보세요"
        sub="레브랩의 SEL 콘텐츠는 밤의 숲을 달리고 공동체를 짓는 몰입형 경험입니다. 학년·교과·차시에 맞춰 어떤 도구를 어떻게 쓸지 함께 설계해요."
        ctaLabel="도입·연수 문의하기 →"
        ctaTo="/contact"
      />

      <section className="band" style={{ paddingTop: "clamp(48px,6vw,72px)" }}>
        <div className="wrap">
          <ToolsGallery full />
        </div>
      </section>

    </>
  );
}
