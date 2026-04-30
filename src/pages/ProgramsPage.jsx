import { COLORS, SEL_DOMAINS } from "../styles/tokens";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import {
  FadeIn,
  Hover,
  SectionLabel,
  SectionTitle,
  Pill,
  Card,
} from "../components/ui";

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
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: COLORS.teal100,
          opacity: 0.2,
          filter: "blur(80px)",
        }}
      />
      <FadeIn>
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: COLORS.teal600,
            letterSpacing: 2,
            marginBottom: 16,
          }}
        >
          PROGRAMS
        </p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1
          style={{
            fontSize: "clamp(28px,4.5vw,44px)",
            fontWeight: 700,
            color: COLORS.gray800,
            lineHeight: 1.35,
            marginBottom: 12,
            letterSpacing: -0.5,
          }}
        >
          마음을 키우는 프로그램
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p
          style={{
            fontSize: 16,
            color: COLORS.gray600,
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          서울 SEL 2026 프레임워크에 기반한
          <br />
          커리큘럼, 워크북, 연수 프로그램을 소개합니다
        </p>
      </FadeIn>
    </section>
  );
}

/* ── 프로그램 요약 카드 ── */
const PROGRAM_CARDS = [
  {
    id: "curriculum",
    tag: "커리큘럼",
    title: "SEL 통합 교과",
    summary: "학년별 15차시, 총 45차시",
    tagBg: COLORS.teal100,
    tagColor: COLORS.teal800,
    accent: COLORS.teal600,
  },
  {
    id: "workbook",
    tag: "워크북",
    title: "마음의 한줄",
    summary: "필사 기반 3권 시리즈",
    tagBg: COLORS.purple100,
    tagColor: COLORS.purple800,
    accent: COLORS.purple600,
  },
  {
    id: "workshop",
    tag: "연수·워크숍",
    title: "교사 연수 / 학부모 특강",
    summary: "현장 적용 실습 중심",
    tagBg: COLORS.coral100,
    tagColor: COLORS.coral800,
    accent: COLORS.coral600,
  },
];

