"use client";
import { useState } from "react";
import { liveRequest, updateTeacherData, useTeacherRoom } from "../../features/live/client.js";
import "../../styles/live.css";

export default function LiveSlot({ lesson, slide, index }) {
  const room = useTeacherRoom(lesson?.slug);
  const [hiding, setHiding] = useState(null);
  const [error, setError] = useState("");
  if (!slide?.live || !room.code) return null;
  const item = slide.live;
  const result = room.data?.results?.[item.id];
  async function hide(postId) {
    setHiding(postId); setError("");
    try { updateTeacherData(lesson.slug, room.code, await liveRequest({ action: "hide", code: room.code, itemId: item.id, postId }, room.token)); }
    catch (problem) { setError(problem.message); }
    finally { setHiding(null); }
  }
  return <section className={`live-slot live-slot-${item.kind}`} aria-label={item.kind === "vote" ? "우리 반 실시간 투표" : "우리 반 한 문장 벽"} data-live-index={index}>
    <div className="live-result-heading"><h3>{item.kind === "vote" ? "우리 반은 이렇게 보았어요" : item.title || (slide.type === "exit" ? "우리 반의 한 문장" : "우리 반의 생각")}</h3><span>{item.kind === "vote" ? `${result?.total ?? 0}표 · 정답은 없어요` : `${result?.posts?.length ?? 0}문장`}</span></div>
    {item.kind === "vote" ? <ul className="live-bars">{(slide.choices || []).map((choice, i) => {
      const count = result?.counts?.[i] ?? 0, total = result?.total || 0;
      return <li key={choice} className={`live-choice-color-${i % 4}`}><div className="live-bar-label"><span>{choice}</span><strong>{count}<small>명</small></strong></div><div className="live-bar-track" aria-hidden="true"><span style={{ transform: `scaleX(${total ? count / total : 0})` }} /></div></li>;
    })}</ul> : <>
      {result?.posts?.length ? <div className="live-wall" tabIndex={0} role="region" aria-label="최근 문장부터, 스크롤해서 더 보기">{result.posts.map((post) => <article className="live-wall-card" key={post.id}><p>{post.text}</p><button type="button" disabled={hiding === post.id} onClick={() => hide(post.id)} aria-label={`문장 숨기기: ${post.text}`}>{hiding === post.id ? "숨기는 중…" : "숨기기"}</button></article>)}</div> : <p className="live-empty">휴대폰으로 보낸 문장이 여기에 붙어요.</p>}
      {result?.hiddenCount > 0 && <p className="live-hidden-count">교사 확인 · 숨긴 글 {result.hiddenCount}개</p>}
    </>}
    <p className="sr-only" role="status">{item.kind === "vote" ? `${result?.total ?? 0}명이 투표했어요.` : `${result?.posts?.length ?? 0}개의 문장이 도착했어요.`}</p>
    {(error || room.error) && <p className="live-error" role="status">{error || room.error}</p>}
  </section>;
}
