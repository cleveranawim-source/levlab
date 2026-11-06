"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import KineticText from "../components/KineticText";
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
import { CATCHPHRASE, CURRICULUM, FORMSPREE_ENDPOINT, CONTACT_EMAIL, CONSENT_VERSION, XFER_CONSENT_VERSION } from "../data/site";
import { TOOLS } from "../data/tools";

const PROGRAMS = [
  { kick: "커리큘럼", title: "중학교 3년 SEL 수업", desc: "서울 사회정서교육 17개 사회정서기술과 성취기준에 맞춘 학년별 34차시. 학년마다 핵심 15차시부터 차례로 공개합니다.", stat: "학년별 핵심 15차시", to: "/curriculum",
    icon: <path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" /> },
  { kick: "워크북", title: "마음의 한줄", desc: "매일 한 줄 필사로 마음 근육을 키우는 SEL 워크북. 학년별 34주, 손글씨의 힘을 믿는 아날로그 실천.", stat: "3권 시리즈", to: "/programs#workbook",
    icon: <><path d="M5 4h9l5 5v11H5z" /><path d="M14 4v5h5M8 13h7M8 16h5" strokeLinecap="round" /></> },
  { kick: "연수 · 워크숍", title: "교사 연수 / 학부모 특강", desc: "내일 교실에서 바로 쓸 수업 설계와, 오늘 저녁 식탁에서 시작할 감정 코칭 언어. 실습 중심 프로그램.", stat: "맞춤 설계", to: "/programs#workshop",
    icon: <><circle cx="9" cy="8" r="3" /><path d="M4 20c0-3 2-5 5-5s5 2 5 5M16 6a3 3 0 010 6M20 20c0-2-1-3.5-3-4.3" strokeLinecap="round" /></> },
];

// 서울 사회정서교육 학년별 학습 주제에서 고른 예시 (학년이 오를수록 인식 → 탐색 → 실천)
const GRADES = [
  { g: "중1", theme: "알아차리기", desc: "다양한 감정과 다른 사람의 감정을 알아차리고, 내 생각과 감정을 분명하게 전하는 첫해.",
    topics: ["다양한 감정 인식하기", "다른 사람의 감정 알아차리기", "자신의 생각과 감정을 명확하게 전달하기"] },
  { g: "중2", theme: "탐색하기", desc: "상황에 맞는 조절 방법과 관계의 경계를 찾아보며, 다름을 존중하는 법을 익히는 해.",
    topics: ["상황에 맞는 감정 조절 방법 탐색하기", "요청하기와 거절하기", "타인의 관점을 존중하고 다름을 수용하기"] },
  { g: "중3", theme: "실천하기", desc: "감정의 주도권을 갖고, 또래 갈등을 중재하며, 공동체를 위해 참여하는 마무리 해.",
    topics: ["감정의 원인을 알고 감정의 주도권 갖기", "또래 갈등을 중재하고 해결방안 찾기", "공동체 가치를 지키기 위해 참여하기"] },
];

const PUBLIC_TOOLS = TOOLS.filter((t) => t.url).length;

const STATS = [
  { to: CURRICULUM.totalLessons, suffix: "차시", label: "중학교 3년 수업" },
  { to: CURRICULUM.skills, suffix: "개", label: "사회정서기술" },
  { to: CURRICULUM.domains, suffix: "영역", label: "서울 사회정서교육" },
  { to: PUBLIC_TOOLS, suffix: "개", label: "인터랙티브 콘텐츠" },
];

function Stats() {
  const ref = useRef(null);
  const [vals, setVals] = useState(STATS.map(() => 0));
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVals(STATS.map((s) => s.to));
      return;
    }
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
  const [agree, setAgree] = useState(false);
  const [agreeXfer, setAgreeXfer] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (e.currentTarget.elements._gotcha?.value) return; // 스팸 봇은 조용히 무시
    const value = email.trim();
    if (!agree || !agreeXfer) {
      setStatus("error");
      setMsg("아래 두 가지 동의에 모두 체크해 주세요.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setStatus("error");
      setMsg("이메일 주소를 다시 확인해 주세요.");
      return;
    }
    setStatus("sending");
    setMsg("");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          이메일: value,
          "수집·이용 동의": CONSENT_VERSION,
          "국외 이전 동의": XFER_CONSENT_VERSION,
          "문의 유형": "공개 소식 받기",
          _replyto: value,
          _subject: `[Lev Lab 공개 소식 신청] ${value}`,
        }),
      });
      if (res.ok) {
        setStatus("done");
        setMsg("신청이 접수됐어요. 새 수업이 열리면 알려 드릴게요!");
        setEmail("");
        setAgree(false);
        setAgreeXfer(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMsg(data?.errors?.[0]?.message || "신청을 보내지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    } catch {
      setStatus("error");
      setMsg("인터넷 연결을 확인한 뒤 다시 시도해 주세요.");
    }
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
          <h2>새 수업이 열리면 알려 드릴게요</h2>
          <p>핵심 15차시 수업과 새 웹앱이 공개될 때 이메일로 소식을 보냅니다.</p>
          <form onSubmit={submit} noValidate>
            <input
              type="email"
              name="email"
              placeholder="이메일 주소"
              aria-label="이메일 주소"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
            <button className="btn btn-solid" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "보내는 중…" : "소식 받기"}
            </button>
          </form>
          <div
            className="msg"
            role="status"
            aria-live="polite"
            style={{ color: status === "error" ? "var(--accent-deep)" : "var(--brand)" }}
          >
            {msg}
          </div>
          <label className="news-consent">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>
              <b>(필수) 개인정보 수집·이용 동의</b> — 이메일을 새 수업 공개 소식 발송에만 쓰고, 신청을 철회할 때까지 보관합니다.
              동의하지 않으셔도 되지만, 그 경우 소식을 보내 드릴 수 없습니다. 철회는 {CONTACT_EMAIL}로 알려 주세요.
            </span>
          </label>
          <label className="news-consent">
            <input type="checkbox" checked={agreeXfer} onChange={(e) => setAgreeXfer(e.target.checked)} />
            <span>
              <b>(필수) 개인정보 국외 이전 동의</b> — 이메일이 Formspree, Inc.(미국, team@formspree.io)로 제출 즉시 암호화 전송되어 접수되고, 레브랩 메일(Google, 미국)로 전달됩니다. 레브랩 보관 기간이 끝나면 함께 지웁니다. 동의하지 않으시면 소식을 신청할 수 없습니다. <Link href="/privacy">개인정보 처리방침</Link>
            </span>
          </label>
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
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
              서울 사회정서교육 17개 사회정서기술에 맞춘 중학교 사회정서교육(SEL) 연구소.{" "}
              <b style={{ color: "var(--ink)", fontWeight: 700 }}>3년 과정 수업</b>과 게임·자기 점검·활동 도구로, 학생이 직접 체험하며 마음 근육을 키웁니다.
            </p>
            <div className="cta-row hero-anim" style={{ animationDelay: ".6s" }}>
              <Magnetic as={Link} className="btn btn-solid" href="/curriculum">SEL 수업 살펴보기 →</Magnetic>
              <Magnetic as={Link} className="btn btn-ghost" href="/tools">콘텐츠 체험하기</Magnetic>
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
          <span className="lbl">함께하는 곳</span>
          <span className="org">명지중학교</span><span className="dot" />
          <span className="org">정연출판사</span>
        </div>
      </div>

      {/* Why SEL */}
      <section className="band" id="about">
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Why SEL</p>
            <KineticReveal text="마음은 네 개의 결로 자랍니다" />
            <p>서울 사회정서교육은 중학생의 마음을 네 영역, 17개 사회정서기술로 나눠 기릅니다. 레브랩의 모든 수업과 콘텐츠는 이 틀에 맞춰 설계했습니다. 아래에서 각 영역을 눌러 보세요.</p>
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
            <p className="eyebrow">Interactive SEL</p>
            <KineticReveal text="플레이로 배우는 SEL" />
            <p>AI 수업 · 게임 · 자기 점검 · 활동 도구 — 학생이 직접 만지고 플레이하며 배우는 인터랙티브 SEL 라이브러리. 설치 없이 웹 브라우저에서 바로 실행됩니다.</p>
          </Reveal>
          <Reveal d={1}><ToolsGallery /></Reveal>
          <div style={{ marginTop: 26 }}>
            <Link className="btn btn-ghost" href="/tools">전체 SEL 콘텐츠 보기 →</Link>
          </div>
        </div>
      </section>

      {/* 3-year curriculum */}
      <section className="band" id="curriculum">
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Curriculum</p>
            <KineticReveal text="중학교 3년, 한 해씩 깊어지는 수업" />
            <p>학년마다 34차시, 네 영역의 17개 기술을 모두 다룹니다. 같은 기술도 학년이 오르면 알아차리기에서 탐색하기, 실천하기로 깊어집니다.</p>
          </Reveal>
          <div className="grade-grid">
            {GRADES.map((g, i) => (
              <Reveal as={Link} href={`/curriculum/grade-${i + 1}`} className="grade-card" d={i + 1} key={g.g}>
                <span className="grade-g">{g.g}</span>
                <h3>{g.theme}</h3>
                <p>{g.desc}</p>
                <ul>{g.topics.map((t) => <li key={t}>{t}</li>)}</ul>
                <span className="grade-meta">핵심 15차시 보기 <span aria-hidden="true">→</span></span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="band" id="programs" style={{ background: "var(--ground-2)" }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Programs</p>
            <KineticReveal text="교실에서 바로 쓰는 프로그램" />
            <p>명지중학교 교실에서 먼저 돌려 보고 다듬은 설계. 커리큘럼·워크북·연수 세 축으로 SEL을 학교 안에 들입니다.</p>
          </Reveal>
          <div className="prog-grid">
            {PROGRAMS.map((p, i) => (
              <Reveal as={Link} href={p.to} className="pcard" d={i + 1} key={p.title}>
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

      {/* Founder quote */}
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="founder">
            <div className="bg" style={{ backgroundImage: "url('/img/leaves.jpg')" }} />
            <blockquote>
              <p className="q">“마음의 교육은 <span className="hl">교과 밖의 특별한 시간</span>이 아니라, 매일의 수업 안에 자연스럽게 스며들 때 자랍니다.”</p>
              <p className="who"><b>이승열</b> · 명지중학교 교목, 레브랩 대표<br />2026 서울 사회정서교육 현장지원단 · 학교로 찾아가는 사회정서교육 강사 · 「마음의 한줄」 저자</p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
