import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getStore, TTL_SECONDS } from "./store.js";
import { cleanPost } from "./filter.js";

const digest = (value) => createHash("sha256").update(value).digest("hex");
const roomKey = (code) => `levlab:live:room:${code}`;
const validDevice = (value) => typeof value === "string" && /^[A-Za-z0-9_-]{16,80}$/.test(value);
const missing = () => new LiveError(404, "room_closed", "수업방이 닫혔거나 시간이 지났어요. 선생님께 새 코드를 확인해 주세요.");
export class LiveError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const bad = (message = "입력을 확인해 주세요.") => new LiveError(400, "invalid_input", message);
function teacher(room, token) {
  const hash = digest(typeof token === "string" ? token : "");
  if (!token || !timingSafeEqual(Buffer.from(hash), Buffer.from(room.tokenHash))) {
    throw new LiveError(403, "teacher_required", "선생님 화면에서만 할 수 있어요.");
  }
}
async function lessonItems(slug) {
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 60) throw bad();
  try {
    const data = JSON.parse(await readFile(path.join(process.cwd(), "content/slides", `${slug}.json`), "utf8"));
    const items = (Array.isArray(data) ? data : data.slides).filter((slide) => slide.live).map((slide) => ({
      ...slide.live, ...(slide.live.kind === "vote" ? { choices: slide.choices } : { max: slide.live.max || 60 }),
    }));
    if (!items.length || items.length > 30 || items.some((item) => !/^[a-z0-9-]{1,80}$/.test(item.id)
      || !["vote", "wall"].includes(item.kind) || typeof item.prompt !== "string"
      || (item.kind === "vote" && (!Array.isArray(item.choices) || item.choices.length < 2 || item.choices.length > 8))
      || (item.kind === "wall" && (!Number.isInteger(item.max) || item.max < 1 || item.max > 200)))) throw bad();
    return items;
  } catch { throw bad("이 차시의 수업방은 아직 준비 중이에요."); }
}
async function readBody(request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw bad("JSON 요청이 필요해요.");
  if (Number(request.headers.get("content-length")) > 4096) throw new LiveError(413, "too_large", "요청이 너무 커요.");
  const reader = request.body?.getReader();
  if (!reader) throw bad();
  let size = 0; const chunks = [];
  while (true) {
    const { value, done } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 4096) { await reader.cancel(); throw new LiveError(413, "too_large", "요청이 너무 커요."); }
    chunks.push(value);
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw bad();
    return body;
  } catch { throw bad("요청을 읽지 못했어요."); }
}
function publicState(room, device, isTeacher) {
  const active = room.items.find((item) => item.id === room.activeId) || null;
  const results = {};
  // Students receive only the active item's aggregate, never device IDs or hidden text.
  for (const item of isTeacher ? room.items : active ? [active] : []) {
    if (item.kind === "vote") {
      const votes = room.votes[item.id] || {};
      results[item.id] = { counts: item.choices.map((_, choice) => Object.values(votes).filter((v) => v === choice).length), total: Object.keys(votes).length,
        ...(device ? { mine: votes[device] ?? null } : {}) };
    } else {
      const posts = room.posts[item.id] || [];
      results[item.id] = { posts: posts.filter((p) => !p.hidden).slice().reverse().map(({ id, text, at }) => ({ id, text, at })),
        ...(isTeacher ? { hiddenCount: posts.filter((p) => p.hidden).length } : { mineCount: posts.filter((p) => p.device === device).length }) };
    }
  }
  return { enabled: true, code: room.code, lesson: room.lesson, active, results, devices: Object.keys(room.devices).length, expiresAt: room.expiresAt, revision: room.revision };
}
export function createLiveHandler({ store, now = Date.now, loadLesson = lessonItems } = {}) {
  return async function handle(request) {
    const db = store || getStore();
    const json = (data, status = 200) => Response.json(data, { status, headers: { "cache-control": "no-store, private", "x-robots-tag": "noindex, nofollow", ...(status === 429 ? { "retry-after": "60" } : {}) } });
    try {
      if (!db.enabled) return json({ enabled: false, message: "수업방은 준비 중이에요" });
      if (request.method === "GET") return json({ enabled: true });
      if (request.method !== "POST") throw new LiveError(405, "method", "지원하지 않는 요청이에요.");
      // JSON-only same-origin API; don't allow cross-site creation or participation.
      const origin = request.headers.get("origin");
      if (origin && origin !== new URL(request.url).origin) throw new LiveError(403, "origin", "수업방 화면에서 다시 시도해 주세요.");
      const body = await readBody(request);
      const { action } = body;
      if (!["create", "state", "focus", "vote", "post", "hide", "close"].includes(action)) throw bad();
      const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "local").trim().slice(0, 100);
      const rateKey = `levlab:live:limit:${digest(`ip:${ip}`)}`;
      const bucket = action === "create" ? "create" : action === "state" ? "read" : "write";
      if (!(await db.limit(`${rateKey}:${bucket}`, action === "create" ? 3600000 : 60000, action === "create" ? 20 : action === "state" ? 6000 : 900))) {
        throw new LiveError(429, "slow_down", "잠깐 쉬었다가 다시 눌러 주세요.");
      }
      if (body.deviceId !== undefined && !validDevice(body.deviceId)) throw bad();
      if (body.deviceId && !(await db.limit(`levlab:live:limit:${digest(`device:${body.deviceId}`)}:${bucket}`, 60000, action === "state" ? 90 : 30))) {
        throw new LiveError(429, "slow_down", "잠깐 쉬었다가 다시 눌러 주세요.");
      }
      if (action === "create") {
        const items = await loadLesson(body.lesson);
        const token = randomBytes(32).toString("base64url");
        for (let attempt = 0; attempt < 12; attempt++) {
          const code = String(randomInt(100000, 1000000));
          const room = { code, lesson: body.lesson, tokenHash: digest(token), salt: randomBytes(16).toString("hex"), items,
            createdAt: now(), expiresAt: now() + TTL_SECONDS * 1000, revision: 1, activeId: null, devices: {}, votes: {}, posts: {} };
          if (await db.create(roomKey(code), JSON.stringify(room))) return json({ ...publicState(room, null, true), token });
        }
        throw new LiveError(503, "busy", "수업방을 만들지 못했어요. 다시 눌러 주세요.");
      }
      if (typeof body.code !== "string" || !/^\d{4,6}$/.test(body.code)) throw bad("방 코드는 숫자 4~6자리예요.");
      const token = request.headers.get("x-teacher-token");
      for (let retry = 0; retry < 24; retry++) {
        const raw = await db.get(roomKey(body.code));
        if (!raw) throw missing();
        const room = JSON.parse(raw);
        if (room.expiresAt <= now()) { await db.compareSwap(roomKey(body.code), raw, null); throw missing(); }
        const isTeacher = Boolean(token);
        if (isTeacher || ["focus", "hide", "close"].includes(action)) teacher(room, token);
        const device = body.deviceId ? digest(`${room.salt}:${body.deviceId}`) : null;
        if (!isTeacher && !device) throw bad("수업방에 다시 들어와 주세요.");
        let dirty = false;
        if (!isTeacher && device && !room.devices[device]) {
          if (Object.keys(room.devices).length >= 200) throw new LiveError(409, "full", "수업방이 가득 찼어요. 선생님께 알려 주세요.");
          room.devices[device] = true; dirty = true;
        }
        if (action === "close") {
          if (await db.compareSwap(roomKey(body.code), raw, null)) return json({ ok: true, closed: true });
          continue;
        }
        if (action === "focus") {
          if (body.itemId !== null && !room.items.some((item) => item.id === body.itemId)) throw bad("없는 활동이에요.");
          if (body.sequence !== undefined && (!Number.isSafeInteger(body.sequence) || body.sequence < 0)) throw bad();
          const sequence = body.sequence ?? now();
          if (sequence >= (room.focusSequence || 0)) { room.activeId = body.itemId; room.focusSequence = sequence; dirty = true; }
        }
        if (["vote", "post"].includes(action)) {
          if (!device) throw bad();
          const item = room.items.find((entry) => entry.id === body.itemId);
          if (!item || room.activeId !== item.id) throw new LiveError(409, "focus_changed", "활동이 바뀌었어요. 선생님 화면을 봐 주세요.");
          if (action === "vote") {
            if (item.kind !== "vote" || !Number.isInteger(body.choice) || body.choice < 0 || body.choice >= item.choices.length) throw bad();
            (room.votes[item.id] ??= {})[device] = body.choice;
          } else {
            if (item.kind !== "wall") throw bad();
            const text = cleanPost(body.text, item.max);
            if (!text) throw new LiveError(400, "rewrite", "다시 써 볼까요? 이름·연락처·주소나 상처 주는 말은 빼고, 짧게 적어 주세요.");
            const posts = room.posts[item.id] ??= [];
            if (posts.filter((p) => p.device === device).length >= 3) throw new LiveError(409, "post_limit", "이 활동에는 세 문장까지 보낼 수 있어요.");
            posts.push({ id: randomBytes(12).toString("base64url"), device, text, at: now(), hidden: false });
          }
          dirty = true;
        }
        if (action === "hide") {
          if (!room.items.some((item) => item.id === body.itemId && item.kind === "wall") || typeof body.postId !== "string") throw bad();
          const posts = room.posts[body.itemId];
          const post = posts?.find((entry) => entry.id === body.postId);
          if (!post) throw bad("글을 찾지 못했어요.");
          post.hidden = true; post.text = ""; dirty = true;
        }
        if (dirty) room.revision++;
        if (!dirty || await db.compareSwap(roomKey(body.code), raw, JSON.stringify(room))) return json(publicState(room, device, isTeacher));
        // CAS retries keep parallel votes/posts safe across serverless instances.
        await new Promise((resolve) => setTimeout(resolve, Math.min(80, 4 * (retry + 1))));
      }
      throw new LiveError(409, "busy", "여러 친구가 함께 보내고 있어요. 한 번 더 눌러 주세요.");
    } catch (error) {
      if (error instanceof LiveError) return json({ error: error.code, message: error.message }, error.status);
      // Do not log student text, IDs, tokens or IP addresses.
      return json({ error: "unavailable", message: "연결이 잠시 끊겼어요. 잠시 뒤 다시 시도해 주세요." }, 503);
    }
  };
}
