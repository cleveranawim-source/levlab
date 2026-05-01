import { useState } from "react";
import { COLORS } from "../styles/tokens";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FadeIn, Hover, SectionLabel, SectionTitle, Pill } from "../components/ui";

/* ── Data ── */
const COLLAB_TYPES = [
  {
    icon: "교",
    title: "학교 SEL 도입",
    desc: "학교 맞춤형 SEL 커리큘럼 설계, 교사 연수, 워크북 도입 컨설팅",
    for: "교육기관",
    bg: COLORS.teal50,
    accent: COLORS.teal600,
    color: COLORS.teal800,
    iconBg: COLORS.teal100,
  },
  {
    icon: "연",
    title: "교사 연수 의뢰",
    desc: "SEL 현장 적용 실습 연수, 맞춤 워크숍 기획 및 진행",
    for: "교육청·연수원",
    bg: COLORS.purple50,
    accent: COLORS.purple600,
    color: COLORS.purple800,
    iconBg: COLORS.purple100,
  },
  {
    icon: "부",
    title: "학부모 특강",
    desc: "가정 내 감정 코칭, 사춘기 자녀 소통법 워크숍",
    for: "학부모회·PTA",
    bg: COLORS.coral50,
    accent: COLORS.coral600,
    color: COLORS.coral800,
    iconBg: COLORS.coral100,
  },
  {
    icon: "출",
    title: "콘텐츠 협업",
    desc: "SEL 교재 공동 개발, 영상 콘텐츠 기획, 미디어 협업",
    for: "출판사·미디어",
    bg: COLORS.amber50,
    accent: COLORS.amber600,
    color: COLORS.amber800,
    iconBg: COLORS.amber100,
  },
];

const FAQ_DATA = [
  {
    q: "프로그램 도입 비용이 어떻게 되나요?",
    a: "학교 규모, 프로그램 종류, 기간에 따라 맞춤 견적을 드립니다. 문의 폼으로 학교 정보를 보내주시면 1-2일 내에 상세 안내를 보내드려요.",
  },
  {
    q: "자료실의 자료는 무료인가요?",
    a: "네, 자료실의 모든 교안·활동지·가이드는 교육 목적으로 무료 제공됩니다. 별도 회원가입 없이 바로 다운로드할 수 있어요.",
  },
  {
    q: "온라인 연수도 가능한가요?",
    a: "가능합니다. Zoom 기반 실시간 온라인 연수, 녹화 콘텐츠 제공, 혼합형(온·오프라인) 모두 운영하고 있습니다.",
  },
  {
    q: "마음의 한줄 워크북은 어디서 구입하나요?",
    a: "현재 출판 준비 중이며, 출간 시 레브랩 뉴스레터로 가장 먼저 안내드립니다. 학교 단체 구입 문의는 폼으로 보내주세요.",
  },
  {
    q: "개인 교사도 연수를 신청할 수 있나요?",
    a: "정기 공개 연수를 준비 중입니다. 뉴스레터를 구독하시면 일정이 확정되는 대로 안내해드려요. 5인 이상 소그룹은 별도 일정 조율도 가능합니다.",
  },
];

