import test from "node:test";
import assert from "node:assert/strict";
import { createLiveHandler } from "../features/live/server.js";
import { createStore, storageConfig, TTL_SECONDS } from "../features/live/store.js";
import { cleanPost } from "../features/live/filter.js";
import { GET, POST, runtime, dynamic } from "../app/api/live/route.js";

const items = [
  { id: "story", kind: "vote", prompt: "누구의 이야기인가요?", choices: ["민준이", "선생님", "엄마", "단짝"] },
  { id: "wall", kind: "wall", prompt: "다름 말", max: 60 },
];
function setup() {
  let clock = 100000;
  const memory = new Map();
  const now = () => clock;
  const store = createStore({ config: { kind: "memory" }, now, memory });
  const handler = createLiveHandler({ store, now, loadLesson: async () => items });
  const request = async (body, token, headers = {}) => {
    const response = await handler(new Request("http://localhost/api/live", { method: "POST", headers: { "content-type": "application/json", ...(token ? { "x-teacher-token": token } : {}), ...headers }, body: JSON.stringify(body) }));
    return { status: response.status, data: await response.json(), headers: response.headers };
  };
  const create = async () => { const out = await request({ action: "create", lesson: "g1-09" }); assert.equal(out.status, 200); return out.data; };
  return { request, create, store, memory, handler, advance: (ms) => { clock += ms; } };
}
const student = (number = 1) => `student-device-${String(number).padStart(4, "0")}`;

