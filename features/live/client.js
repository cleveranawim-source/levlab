"use client";
import { useSyncExternalStore } from "react";

export const LIVE_URL = "https://www.levlab.co.kr/live";
export async function liveRequest(body, token, signal) {
  const response = await fetch("/api/live", {
    method: "POST", headers: { "content-type": "application/json", ...(token ? { "x-teacher-token": token } : {}) },
    body: JSON.stringify(body), cache: "no-store", signal: signal || AbortSignal.timeout(10000),
  });
  const data = await response.json();
  if (!response.ok || data.enabled === false) {
    const error = new Error(data.message || "연결을 확인하고 다시 눌러 주세요.");
    error.code = data.enabled === false ? "disabled" : data.error; error.status = response.status;
    throw error;
  }
  return data;
}
let fallbackDevice;
export function deviceId() {
  try {
    let id = localStorage.getItem("levlab-live-device");
    if (!/^[A-Za-z0-9_-]{16,80}$/.test(id || "")) { id = crypto.randomUUID(); localStorage.setItem("levlab-live-device", id); }
    return id;
  } catch { return fallbackDevice ??= crypto.randomUUID(); }
}
const EMPTY = Object.freeze({ code: null, token: null, data: null, error: "" });
const channels = new Map();
function channel(slug) {
  if (!channels.has(slug)) channels.set(slug, { value: EMPTY, listeners: new Set() });
  return channels.get(slug);
}
export function setTeacherRoom(slug, patch) {
  const state = channel(slug); state.value = { ...state.value, ...patch };
  state.listeners.forEach((callback) => callback());
}
export function clearTeacherRoom(slug, error = "") {
  try { sessionStorage.removeItem(`levlab-live-teacher:${slug}`); } catch { /* Tab memory remains usable. */ }
  setTeacherRoom(slug, { ...EMPTY, error });
}
export function saveTeacherRoom(slug, data) {
  const credentials = { code: data.code, token: data.token, expiresAt: data.expiresAt };
  try { sessionStorage.setItem(`levlab-live-teacher:${slug}`, JSON.stringify(credentials)); } catch { /* Still works until the tab closes. */ }
  setTeacherRoom(slug, { ...credentials, data, error: "" });
}
export function restoreTeacherRoom(slug) {
  if (channel(slug).value.code) return;
  try {
    const stored = JSON.parse(sessionStorage.getItem(`levlab-live-teacher:${slug}`));
    if (stored && /^\d{4,6}$/.test(stored.code) && typeof stored.token === "string" && stored.expiresAt > Date.now()) setTeacherRoom(slug, stored);
    else sessionStorage.removeItem(`levlab-live-teacher:${slug}`);
  } catch { /* No previous room. */ }
}
export function updateTeacherData(slug, code, data) {
  const previous = channel(slug).value;
  if (previous.code === code && (data.revision ?? 0) >= (previous.data?.revision ?? 0)) setTeacherRoom(slug, { data, error: "" });
}
export function useTeacherRoom(slug) {
  const state = channel(slug);
  return useSyncExternalStore((listener) => { state.listeners.add(listener); return () => state.listeners.delete(listener); }, () => state.value, () => EMPTY);
}
