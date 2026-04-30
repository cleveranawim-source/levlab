import { useState, useMemo } from "react";
import { COLORS } from "../styles/tokens";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FadeIn, Hover, SectionLabel, SectionTitle, Pill } from "../components/ui";

/* ── Data ── */
const CATS = [
  { key: "all", label: "전체" },
  { key: "column", label: "SEL 칼럼" },
  { key: "field", label: "현장 이야기" },
  { key: "newsletter", label: "뉴스레터" },
  { key: "essay", label: "교목 에세이" },
];

const HERO_POST = {
  cat: "SEL 칼럼",
  catKey: "column",
  title: "감정 코칭, 교실에서 어떻게 시작할까",
  excerpt:
    "감정을 '문제'로 보는 교실에서 감정을 '단서'로 읽는 교실로. 교사가 학생의 감정에 반응하는 방식 하나가 교실의 분위기 전체를 바꿉니다. 서울 SEL 2026 자기 영역의 핵심인 '감정 인식'을 교실 현장에 적용하는 구체적인 첫 걸음을 제안합니다.",
  date: "2026.04.10",
  readTime: "8분",
  pillBg: COLORS.teal50,
  pillColor: COLORS.teal800,
};

const POSTS = [
  {
    id: 1, catKey: "field", cat: "현장 이야기",
    title: "아침묵상에서 만난 학생들의 한 줄",
    excerpt: "매일 아침 5분, 학생들이 적어낸 한 줄의 문장. 그 안에 담긴 마음의 풍경을 읽다.",
    date: "2026.04.07", readTime: "6분",
    gradient: `linear-gradient(135deg, ${COLORS.coral50}, ${COLORS.amber50})`,
    pillBg: COLORS.coral50, pillColor: COLORS.coral800,
  },
  {
    id: 2, catKey: "newsletter", cat: "뉴스레터",
    title: "4월의 마음 날씨: 봄의 감정 리터러시",
    excerpt: "봄은 설렘과 불안이 공존하는 계절. 새 학기 두 달 차, 학생들의 정서 지형이 바뀌고 있습니다.",
    date: "2026.04.01", readTime: "5분",
    gradient: `linear-gradient(135deg, ${COLORS.purple50}, ${COLORS.blue50})`,
    pillBg: COLORS.purple50, pillColor: COLORS.purple800,
  },
  {
    id: 3, catKey: "column", cat: "SEL 칼럼",
    title: "교과 통합 SEL, 별도 시수 없이 가능한 이유",
    excerpt: "SEL을 위한 수업이 아니라, 수업 안에 SEL이 있다. 종교 교과와 SEL의 자연스러운 접점을 탐구합니다.",
    date: "2026.03.24", readTime: "10분",
    gradient: `linear-gradient(135deg, ${COLORS.teal50}, ${COLORS.purple50})`,
    pillBg: COLORS.teal50, pillColor: COLORS.teal800,
  },
  {
    id: 4, catKey: "essay", cat: "교목 에세이",
    title: "22년째 같은 교실, 다른 아침",
    excerpt: "아침묵상 마이크를 잡은 지 22년. 교실은 같지만, 매일 아침은 다릅니다. 교목이라는 자리에 대한 단상.",
    date: "2026.03.18", readTime: "7분",
    gradient: `linear-gradient(135deg, ${COLORS.amber50}, ${COLORS.teal50})`,
    pillBg: COLORS.amber50, pillColor: COLORS.amber800,
  },
  {
    id: 5, catKey: "field", cat: "현장 이야기",
    title: "필사가 바꾼 교실의 온도",
    excerpt: "마음의 한줄 워크북을 도입한 뒤 학급 분위기가 달라졌습니다. 손글씨가 가진 치유의 힘에 대해.",
    date: "2026.03.11", readTime: "6분",
    gradient: `linear-gradient(135deg, ${COLORS.coral50}, ${COLORS.purple50})`,
    pillBg: COLORS.coral50, pillColor: COLORS.coral800,
  },
  {
    id: 6, catKey: "column", cat: "SEL 칼럼",
    title: "사춘기와 SEL: 폭풍 속에서 닻 내리기",
    excerpt: "중학생 사춘기는 SEL이 가장 절실한 시기이자, 가장 어려운 시기입니다. 현장에서 찾은 접근법.",
    date: "2026.03.04", readTime: "9분",
    gradient: `linear-gradient(135deg, ${COLORS.blue50}, ${COLORS.teal50})`,
    pillBg: COLORS.blue50, pillColor: COLORS.blue800,
  },
  {
    id: 7, catKey: "newsletter", cat: "뉴스레터",
    title: "3월의 마음 날씨: 새 학기의 긴장",
    excerpt: "3월은 기대와 불안이 뒤섞인 달. 교실의 첫 일주일을 SEL 렌즈로 읽어봅니다.",
    date: "2026.02.25", readTime: "5분",
    gradient: `linear-gradient(135deg, ${COLORS.purple50}, ${COLORS.coral50})`,
    pillBg: COLORS.purple50, pillColor: COLORS.purple800,
  },
  {
    id: 8, catKey: "essay", cat: "교목 에세이",
    title: "기도문을 쓴다는 것",
    excerpt: "공적 기도문의 한 문장에 담긴 무게. 학생, 교사, 학부모의 마음을 한 자리에 모으는 언어에 대해.",
    date: "2026.02.18", readTime: "7분",
    gradient: `linear-gradient(135deg, ${COLORS.teal50}, ${COLORS.amber50})`,
    pillBg: COLORS.teal50, pillColor: COLORS.teal800,
  },
];

