import { useState } from "react";
import { COLORS, SEL_DOMAINS } from "../styles/tokens";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FadeIn, Hover, SectionLabel, SectionTitle, Pill, Card } from "../components/ui";

/* ── Hero ── */
function Hero() {
  const ctas = [
    { label: "교사·교목이에요", bg: COLORS.teal50, color: COLORS.teal800, border: COLORS.teal200 },
    { label: "기관 담당자예요", bg: COLORS.blue50, color: COLORS.blue800, border: COLORS.blue100 },
    { label: "학부모예요", bg: COLORS.amber50, color: COLORS.amber800, border: COLORS.amber100 },
  ];

  return (
    <section
      style={{
        textAlign: "center",
        padding: "80px clamp(16px,4vw,48px) 64px",
        background: `linear-gradient(180deg, ${COLORS.teal50} 0%, #fff 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: COLORS.teal100, opacity: 0.25, filter: "blur(80px)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -100, width: 300, height: 300, borderRadius: "50%", background: COLORS.purple50, opacity: 0.3, filter: "blur(60px)" }} />

      <FadeIn>
        <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.teal600, letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>
          Social-Emotional Learning Lab
        </p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: COLORS.gray800, lineHeight: 1.25, marginBottom: 16, letterSpacing: -1 }}>
          마음을 읽는 교육,<br />레브랩
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p style={{ fontSize: 17, color: COLORS.gray600, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>
          사회정서학습(SEL)으로 학생의 마음 근육을 키우는<br />교육 콘텐츠 연구소
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {ctas.map((b) => (
            <Hover
              key={b.label}
              style={{
                padding: "12px 28px", borderRadius: 10, fontSize: 15, fontWeight: 500,
                background: b.bg, color: b.color, border: `1.5px solid ${b.border}`, cursor: "pointer",
              }}
              hoverStyle={{ transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
            >
              {b.label}
            </Hover>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

/* ── SEL 소개 ── */
function SelSection() {
  return (
    <section style={{ padding: "72px clamp(16px,4vw,48px)", maxWidth: 960, margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>WHY SEL?</SectionLabel>
        <SectionTitle style={{ marginBottom: 8 }}>왜 사회정서학습인가요?</SectionTitle>
        <p style={{ fontSize: 16, color: COLORS.gray600, lineHeight: 1.7, maxWidth: 560, marginBottom: 36 }}>
          서울교육청 2026 SEL 프레임워크는 학생의 마음을 4개 영역으로 나누어 체계적으로 돌봅니다.
        </p>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {SEL_DOMAINS.map((d, i) => (
          <FadeIn key={d.key} delay={i * 0.1}>
            <Hover
              style={{ background: d.bg, padding: "28px 20px", borderLeft: `4px solid ${d.accent}`, borderRadius: 0, cursor: "default" }}
              hoverStyle={{ transform: "translateX(4px)" }}
            >
              <p style={{ fontSize: 20, fontWeight: 600, color: d.color, marginBottom: 6 }}>{d.name}</p>
              <p style={{ fontSize: 14, color: d.accent, lineHeight: 1.5 }}>{d.desc}</p>
            </Hover>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ── 프로그램 ── */
const PROGRAMS = [
  {
    tag: "커리큘럼", title: "SEL 통합 교과",
    desc: "서울 SEL 2026 기반, 학년별 15차시(총 45차시) 통합 수업안. 4개 영역을 교과 안에 녹여냅니다.",
    tagBg: COLORS.teal100, tagColor: COLORS.teal800,
  },
  {
    tag: "워크북", title: "마음의 한줄",
    desc: "필사 기반 SEL 워크북 3권 시리즈. 학년별 34주, 매일 한 줄의 글쓰기로 마음 근육을 키웁니다.",
    tagBg: COLORS.purple100, tagColor: COLORS.purple800,
  },
  {
    tag: "연수·워크숍", title: "교사 연수 / 학부모 특강",
    desc: "SEL 현장 적용 실습 중심 프로그램. 교사와 학부모 모두를 위한 맞춤형 워크숍을 제공합니다.",
    tagBg: COLORS.coral100, tagColor: COLORS.coral800,
  },
];

function ProgramSection() {
  return (
    <section style={{ padding: "72px clamp(16px,4vw,48px)", background: COLORS.gray50 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>PROGRAMS</SectionLabel>
          <SectionTitle>레브랩의 프로그램</SectionTitle>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {PROGRAMS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.12}>
              <Card>
                <Pill bg={p.tagBg} color={p.tagColor}>{p.tag}</Pill>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: COLORS.gray800, margin: "16px 0 10px" }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: COLORS.gray600, lineHeight: 1.7, flex: 1 }}>{p.desc}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.teal600, marginTop: 16 }}>자세히 보기 →</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 숫자 ── */
const STATS = [
  { num: "22년", label: "교육 현장 경력" },
  { num: "45차시", label: "SEL 통합 교과" },
  { num: "3권", label: "마음의 한줄 시리즈" },
  { num: "4영역", label: "서울 SEL 프레임워크" },
];

function StatsSection() {
  return (
    <section style={{ padding: "64px clamp(16px,4vw,48px)", maxWidth: 960, margin: "0 auto" }}>
      <div className="grid-4" style={{ gap: 16 }}>
        {STATS.map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.08}>
            <div style={{ textAlign: "center", padding: "28px 12px", background: COLORS.teal50, borderRadius: 14, borderBottom: `3px solid ${COLORS.teal200}` }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: COLORS.teal800, marginBottom: 4 }}>{s.num}</p>
              <p style={{ fontSize: 13, color: COLORS.teal600 }}>{s.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ── 인사이트 ── */
const POSTS = [
  { cat: "SEL 칼럼", title: "감정 코칭, 교실에서 어떻게 시작할까", date: "2026.04.10" },
  { cat: "현장 이야기", title: "아침묵상에서 만난 학생들의 한 줄", date: "2026.04.07" },
  { cat: "뉴스레터", title: "4월의 마음 날씨: 봄의 감정 리터러시", date: "2026.04.01" },
];

function InsightSection() {
  return (
    <section style={{ padding: "72px clamp(16px,4vw,48px)", background: COLORS.gray50 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>INSIGHTS</SectionLabel>
          <SectionTitle>레브랩 인사이트</SectionTitle>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {POSTS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1}>
              <Hover
                style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: `1px solid ${COLORS.gray100}`, cursor: "pointer" }}
                hoverStyle={{ transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
              >
                <div style={{ height: 140, background: `linear-gradient(135deg, ${COLORS.teal50}, ${COLORS.purple50})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={COLORS.gray200} strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: COLORS.teal600, marginBottom: 6 }}>{p.cat}</p>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.gray800, lineHeight: 1.4, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 12, color: COLORS.gray200 }}>{p.date}</p>
                </div>
              </Hover>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 신뢰 요소 ── */
