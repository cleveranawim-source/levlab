import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { COLORS } from "../styles/tokens";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FadeIn, Hover, SectionLabel, SectionTitle, Pill } from "../components/ui";

/* ── Data ── */
const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "lesson", label: "교안·지도안" },
  { key: "activity", label: "학생 활동지" },
  { key: "guide", label: "SEL 가이드" },
  { key: "template", label: "서식·템플릿" },
  { key: "recommend", label: "추천 도서·영상" },
];

const GRADES = [
  { key: "all", label: "전체", bg: COLORS.gray50, color: COLORS.gray600 },
  { key: "1", label: "1학년", bg: COLORS.purple50, color: COLORS.purple800 },
  { key: "2", label: "2학년", bg: COLORS.coral50, color: COLORS.coral800 },
  { key: "3", label: "3학년", bg: COLORS.teal50, color: COLORS.teal800 },
  { key: "common", label: "공통", bg: COLORS.gray50, color: COLORS.gray600 },
];

const FEATURED = [
  {
    cat: "교안·지도안",
    title: "SEL 통합 교과 1학년 전체 교안",
    desc: "15차시 · 교사용 지도안 + 학생 활동지",
    format: ".docx",
    size: "12.4 MB",
    accent: COLORS.teal400,
    glow: COLORS.teal600,
    pillBg: "rgba(93,202,165,0.15)",
    pillColor: COLORS.teal100,
    textColor: COLORS.teal100,
  },
  {
    cat: "SEL 가이드",
    title: "서울 SEL 2026 브리핑 문서",
    desc: "4개 영역 해설 + 교사용 적용 가이드",
    format: ".pdf",
    size: "3.8 MB",
    accent: COLORS.purple600,
    glow: "#3C3489",
    pillBg: "rgba(206,203,246,0.12)",
    pillColor: "#AFA9EC",
    textColor: "#CECBF6",
  },
];

const RESOURCES = [
  { id: 1, cat: "lesson", grade: "2", title: "2학년 SEL 통합 교과 전체 교안", meta: "15차시 · .docx · 11.2 MB", domain: "대인관계", iconBg: COLORS.coral50, iconColor: COLORS.coral800, iconLabel: "교안", gradeBg: COLORS.coral50, gradeColor: COLORS.coral800, domainBg: COLORS.coral50, domainColor: COLORS.coral800 },
  { id: 2, cat: "lesson", grade: "3", title: "3학년 SEL 통합 교과 전체 교안", meta: "15차시 · .docx · 10.8 MB", domain: "공동체", iconBg: COLORS.teal50, iconColor: COLORS.teal800, iconLabel: "교안", gradeBg: COLORS.teal50, gradeColor: COLORS.teal800, domainBg: COLORS.teal50, domainColor: COLORS.teal800 },
  { id: 3, cat: "activity", grade: "1", title: "감정 날씨 워크시트", meta: "학생용 · .pdf · 1.2 MB", domain: "자기", iconBg: COLORS.purple50, iconColor: COLORS.purple800, iconLabel: "활동", gradeBg: COLORS.purple50, gradeColor: COLORS.purple800, domainBg: COLORS.purple50, domainColor: COLORS.purple800 },
  { id: 4, cat: "activity", grade: "2", title: "공감 대화 카드 세트", meta: "모둠용 · .pdf · 2.1 MB", domain: "대인관계", iconBg: COLORS.coral50, iconColor: COLORS.coral800, iconLabel: "활동", gradeBg: COLORS.coral50, gradeColor: COLORS.coral800, domainBg: COLORS.coral50, domainColor: COLORS.coral800 },
  { id: 5, cat: "guide", grade: "common", title: "마음의 한줄 교사 활용 가이드", meta: "워크북 연동 · .pdf · 2.5 MB", domain: "공통", iconBg: COLORS.blue50, iconColor: COLORS.blue800, iconLabel: "가이드", gradeBg: COLORS.gray50, gradeColor: COLORS.gray600, domainBg: COLORS.blue50, domainColor: COLORS.blue800 },
  { id: 6, cat: "guide", grade: "common", title: "SEL 수업 관찰·기록 양식 해설", meta: "교사용 · .pdf · 1.8 MB", domain: "공통", iconBg: COLORS.blue50, iconColor: COLORS.blue800, iconLabel: "가이드", gradeBg: COLORS.gray50, gradeColor: COLORS.gray600, domainBg: COLORS.blue50, domainColor: COLORS.blue800 },
  { id: 7, cat: "template", grade: "common", title: "학급 SEL 주간 계획표 템플릿", meta: ".xlsx · 0.3 MB", domain: "공통", iconBg: COLORS.amber50, iconColor: COLORS.amber800, iconLabel: "서식", gradeBg: COLORS.gray50, gradeColor: COLORS.gray600, domainBg: COLORS.amber50, domainColor: COLORS.amber800 },
  { id: 8, cat: "activity", grade: "3", title: "우리 반 약속 만들기 활동지", meta: "모둠용 · .pdf · 1.5 MB", domain: "공동체", iconBg: COLORS.teal50, iconColor: COLORS.teal800, iconLabel: "활동", gradeBg: COLORS.teal50, gradeColor: COLORS.teal800, domainBg: COLORS.teal50, domainColor: COLORS.teal800 },
  { id: 9, cat: "activity", grade: "1", title: "마음 온도계 자기평가지", meta: "학생용 · .pdf · 0.8 MB", domain: "마음건강", iconBg: COLORS.blue50, iconColor: COLORS.blue800, iconLabel: "활동", gradeBg: COLORS.purple50, gradeColor: COLORS.purple800, domainBg: COLORS.blue50, domainColor: COLORS.blue800 },
  { id: 10, cat: "template", grade: "common", title: "학부모 상담 기록 양식", meta: ".docx · 0.2 MB", domain: "공통", iconBg: COLORS.amber50, iconColor: COLORS.amber800, iconLabel: "서식", gradeBg: COLORS.gray50, gradeColor: COLORS.gray600, domainBg: COLORS.amber50, domainColor: COLORS.amber800 },
];