test("route exports use Node and dynamic Web handlers", async () => {
  assert.equal(runtime, "nodejs"); assert.equal(dynamic, "force-dynamic");
  assert.equal(typeof POST, "function");
  const response = await GET(new Request("http://localhost/api/live"));
  assert.equal(response.status, 200); assert.match(response.headers.get("cache-control"), /no-store/);
});
test("create, anonymous join, same-device rejoin and teacher state do not inflate attendance", async () => {
  const s = setup(), room = await s.create();
  assert.match(room.code, /^\d{6}$/); assert.ok(room.token.length >= 40);
  assert.equal(room.expiresAt, 100000 + TTL_SECONDS * 1000);
  for (let i = 0; i < 2; i++) {
    const joined = await s.request({ action: "state", code: room.code, deviceId: student() });
    assert.equal(joined.data.devices, 1); assert.equal(joined.data.active, null);
    assert.equal(joined.data.token, undefined); assert.equal(joined.data.tokenHash, undefined);
    assert.equal(JSON.stringify(joined.data).includes(student()), false);
  }
  assert.equal((await s.request({ action: "state", code: room.code }, room.token)).data.devices, 1);
});
test("one vote per device, change vote, invalid option and inactive activity", async () => {
  const s = setup(), room = await s.create();
  const vote = (choice) => s.request({ action: "vote", code: room.code, deviceId: student(), itemId: "story", choice });
  assert.equal((await vote(0)).status, 409);
  await s.request({ action: "focus", code: room.code, itemId: "story" }, room.token);
  await vote(0); await vote(0);
  const changed = await vote(2);
  assert.deepEqual(changed.data.results.story.counts, [0, 0, 1, 0]);
  assert.equal(changed.data.results.story.mine, 2); assert.equal(changed.data.results.story.total, 1);
  assert.equal((await vote(4)).status, 400); assert.equal((await vote("1")).status, 400);
  await s.request({ action: "focus", code: room.code, itemId: null }, room.token);
  assert.equal((await vote(0)).status, 409);
});
test("late focus responses cannot move a class backwards", async () => {
  const s = setup(), room = await s.create();
  await s.request({ action: "focus", code: room.code, itemId: "wall", sequence: 20 }, room.token);
  const stale = await s.request({ action: "focus", code: room.code, itemId: "story", sequence: 10 }, room.token);
  assert.equal(stale.data.active.id, "wall");
});
test("Korean abuse and personal-information filter with safe Korean and length boundary", () => {
  for (const text of ["010-1234-5678", "010 1234 5678", "02-123-4567", "a@example.com", "서울시 강남구 테헤란로 123", "역삼동 123-4", "101동 503호", "990101-1234567", "씨 발", "병​신", "ㅅㅂ", "찐따"]) assert.equal(cleanPost(text), null, text);
  assert.equal(cleanPost("가".repeat(61)), null);
  assert.equal(cleanPost("가".repeat(60)), "가".repeat(60));
  assert.equal(cleanPost(" 나는 다르게 보았어. "), "나는 다르게 보았어.");
  assert.equal(cleanPost("너는 그렇게 느꼈구나."), "너는 그렇게 느꼈구나.");
});
test("wall: validation, max three per activity and device, hide removes text and only teacher sees count", async () => {
  const s = setup(), room = await s.create();
  await s.request({ action: "focus", code: room.code, itemId: "wall" }, room.token);
  const post = (text) => s.request({ action: "post", code: room.code, itemId: "wall", deviceId: student(), text });
  const rejected = await post("전화해 01012345678");
  assert.equal(rejected.status, 400); assert.match(rejected.data.message, /다시 써 볼까요/);
  let result;
  for (const text of ["나는 이렇게 봤어.", "너는 그렇게 느꼈구나.", "다른 생각을 들려줄래?"]) { result = await post(text); assert.equal(result.status, 200); }
  assert.equal((await post("한 번 더")).status, 409);
  const id = result.data.results.wall.posts[0].id;
  const hidden = await s.request({ action: "hide", code: room.code, itemId: "wall", postId: id }, room.token);
  assert.equal(hidden.data.results.wall.posts.length, 2); assert.equal(hidden.data.results.wall.hiddenCount, 1);
  const publicView = await s.request({ action: "state", code: room.code, deviceId: student() });
  assert.equal(publicView.data.results.wall.hiddenCount, undefined);
  assert.equal(publicView.data.results.wall.mineCount, 3);
  assert.equal(publicView.data.results.wall.posts.some((p) => p.id === id), false);
  const raw = await s.store.get(`levlab:live:room:${room.code}`);
  assert.equal(raw.includes("다른 생각을 들려줄래?"), false);
  assert.equal(raw.includes(student()), false);
});
test("teacher token required for focus, hide, close; bad token is not treated as a student", async () => {
  const s = setup(), room = await s.create();
  for (const action of ["focus", "hide", "close"]) {
    const payload = { action, code: room.code, deviceId: student(), itemId: null };
    assert.equal((await s.request(payload)).status, 403);
    assert.equal((await s.request(payload, "invalid-token")).status, 403);
  }
  assert.equal((await s.request({ action: "state", code: room.code, deviceId: student() }, "invalid-token")).status, 403);
});
test("fixed three-hour TTL is not extended by writes; close removes entire room immediately", async () => {
  const s = setup(), room = await s.create();
  s.advance(TTL_SECONDS * 1000 - 1000);
  await s.request({ action: "state", code: room.code, deviceId: student() });
  s.advance(1001);
  assert.equal((await s.request({ action: "state", code: room.code, deviceId: student() })).status, 404);
  assert.equal(await s.store.get(`levlab:live:room:${room.code}`), null);
  const next = await s.create();
  await s.request({ action: "state", code: next.code, deviceId: student() });
  const close = await s.request({ action: "close", code: next.code }, next.token);
  assert.equal(close.data.closed, true);
  assert.equal(await s.store.get(`levlab:live:room:${next.code}`), null);
  assert.equal((await s.request({ action: "state", code: next.code, deviceId: student() })).status, 404);
});
test("concurrent votes are not lost; racing a close cannot resurrect the room", async () => {
  const s = setup(), room = await s.create();
  await s.request({ action: "focus", code: room.code, itemId: "story" }, room.token);
  const results = await Promise.all(Array.from({ length: 30 }, (_, i) => s.request({ action: "vote", code: room.code, itemId: "story", choice: i % 4, deviceId: student(i) })));
  assert.ok(results.every((r) => r.status === 200));
  const state = await s.request({ action: "state", code: room.code }, room.token);
  assert.equal(state.data.results.story.total, 30); assert.equal(state.data.devices, 30);
  await Promise.all([s.request({ action: "close", code: room.code }, room.token), s.request({ action: "vote", code: room.code, itemId: "story", choice: 1, deviceId: student(50) })]);
  assert.equal(await s.store.get(`levlab:live:room:${room.code}`), null);
});
test("same-device and IP abuse rate limits return 429 and Retry-After", async () => {
  const s = setup(), room = await s.create();
  await s.request({ action: "focus", code: room.code, itemId: "story" }, room.token);
  let response;
  for (let i = 0; i < 31; i++) response = await s.request({ action: "vote", code: room.code, itemId: "story", choice: 0, deviceId: student() });
  assert.equal(response.status, 429); assert.equal(response.headers.get("retry-after"), "60");
  s.advance(60001);
  assert.equal((await s.request({ action: "vote", code: room.code, itemId: "story", choice: 1, deviceId: student() })).status, 200);
  for (let i = 0; i < 20; i++) response = await s.request({ action: "create", lesson: "g1-09" });
  assert.equal(response.status, 429);
});
test("deployment disables memory fallback, accepts either Upstash credential naming, never exposes secrets", async () => {
  assert.equal(storageConfig({ VERCEL: "1" }).kind, "disabled");
  assert.equal(storageConfig({ NODE_ENV: "production" }).kind, "disabled");
  assert.equal(storageConfig({ NODE_ENV: "development" }).kind, "memory");
  assert.equal(storageConfig({ VERCEL: "1", KV_REST_API_URL: "https://db", UPSTASH_REDIS_REST_TOKEN: "unrelated" }).kind, "disabled");
  assert.equal(storageConfig({ VERCEL: "1", KV_REST_API_URL: "https://db", KV_REST_API_TOKEN: "token" }).kind, "upstash");
  assert.equal(storageConfig({ UPSTASH_REDIS_REST_URL: "https://db/", UPSTASH_REDIS_REST_TOKEN: "token" }).url, "https://db");
  const handle = createLiveHandler({ store: createStore({ config: { kind: "disabled" } }) });
  const data = await (await handle(new Request("http://localhost/api/live"))).json();
  assert.deepEqual(data, { enabled: false, message: "수업방은 준비 중이에요" });
});
test("REST store uses fixed TTL and atomic CAS; outages never write to memory", async () => {
  const calls = [];
  const store = createStore({ config: { kind: "upstash", url: "https://db.test", token: "secret" }, fetcher: async (_url, options) => {
    calls.push(JSON.parse(options.body)); return Response.json({ result: calls.at(-1)[0] === "SET" ? "OK" : 1 });
  } });
  await store.create("key", "a"); await store.compareSwap("key", "a", "b"); await store.compareSwap("key", "b", null);
  assert.deepEqual(calls[0], ["SET", "key", "a", "NX", "EX", 10800]);
  assert.equal(calls[1][0], "EVAL"); assert.match(calls[1][1], /KEEPTTL/); assert.equal(calls[2].at(-1), "");
  const unavailable = createLiveHandler({ store: createStore({ config: { kind: "upstash", url: "https://db.test", token: "secret" }, fetcher: async () => { throw Error("offline"); } }) });
  const result = await unavailable(new Request("http://localhost/api/live", { method: "POST", headers: { "content-type": "application/json" }, body: '{"action":"create","lesson":"g1-09"}' }));
  assert.equal(result.status, 503);
});
test("request validation: size, JSON, origin, device, lesson traversal", async () => {
  const s = setup(), room = await s.create();
  assert.equal((await s.request({ action: "post", text: "가".repeat(2000) })).status, 413);
  assert.equal((await s.request({ action: "create", lesson: "g1-09" }, null, { origin: "https://elsewhere.test" })).status, 403);
  assert.equal((await s.request({ action: "state", code: room.code, deviceId: "bad" })).status, 400);
  const broken = await s.handler(new Request("http://localhost/api/live", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }));
  assert.equal(broken.status, 400);
  const actual = createLiveHandler({ store: createStore({ config: { kind: "memory" } }) });
  const req = (lesson) => actual(new Request("http://localhost/api/live", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "create", lesson }) }));
  assert.equal((await req("../../package")).status, 400);
  assert.equal((await req("g1-09")).status, 200);
});
