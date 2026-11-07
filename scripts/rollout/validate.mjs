#!/usr/bin/env node
/** Validate authored kits, including planned (not yet generated) image assets. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SLIDE_TYPES = new Set('title video question goals journey picture story cards activity ask compare exit next end'.split(' '));
const SECTION_TYPES = new Set('boxes table pairs choose scale lines exit illusion reasons frames convert'.split(' '));
const STAGES = new Set(['도입', '이해하기', '연습하기', '적용하기', '정리']);
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
const string = value => typeof value === 'string' && value.trim().length > 0;
const file = p => { try { return fs.statSync(p).isFile(); } catch { return false; } };

export function validateLesson(slug, root = ROOT) {
  const errors = [], warnings = [];
  const fail = message => errors.push(message);
  const warn = message => warnings.push(message);
  if (!/^[a-z0-9-]+$/.test(slug)) return { slug, status: 'FAIL', errors: ['Invalid slug'], warnings };
  function read(kind) {
    const name = `content/${kind}/${slug}.json`;
    try { return JSON.parse(fs.readFileSync(path.join(root, name), 'utf8')); }
    catch (error) { fail(`${name}: ${error.code === 'ENOENT' ? 'missing file' : `invalid JSON (${error.message})`}`); return undefined; }
  }
  function textField(value, where) { if (!string(value)) fail(`${where}: required nonempty string`); }
  function list(value, where, min = 0, max = Infinity, strings = true) {
    if (!Array.isArray(value)) { fail(`${where}: required array`); return []; }
    if (value.length < min || value.length > max) fail(`${where}: expected ${min}–${max === Infinity ? 'many' : max} items, got ${value.length}`);
    if (strings) value.forEach((v, i) => textField(v, `${where}[${i}]`));
    return value;
  }
  function record(value, where) { if (!object(value)) { fail(`${where}: expected object`); return false; } return true; }
  function versioned(value, where) {
    if (!record(value, where)) return false;
    if (value.slug !== slug) fail(`${where}.slug: expected ${slug}`);
    if (!Number.isInteger(value.version) || value.version < 1) fail(`${where}.version: required positive integer`);
    return true;
  }
  function short(value, max, where) {
    if (typeof value === 'string' && [...value].length > max) warn(`${where}: ${[...value].length} characters (recommended ≤ ${max})`);
  }
  const art = read('art'), planned = new Set();
  if (art !== undefined) list(art, 'art', 0, Infinity, false).forEach((entry, i) => {
    const where = `art[${i}]`;
    if (!record(entry, where)) return;
    textField(entry.prompt, `${where}.prompt`);
    if (!string(entry.out) || !entry.out.startsWith(`public/images/slides/${slug}/`) || !entry.out.endsWith('.webp') || entry.out.split('/').some(p => p === '..' || p === '.')) {
      fail(`${where}.out: expected public/images/slides/${slug}/*.webp`); return;
    }
    if (planned.has(entry.out)) fail(`${where}.out: duplicate ${entry.out}`);
    planned.add(entry.out);
  });
  function asset(src, where) {
    if (!string(src) || !src.startsWith('/') || src.includes('..') || src.includes('\\')) { fail(`${where}: expected a local /public-relative path`); return; }
    const out = `public${src}`;
    if (!file(path.join(root, out)) && !planned.has(out)) fail(`${where}: missing asset and art entry: ${src}`);
  }
  const deck = read('slides');
  if (deck !== undefined && versioned(deck, 'slides')) {
    const ids = new Set(); let lives = 0;
    list(deck.slides, 'slides.slides', 1, Infinity, false).forEach((s, i) => {
      const w = `slides[${i + 1}]`;
      if (!record(s, w)) return;
      if (!SLIDE_TYPES.has(s.type)) fail(`${w}.type: unsupported ${s.type}`);
      if (s.stage !== undefined && !STAGES.has(s.stage)) fail(`${w}.stage: invalid ${s.stage}`);
      short(s.heading, 30, `${w}.heading`); short(s.story, 120, `${w}.story`);
      for (const field of ['steps', 'ask']) if (s[field] !== undefined || (s.type === 'ask' && field === 'ask')) list(s[field], `${w}.${field}`, s.type === 'ask' && field === 'ask' ? 1 : 0).forEach((v, j) => short(v, 60, `${w}.${field}[${j}]`));
      if (s.type === 'ask' && s.steps?.length > 3) warn(`${w}.steps: ${s.steps.length} instructions (recommended ≤ 3 on ask slides)`);
      if (s.image !== undefined && record(s.image, `${w}.image`)) asset(s.image.src, `${w}.image.src`);
      if (s.timer !== undefined && (typeof s.timer !== 'number' || s.timer <= 0)) fail(`${w}.timer: expected positive minutes`);
      if (s.type === 'goals') list(s.goals, `${w}.goals`, 3, 3);
      if (s.type === 'story') {
        textField(s.story, `${w}.story`);
        list(s.choices, `${w}.choices`, 2, s.live?.kind === 'vote' ? 8 : 6);
      }
      if (s.type === 'cards') list(s.cards, `${w}.cards`, 2, 4, false).forEach((c, j) => {
        if (record(c, `${w}.cards[${j}]`)) for (const key of ['title', 'text', 'example']) textField(c[key], `${w}.cards[${j}].${key}`);
      });
      if (s.type === 'compare') for (const side of ['left', 'right']) {
        if (record(s[side], `${w}.${side}`)) { textField(s[side].label, `${w}.${side}.label`); list(s[side].items, `${w}.${side}.items`, 3, 3); }
      }
      if (s.type === 'exit') textField(s.prompt, `${w}.prompt`);
      if (s.type === 'end') textField(s.message, `${w}.message`);
      if (s.type === 'video' && record(s.video, `${w}.video`)) {
        textField(s.video.src, `${w}.video.src`); textField(s.video.poster, `${w}.video.poster`);
      }
      if (s.rows !== undefined) list(s.rows, `${w}.rows`, 0, 4);
      if (s.toy?.prompt !== undefined) textField(s.toy.prompt, `${w}.toy.prompt`);
      if (s.live?.title !== undefined) textField(s.live.title, `${w}.live.title`);
      if (s.frames !== undefined) list(s.frames, `${w}.frames`);
      if (s.app !== undefined && record(s.app, `${w}.app`)) { textField(s.app.name, `${w}.app.name`); textField(s.app.url, `${w}.app.url`); }
      if (s.toy !== undefined && record(s.toy, `${w}.toy`)) {
        if (!['tally', 'roulette', 'flip', ...(slug === 'g1-09' ? ['hint'] : [])].includes(s.toy.kind)) fail(`${w}.toy.kind: unsupported ${s.toy.kind}`);
        if (s.toy.kind === 'tally' && (s.type !== 'story' || !Array.isArray(s.choices) || s.choices.length < 2)) fail(`${w}.toy: tally needs a story with choices`);
        if (s.toy.kind === 'flip' && s.type !== 'compare') fail(`${w}.toy: flip needs compare`);
        if (s.toy.kind === 'roulette') { textField(s.toy.label, `${w}.toy.label`); list(s.toy.items, `${w}.toy.items`, 1); }
      }
      if (s.live !== undefined && record(s.live, `${w}.live`)) {
        lives++;
        if (!string(s.live.id) || !/^[a-z0-9-]{1,80}$/.test(s.live.id)) fail(`${w}.live.id: expected /^[a-z0-9-]{1,80}$/`);
        if (ids.has(s.live.id)) fail(`${w}.live.id: duplicate ${s.live.id}`);
        ids.add(s.live.id); textField(s.live.prompt, `${w}.live.prompt`);
        if (s.live.kind === 'vote') {
          if (!Array.isArray(s.choices) || s.choices.length < 2 || s.choices.length > 8) fail(`${w}.live: vote needs 2–8 choices on this slide`);
        } else if (s.live.kind === 'wall') {
          if (!Number.isInteger(s.live.max) || s.live.max < 1 || s.live.max > 200) fail(`${w}.live.max: expected integer 1–200`);
        } else fail(`${w}.live.kind: expected vote or wall`);
      }
    });
    if (lives < 2 || lives > 3) warn(`slides.live: ${lives} items (recommended 2–3)`);
  }
  const worksheet = read('worksheets');
  if (worksheet !== undefined && versioned(worksheet, 'worksheet')) {
    if (worksheet.cardTip !== undefined) textField(worksheet.cardTip, "worksheet.cardTip");
    if (worksheet.art) asset(worksheet.art, 'worksheet.art');
    list(worksheet.sections, 'worksheet.sections', 1, Infinity, false).forEach((s, i) => {
      const w = `worksheet.sections[${i + 1}]`;
      if (!record(s, w)) return;
      if (!SECTION_TYPES.has(s.type)) { fail(`${w}.type: unsupported ${s.type}`); return; }
      if (!STAGES.has(s.stage)) fail(`${w}.stage: invalid ${s.stage}`);
      textField(s.title, `${w}.title`); short(s.title, 30, `${w}.title`);
      switch (s.type) {
        case 'boxes': case 'reasons':
          list(s.boxes, `${w}.boxes`, 2, 4, false).forEach((b, j) => {
            if (record(b, `${w}.boxes[${j}]`)) for (const k of ['title', 'hint']) textField(b[k], `${w}.boxes[${j}].${k}`);
          });
          if (s.type === 'reasons') textField(s.chose, `${w}.chose`);
          break;
        case 'table': case 'frames':
          list(s.frames, `${w}.frames`, 2, 4); list(s.rows, `${w}.rows`, 2, 4);
          if (s.type === 'frames') textField(s.check, `${w}.check`);
          break;
        case 'pairs': case 'convert':
          if (s.type === 'pairs') list(s.labels, `${w}.labels`, 2, 2);
          list(s.examples, `${w}.examples`, 0, Infinity, false).forEach((pair, j) => list(pair, `${w}.examples[${j}]`, 2, 2));
          if ((s.type === 'pairs' || s.blank !== undefined) && (!Number.isInteger(s.blank) || s.blank < 0)) fail(`${w}.blank: expected nonnegative integer`);
          break;
        case 'choose': list(s.options, `${w}.options`, 6, 16); textField(s.then, `${w}.then`); break;
        case 'scale': list(s.items, `${w}.items`, 3, 6); list(s.scale, `${w}.scale`, 4, 4); break;
        case 'lines':
          textField(s.prompt, `${w}.prompt`);
          if (!Number.isInteger(s.lines) || s.lines < 3 || s.lines > 6) fail(`${w}.lines: expected integer 3–6`);
          break;
        case 'exit':
          textField(s.prompt, `${w}.prompt`);
          list(s.meta, `${w}.meta`, 1, 4, false).forEach((m, j) => {
            if (record(m, `${w}.meta[${j}]`)) for (const k of ['title', 'hint']) textField(m[k], `${w}.meta[${j}].${k}`);
          });
          break;
        case 'illusion':
          list(s.pictures, `${w}.pictures`, 1, Infinity, false).forEach((p, j) => {
            if (record(p, `${w}.pictures[${j}]`)) { asset(p.src, `${w}.pictures[${j}].src`); list(p.options, `${w}.pictures[${j}].options`, 2); }
          });
          textField(s.reflect, `${w}.reflect`); break;
      }
    });
    if (worksheet.cardSets !== undefined) list(worksheet.cardSets, 'worksheet.cardSets', 0, Infinity, false).forEach((set, i) => {
      const w = `worksheet.cardSets[${i}]`;
      if (!record(set, w)) return;
      textField(set.title, `${w}.title`);
      if (set.note !== undefined) textField(set.note, `${w}.note`);
      list(set.cards, `${w}.cards`, 2, 60, false).forEach((c, j) => {
        if (!record(c, `${w}.cards[${j}]`)) return;
        textField(c.front, `${w}.cards[${j}].front`);
        if (typeof c.front === 'string' && [...c.front].length > 20) fail(`${w}.cards[${j}].front: maximum 20 characters`);
        if (c.back !== undefined) textField(c.back, `${w}.cards[${j}].back`);
      });
    });
    if (worksheet.cards !== undefined) list(worksheet.cards, 'worksheet.cards', 0, 4, false).forEach((c, i) => {
      const w = `worksheet.cards[${i}]`;
      if (!record(c, w)) return;
      if (c.no === undefined) fail(`${w}.no: required`);
      textField(c.title, `${w}.title`); textField(c.story, `${w}.story`); short(c.story, 120, `${w}.story`);
      asset(c.image, `${w}.image`);
    });
  }
  const teaser = read('teasers');
  if (teaser !== undefined && versioned(teaser, 'teaser')) {
    const scenes = list(teaser.scenes, 'teaser.scenes', 5, 7, false);
    if (scenes.at(-1)?.kind !== 'title') fail('teaser.scenes: last scene must be title');
    scenes.forEach((s, i) => {
      const w = `teaser.scenes[${i + 1}]`;
      if (!record(s, w)) return;
      textField(s.say, `${w}.say`);
      if (!['image', 'title'].includes(s.kind)) fail(`${w}.kind: expected image or title`);
      if (s.kind === 'image') asset(s.image, `${w}.image`);
      if (s.clip !== undefined && (typeof s.clip !== 'string' || !new RegExp(`^content/teasers/clips/${slug}-[a-z0-9-]+\\.mp4$`).test(s.clip))) fail(`${w}.clip: expected content/teasers/clips/${slug}-*.mp4`);
    });
  }
  return { slug, status: errors.length ? 'FAIL' : warnings.length ? 'WARN' : 'PASS', errors, warnings };
}

export function main(slugs = process.argv.slice(2), root = ROOT) {
  if (!slugs.length) {
    const lessons = JSON.parse(fs.readFileSync(path.join(root, 'content/lessons.json'), 'utf8')).lessons;
    slugs = lessons.filter(l => ['published', 'core'].includes(l.status)).map(l => l.slug);
  }
  const results = [...new Set(slugs)].map(slug => validateLesson(slug, root));
  console.log('LESSON       RESULT  ERRORS  WARNINGS');
  for (const r of results) console.log(`${r.slug.padEnd(12)} ${r.status.padEnd(7)} ${String(r.errors.length).padEnd(7)} ${r.warnings.length}`);
  for (const r of results) {
    for (const message of r.errors) console.log(`FAIL ${r.slug}: ${message}`);
    for (const message of r.warnings) console.log(`WARN ${r.slug}: ${message}`);
  }
  console.log(`${results.length} lessons: ${results.filter(r => r.status === 'PASS').length} PASS, ${results.filter(r => r.status === 'WARN').length} WARN, ${results.filter(r => r.status === 'FAIL').length} FAIL`);
  return results.some(r => r.status === 'FAIL') ? 1 : 0;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = main(); }
  catch (error) { console.error(`FAIL: ${error.message}`); process.exitCode = 1; }
}