/* ── Hero ── */
function Hero() {
  return (
    <section
      style={{
        padding: "80px clamp(16px,4vw,48px) 56px",
        background: COLORS.teal900,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -60, right: -40, width: 300, height: 300, borderRadius: "50%", background: COLORS.teal600, opacity: 0.1, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -80, left: 80, width: 240, height: 240, borderRadius: "50%", background: COLORS.purple800, opacity: 0.07, filter: "blur(50px)" }} />
      <div style={{ position: "absolute", top: 60, left: "55%", width: 100, height: 100, border: `2px solid ${COLORS.teal400}`, borderRadius: 24, opacity: 0.08, transform: "rotate(25deg)" }} />

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>
        <FadeIn>
          <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.teal200, letterSpacing: 2, marginBottom: 16 }}>
            CONTACT
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 style={{ fontSize: "clamp(30px,5vw,48px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 12, letterSpacing: -0.5 }}>
            함께 만들어가는
            <br />
            마음의 교육
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p style={{ fontSize: 16, color: COLORS.teal100, maxWidth: 440, lineHeight: 1.7 }}>
            프로그램 문의, 협업 제안, 자료 요청 등<br />
            어떤 이야기든 편하게 보내주세요
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Collaboration types ── */
function CollabSection() {
  return (
    <section style={{ padding: "64px clamp(16px,4vw,48px)", maxWidth: 960, margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>COLLABORATION</SectionLabel>
        <SectionTitle>이런 협업을 합니다</SectionTitle>
      </FadeIn>
      <div className="grid-2" style={{ gap: 16 }}>
        {COLLAB_TYPES.map((c, i) => (
          <FadeIn key={c.title} delay={i * 0.08}>
            <Hover
              style={{
                padding: "28px 24px",
                borderRadius: 18,
                border: `1px solid ${COLORS.gray100}`,
                background: "#fff",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                height: "100%",
              }}
              hoverStyle={{
                borderColor: c.accent,
                background: c.bg,
                transform: "translateX(4px)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: c.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: c.color,
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: COLORS.gray800 }}>{c.title}</h3>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: c.bg, color: c.accent, fontWeight: 500 }}>
                    {c.for}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: COLORS.gray600, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            </Hover>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ── Contact form ── */
function FormSection() {
  const [form, setForm] = useState({ name: "", org: "", email: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: `1.5px solid ${COLORS.gray100}`,
    fontSize: 14,
    color: COLORS.gray800,
    outline: "none",
    transition: "border-color 0.2s",
    background: "#fff",
    fontFamily: "inherit",
  };

  const focusHandler = (e) => (e.target.style.borderColor = COLORS.teal400);
  const blurHandler = (e) => (e.target.style.borderColor = COLORS.gray100);

  return (
    <section style={{ padding: "64px clamp(16px,4vw,48px)", background: COLORS.gray50 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="grid-2" style={{ gap: 40, alignItems: "flex-start" }}>
          {/* Left — info */}
          <FadeIn>
            <SectionLabel>GET IN TOUCH</SectionLabel>
            <SectionTitle style={{ marginBottom: 16 }}>문의하기</SectionTitle>
            <p style={{ fontSize: 15, color: COLORS.gray600, lineHeight: 1.8, marginBottom: 32 }}>
              프로그램 도입, 연수 의뢰, 협업 제안, 자료 요청 등
              어떤 내용이든 보내주세요. 영업일 기준 1-2일 내에 회신드립니다.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.teal50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.teal600} strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: COLORS.gray200, marginBottom: 2 }}>이메일</p>
                  <a
                    href="mailto:levlabkr@gmail.com"
                    style={{ fontSize: 14, fontWeight: 500, color: COLORS.gray800, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.teal600)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.gray800)}
                  >
                    levlabkr@gmail.com
                  </a>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.teal50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.teal600} strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: COLORS.gray200, marginBottom: 2 }}>위치</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.gray800 }}>서울특별시 (명지중학교)</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.teal50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.teal600} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: COLORS.gray200, marginBottom: 2 }}>응답 시간</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.gray800 }}>영업일 1-2일 내 회신</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right — form */}
          <FadeIn delay={0.1}>
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: `1px solid ${COLORS.gray100}` }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.teal50, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.teal600} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, color: COLORS.gray800, marginBottom: 8 }}>보내주셔서 감사합니다</h3>
                  <p style={{ fontSize: 14, color: COLORS.gray600 }}>1-2일 내에 회신드리겠습니다</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="grid-2" style={{ gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.gray600, marginBottom: 6, display: "block" }}>이름 *</label>
                      <input type="text" placeholder="홍길동" value={form.name} onChange={update("name")} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.gray600, marginBottom: 6, display: "block" }}>소속</label>
                      <input type="text" placeholder="학교·기관명" value={form.org} onChange={update("org")} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.gray600, marginBottom: 6, display: "block" }}>이메일 *</label>
                    <input type="email" placeholder="email@example.com" value={form.email} onChange={update("email")} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.gray600, marginBottom: 6, display: "block" }}>문의 유형</label>
                    <select value={form.type} onChange={update("type")} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} onFocus={focusHandler} onBlur={blurHandler}>
                      <option value="">선택해주세요</option>
                      <option value="school">학교 SEL 도입</option>
                      <option value="training">교사 연수 의뢰</option>
                      <option value="parent">학부모 특강</option>
                      <option value="content">콘텐츠 협업</option>
                      <option value="resource">자료 요청</option>
                      <option value="other">기타 문의</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.gray600, marginBottom: 6, display: "block" }}>메시지 *</label>
                    <textarea
                      placeholder="문의 내용을 자유롭게 적어주세요"
                      value={form.message}
                      onChange={update("message")}
                      rows={5}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                      onFocus={focusHandler}
                      onBlur={blurHandler}
                    />
                  </div>
                  <Hover
                    style={{
                      padding: "14px 0",
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 600,
                      background: COLORS.teal600,
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "center",
                      width: "100%",
                    }}
                    hoverStyle={{ background: COLORS.teal800 }}
                  >
                    <div onClick={() => setSubmitted(true)}>보내기</div>
                  </Hover>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ accordion ── */
function FaqItem({ item, isOpen, toggle }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${COLORS.gray100}`,
        cursor: "pointer",
      }}
      onClick={toggle}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0",
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.gray800, flex: 1, paddingRight: 16 }}>
          {item.q}
        </p>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: isOpen ? COLORS.teal600 : COLORS.gray50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.25s ease",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke={isOpen ? "#fff" : COLORS.gray600}
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transition: "transform 0.25s ease", transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
          >
            <line x1="7" y1="2" x2="7" y2="12" />
            <line x1="2" y1="7" x2="12" y2="7" />
          </svg>
        </div>
      </div>
      <div
        style={{
          maxHeight: isOpen ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <p style={{ fontSize: 14, color: COLORS.gray600, lineHeight: 1.75, paddingBottom: 20, paddingRight: 44 }}>
          {item.a}
        </p>
      </div>
    </div>
  );
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section style={{ padding: "64px clamp(16px,4vw,48px)", maxWidth: 960, margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>자주 묻는 질문</SectionTitle>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div style={{ borderTop: `1px solid ${COLORS.gray100}` }}>
          {FAQ_DATA.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              isOpen={openIdx === i}
              toggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

/* ── Page ── */
export default function ContactPage() {
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
      <Hero />
      <CollabSection />
      <FormSection />
      <FaqSection />
      <Footer />
    </div>
  );
}
