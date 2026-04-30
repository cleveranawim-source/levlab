import { Link } from "react-router-dom";
import { COLORS } from "../styles/tokens";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FadeIn, Hover, SectionLabel, SectionTitle, Pill, Card } from "../components/ui";

/* ── Hero ── */
function Hero() {
  return (
    <section
      style={{
        textAlign: "center",
        padding: "80px clamp(16px,4vw,48px) 60px",
        background: `linear-gradient(180deg, ${COLORS.teal50} 0%, #fff 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -100, right: -60, width: 360, height: 360, borderRadius: "50%", background: COLORS.teal100, opacity: 0.2, filter: "blur(80px)" }} />
      <FadeIn>
        <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.teal600, letterSpacing: 2, marginBottom: 16 }}>ABOUT LEV LAB</p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 700, color: COLORS.gray800, lineHeight: 1.35, marginBottom: 12, letterSpacing: -0.5 }}>
          마음(לֵב)에서 시작하는 교육,<br />레브랩을 소개합니다
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p style={{ fontSize: 16, color: COLORS.gray600, lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
          22년 교육 현장에서 길어 올린 경험이<br />하나의 이름으로 수렴되기까지
        </p>
      </FadeIn>
    </section>
  );
}

/* ── 레브(לֵב) 이야기 ── */
const LEV_MEANINGS = [
  { ko: "마음", en: "Heart", desc: "감정을 알아차리는 힘", bg: COLORS.purple50, border: COLORS.purple600, title: COLORS.purple800, sub: COLORS.purple600 },
  { ko: "지성", en: "Mind", desc: "판단하고 성찰하는 힘", bg: COLORS.coral50, border: COLORS.coral600, title: COLORS.coral800, sub: COLORS.coral600 },
  { ko: "의지", en: "Will", desc: "책임 있게 결정하는 힘", bg: COLORS.teal50, border: COLORS.teal600, title: COLORS.teal800, sub: COLORS.teal600 },
];

function LevStory() {
  return (
    <section style={{ padding: "80px clamp(16px,4vw,48px)", maxWidth: 920, margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>THE NAME</SectionLabel>
        <SectionTitle style={{ marginBottom: 24 }}>왜 '레브'인가요?</SectionTitle>
      </FadeIn>

      <div className="flex-col-mobile" style={{ gap: 32, alignItems: "flex-start" }}>
        <FadeIn style={{ flex: 1 }}>
          <p style={{ fontSize: 16, color: COLORS.gray600, lineHeight: 1.85, marginBottom: 16 }}>
            히브리어 <strong style={{ color: COLORS.gray800 }}>לֵב</strong>(레브)는 '마음'이자 '의지'이자 '지성'입니다.
            성경에서 마음은 감정만이 아니라, 판단하고 결정하고 방향을 잡는 중심입니다.
          </p>
          <p style={{ fontSize: 16, color: COLORS.gray600, lineHeight: 1.85 }}>
            SEL(사회정서학습)이 추구하는 것도 같습니다 — 감정을 알아차리고,
            관계를 돌보고, 공동체 안에서 책임 있는 결정을 내리는 힘.
            레브랩은 이 히브리어 한 단어에 교육철학 전체를 담았습니다.
          </p>
        </FadeIn>
        <FadeIn delay={0.15} style={{ flexShrink: 0, textAlign: "center" }}>
          <div style={{
            width: 130, height: 130, borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.teal50}, ${COLORS.purple50})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 10px",
          }}>
            <span style={{ fontSize: 48, color: COLORS.teal600, fontFamily: "'Times New Roman', serif", fontWeight: 500 }}>לֵב</span>
          </div>
          <p style={{ fontSize: 13, color: COLORS.gray200, letterSpacing: 1 }}>heart · mind · will</p>
        </FadeIn>
      </div>

      <div className="grid-3" style={{ gap: 14, marginTop: 32 }}>
        {LEV_MEANINGS.map((m, i) => (
          <FadeIn key={m.en} delay={i * 0.1}>
            <Hover
              style={{ padding: "20px 18px", background: m.bg, borderLeft: `4px solid ${m.border}`, borderRadius: 0 }}
              hoverStyle={{ transform: "translateX(4px)" }}
            >
              <p style={{ fontSize: 16, fontWeight: 600, color: m.title, marginBottom: 4 }}>
                {m.ko} <span style={{ fontWeight: 400, fontSize: 13, color: m.sub }}>({m.en})</span>
              </p>
              <p style={{ fontSize: 14, color: m.sub, lineHeight: 1.5 }}>{m.desc}</p>
            </Hover>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ── 미션 · 비전 · 가치 ── */
const MVV = [
  { tag: "미션", tagBg: COLORS.teal50, tagColor: COLORS.teal800, title: "마음을 읽는 교육", desc: "SEL 기반 교육 콘텐츠로 학생·교사·학부모의 정서적 성장을 지원합니다" },
  { tag: "비전", tagBg: COLORS.purple50, tagColor: COLORS.purple800, title: "모든 교실에 SEL을", desc: "한국 교육 현장에 사회정서학습이 자연스럽게 스며드는 생태계를 만듭니다" },
  { tag: "핵심 가치", tagBg: COLORS.coral50, tagColor: COLORS.coral800, title: "현장 · 통합 · 필사", desc: "이론이 아닌 현장, 분리가 아닌 통합, 디지털 너머의 아날로그 실천" },
];

function MissionSection() {
  return (
    <section style={{ padding: "72px clamp(16px,4vw,48px)", background: COLORS.gray50 }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>MISSION · VISION · VALUES</SectionLabel>
          <SectionTitle>레브랩이 지향하는 것</SectionTitle>
        </FadeIn>
        <div className="grid-3" style={{ gap: 18 }}>
          {MVV.map((it, i) => (
            <FadeIn key={it.tag} delay={i * 0.1}>
              <Card style={{ textAlign: "center", alignItems: "center" }}>
                <Pill bg={it.tagBg} color={it.tagColor}>{it.tag}</Pill>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: COLORS.gray800, margin: "16px 0 10px" }}>{it.title}</h3>
                <p style={{ fontSize: 14, color: COLORS.gray600, lineHeight: 1.7 }}>{it.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 대표 소개 ── */
function FounderSection() {
  const tags = ["22년 교육 현장", "서울 SEL 2026", "「마음의 한줄」 저자", "TOV 채널"];
  return (
    <section style={{ padding: "80px clamp(16px,4vw,48px)", maxWidth: 920, margin: "0 auto" }}>
      <FadeIn><SectionLabel>FOUNDER</SectionLabel></FadeIn>
      <div className="flex-col-mobile" style={{ gap: 32, alignItems: "flex-start" }}>
        <FadeIn delay={0.05} style={{ flexShrink: 0 }}>
          <div style={{
            width: 160, height: 192, borderRadius: 16,
            background: `linear-gradient(160deg, ${COLORS.teal50}, ${COLORS.gray50})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${COLORS.gray100}`,
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", background: COLORS.teal100,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 600, color: COLORS.teal800,
            }}>SY</div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} style={{ flex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.gray800, marginBottom: 4 }}>이승열</h2>
          <p style={{ fontSize: 15, fontWeight: 500, color: COLORS.teal600, marginBottom: 16 }}>교목 · SEL 코디네이터 · 레브랩 대표</p>
          <p style={{ fontSize: 15, color: COLORS.gray600, lineHeight: 1.85, marginBottom: 12 }}>
            명지중학교 교목으로 22년간 학생들의 아침을 열어온 사역자.
            매일 아침묵상 방송, 주간 설교, SEL 통합 교과 설계를 병행하며
            '마음의 교육'이 교과 안에 자연스럽게 녹아드는 구조를 연구해왔습니다.
          </p>
          <p style={{ fontSize: 15, color: COLORS.gray600, lineHeight: 1.85, marginBottom: 20 }}>
            필사(筆寫)와 AI를 동시에 활용하는 '아날로그-디지털 하이브리드' 교육 콘텐츠 제작자이자,
            신앙과 사회정서학습의 접점을 탐구하는 실천가입니다.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tags.map((t) => (
              <span key={t} style={{ fontSize: 13, padding: "5px 14px", borderRadius: 20, background: COLORS.gray50, color: COLORS.gray600, border: `1px solid ${COLORS.gray100}` }}>
                {t}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── 타임라인 ── */
const TIMELINE = [
  { year: "2004", title: "교목 사역 시작", desc: "명지중학교 교목으로 부임, 아침묵상 방송 시작", dot: COLORS.teal600 },
  { year: "2023", title: "SEL 통합 교육 설계", desc: "서울교육청 SEL 프레임워크와 종교 교과의 통합 연구 시작", dot: COLORS.teal400 },
  { year: "2025", title: "「마음의 한줄」 완성", desc: "필사 기반 SEL 워크북 3권 시리즈 편집 완료, 출판 준비", dot: COLORS.teal400 },
  { year: "2026", title: "45차시 커리큘럼 · 레브랩 설립", desc: "서울 SEL 2026 기반 학년별 15차시 완성, Lev Lab 공식 출범", dot: COLORS.teal400 },
  { year: "NOW", title: "교사 연수 · 학부모 워크숍 · TOV 채널", desc: "SEL 콘텐츠 확산과 교육 생태계 구축", dot: COLORS.teal200 },
];

function TimelineSection() {
  return (
    <section style={{ padding: "72px clamp(16px,4vw,48px)", background: COLORS.gray50 }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>JOURNEY</SectionLabel>
          <SectionTitle>레브랩이 되기까지</SectionTitle>
        </FadeIn>
        <div style={{ position: "relative", paddingLeft: 32 }}>
          <div style={{ position: "absolute", left: 10, top: 6, bottom: 6, width: 2, background: `linear-gradient(to bottom, ${COLORS.teal600}, ${COLORS.teal100})`, borderRadius: 1 }} />
          {TIMELINE.map((t, i) => (
            <FadeIn key={t.year} delay={i * 0.08}>
              <div style={{ marginBottom: i < TIMELINE.length - 1 ? 28 : 0, position: "relative" }}>
                <div style={{
                  position: "absolute", left: -28, top: 4, width: 18, height: 18,
                  borderRadius: "50%", background: t.dot, border: `3px solid ${COLORS.teal50}`,
                  boxShadow: `0 0 0 2px ${t.dot}33`,
                }} />
                <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal600, marginBottom: 2, letterSpacing: 0.5 }}>{t.year}</p>
                <p style={{ fontSize: 17, fontWeight: 600, color: COLORS.gray800, marginBottom: 4 }}>{t.title}</p>
                <p style={{ fontSize: 14, color: COLORS.gray600, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 차별점 ── */
const DIFFS = [
  { title: "현장에서 태어난 콘텐츠", desc: "이론 수입이 아닌, 22년간 실제 교실에서 검증된 프로그램" },
  { title: "교과 통합형 SEL", desc: "별도 시수가 아닌, 기존 교과 안에 SEL을 녹이는 설계" },
  { title: "아날로그 + 디지털", desc: "필사(마음의 한줄)와 AI 활용 콘텐츠 제작의 균형" },
  { title: "서울 SEL 2026 정합성", desc: "서울교육청 공식 프레임워크 4개 영역에 완전 대응" },
];

function DiffsSection() {
  return (
    <section style={{ padding: "80px clamp(16px,4vw,48px)", maxWidth: 920, margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>WHY LEV LAB</SectionLabel>
        <SectionTitle>레브랩이 다른 이유</SectionTitle>
      </FadeIn>
      <div className="grid-2" style={{ gap: 16 }}>
        {DIFFS.map((d, i) => (
          <FadeIn key={d.title} delay={i * 0.08}>
            <Hover
              style={{ padding: "24px 22px", borderRadius: 14, border: `1px solid ${COLORS.gray100}`, background: "#fff" }}
              hoverStyle={{ borderColor: COLORS.teal200, background: COLORS.teal50 }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: COLORS.teal50,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.teal600 }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: COLORS.gray800, marginBottom: 6 }}>{d.title}</p>
              <p style={{ fontSize: 14, color: COLORS.gray600, lineHeight: 1.65 }}>{d.desc}</p>
            </Hover>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ── CTA ── */
function CtaSection() {
  return (
    <section style={{ padding: "72px clamp(16px,4vw,48px)", textAlign: "center", background: `linear-gradient(180deg, #fff 0%, ${COLORS.teal50} 100%)` }}>
      <FadeIn>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.teal800, marginBottom: 10 }}>함께 만들어가는 교육</h2>
        <p style={{ fontSize: 16, color: COLORS.teal600, marginBottom: 28 }}>레브랩과 협업하고 싶으신가요?</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/contact" style={{ textDecoration: "none" }}>
            <Hover
              style={{ padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, background: COLORS.teal600, color: "#fff", border: `1.5px solid ${COLORS.teal600}`, cursor: "pointer" }}
              hoverStyle={{ background: COLORS.teal800, transform: "translateY(-2px)" }}
            >협업 문의하기</Hover>
          </Link>
          <Link to="/programs" style={{ textDecoration: "none" }}>
            <Hover
              style={{ padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, background: "#fff", color: COLORS.teal800, border: `1.5px solid ${COLORS.teal200}`, cursor: "pointer" }}
              hoverStyle={{ background: COLORS.teal50, transform: "translateY(-2px)" }}
            >프로그램 살펴보기</Hover>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

/* ── Page ── */
export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif", color: COLORS.gray800, background: "#fff", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <LevStory />
      <MissionSection />
      <FounderSection />
      <TimelineSection />
      <DiffsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
