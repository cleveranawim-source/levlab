import { Fragment } from "react";
import { FlipCards, HintPicture, LiveWall, Roulette, StoryChoices } from "./SlideToys";
import SlideVideo from "./SlideVideo";

export const STAGES = ["도입", "이해하기", "연습하기", "적용하기", "정리"];
export const AREA_COLORS = { 자기: "#6D4FC2", 대인관계: "#BF4027", 공동체: "#17784E", 마음건강: "#2F6FB8" };

export function revealCount(slide) {
  if (slide.type === "ask") return Math.max(1, slide.ask?.length || 0);
  if (slide.type === "compare") return Math.max(1, (slide.left?.items?.length || 0) + (slide.toy?.kind === "flip" ? 1 : 0));
  return Math.max(1, slide.steps?.length || 0);
}

export function slideHeading(slide, lesson) {
  return slide.heading || ({ title: lesson.title, question: "함께 생각할 질문", goals: "오늘 우리가 할 수 있게 될 일", journey: "오늘의 45분", next: "다음 시간에 만나요", end: "오늘의 마음에 남기기" })[slide.type] || lesson.title;
}

function Art({ image, className = "" }) {
  return <figure className={`slide-art ${className}`}>
    {image?.src ? <img src={image.src} alt={image.alt || "수업 그림"} width="1200" height="900" draggable="false" />
      : <div className="slide-art-placeholder" role="img" aria-label={image?.alt || "수업 그림 자리"}><span>{image?.alt || "함께 상상해 보아요"}</span></div>}
    {image?.credit && <figcaption>{image.credit}</figcaption>}
  </figure>;
}

function Steps({ steps = [], interactive, revealed }) {
  if (!steps.length) return null;
  return <ol className="slide-steps">{steps.map((step, index) => <li key={index}
    className={interactive && index >= revealed ? "slide-pending" : "slide-revealed"}
    aria-hidden={interactive && index >= revealed ? true : undefined}>
    <span className="slide-step-number" aria-hidden="true">{index + 1}</span><span>{step}</span>
  </li>)}</ol>;
}

function Highlight({ children }) {
  return <mark className="slide-highlight">{children}</mark>;
}

function LessonTitle({ lesson, image, next = false }) {
  return <div className={`slide-title-layout${next ? " slide-next-layout" : ""}`} style={{ "--slide-accent": AREA_COLORS[lesson.area] || "#1F5C3F" }}>
    <div className="slide-title-copy">
      {next ? <><h2>다음 시간에 만나요</h2><p className="slide-next-title">{lesson.title}</p></> : <h1>{lesson.title}</h1>}
      <div className="slide-lesson-meta"><span>중{lesson.grade}</span><span className="slide-area">{lesson.area}</span><span>핵심 {lesson.coreOrder}차시</span></div>
      <p className="slide-skill">{lesson.skill}</p>
      <p className="slide-standard">[9사회정서{lesson.standard}]</p>
      {next && <p className="slide-next-question">{lesson.keyQuestion}</p>}
    </div>
    <Art image={image} />
  </div>;
}