function ProgramOverview() {
  return (
    <section
      style={{
        padding: "64px clamp(16px,4vw,48px)",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      <div
        className="grid-3"
        style={{
          gap: 18,
        }}
      >
        {PROGRAM_CARDS.map((p, i) => (
          <FadeIn key={p.id} delay={i * 0.1}>
            <Hover
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "28px 24px",
                border: `1px solid ${COLORS.gray100}`,
                borderTop: `4px solid ${p.accent}`,
                textAlign: "center",
                cursor: "pointer",
              }}
              hoverStyle={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
              }}
            >
              <Pill bg={p.tagBg} color={p.tagColor}>
                {p.tag}
              </Pill>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: COLORS.gray800,
                  margin: "14px 0 6px",
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: 14, color: COLORS.gray600 }}>
                {p.summary}
              </p>
            </Hover>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ── 커리큘럼 상세 ── */
const GRADE_DATA = [
  {
    grade: "1학년",
    theme: "나를 알아가기",
    domains: ["자기이해", "감정인식", "자기관리"],
    color: COLORS.purple50,
    accent: COLORS.purple600,
    textColor: COLORS.purple800,
  },
  {
    grade: "2학년",
    theme: "너와 함께하기",
    domains: ["공감능력", "소통기술", "갈등해결"],
    color: COLORS.coral50,
    accent: COLORS.coral600,
    textColor: COLORS.coral800,
  },
  {
    grade: "3학년",
    theme: "우리로 성장하기",
    domains: ["책임의식", "시민성", "회복탄력성"],
    color: COLORS.teal50,
    accent: COLORS.teal600,
    textColor: COLORS.teal800,
  },
];

function CurriculumSection() {
  return (
    <section style={{ padding: "72px clamp(16px,4vw,48px)", background: COLORS.gray50 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>CURRICULUM</SectionLabel>
          <SectionTitle style={{ marginBottom: 8 }}>
            SEL 통합 교과 — 45차시
          </SectionTitle>
          <p
            style={{
              fontSize: 16,
              color: COLORS.gray600,
              lineHeight: 1.7,
              maxWidth: 600,
              marginBottom: 36,
            }}
          >
            서울교육청 2026 SEL 프레임워크의 4개 영역(자기, 대인관계, 공동체,
            마음건강)을 기존 교과 안에 통합한 수업 설계입니다. 별도 시수 없이,
            교과 시간 안에서 자연스럽게 SEL을 실천합니다.
          </p>
        </FadeIn>

        {/* SEL 4영역 미니 카드 */}
        <FadeIn delay={0.05}>
          <div
            className="grid-4"
            style={{
              gap: 12,
              marginBottom: 36,
            }}
          >
            {SEL_DOMAINS.map((d) => (
              <div
                key={d.key}
                style={{
                  background: d.bg,
                  padding: "14px 12px",
                  borderLeft: `3px solid ${d.accent}`,
                  borderRadius: 0,
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: d.color,
                    marginBottom: 2,
                  }}
                >
                  {d.name}
                </p>
                <p style={{ fontSize: 12, color: d.accent }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* 학년별 구성 */}
        <FadeIn delay={0.1}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: COLORS.gray800,
              marginBottom: 16,
            }}
          >
            학년별 15차시 구성
          </h3>
        </FadeIn>
        <div
          className="grid-3"
          style={{
            gap: 16,
          }}
        >
          {GRADE_DATA.map((g, i) => (
            <FadeIn key={g.grade} delay={0.12 + i * 0.08}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: 24,
                  border: `1px solid ${COLORS.gray100}`,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: g.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: g.textColor,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: COLORS.gray800,
                      }}
                    >
                      {g.grade}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: g.accent,
                        fontWeight: 500,
                      }}
                    >
                      {g.theme}
                    </p>
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                >
                  {g.domains.map((d) => (
                    <span
                      key={d}
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        borderRadius: 16,
                        background: g.color,
                        color: g.textColor,
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: COLORS.gray600,
                    marginTop: 12,
                    lineHeight: 1.6,
                  }}
                >
                  15차시 × 4개 SEL 영역 통합 수업안
                  <br />
                  교사용 지도안 + 학생 활동지 포함
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 마음의 한줄 상세 ── */
const WORKBOOK_FEATURES = [
  {
    title: "매일 한 줄 필사",
    desc: "성찰 문장을 손으로 쓰며 마음을 정리하는 루틴",
  },
  {
    title: "34주 커리큘럼",
    desc: "학기 단위로 설계된 체계적 정서 성장 로드맵",
  },
  {
    title: "학년별 3권 시리즈",
    desc: "1학년 자기, 2학년 관계, 3학년 공동체 주제 심화",
  },
  {
    title: "SEL 4영역 연동",
    desc: "서울교육청 프레임워크와 자연스럽게 연결",
  },
];

function WorkbookSection() {
  return (
    <section
      style={{
        padding: "72px clamp(16px,4vw,48px)",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      <FadeIn>
        <SectionLabel>WORKBOOK</SectionLabel>
        <SectionTitle style={{ marginBottom: 8 }}>
          마음의 한줄 — 필사 기반 SEL 워크북
        </SectionTitle>
        <p
          style={{
            fontSize: 16,
            color: COLORS.gray600,
            lineHeight: 1.7,
            maxWidth: 600,
            marginBottom: 36,
          }}
        >
          디지털 시대, 손글씨의 힘을 믿습니다. 매일 한 줄의 문장을 필사하며
          자신의 감정을 알아차리고, 생각을 정리하고, 마음 근육을 키웁니다.
          「마음의 한줄」은 필사(筆寫)와 SEL을 결합한 레브랩의 대표 워크북
          시리즈입니다.
        </p>
      </FadeIn>

      <div className="flex-col-mobile" style={{ gap: 24, alignItems: "flex-start" }}>
        {/* 워크북 모형 */}
        <FadeIn delay={0.05} style={{ flexShrink: 0 }}>
          <div
            style={{
              width: 200,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              {
                vol: "Vol.1",
                title: "나를 만나다",
                bg: COLORS.purple50,
                border: COLORS.purple600,
                color: COLORS.purple800,
              },
              {
                vol: "Vol.2",
                title: "너를 이해하다",
                bg: COLORS.coral50,
                border: COLORS.coral600,
                color: COLORS.coral800,
              },
              {
                vol: "Vol.3",
                title: "우리로 자라다",
                bg: COLORS.teal50,
                border: COLORS.teal600,
                color: COLORS.teal800,
              },
            ].map((b) => (
              <div
                key={b.vol}
                style={{
                  background: b.bg,
                  borderLeft: `4px solid ${b.border}`,
                  borderRadius: 0,
                  padding: "16px 14px",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: b.border,
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  {b.vol}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: b.color,
                  }}
                >
                  {b.title}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: b.border,
                    marginTop: 2,
                  }}
                >
                  34주 · 중학교 {b.vol.slice(-1)}학년
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* 특징 그리드 */}
        <div
          className="grid-2"
          style={{
            flex: 1,
            gap: 14,
          }}
        >
          {WORKBOOK_FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={0.1 + i * 0.06}>
              <Hover
                style={{
                  padding: "20px 18px",
                  borderRadius: 12,
                  border: `1px solid ${COLORS.gray100}`,
                  background: "#fff",
                  height: "100%",
                }}
                hoverStyle={{
                  borderColor: COLORS.purple100,
                  background: COLORS.purple50,
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: COLORS.gray800,
                    marginBottom: 6,
                  }}
                >
                  {f.title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: COLORS.gray600,
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </p>
              </Hover>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 연수·워크숍 상세 ── */
const WORKSHOPS = [
  {
    target: "교사 대상",
    title: "SEL 현장 적용 연수",
    items: [
      "서울 SEL 2026 프레임워크 이해",
      "교과 통합 수업 설계 실습",
      "마음의 한줄 활용법",
      "학생 정서 관찰·기록 기법",
    ],
    bg: COLORS.teal50,
    accent: COLORS.teal600,
    textColor: COLORS.teal800,
  },
  {
    target: "학부모 대상",
    title: "가정에서의 감정 코칭",
    items: [
      "SEL이란 무엇인가 — 학부모 입문",
      "자녀 감정 읽기와 반영적 경청",
      "가정 내 필사 루틴 만들기",
      "사춘기 자녀와 소통하는 언어",
    ],
    bg: COLORS.amber50,
    accent: COLORS.amber600,
    textColor: COLORS.amber800,
  },
];

function WorkshopSection() {
  return (
    <section style={{ padding: "72px clamp(16px,4vw,48px)", background: COLORS.gray50 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>WORKSHOP</SectionLabel>
          <SectionTitle style={{ marginBottom: 8 }}>
            교사 연수 / 학부모 워크숍
          </SectionTitle>
          <p
            style={{
              fontSize: 16,
              color: COLORS.gray600,
              lineHeight: 1.7,
              maxWidth: 600,
              marginBottom: 36,
            }}
          >
            이론 전달이 아닌 실습 중심. 교사는 내일 교실에서 바로 쓸 수 있는
            수업 설계를, 학부모는 오늘 저녁 식탁에서 바로 시작할 수 있는 감정
            코칭 언어를 가져갑니다.
          </p>
        </FadeIn>

        <div
          className="grid-2"
          style={{
            gap: 20,
          }}
        >
          {WORKSHOPS.map((w, i) => (
            <FadeIn key={w.target} delay={i * 0.1}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 28,
                  border: `1px solid ${COLORS.gray100}`,
                  borderTop: `4px solid ${w.accent}`,
                  height: "100%",
                }}
              >
                <Pill bg={w.bg} color={w.textColor}>
                  {w.target}
                </Pill>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: COLORS.gray800,
                    margin: "14px 0 16px",
                  }}
                >
                  {w.title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {w.items.map((item, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: w.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: w.accent,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {String(j + 1).padStart(2, "0")}
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          color: COLORS.gray600,
                          lineHeight: 1.5,
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CtaSection() {
  return (
    <section
      style={{
        padding: "72px clamp(16px,4vw,48px)",
        textAlign: "center",
        background: `linear-gradient(180deg, #fff 0%, ${COLORS.teal50} 100%)`,
      }}
    >
      <FadeIn>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.teal800,
            marginBottom: 10,
          }}
        >
          우리 학교에 맞는 프로그램이 궁금하세요?
        </h2>
        <p
          style={{ fontSize: 16, color: COLORS.teal600, marginBottom: 28 }}
        >
          학교·기관·학부모 대상 맞춤 상담을 제공합니다
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Hover
            style={{
              padding: "14px 32px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              background: COLORS.teal600,
              color: "#fff",
              border: `1.5px solid ${COLORS.teal600}`,
              cursor: "pointer",
            }}
            hoverStyle={{
              background: COLORS.teal800,
              transform: "translateY(-2px)",
            }}
          >
            프로그램 문의하기
          </Hover>
          <Hover
            style={{
              padding: "14px 32px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              background: "#fff",
              color: COLORS.teal800,
              border: `1.5px solid ${COLORS.teal200}`,
              cursor: "pointer",
            }}
            hoverStyle={{
              background: COLORS.teal50,
              transform: "translateY(-2px)",
            }}
          >
            자료실에서 샘플 보기
          </Hover>
        </div>
      </FadeIn>
    </section>
  );
}

/* ── Page ── */
export default function ProgramsPage() {
  return (
    <div
      style={{
        fontFamily:
          "'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo', sans-serif",
        color: COLORS.gray800,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <Nav />
      <Hero />
      <ProgramOverview />
      <CurriculumSection />
      <WorkbookSection />
      <WorkshopSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
