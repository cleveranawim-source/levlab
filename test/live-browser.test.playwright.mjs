// Run against `npm run dev` (memory mode), using existing external test tools:
// PLAYWRIGHT_MODULE=/path/to/playwright-core/index.mjs AXE_PATH=/path/to/axe.min.js
// LIVE_BASE_URL=http://localhost:3110 node test/live-browser.test.playwright.mjs
// No npm dependency is added to the app. This test creates and deletes a local room.
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const axe = await readFile(process.env.AXE_PATH || "node_modules/axe-core/axe.min.js", "utf8");
const base = process.env.LIVE_BASE_URL || "http://localhost:3110";
assert.match(base, /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/);
const out = path.resolve("docs/audit/slides/live");
await mkdir(out, { recursive: true });
const deck = JSON.parse(await readFile("content/slides/g1-09.json", "utf8"));
const story = deck.slides.findIndex((slide) => slide.live?.kind === "vote") + 1;
const wall = deck.slides.findIndex((slide) => slide.live?.id === "different-words") + 1;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const errors = [], audits = [], screenshots = [];
let teacher, room;
async function screenshot(page, name) {
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true }); screenshots.push(`${name}.png`);
}
async function audit(page, name) {
  await page.addScriptTag({ content: axe });
  const result = await page.evaluate(async () => {
    const scan = await axe.run(document, { rules: { "color-contrast": { enabled: true } } });
    return { violations: scan.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })), passes: scan.passes.length, overflow: document.documentElement.scrollWidth > innerWidth };
  });
  audits.push({ name, ...result });
  await writeFile(path.join(out, "browser-results.json"), JSON.stringify({ audits, errors, screenshots }, null, 2));
  assert.deepEqual(result.violations, [], `${name}: axe violations`);
  assert.equal(result.overflow, false, `${name}: horizontal overflow`);
}
async function until(fn, message) {
  for (let i = 0; i < 50; i++) { if (await fn()) return; await new Promise((resolve) => setTimeout(resolve, 200)); }
  throw new Error(message);
}
try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, colorScheme: "light" });
  teacher = await context.newPage(); teacher.on("pageerror", (error) => errors.push(error.message));
  await teacher.goto(`${base}/lessons/g1-09/slides#1`);
  await teacher.getByRole("button", { name: "수업방 열기", exact: true }).click();
  await teacher.getByRole("dialog").waitFor();
  room = await teacher.evaluate(() => JSON.parse(sessionStorage.getItem("levlab-live-teacher:g1-09")));
  assert.match(room.code, /^\d{6}$/);
  await screenshot(teacher, "01-teacher-qr");
  const students = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, colorScheme: "light" });
    const page = await ctx.newPage(); page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/live?c=${room.code}`);
    await until(async () => await page.locator("#live-code").inputValue() === room.code, "QR code was not prefilled");
    if (i === 0) { await audit(page, "join-360"); await screenshot(page, "02-student-join"); }
    await page.getByRole("button", { name: "수업방 들어가기" }).click();
    await page.getByRole("heading", { name: "선생님 화면을 봐 주세요" }).waitFor();
    students.push(page);
  }
  await audit(students[0], "waiting-360"); await screenshot(students[0], "03-student-waiting");
  await until(async () => /3대/.test((await teacher.locator(".live-device-count").innerText()).replace(/\s/g, "")), "three devices did not join");
  await screenshot(teacher, "04-teacher-three-devices");
  await teacher.getByRole("button", { name: "QR 접기", exact: true }).click();
  await teacher.evaluate((number) => { location.hash = String(number); }, story);
  for (let i = 0; i < students.length; i++) {
    await students[i].locator(".live-vote-option").first().waitFor();
    await students[i].locator(".live-vote-option").nth(i % 2).click();
    await students[i].getByRole("status").filter({ hasText: "내 생각을 보냈어요" }).waitFor();
  }
  await students[0].locator(".live-vote-option").nth(2).click();
  await until(async () => (await teacher.locator(".live-slot-vote .live-result-heading").innerText()).includes("3표"), "three votes missing");
  await audit(students[0], "vote-360"); await screenshot(students[0], "05-student-vote"); await screenshot(teacher, "06-teacher-votes");
  await teacher.reload();
  await until(async () => (await teacher.locator(".live-slot-vote .live-result-heading").innerText()).includes("3표"), "teacher room did not restore");
  assert.equal(await teacher.evaluate(() => JSON.parse(sessionStorage.getItem("levlab-live-teacher:g1-09")).code), room.code);
  await teacher.evaluate((number) => { location.hash = String(number); }, wall);
  const texts = ["너는 그렇게 느꼈구나.", "나는 이렇게 보았어.", "어떻게 그렇게 생각하게 됐어?"];
  for (let i = 0; i < students.length; i++) {
    await students[i].locator("#live-sentence").waitFor();
    await students[i].locator("#live-sentence").fill(texts[i]);
    await students[i].getByRole("button", { name: "큰 화면에 문장 보내기" }).click();
    await students[i].getByRole("status").filter({ hasText: "문장이 큰 화면에 붙었어요" }).waitFor();
  }
  await until(async () => await teacher.locator(".live-wall-card").count() === 3, "wall did not receive all three posts");
  await audit(students[0], "wall-360"); await screenshot(students[0], "07-student-wall"); await screenshot(teacher, "08-teacher-wall");
  await students[0].locator("#live-sentence").fill("연락해 010-1234-5678");
  await students[0].getByRole("button", { name: "큰 화면에 문장 보내기" }).click();
  await students[0].getByRole("alert").filter({ hasText: "다시 써 볼까요" }).waitFor();
  await audit(students[0], "rejected-360"); await screenshot(students[0], "09-student-rewrite");
  await teacher.getByRole("button", { name: `문장 숨기기: ${texts[1]}`, exact: true }).click();
  await until(async () => await teacher.locator(".live-wall-card").count() === 2, "hide did not remove post");
  assert.match(await teacher.locator(".live-hidden-count").innerText(), /숨긴 글 1개/);
  const studentState = await students[1].evaluate(async (code) => (await fetch("/api/live", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "state", code, deviceId: localStorage.getItem("levlab-live-device") }) })).json(), room.code);
  assert.equal(studentState.results[studentState.active.id].hiddenCount, undefined);
  assert.equal(JSON.stringify(studentState).includes(texts[1]), false);
  await screenshot(teacher, "10-teacher-hidden");
  await teacher.mouse.move(1600, 1000);
  await teacher.getByRole("button", { name: new RegExp(`수업방 ${room.code}`) }).click();
  await teacher.getByRole("button", { name: "수업방 닫기 · 응답 삭제", exact: true }).click();
  for (const page of students) await page.getByRole("alert").filter({ hasText: "닫혔거나 시간이 지났어요" }).waitFor();
  await screenshot(students[0], "11-student-closed"); await audit(students[0], "closed-360");
  await screenshot(teacher, "12-teacher-closed");
  assert.equal(await teacher.locator(".live-slot").count(), 0);
  const disabledCtx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await disabledCtx.route("**/api/live", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ enabled: false, message: "수업방은 준비 중이에요" }) }));
  const disabledPage = await disabledCtx.newPage();
  await disabledPage.goto(`${base}/lessons/g1-09/slides#1`);
  await disabledPage.getByText("수업방은 준비 중이에요", { exact: true }).waitFor();
  await screenshot(disabledPage, "13-teacher-storage-disabled");
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, contexts: 3, viewport: "360×800 / 1920×1080", audits: audits.map((a) => ({ name: a.name, violations: a.violations.length })), screenshots }, null, 2));
} finally {
  // Also delete the test room on assertion failure.
  if (teacher && room) await teacher.evaluate(async ({ code, token }) => { await fetch("/api/live", { method: "POST", headers: { "content-type": "application/json", "x-teacher-token": token }, body: JSON.stringify({ action: "close", code }) }); }, room).catch(() => {});
  await writeFile(path.join(out, "browser-results.json"), JSON.stringify({ audits, errors, screenshots }, null, 2));
  await browser.close();
}