export default function SlideContent({ slide, deck, index, interactive, enabled, active, motion, revealed, choice, onChoose, flipped, onFlip }) {
  const { lesson } = deck;
  const heading = slideHeading(slide, lesson);
  const steps = <Steps steps={slide.steps} interactive={interactive} revealed={revealed} />;
  switch (slide.type) {
    case "title": return <LessonTitle lesson={lesson} image={deck.image} />;
    case "video": return <SlideVideo slide={slide} enabled={enabled} active={active} />;
    case "question": return <div className="slide-question-layout"><h2>{heading}</h2><p className="slide-big-question"><Highlight>{lesson.keyQuestion}</Highlight></p></div>;
    case "goals": return <><h2>{heading}</h2><ol className="slide-goals">{slide.goals.map((goal, i) => <li key={i}><span aria-hidden="true">{i + 1}</span><p>{goal}</p></li>)}</ol></>;
    case "journey": return <><h2>{heading}</h2><ol className="slide-journey">{lesson.flow.map((flow, i) => <li key={flow.stage} className={`slide-stage-${i}`}><span className="slide-journey-stage">{flow.stage}</span><strong>{flow.minutes}<span>분</span></strong><p>{slide.titles?.[flow.stage] || flow.title}</p></li>)}</ol><div className="slide-timebar" aria-label={`${lesson.minutes}분 수업 시간 막대`}>{lesson.flow.map((flow, i) => <span key={flow.stage} className={`slide-stage-${i}`} style={{ flex: flow.minutes }}>{flow.minutes}분</span>)}</div></>;
    case "picture": return <><h2>{heading}</h2><div className="slide-picture-layout">{slide.toy?.kind === "hint" && slide.image?.src ? <HintPicture image={slide.image} toy={slide.toy} enabled={enabled} /> : <Art image={slide.image} />}<div className="slide-picture-copy">{steps}{slide.ask?.length > 0 && <div className="slide-picture-asks">{slide.ask.map((ask, i) => <p className="slide-picture-ask" key={i}>{ask}</p>)}</div>}</div></div></>;
    case "story": return <><h2>{heading}</h2><div className="slide-story-layout"><Art image={slide.image} /><div className="slide-story-copy"><p className="slide-story-text">{slide.story}</p>{steps}<StoryChoices lesson={lesson} slide={slide} index={index} enabled={enabled} choice={choice} onChoose={onChoose} /></div></div></>;
    case "cards": return <><h2>{heading}</h2><div className="slide-cards" style={{ "--slide-card-count": slide.cards?.length || 3 }}>{slide.cards?.map((card, i) => <article className="slide-concept" key={i}><h3>{card.title}</h3><p>{card.text || card.description}</p><p className="slide-example">{card.example}</p></article>)}</div>{slide.steps?.length > 0 && <div className="slide-cards-steps">{steps}</div>}</>;
    case "activity": return <><h2>{heading}</h2><div className="slide-with-wall"><div className="slide-wall-main"><div className={`slide-activity-layout${slide.frames?.length || slide.image ? "" : " slide-activity-no-frames"}`}>{steps}<div className="slide-frames" hidden={!slide.frames?.length} style={{ "--slide-frame-count": slide.frames?.length || 3 }}>{slide.frames?.map((frame, i) => <div className={`slide-frame${slide.rows?.length ? "" : " slide-frame-empty"}`} key={i}><h3>{typeof frame === "string" ? frame : frame.title}</h3>{(slide.rows || []).map((label) => <p key={label}>{label}<span aria-hidden="true" /></p>)}</div>)}</div>{!slide.frames?.length && slide.image && <Art image={slide.image} />}</div><div className="slide-activity-footer">{slide.app?.url && <a className="slide-app-link" href={slide.app.url} target="_blank" rel="noopener noreferrer">레브랩 앱으로 하기 <span>{slide.app.name}</span><span className="sr-only"> (새 창)</span></a>}{slide.toy?.kind === "roulette" && <Roulette toy={slide.toy} enabled={enabled} active={active} motion={motion} />}</div></div><LiveWall lesson={lesson} slide={slide} index={index} enabled={enabled} /></div></>;
    case "ask": return <><h2>{heading}</h2><div className="slide-with-wall"><div className="slide-wall-main"><div className="slide-questions">{slide.ask?.map((question, i) => <div key={i} hidden={interactive && i !== revealed - 1}><p className="slide-question-number">{i + 1} / {slide.ask.length}</p><p className="slide-discussion-question"><Highlight>{question}</Highlight></p></div>)}</div></div><LiveWall lesson={lesson} slide={slide} index={index} enabled={enabled} /></div></>;
    case "compare": return <><h2>{heading}</h2><div className="slide-with-wall"><div className="slide-wall-main">{slide.toy?.kind === "flip" ? <FlipCards slide={slide} enabled={enabled} flipped={flipped} onFlip={onFlip} /> : <><div className="slide-compare-head"><h3>{slide.left?.label}</h3><h3>{slide.right?.label}</h3></div><ol className="slide-compare">{slide.left?.items?.map((left, i) => <li key={i} className={interactive && i >= revealed ? "slide-pending" : "slide-revealed"} aria-hidden={interactive && i >= revealed ? true : undefined}><p>{left}</p><span aria-hidden="true">→</span><p>{slide.right?.items[i]}</p></li>)}</ol></>}<Steps steps={slide.steps} /></div><LiveWall lesson={lesson} slide={slide} index={index} enabled={enabled} /></div></>;
    case "exit": return <><h2>{heading}</h2><div className="slide-with-wall"><div className="slide-wall-main"><p className="slide-exit-prompt">{slide.prompt?.split(/(_{2,})/).map((part, i) => /_{2,}/.test(part) ? <span className="slide-blank" key={i}><span className="sr-only">빈칸</span><span aria-hidden="true">나의 말</span></span> : <Fragment key={i}>{part}</Fragment>)}</p>{steps}</div><LiveWall lesson={lesson} slide={slide} index={index} enabled={enabled} /></div></>;
    case "next": return <LessonTitle lesson={deck.nextLesson} image={deck.nextImage} next />;
    case "end": return <div className="slide-end-layout"><h2 className="sr-only">{heading}</h2><p className="slide-end-message"><Highlight>{slide.message}</Highlight></p><p className="slide-thanks">오늘 수업에 함께해 주어 고마워요</p><img className="slide-end-logo" src="/logo/levlab-symbol.svg" alt="Lev Lab 레브랩" width="96" height="96" /></div>;
    default: return <><h2>{heading}</h2>{steps}</>;
  }
}
