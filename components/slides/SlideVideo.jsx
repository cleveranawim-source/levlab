"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function SlideVideo({ slide, enabled, active }) {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const toggle = useCallback(async () => {
    if (!video.current) return;
    if (!video.current.paused) { video.current.pause(); return; }
    try { video.current.muted = false; await video.current.play(); setError(""); }
    catch { setError("영상을 재생할 수 없어요. 재생 버튼을 다시 눌러 주세요."); }
  }, []);
  useEffect(() => { if (!active) video.current?.pause(); }, [active]);
  useEffect(() => {
    const hidden = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener("visibilitychange", hidden);
    return () => document.removeEventListener("visibilitychange", hidden);
  }, []);
  useEffect(() => {
    if (!enabled || !active || !slide.video?.src) return;
    const key = (event) => {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key.toLowerCase() === "p") { event.preventDefault(); toggle(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [enabled, active, slide.video?.src, toggle]);
  return <div className={`slide-video${playing ? " is-playing" : ""}`}>
    <h2>{slide.heading || "함께 보는 영상"}</h2>
    {slide.video?.src ? <video ref={video} src={slide.video.src} poster={slide.video.poster || undefined} preload="none" playsInline controls={enabled} aria-label={slide.heading || "수업 영상"} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError("영상 파일을 불러올 수 없어요. 다음 화면으로 이어 가 주세요.")} /> : slide.video?.poster ? <img className="slide-video-poster" src={slide.video.poster} alt={slide.heading || "수업 영상 포스터"} width="1920" height="1080" /> : <div className="slide-video-placeholder"><p>함께 보는 영상</p><span>영상 준비 중</span></div>}
    {enabled && slide.video?.src && !playing && <button className="slide-video-play" type="button" onClick={toggle}><svg viewBox="0 0 32 32" width="48" height="48" aria-hidden="true"><path d="M10 5v22l18-11Z" fill="currentColor" /></svg><span>소리와 함께 재생<small>P · 재생 / 정지</small></span></button>}
    {slide.video?.captions && <p className="slide-video-caption">{slide.video.captions}</p>}
    <p className="slide-video-error" role="status">{error}</p>
  </div>;
}