const RECOMMENDATIONS = [
  { type: "도서", typeBg: COLORS.amber50, typeColor: COLORS.amber800, title: "감정은 습관이다", author: "리사 펠드먼 배럿 · 생각연구소" },
  { type: "영상", typeBg: COLORS.blue50, typeColor: COLORS.blue800, title: "The Power of Vulnerability", author: "Brene Brown · TED · 20분" },
  { type: "도서", typeBg: COLORS.amber50, typeColor: COLORS.amber800, title: "비폭력대화", author: "마셜 로젠버그 · 한국NVC센터" },
];

/* ── Components ── */

function DarkHero({ query, onQueryChange }) {
  return (
    <section
      style={{
        padding: "80px clamp(16px,4vw,48px) 56px",
        background: COLORS.teal900,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: -80, right: -40, width: 320, height: 320, borderRadius: "50%", background: COLORS.teal600, opacity: 0.12, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -100, left: 60, width: 260, height: 260, borderRadius: "50%", background: COLORS.teal800, opacity: 0.25, filter: "blur(50px)" }} />
      <div style={{ position: "absolute", top: 40, left: "45%", width: 180, height: 180, borderRadius: "50%", background: COLORS.purple800, opacity: 0.08, filter: "blur(50px)" }} />

      <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.teal200, letterSpacing: 2, marginBottom: 16 }}>
            RESOURCES
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 style={{ fontSize: "clamp(30px,5vw,48px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 12, letterSpacing: -0.5 }}>
            교실에서 바로 쓰는
            <br />
            SEL 자료 허브
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p style={{ fontSize: 16, color: COLORS.teal100, marginBottom: 28, maxWidth: 420 }}>
            교안, 워크시트, 가이드를 무료로 다운로드하세요
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div style={{ display: "flex", gap: 10, maxWidth: 440 }}>
            <input
              type="text"
              placeholder="자료 검색..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              style={{
                flex: 1,
                padding: "13px 18px",
                borderRadius: 12,
                border: `1.5px solid ${COLORS.teal600}`,
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = COLORS.teal200)}
              onBlur={(e) => (e.target.style.borderColor = COLORS.teal600)}
            />
            <Hover
              style={{
                padding: "13px 24px",
                borderRadius: 12,
                background: COLORS.teal400,
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              hoverStyle={{ background: COLORS.teal200 }}
            >
              검색
            </Hover>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FilterBar({ cat, setCat, grade, setGrade }) {
  return (
    <section style={{ padding: "24px clamp(16px,4vw,48px)", maxWidth: 960, margin: "0 auto" }}>
      <FadeIn>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              style={{
                fontSize: 13,
                fontWeight: cat === c.key ? 600 : 400,
                padding: "6px 16px",
                borderRadius: 20,
                border: "none",
                background: cat === c.key ? COLORS.teal800 : COLORS.gray50,
                color: cat === c.key ? "#fff" : COLORS.gray600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {GRADES.map((g) => (
            <button
              key={g.key}
              onClick={() => setGrade(g.key)}
              style={{
                fontSize: 13,
                fontWeight: grade === g.key ? 600 : 400,
                padding: "6px 14px",
                borderRadius: 20,
                border: grade === g.key ? `1.5px solid ${g.key === "all" ? COLORS.gray600 : g.color}` : "1.5px solid transparent",
                background: grade === g.key ? g.bg : "transparent",
                color: grade === g.key ? (g.key === "all" ? COLORS.gray800 : g.color) : COLORS.gray200,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

function FeaturedSection() {
  return (
    <section style={{ padding: "0 clamp(16px,4vw,48px) 40px", maxWidth: 960, margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>FEATURED</SectionLabel>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.gray800, marginBottom: 20 }}>
          인기 자료
        </h2>
      </FadeIn>
      <div className="grid-2" style={{ gap: 16 }}>
        {FEATURED.map((f, i) => (
          <FadeIn key={f.title} delay={i * 0.1}>
            <Hover
              style={{
                background: COLORS.teal900,
                borderRadius: 20,
                padding: "32px 28px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              hoverStyle={{ transform: "translateY(-4px)", boxShadow: "0 20px 48px rgba(4,52,44,0.4)" }}
            >
              {/* Glow orb */}
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  background: f.glow,
                  opacity: 0.2,
                  filter: "blur(40px)",
                }}
              />
              {/* Geometric accent */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  right: 24,
                  width: 60,
                  height: 60,
                  border: `1.5px solid ${f.accent}`,
                  borderRadius: 14,
                  opacity: 0.12,
                  transform: "rotate(15deg)",
                }}
              />

              <span
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 16,
                  background: f.pillBg,
                  color: f.pillColor,
                  alignSelf: "flex-start",
                  marginBottom: 16,
                }}
              >
                {f.cat}
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 6, position: "relative" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: f.textColor, marginBottom: 20, flex: 1, position: "relative" }}>
                {f.desc}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: f.textColor }}>
                    {f.format}
                  </span>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: f.textColor }}>
                    {f.size}
                  </span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: f.pillColor }}>
                  다운로드 →
                </span>
              </div>
            </Hover>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ResourceRow({ r, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
          borderRadius: 14,
          border: `1px solid ${hovered ? COLORS.teal200 : COLORS.gray100}`,
          background: hovered ? COLORS.teal50 : "#fff",
          marginBottom: 10,
          cursor: "pointer",
          transition: "all 0.2s ease",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: r.iconBg,
            color: r.iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {r.iconLabel}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.gray800, marginBottom: 2 }}>
            {r.title}
          </p>
          <p style={{ fontSize: 12, color: COLORS.gray600 }}>{r.meta}</p>
        </div>
        <div className="hide-mobile" style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 16, background: r.gradeBg, color: r.gradeColor, fontWeight: 500 }}>
            {r.grade === "common" ? "공통" : `${r.grade}학년`}
          </span>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 16, background: r.domainBg, color: r.domainColor, fontWeight: 500 }}>
            {r.domain}
          </span>
        </div>
        <Hover
          style={{
            padding: "8px 18px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            background: hovered ? COLORS.teal600 : "transparent",
            color: hovered ? "#fff" : COLORS.teal600,
            border: `1.5px solid ${COLORS.teal600}`,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          hoverStyle={{ background: COLORS.teal800 }}
        >
          다운로드
        </Hover>
      </div>
    </FadeIn>
  );
}

function ResourceList({ resources }) {
  return (
    <section style={{ padding: "0 clamp(16px,4vw,48px) 48px", maxWidth: 960, margin: "0 auto" }}>
      <FadeIn>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.gray800 }}>전체 자료</h2>
          <p style={{ fontSize: 13, color: COLORS.gray200 }}>{resources.length}개 자료</p>
        </div>
      </FadeIn>
      {resources.length === 0 ? (
        <FadeIn>
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 16, color: COLORS.gray200, marginBottom: 4 }}>해당 조건의 자료가 없습니다</p>
            <p style={{ fontSize: 13, color: COLORS.gray200 }}>필터를 변경하거나 자료를 요청해주세요</p>
          </div>
        </FadeIn>
      ) : (
        resources.map((r, i) => <ResourceRow key={r.id} r={r} delay={i * 0.04} />)
      )}
    </section>
  );
}