function TrustSection() {
  const partners = ["명지중학교", "서울시교육청", "협력기관", "협력기관"];
  return (
    <section style={{ padding: "48px clamp(16px,4vw,48px)", textAlign: "center" }}>
      <FadeIn>
        <p style={{ fontSize: 13, color: COLORS.gray200, marginBottom: 20, letterSpacing: 1 }}>TRUSTED BY</p>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          {partners.map((p, i) => (
            <span key={i} style={{ fontSize: 14, fontWeight: 500, color: COLORS.gray200, padding: "10px 24px", border: `1px solid ${COLORS.gray100}`, borderRadius: 8 }}>
              {p}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

/* ── 뉴스레터 CTA ── */
function NewsletterCta() {
  const [email, setEmail] = useState("");
  return (
    <section style={{ padding: "72px clamp(16px,4vw,48px)", textAlign: "center", background: `linear-gradient(180deg, #fff 0%, ${COLORS.teal50} 100%)` }}>
      <FadeIn>
        <SectionLabel>NEWSLETTER</SectionLabel>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: COLORS.gray800, marginBottom: 8 }}>레브랩 소식 받기</h2>
        <p style={{ fontSize: 15, color: COLORS.gray600, marginBottom: 28 }}>격주 SEL 인사이트를 이메일로 보내드려요</p>
        <div style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto" }}>
          <input
            type="email" placeholder="이메일 주소" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1, padding: "12px 16px", fontSize: 14, borderRadius: 10,
              border: `1.5px solid ${COLORS.gray100}`, outline: "none",
            }}
          />
          <Hover
            style={{ padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, background: COLORS.teal600, color: "#fff", border: "none", cursor: "pointer" }}
            hoverStyle={{ background: COLORS.teal800 }}
          >
            구독하기
          </Hover>
        </div>
      </FadeIn>
    </section>
  );
}

/* ── Page ── */
export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif", color: COLORS.gray800, background: "#fff", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <SelSection />
      <ProgramSection />
      <StatsSection />
      <InsightSection />
      <TrustSection />
      <NewsletterCta />
      <Footer />
    </div>
  );
}
