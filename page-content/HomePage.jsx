import Link from "next/link";
import ContentImage from "../components/ContentImage";
import ToolCard from "../components/ToolCard";
import Newsletter from "../components/Newsletter";
import { CURRICULUM } from "../data/site";
import { SEL_DOMAINS } from "../data/sel";
import { TOOLS } from "../data/tools";
import { getLessonsByGrade, getStandards, GRADES } from "../features/curriculum/data";

const GRADE_COPY = {
  1: { theme: "알아차리기", topics: ["다양한 감정 인식하기", "다른 사람의 감정 알아차리기"], alt: "감정 카드를 함께 살펴보며 마음을 알아차리는 중학교 1학년 학생들" },
  2: { theme: "탐색하기", topics: ["상황에 맞는 감정 조절 방법 탐색하기", "요청하기와 거절하기"], alt: "서로의 생각을 나누며 관계를 탐색하는 중학교 2학년 학생들" },
  3: { theme: "실천하기", topics: ["감정의 원인을 알고 감정의 주도권 갖기", "또래 갈등을 중재하고 해결방안 찾기"], alt: "친구와 협력하며 배운 것을 실천하는 중학교 3학년 학생들" },
};
const DOMAIN_SCENES = { self: "내 감정과 생각을 살펴보는 학생", inter: "서로의 이야기를 듣고 마음을 나누는 학생들", comm: "힘을 모아 함께 활동하는 학생들", well: "자신의 마음을 돌보고 도움을 나누는 학생들" };
const featuredTools = [TOOLS.find((t) => t.t === "AI 수업" && t.url), ...TOOLS.filter((t) => t.t === "게임" && t.url).slice(0, 3)].filter(Boolean);

export default function HomePage() {
  const standards = getStandards();
  // 학년마다 한 차시, 영역이 겹치지 않게: 중1 대인관계(공감) · 중2 공동체 · 중3 마음건강(도움 요청)
  const FEATURED = [[1, "대인관계"], [2, "공동체"], [3, "마음건강"]];
  const lessons = FEATURED.map(([n, area]) => getLessonsByGrade(n).find((l) => l.area === area)).filter(Boolean);
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="wrap home-hero-grid">
          <div className="home-hero-copy">
            <h1 className="serif" id="home-title">감정을 다루는 힘은<br />가르칠 수 있습니다</h1>
            <p className="sub">서울 사회정서교육 17개 사회정서기술에 맞춘<br className="desktop-break" /> 중학교 3년 수업과 게임·자기 점검·활동 도구.<br className="desktop-break" /> 직접 체험하며 마음 근육을 키웁니다.</p>
            <div className="cta-row"><Link className="btn btn-solid" href="/curriculum">수업 찾기 <span aria-hidden="true">→</span></Link><Link className="btn btn-ghost" href="/tools">콘텐츠 체험하기</Link></div>
          </div>
          <ContentImage className="home-hero-art" src="/images/home-hero.webp" alt="교실에서 감정 카드와 활동지를 펼치고 함께 이야기하는 학생들" width={1200} height={900} priority />
        </div>
        <div className="wrap"><p className="home-facts">3년 {CURRICULUM.totalLessons}차시 <span aria-hidden="true">·</span> {CURRICULUM.skills}개 사회정서기술 <span aria-hidden="true">·</span> 학년별 핵심 {CURRICULUM.coreLessonsPerGrade}차시</p></div>
      </section>

      <section className="band" aria-labelledby="home-grades">
        <div className="wrap">
          <div className="sec-head"><h2 id="home-grades">학년으로 시작하세요</h2><p>알아차리기에서 탐색하기, 실천하기로. 한 해씩 깊어지는 수업.</p></div>
          <div className="home-grade-grid">
            {GRADES.map((n) => <Link key={n} className="home-grade" href={`/curriculum/grade-${n}`}>
              <ContentImage src={`/images/grades/g${n}.webp`} alt={GRADE_COPY[n].alt} width={800} height={600} />
              <div className="home-grade-copy"><h3><span>중{n}</span> {GRADE_COPY[n].theme}</h3><ul>{GRADE_COPY[n].topics.map((t) => <li key={t}>{t}</li>)}</ul><span className="home-grade-link">핵심 15차시 <span aria-hidden="true">→</span></span></div>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="band home-domains" aria-labelledby="home-domains">
        <div className="wrap">
          <div className="sec-head"><h2 id="home-domains">마음은 네 개의 결로 자랍니다</h2><p>네 영역, 17개 사회정서기술. 레브랩의 모든 수업과 콘텐츠가 이어지는 틀입니다.</p></div>
          <div className="home-domain-grid">
            {SEL_DOMAINS.map((d) => <section className={`home-domain domain-${d.key}`} key={d.key} aria-labelledby={`domain-${d.key}`}>
              <div className="home-domain-heading"><h3 id={`domain-${d.key}`}>{d.nm}</h3><p>{d.tagline}</p></div>
              <ContentImage src={`/images/domains/${d.key}.webp`} alt={DOMAIN_SCENES[d.key]} width={800} height={600} />
              <ul>{standards.filter((s) => s.area === d.nm).map((s) => <li key={s.code}><Link href={`/standards/${s.code}`}>{s.skill}<span aria-hidden="true">↗</span></Link></li>)}</ul>
            </section>)}
          </div>
        </div>
      </section>

      <section className="band home-lessons" aria-labelledby="home-lessons">
        <div className="wrap">
          <div className="sec-head section-heading-row"><h2 id="home-lessons">먼저 둘러볼 만한 수업</h2><Link className="text-link" href="/curriculum">전체 수업 <span aria-hidden="true">→</span></Link></div>
          <div className="featured-lessons">
            {lessons.map((l) => <Link className="featured-lesson" href={`/lessons/${l.slug}`} key={l.slug}>
              <ContentImage src={`/images/lessons/${l.slug}.webp`} alt={`중${l.grade} ${l.title} 수업 활동 장면`} width={800} height={600} />
              <div className="featured-lesson-copy"><p className="lesson-label"><span>중{l.grade}</span><span className={`domain-label domain-${SEL_DOMAINS.find((d) => d.nm === l.area)?.key || "self"}`}>{l.area}</span></p><h3>{l.title}</h3><p className="featured-question serif">{l.keyQuestion}</p></div>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="home-tools">
        <div className="wrap">
          <div className="sec-head section-heading-row"><div><h2 id="home-tools">AI 수업과 게임</h2><p>설치 없이 웹 브라우저에서 바로 실행됩니다.</p></div><Link className="text-link" href="/tools">전체 콘텐츠 <span aria-hidden="true">→</span></Link></div>
          <div className="tool-grid home-tool-grid">{featuredTools.map((tool) => <ToolCard key={tool.n} tool={tool} />)}</div>
        </div>
      </section>

      <section className="band founder-band" aria-label="대표 한마디">
        <div className="wrap"><blockquote className="founder-quote"><p className="serif">“마음의 교육은 교과 밖의 특별한 시간이 아니라, 매일의 수업 안에 자연스럽게 스며들 때 자랍니다.”</p><footer><b>이승열</b> · 명지중학교 교목, 레브랩 대표<br /><span>2026 서울 사회정서교육 현장지원단 · 학교로 찾아가는 사회정서교육 강사 · 「마음의 한줄」 저자</span></footer></blockquote></div>
      </section>
      <Newsletter />
      <div className="trust"><div className="wrap"><span>함께하는 곳</span><span>명지중학교</span><span>정연출판사</span></div></div>
    </>
  );
}