/* ── Hero ── */
function HeroArticle() {
  return (
    <section
      style={{
        padding: "0 clamp(16px,4vw,48px)",
        maxWidth: 960,
        margin: "0 auto",
        paddingTop: 48,
        paddingBottom: 56,
      }}
    >
      <FadeIn>
        <Hover
          className="grid-2"
          style={{
            gap: 0,
            borderRadius: 24,
            overflow: "hidden",
            background: COLORS.teal900,
            cursor: "pointer",
            position: "relative",
          }}
          hoverStyle={{
            transform: "translateY(-4px)",
            boxShadow: "0 24px 56px rgba(4,52,44,0.35)",
          }}
        >
          {/* Left — image area */}
          <div
            style={{
              background: `linear-gradient(160deg, ${COLORS.teal800}, ${COLORS.teal900})`,
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative elements */}
            <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: COLORS.teal600, opacity: 0.15, filter: "blur(40px)" }} />
            <div style={{ position: "absolute", bottom: 30, right: 20, width: 80, height: 80, border: `2px solid ${COLORS.teal400}`, borderRadius: 20, opacity: 0.15, transform: "rotate(20deg)" }} />
            <div style={{ position: "absolute", top: 40, right: 60, width: 40, height: 40, border: `1.5px solid ${COLORS.teal200}`, borderRadius: "50%", opacity: 0.1 }} />

            <p style={{ fontSize: 64, fontWeight: 800, color: COLORS.teal400, opacity: 0.15, lineHeight: 1, marginBottom: 8, position: "relative" }}>
              01
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal200, letterSpacing: 2, position: "relative" }}>
              FEATURED
            </p>
          </div>

          {/* Right — content */}
          <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
            <Pill bg="rgba(93,202,165,0.15)" color={COLORS.teal100}>
              {HERO_POST.cat}
            </Pill>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.35, margin: "16px 0 12px" }}>
              {HERO_POST.title}
            </h2>
            <p style={{ fontSize: 14, color: COLORS.teal100, lineHeight: 1.75, marginBottom: 20 }}>
              {HERO_POST.excerpt}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 12, color: COLORS.teal200 }}>{HERO_POST.date}</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.teal600 }} />
              <span style={{ fontSize: 12, color: COLORS.teal200 }}>{HERO_POST.readTime} 읽기</span>
            </div>
          </div>
        </Hover>
      </FadeIn>
    </section>
  );
}

