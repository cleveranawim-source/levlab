import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import KineticText from "../components/KineticText";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import Reveal from "../components/Reveal";
import SelExplorer from "../components/SelExplorer";
import ToolsGallery from "../components/ToolsGallery";
import LeafField from "../components/LeafField";
import Tilt from "../components/Tilt";
import Magnetic from "../components/Magnetic";
import SectionNav from "../components/SectionNav";
import KineticReveal from "../components/KineticReveal";
import VideoShowcase from "../components/VideoShowcase";
import { CATCHPHRASE } from "../data/site";

const PROGRAMS = [
  { kick: "커리큘럼", title: "SEL 통합 교과", desc: "서울 SEL 2026 기반, 학년별 15차시(총 45차시) 통합 수업안. 별도 시수 없이 교과 안에서 네 영역을 실천합니다.", stat: "45차시", to: "/programs",
    icon: <path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" /> },
  { kick: "워크북", title: "마음의 한줄", desc: "매일 한 줄 필사로 마음 근육을 키우는 SEL 워크북. 학년별 34주, 손글씨의 힘을 믿는 아날로그 실천.", stat: "3권 시리즈", to: "/programs",
    icon: <><path d="M5 4h9l5 5v11H5z" /><path d="M14 4v5h5M8 13h7M8 16h5" strokeLinecap="round" /></> },
  { kick: "연수 · 워크숍", title: "교사 연수 / 학부모 특강", desc: "내일 교실에서 바로 쓸 수업 설계와, 오늘 저녁 식탁에서 시작할 감정 코칭 언어. 실습 중심 프로그램.", stat: "맞춤 설계", to: "/programs",
    icon: <><circle cx="9" cy="8" r="3" /><path d="M4 20c0-3 2-5 5-5s5 2 5 5M16 6a3 3 0 010 6M20 20c0-2-1-3.5-3-4.3" strokeLinecap="round" /></> },
];

const POSTS = [
  { cat: "현장 이야기", title: "아침묵상에서 만난 학생들의 한 줄", rt: "읽기 6분 · 2026.04.07" },
  { cat: "SEL 칼럼", title: "교과 통합 SEL, 별도 시수 없이 가능한 이유", rt: "읽기 10분 · 2026.03.24" },
  { cat: "교목 에세이", title: "22년째 같은 교실, 다른 아침", rt: "읽기 7분 · 2026.03.18" },
];

const RESOURCES = [
  { chip: "교안", c: "var(--inter)", t: "2학년 SEL 통합 교과 전체 교안", m: "15차시 · .docx · 대인관계" },
  { chip: "활동", c: "var(--self)", t: "감정 날씨 워크시트", m: "학생용 · .pdf · 자기" },
  { chip: "가이드", c: "var(--well)", t: "마음의 한줄 교사 활용 가이드", m: "워크북 연동 · .pdf · 공통" },
];

const STATS = [
  { to: 45, suffix: "차시", label: "SEL 통합 교과" },
  { to: 3, suffix: "권", label: "마음의 한줄 시리즈" },
  { to: 4, suffix: "영역", label: "서울 SEL 프레임워크" },
  { to: 22, suffix: "년", label: "교육 현장 경험" },
];

function Stats() {
  const ref = useRef(null);
  const [vals, setVals] = useState(STATS.map(() => 0));
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / 1100);
          const e2 = 1 - Math.pow(1 - p, 3);
          setVals(STATS.map((s) => Math.round(s.to * e2)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="stats" ref={ref} style={{ marginTop: 34 }}>
      {STATS.map((s, i) => (
        <div className="stat-cell" key={s.label}>
          <div className="n">{vals[i]}{s.suffix}</div>
          <div className="l">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ text: "", ok: true });
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setMsg({ text: "이메일 주소를 확인해 주세요.", ok: false });
      return;
    }
    setMsg({ text: "구독 신청 완료! 곧 첫 소식을 보내드릴게요.", ok: true });
    setEmail("");
  };
  return (
    <section className="band" id="newsletter">
      <div className="wrap">
        <Reveal className="news">
          <svg className="leafdec" style={{ top: -30, right: -20, width: 140, transform: "rotate(20deg)" }} viewBox="0 0 220 220" aria-hidden="true">
            <path d="M110 10 Q70 50 58 100 Q46 155 70 190 Q90 220 110 220 L110 10Z" fill="#7bc67e" />
            <path d="M110 10 Q150 50 162 100 Q174 155 150 190 Q130 220 110 220 L110 10Z" fill="#2d6b4a" />
          </svg>
          <p className="eyebrow">Newsletter</p>
          <h2>격주로, 마음 날씨를 배달합니다</h2>
          <p>SEL 인사이트와 새 교안 소식을 이메일로. 학교·가정에서 바로 쓰는 한 가지 실천을 함께 담아요.</p>
          <form onSubmit={submit}>
            <input type="email" placeholder="이메일 주소" aria-label="이메일 주소" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className="btn btn-solid" type="submit">구독하기</button>
          </form>
          <div className="msg" style={{ color: msg.ok ? "var(--brand)" : "var(--accent-deep)" }}>{msg.text}</div>
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <SectionNav />

      {/* Hero */}
      <section className="hero" id="home">
        <div className="aurora" />
        <LeafField />
        <div className="wrap">
          <div>
            <p className="slogan hero-anim" style={{ animationDelay: ".05s" }}><Logo /> {CATCHPHRASE}</p>
            <h1 style={{ marginTop: 14 }}>
              <KineticText words={["감정을", "다루는", "힘은"]} offset={0} /><br />
              <span className="g">
                <KineticText words={["가르칠", "수", "있습니다"]} offset={3} />
                <svg className="underline" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 8 C 70 2, 150 2, 298 7" stroke="var(--mint)" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="sub hero-anim" style={{ animationDelay: ".5s" }}>
              서울 SEL 2026 프레임워크에 기반한 교과 통합 사회정서학습 연구소.{" "}
              <b style={{ color: "var(--ink)", fontWeight: 700 }}>게임·자기진단·활동 도구</b>부터 워크북·연수까지, 학생이 직접 체험하며 마음 근육을 키웁니다.
            </p>
            <div className="cta-row hero-anim" style={{ animationDelay: ".6s" }}>
              <Magnetic as={Link} className="btn btn-solid" to="/tools">SEL 콘텐츠 살펴보기 →</Magnetic>
              <Magnetic as={Link} className="btn btn-ghost" to="/resources">교안·자료 받기</Magnetic>
            </div>
          </div>
          <div className="hero-media in hero-anim" style={{ animationDelay: ".4s" }}>
            <Tilt strength={7}>
              <div className="frame"><img src="/img/hero.jpg" alt="아침 햇살 아래 노트에 한 줄을 필사하는 손" /></div>
            </Tilt>
            <div className="hero-badge float">
              <Logo />
              <div><div className="t">마음의 한줄</div><div className="s">하루 5분, 필사 SEL</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <div className="trust">
        <div className="wrap">
          <span className="lbl">함께해온 곳</span>
          <span className="org">명지중학교</span><span className="dot" />
          <span className="org">서울시교육청 SEL</span><span className="dot" />
          <span className="org">LevLab 유튜브</span>
        </div>
      </div>

      {/* Why SEL */}
      <section className="band" id="about">
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Why SEL</p>
            <KineticReveal text="마음은 네 개의 결로 자랍니다" />
            <p>서울교육청 2026 SEL 프레임워크는 학생의 마음을 네 영역으로 나눠 돌봅니다. 아래에서 각 영역을 눌러보세요.</p>
          </Reveal>
          <Reveal d={1}><SelExplorer /></Reveal>
        </div>
      </section>

      {/* Cinematic game showcase */}
      <VideoShowcase />

      {/* Interactive SEL — flagship */}
      <section className="band" id="tools">
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Interactive SEL · 레브랩의 새로운 중심</p>
            <KineticReveal text="플레이로 배우는 SEL" />
            <p>게임 · 자기진단 · 활동 도구 — 학생이 직접 만지고 플레이하며 배우는 인터랙티브 SEL 라이브러리. 설치 없이 웹 브라우저에서 바로 실행됩니다.</p>
          </Reveal>
          <Reveal d={1}><ToolsGallery /></Reveal>
          <div style={{ marginTop: 26 }}>
            <Link className="btn btn-ghost" to="/tools">전체 SEL 콘텐츠 보기 →</Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="band" id="programs" style={{ background: "var(--ground-2)" }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Programs</p>
            <KineticReveal text="교실에서 바로 쓰는 프로그램" />
            <p>이론 수입이 아니라 현장에서 검증된 설계. 커리큘럼·워크북·연수 세 축으로 SEL을 교과 안에 통합합니다.</p>
          </Reveal>
          <div className="prog-grid">
            {PROGRAMS.map((p, i) => (
              <Reveal as={Link} to={p.to} className="pcard" d={i + 1} key={p.title}>
                <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8">{p.icon}</svg></span>
                <span className="kick">{p.kick}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="meta"><span className="stat">{p.stat}</span><span className="go">→</span></span>
              </Reveal>
            ))}
          </div>
          <Stats />
        </div>
      </section>

      {/* Insights */}
      <section className="band" id="insights">
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Insights</p>
            <KineticReveal text="마음을 읽는 교실의 기록" />
            <p>SEL 칼럼, 현장 이야기, 교목 에세이. 22년째 이어온 아침의 관찰을 나눕니다.</p>
          </Reveal>
          <div className="ins-grid">
            <Reveal as={Link} to="/insights" className="feature" d={1}>
              <div className="bg" style={{ backgroundImage: "url('/img/leaves.jpg')" }} />
              <span className="cat">SEL 칼럼</span>
              <h3>감정 코칭, 교실에서 어떻게 시작할까</h3>
              <p>감정을 ‘문제’로 보는 교실에서 ‘단서’로 읽는 교실로. 교사의 반응 하나가 교실 전체의 공기를 바꿉니다.</p>
              <span className="rt">읽기 8분 · 2026.04.10</span>
            </Reveal>
            <div className="ins-side">
              {POSTS.map((p, i) => (
                <Reveal as={Link} to="/insights" className="ipost" d={i + 2} key={p.title}>
                  <span className="cat">{p.cat}</span>
                  <h4>{p.title}</h4>
                  <span className="rt">{p.rt}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder quote */}
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="founder">
            <div className="bg" style={{ backgroundImage: "url('/img/leaves.jpg')" }} />
            <blockquote>
              <p className="q">“마음의 교육은 <span className="hl">교과 밖의 특별한 시간</span>이 아니라, 매일의 수업 안에 자연스럽게 스며들 때 자랍니다.”</p>
              <p className="who"><b>이승열</b> · 명지중학교 교목, 레브랩 대표<br />서울 SEL 2026 설계 · 「마음의 한줄」 저자 · 22년차 아침묵상 방송</p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Resources */}
      <section className="band" id="resources" style={{ background: "var(--ground-2)", paddingTop: "clamp(56px,7vw,88px)" }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Resources</p>
            <KineticReveal text="교안·활동지를 무료로" />
            <p>교사·학부모가 바로 내려받아 쓰는 SEL 자료. 준비된 자료부터 순차 공개합니다.</p>
          </Reveal>
          <div className="res-list">
            {RESOURCES.map((r, i) => (
              <Reveal as={Link} to="/resources" className="rrow" d={i + 1} key={r.t}>
                <span className="rchip" style={{ background: `color-mix(in srgb, ${r.c} 16%, transparent)`, color: r.c }}>{r.chip}</span>
                <span className="rmain"><span className="rt">{r.t}</span><br /><span className="rm">{r.m}</span></span>
                <span className="dl">받기 ↓</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </>
  );
}
