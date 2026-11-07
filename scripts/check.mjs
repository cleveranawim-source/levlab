import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { ORIGIN, PAGE_META } from "../lib/pageMeta.js";

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const { standards } = await readJson("../content/standards.json");
const { lessons } = await readJson("../content/lessons.json");
assert(Array.isArray(standards) && standards.length, "standards must be a nonempty array");
assert(Array.isArray(lessons), "lessons must be an array");
const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
const codes = new Set();
for (const standard of standards) {
  assert(/^\d{2}-\d{2}$/.test(standard.code), `Invalid standard code: ${standard.code}`);
  assert(!codes.has(standard.code), `Duplicate standard: ${standard.code}`);
  assert(nonempty(standard.skill) && nonempty(standard.area), `Missing skill/area: ${standard.code}`);
  codes.add(standard.code);
}
const slugs = new Set();
for (const lesson of lessons) {
  assert(typeof lesson.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lesson.slug), `Invalid slug: ${lesson.slug}`);
  assert(!slugs.has(lesson.slug), `Duplicate lesson slug: ${lesson.slug}`);
  assert([1, 2, 3].includes(lesson.grade), `Invalid grade: ${lesson.slug}`);
  assert(nonempty(lesson.title), `Missing lesson title: ${lesson.slug}`);
  assert(codes.has(lesson.standard), `Unknown standard ${lesson.standard}: ${lesson.slug}`);
  assert(["draft", "published"].includes(lesson.status), `Invalid status: ${lesson.slug}`);
  slugs.add(lesson.slug);
}
console.log(`Content valid: ${standards.length} standards, ${lessons.length} unique lessons`);

const publicPaths = [
  ...Object.keys(PAGE_META), "/curriculum",
  ...[1, 2, 3].map((grade) => `/curriculum/grade-${grade}`),
  ...standards.map(({ code }) => `/standards/${code}`),
  ...lessons.filter(({ status }) => status === "published").map(({ slug }) => `/lessons/${slug}`),
];
const allPaths = [...new Set([...publicPaths, ...lessons.map(({ slug }) => `/lessons/${slug}`)])];
const manifest = await readJson("../.next/prerender-manifest.json");
for (const path of allPaths) assert(manifest.routes[path], `Not statically generated: ${path}`);

// Use a temporary local production server, without depending on an existing dev session.
const reservation = createServer();
reservation.listen(0, "127.0.0.1");
await once(reservation, "listening");
const { port } = reservation.address();
await new Promise((resolve) => reservation.close(resolve));
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: new URL("..", import.meta.url), stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
server.stdout.on("data", (chunk) => { output += chunk; });
server.stderr.on("data", (chunk) => { output += chunk; });
const base = `http://127.0.0.1:${port}`;
const request = (path, options = {}) => fetch(`${base}${path}`, { redirect: "manual", signal: AbortSignal.timeout(10000), ...options });
const cleanup = () => { if (server.exitCode === null) server.kill("SIGTERM"); };
process.once("SIGINT", cleanup);
process.once("SIGTERM", cleanup);
try {
  let ready = false;
  for (let attempt = 0; attempt < 150; attempt++) {
    if (server.exitCode !== null) throw new Error(`next start exited early:\n${output}`);
    try { ready = (await request("/robots.txt")).ok; } catch { /* Booting. */ }
    if (ready) break;
    await delay(200);
  }
  assert(ready, `next start did not become ready:\n${output}`);
  const sitemapResponse = await request("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200, "sitemap HTTP status");
  const sitemap = await sitemapResponse.text();
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls.sort(), publicPaths.map((path) => new URL(path, ORIGIN).href).sort(), "Sitemap must include all public pages and only published lessons");
  for (const path of allPaths) {
    const response = await request(path);
    assert.equal(response.status, 200, `${path} HTTP status`);
    const html = await response.text();
    const head = html.split("</head>")[0];
    const canonical = head.match(/<link rel="canonical" href="([^"]+)"/);
    assert(canonical && new URL(canonical[1]).href === new URL(path, ORIGIN).href, `${path} server canonical`);
    assert(/<title>.+?<\/title>/.test(head), `${path} server title`);
    assert(head.includes('property="og:image" content="https://www.levlab.co.kr/img/hero.jpg"'), `${path} absolute OG image`);
    const lesson = lessons.find(({ slug }) => path === `/lessons/${slug}`);
    if (lesson?.status !== "published" && lesson) assert(head.includes('name="robots" content="noindex, nofollow"'), `${path} draft robots`);
  }
  for (const path of ["/lessons/g1-09/slides", "/files/slides/g1-09.pptx"]) {
    assert.equal((await request(path)).status, 200, `${path} must be served`);
  }
  for (const [path, to] of [["/lessons", "/curriculum"], ["/standards", "/curriculum#by-skill-h"], ["/lessons/g2-01", "/curriculum/grade-2"], ["/index.html", "/"]]) {
    const res = await request(path, { redirect: "manual" });
    assert.ok([307, 308].includes(res.status) && res.headers.get("location")?.endsWith(to), `${path} must redirect to ${to} (got ${res.status} ${res.headers.get("location")})`);
  }
  for (const path of ["/__check_unknown__", "/curriculum/grade-4", "/curriculum/grade-01", "/standards/99-99", "/lessons/not-a-lesson"]) {
    assert.equal((await request(path)).status, 404, `${path} GET must return real HTTP 404`);
    assert.equal((await request(path, { method: "HEAD" })).status, 404, `${path} HEAD must return real HTTP 404`);
  }
  for (const page of ["support", "privacy"]) {
    const original = await readFile(new URL(`../public/gangdannote/${page}/index.html`, import.meta.url), "utf8");
    for (const slash of ["", "/"]) {
      const path = `/gangdannote/${page}${slash}`;
      const response = await request(path);
      assert.equal(response.status, 200, `${path} must return 200 without redirects`);
      assert.equal(await response.text(), original, `${path} must preserve original HTML`);
    }
  }
  console.log(`PASS: ${urls.length} sitemap URLs, ${allPaths.length} static pages with server metadata, draft noindex, 5 real 404s (GET/HEAD), 4 original gangdannote URLs`);
} catch (error) {
  console.error(output);
  throw error;
} finally {
  cleanup();
  if (server.exitCode === null) await once(server, "exit");
  process.removeListener("SIGINT", cleanup);
  process.removeListener("SIGTERM", cleanup);
}
