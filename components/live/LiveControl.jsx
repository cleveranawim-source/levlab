"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LIVE_URL, clearTeacherRoom, liveRequest, restoreTeacherRoom, saveTeacherRoom, setTeacherRoom, updateTeacherData, useTeacherRoom } from "../../features/live/client.js";
import { makeQR } from "../../features/live/qr.js";
import "../../styles/live.css";

function RoomPanel({ room, busy, onClose, onDismiss }) {
  const dialog = useRef(null);
  const qr = useMemo(() => makeQR(`${LIVE_URL}?c=${room.code}`), [room.code]);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current?.showModal();
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);
  return createPortal(<dialog ref={dialog} className="live-dialog live-ui" aria-labelledby="live-room-title" onCancel={(event) => { event.preventDefault(); onDismiss(); }} onKeyDown={(event) => event.stopPropagation()}>
    <div className="live-panel-heading"><h2 id="live-room-title">우리 수업방에 들어와요</h2><button type="button" className="live-secondary" onClick={onDismiss} autoFocus>QR 접기</button></div>
    <div className="live-join-panel">
      <svg className="live-qr" role="img" aria-label={`수업방 ${room.code} 입장 QR 코드`} viewBox={qr.viewBox} shapeRendering="crispEdges"><rect width="100%" height="100%" fill="#fff" /><path d={qr.path} fill="#152d20" /></svg>
      <div className="live-join-copy"><p>카메라로 QR을 비추거나</p><p className="live-address">www.levlab.co.kr/live</p><p>에서 방 코드를 넣어 주세요.</p><strong className="live-room-code" aria-label={`방 코드 ${room.code.split("").join(" ")}`}>{room.code}</strong><p className="live-device-count" role="status">들어온 기기 <b>{room.data?.devices ?? 0}</b>대</p></div>
    </div>
    <p className="live-privacy">이름·번호 없이 참여해요. 응답은 수업방을 연 뒤 3시간 동안만 보관하며, 방을 닫으면 바로 지워요.</p>
    <div className="live-panel-footer"><p>QR을 접어도 수업방은 열려 있어요.</p><button className="live-secondary" type="button" disabled={busy} onClick={onClose}>{busy ? "닫는 중…" : "수업방 닫기 · 응답 삭제"}</button></div>
    {room.error && <p className="live-error" role="alert">{room.error}</p>}
  </dialog>, document.body);
}

export default function LiveControl({ lesson, slide, index }) {
  const slug = lesson?.slug;
  const room = useTeacherRoom(slug);
  const [enabled, setEnabled] = useState(null);
  const [panel, setPanel] = useState(false);
  const [busy, setBusy] = useState(false);
  const itemId = slide?.live?.id || null;
  const focusSequence = useRef(0);
  useEffect(() => {
    let cancelled = false;
    restoreTeacherRoom(slug);
    fetch("/api/live", { cache: "no-store" }).then((response) => response.json()).then((data) => { if (!cancelled) setEnabled(data.enabled); }).catch(() => { if (!cancelled) setEnabled(true); });
    return () => { cancelled = true; };
  }, [slug]);
  useEffect(() => {
    if (!room.code || !room.token) return;
    let cancelled = false, timer;
    const sequence = Math.max(Date.now(), focusSequence.current + 1); focusSequence.current = sequence;
    let focused = false;
    async function tick() {
      try {
        const data = await liveRequest(focused ? { action: "state", code: room.code } : { action: "focus", code: room.code, itemId, sequence }, room.token);
        if (cancelled) return;
        focused = true;
        updateTeacherData(slug, room.code, data);
      } catch (error) {
        if (cancelled) return;
        if (["room_closed", "teacher_required", "disabled"].includes(error.code)) { clearTeacherRoom(slug, error.message); if (error.code === "disabled") setEnabled(false); return; }
        setTeacherRoom(slug, { error: error.message });
      }
      if (!cancelled) timer = setTimeout(tick, 1800);
    }
    tick();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [slug, room.code, room.token, itemId, index]);
  async function openRoom() {
    if (room.code) { setPanel(true); return; }
    setBusy(true); setTeacherRoom(slug, { error: "" });
    try { const data = await liveRequest({ action: "create", lesson: slug }); saveTeacherRoom(slug, data); setPanel(true); }
    catch (error) { if (error.code === "disabled") setEnabled(false); setTeacherRoom(slug, { error: error.message }); }
    finally { setBusy(false); }
  }
  async function closeRoom() {
    setBusy(true);
    try { await liveRequest({ action: "close", code: room.code }, room.token); clearTeacherRoom(slug); setPanel(false); }
    catch (error) { if (error.code === "room_closed") { clearTeacherRoom(slug); setPanel(false); } else setTeacherRoom(slug, { error: error.message }); }
    finally { setBusy(false); }
  }
  if (enabled === false) return <span className="live-preparing">수업방은 준비 중이에요</span>;
  return <div className="live-control">
    <button type="button" className="live-control-button" disabled={busy || enabled === null} onClick={openRoom} aria-haspopup="dialog" aria-expanded={panel && Boolean(room.code)}>{busy ? "수업방 여는 중…" : room.code ? `수업방 ${room.code} · ${room.data?.devices ?? 0}대` : "수업방 열기"}</button>
    {room.error && !panel && <span className="live-control-error" role="status">{room.error}</span>}
    {panel && room.code && <RoomPanel room={room} busy={busy} onClose={closeRoom} onDismiss={() => setPanel(false)} />}
  </div>;
}