function RecommendSection() {
  return (
    <section style={{ padding: "56px clamp(16px,4vw,48px)", background: COLORS.gray50 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>CURATED</SectionLabel>
          <SectionTitle>추천 도서·영상</SectionTitle>
        </FadeIn>
        <div className="grid-3" style={{ gap: 16 }}>
          {RECOMMENDATIONS.map((r, i) => (
            <FadeIn key={r.title} delay={i * 0.1}>
              <Hover
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  border: `1px solid ${COLORS.gray100}`,
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                hoverStyle={{ transform: "translateY(-4px)", boxShadow: "0 12px 32px rgba(0,0,0,0.06)" }}
              >
                {/* Abstract cover placeholder */}
                <div
                  style={{
                    height: 100,
                    borderRadius: 12,
                    background: r.type === "영상"
                      ? `linear-gradient(135deg, ${COLORS.blue50}, ${COLORS.teal50})`
                      : `linear-gradient(135deg, ${COLORS.amber50}, ${COLORS.coral50})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  {r.type === "영상" ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke={COLORS.blue600} strokeWidth="1.5" />
                      <path d="M10 8l6 4-6 4V8z" fill={COLORS.blue600} />
                    </svg>
                  ) : (
                    <svg width="28" height="32" viewBox="0 0 24 28" fill="none">
                      <rect x="2" y="2" width="20" height="24" rx="3" stroke={COLORS.amber600} strokeWidth="1.5" />
                      <line x1="7" y1="8" x2="17" y2="8" stroke={COLORS.amber600} strokeWidth="1" />
                      <line x1="7" y1="12" x2="17" y2="12" stroke={COLORS.amber600} strokeWidth="1" />
                      <line x1="7" y1="16" x2="13" y2="16" stroke={COLORS.amber600} strokeWidth="1" />
                    </svg>
                  )}
                </div>
                <Pill bg={r.typeBg} color={r.typeColor}>{r.type}</Pill>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.gray800, margin: "10px 0 6px", flex: 1 }}>
                  {r.title}
                </h3>
                <p style={{ fontSize: 12, color: COLORS.gray200 }}>{r.author}</p>
              </Hover>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function DarkCta() {
  return (
    <section
      style={{
        padding: "72px clamp(16px,4vw,48px)",
        background: COLORS.teal900,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -60, left: "50%", width: 300, height: 300, borderRadius: "50%", background: COLORS.teal600, opacity: 0.08, filter: "blur(60px)", transform: "translateX(-50%)" }} />
      <FadeIn>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 10, position: "relative" }}>
          원하는 자료가 없으신가요?
        </h2>
        <p style={{ fontSize: 15, color: COLORS.teal100, marginBottom: 28, position: "relative" }}>
          필요한 자료를 요청하시면 제작해드립니다
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", position: "relative" }}>
          <Link to="/contact" style={{ textDecoration: "none" }}>
            <Hover
              style={{
                padding: "14px 32px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                background: COLORS.teal400,
                color: "#fff",
                border: `1.5px solid ${COLORS.teal400}`,
                cursor: "pointer",
              }}
              hoverStyle={{ background: COLORS.teal200, transform: "translateY(-2px)" }}
            >
              문의하기
            </Hover>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

/* ── Page ── */
export default function ResourcesPage() {
  const [cat, setCat] = useState("all");
  const [grade, setGrade] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return RESOURCES.filter((r) => {
      if (cat !== "all" && r.cat !== cat) return false;
      if (grade !== "all" && r.grade !== grade) return false;
      if (query && !r.title.includes(query) && !r.domain.includes(query)) return false;
      return true;
    });
  }, [cat, grade, query]);

  return (
    <div
      style={{
        fontFamily: "'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo', sans-serif",
        color: COLORS.gray800,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <Nav />
      <DarkHero query={query} onQueryChange={setQuery} />
      <FilterBar cat={cat} setCat={setCat} grade={grade} setGrade={setGrade} />
      <FeaturedSection />
      <ResourceList resources={filtered} />
      <RecommendSection />
      <DarkCta />
      <Footer />
    </div>
  );
}