/* ── Filter ── */
function FilterBar({ cat, setCat }) {
  return (
    <section style={{ padding: "0 clamp(16px,4vw,48px) 32px", maxWidth: 960, margin: "0 auto" }}>
      <FadeIn>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              style={{
                fontSize: 13,
                fontWeight: cat === c.key ? 600 : 400,
                padding: "7px 18px",
                borderRadius: 20,
                border: cat === c.key ? "none" : `1.5px solid ${COLORS.gray100}`,
                background: cat === c.key ? COLORS.teal800 : "transparent",
                color: cat === c.key ? "#fff" : COLORS.gray600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

/* ── Post card ── */
function PostCard({ post, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <Hover
        style={{
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${COLORS.gray100}`,
          background: "#fff",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        hoverStyle={{
          transform: "translateY(-6px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
          borderColor: "transparent",
        }}
      >
        {/* Visual header */}
        <div
          style={{
            height: 160,
            background: post.gradient,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
            padding: "0 0 16px 20px",
          }}
        >
          {/* Decorative number */}
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 16,
              fontSize: 72,
              fontWeight: 800,
              color: "rgba(0,0,0,0.04)",
              lineHeight: 1,
            }}
          >
            {String(post.id).padStart(2, "0")}
          </span>
          {/* Decorative circle */}
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "2px solid rgba(0,0,0,0.04)",
            }}
          />
          <Pill bg={post.pillBg} color={post.pillColor}>
            {post.cat}
          </Pill>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 22px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: COLORS.gray800, lineHeight: 1.4, marginBottom: 10 }}>
            {post.title}
          </h3>
          <p style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.7, flex: 1, marginBottom: 16 }}>
            {post.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: COLORS.gray200 }}>{post.date}</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: COLORS.gray200 }} />
            <span style={{ fontSize: 12, color: COLORS.gray200 }}>{post.readTime} 읽기</span>
            <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: COLORS.teal600 }}>
              읽기 →
            </span>
          </div>
        </div>
      </Hover>
    </FadeIn>
  );
}

/* ── Post grid ── */
function PostGrid({ posts }) {
  return (
    <section style={{ padding: "0 clamp(16px,4vw,48px) 56px", maxWidth: 960, margin: "0 auto" }}>
      {posts.length === 0 ? (
        <FadeIn>
          <div style={{ textAlign: "center", padding: "56px 0" }}>
            <p style={{ fontSize: 16, color: COLORS.gray200 }}>해당 카테고리의 글이 없습니다</p>
          </div>
        </FadeIn>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {posts.map((p, i) => (
            <PostCard key={p.id} post={p} delay={i * 0.06} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Newsletter CTA — bold dark version ── */
function NewsletterCta() {
  const [email, setEmail] = useState("");
  return (
    <section
      style={{
        padding: "80px clamp(16px,4vw,48px)",
        background: COLORS.teal900,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -80, right: -40, width: 300, height: 300, borderRadius: "50%", background: COLORS.teal600, opacity: 0.08, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -60, left: "30%", width: 250, height: 250, borderRadius: "50%", background: COLORS.purple800, opacity: 0.06, filter: "blur(50px)" }} />

      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <FadeIn>
          <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal200, letterSpacing: 2, marginBottom: 16 }}>
            NEWSLETTER
          </p>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.35 }}>
            격주 SEL 인사이트를
            <br />
            이메일로 받아보세요
          </h2>
          <p style={{ fontSize: 15, color: COLORS.teal100, marginBottom: 32, lineHeight: 1.6 }}>
            교실에서 바로 쓸 수 있는 SEL 팁, 새 자료 알림, 현장 이야기를 보내드려요
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: "14px 18px",
                borderRadius: 12,
                border: `1.5px solid ${COLORS.teal600}`,
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontSize: 14,
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = COLORS.teal200)}
              onBlur={(e) => (e.target.style.borderColor = COLORS.teal600)}
            />
            <Hover
              style={{
                padding: "14px 28px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                background: COLORS.teal400,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              hoverStyle={{ background: COLORS.teal200 }}
            >
              구독하기
            </Hover>
          </div>
          <p style={{ fontSize: 12, color: COLORS.teal200, opacity: 0.5, marginTop: 12 }}>
            스팸 없이, 격주 1회 발송합니다
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Page header (dark slim) ── */
function PageHeader() {
  return (
    <section
      style={{
        padding: "56px clamp(16px,4vw,48px) 16px",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      <FadeIn>
        <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.teal600, letterSpacing: 2, marginBottom: 12 }}>
          INSIGHTS
        </p>
        <h1 style={{ fontSize: "clamp(30px,5vw,44px)", fontWeight: 700, color: COLORS.gray800, lineHeight: 1.3, letterSpacing: -0.5, marginBottom: 8 }}>
          레브랩 인사이트
        </h1>
        <p style={{ fontSize: 16, color: COLORS.gray600, maxWidth: 460, lineHeight: 1.7 }}>
          교실의 마음을 읽는 칼럼, 현장 이야기, 그리고 격주 뉴스레터
        </p>
      </FadeIn>
    </section>
  );
}

/* ── Page ── */
export default function InsightsPage() {
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => {
    if (cat === "all") return POSTS;
    return POSTS.filter((p) => p.catKey === cat);
  }, [cat]);

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
      <PageHeader />
      <HeroArticle />
      <FilterBar cat={cat} setCat={setCat} />
      <PostGrid posts={filtered} />
      <NewsletterCta />
      <Footer />
    </div>
  );
}
