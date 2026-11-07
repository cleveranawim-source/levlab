import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateLesson, main } from './validate.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-validator-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const slug = 'g1-test', art = `/images/slides/${slug}/story.webp`;
  const specs = {
    art: [{ out: `public${art}`, prompt: '교실 이야기' }],
    slides: { slug, version: 1, slides: [
      { type: 'story', stage: '도입', heading: '이야기', story: '친구를 만나요.', image: { src: art }, choices: ['나', '친구'], live: { kind: 'vote', id: 'story', prompt: '누구의 이야기인가요?' } },
      { type: 'exit', prompt: '나는 ____을 배웠어요.', live: { kind: 'wall', id: 'exit', max: 60, prompt: '한 문장을 보내요.' } },
    ] },
    worksheets: { slug, version: 1, cards: [], sections: [
      { type: 'boxes', boxes: [{ title: '나', hint: '생각' }, { title: '친구', hint: '생각' }] },
      { type: 'table', frames: ['나', '친구'], rows: ['생각', '마음'] },
      { type: 'pairs', labels: ['전', '후'], examples: [['왜?', '무슨 일이야?']], blank: 2 },
      { type: 'choose', options: ['기쁨', '슬픔', '분노', '두려움', '놀람', '평온'], then: '이유를 써요.' },
      { type: 'scale', items: ['하나', '둘', '셋'], scale: ['전혀', '가끔', '자주', '늘'] },
      { type: 'lines', prompt: '나의 생각', lines: 3 },
      { type: 'exit', prompt: '나는 ____', meta: [{ title: '배운 점', hint: '짧게' }] },
    ].map(s => ({ ...s, title: '활동', stage: '연습하기' })) },
    teasers: { slug, version: 1, scenes: [
      ...Array.from({ length: 4 }, () => ({ kind: 'image', image: art, say: '어떤 이야기일까요?', clip: `content/teasers/clips/${slug}-story.mp4`, clipPrompt: 'Ignored by renderer.' })),
      { kind: 'title', say: '함께 알아볼까요?' },
    ] },
  };
  function write() { for (const [kind, spec] of Object.entries(specs)) { const dir = path.join(root, 'content', kind); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(spec)); } }
  write(); return { root, slug, specs, write, run: () => validateLesson(slug, root) };
}

test('accepts all generic sections and planned assets without generating art', t => {
  const f = fixture(t); assert.equal(f.run().status, 'PASS');
  assert.equal(main([f.slug], f.root), 0);
});

test('checks live IDs, choice boundaries, wall max and toy kind', t => {
  const f = fixture(t), s = f.specs.slides.slides;
  s[0].choices = Array.from({ length: 8 }, (_, i) => `선택 ${i}`); f.write(); assert.equal(f.run().status, 'PASS');
  s[0].choices.push('아홉'); s[1].live.id = 'story'; s[1].live.max = 201; s[1].toy = { kind: 'hint' }; f.write();
  const r = f.run(); assert.equal(r.status, 'FAIL');
  for (const fragment of ['vote needs 2–8', 'duplicate story', 'integer 1–200', 'unsupported hint']) assert.ok(r.errors.some(e => e.includes(fragment)), fragment);
  s[1].live.id = 'BAD ID'; f.write(); assert.ok(f.run().errors.some(e => e.includes('expected /^[a-z0-9-]')));
});

test('rejects missing fields, bad paths, malformed JSON and slug/version mismatches', t => {
  const f = fixture(t);
  delete f.specs.teasers.version; f.specs.worksheets.slug = 'wrong';
  delete f.specs.worksheets.sections[0].boxes;
  f.specs.teasers.scenes[0].clip = '../secret.mp4'; f.specs.teasers.scenes.at(-1).kind = 'image';
  f.specs.slides.slides[0].image.src = '/images/missing.webp'; f.specs.slides.slides[0].type = 'unknown'; f.specs.slides.slides[0].stage = 'unknown';
  f.write(); const r = f.run();
  for (const fragment of ['version', 'expected g1-test', '.boxes', '.clip', 'last scene', 'missing asset', '.type', '.stage']) assert.ok(r.errors.some(e => e.includes(fragment)), fragment);
  fs.writeFileSync(path.join(f.root, 'content/art', `${f.slug}.json`), '{'); assert.ok(f.run().errors.some(e => e.includes('invalid JSON')));
  fs.unlinkSync(path.join(f.root, 'content/art', `${f.slug}.json`)); assert.ok(f.run().errors.some(e => e.includes('missing file')));
});

test('warnings do not fail a valid kit; published/core default selection', t => {
  const f = fixture(t); delete f.specs.slides.slides[1].live;
  Object.assign(f.specs.slides.slides[0], { heading: '가'.repeat(31), story: '가'.repeat(121), steps: ['가'.repeat(61)], ask: ['가'.repeat(61)] });
  f.write(); assert.equal(f.run().status, 'WARN'); assert.equal(f.run().warnings.length, 5);
  fs.writeFileSync(path.join(f.root, 'content/lessons.json'), JSON.stringify({ lessons: [{ slug: f.slug, status: 'published' }, { slug: 'ignored', status: 'draft' }] }));
  assert.equal(main([], f.root), 0);
});

test('malformed section/slide entries return errors instead of crashing', t => {
  const f = fixture(t); f.specs.slides.slides.push(null); f.specs.worksheets.sections.push(null); f.specs.teasers.scenes.push(null); f.write();
  assert.equal(f.run().status, 'FAIL'); assert.equal(main([f.slug], f.root), 1);
});


test('validates optional printable card sets and front length', t => {
  const f = fixture(t);
  f.specs.worksheets.cardSets = [{ title: '감정 카드', note: '잘라 써요.', cards: Array.from({ length: 40 }, () => ({ front: '설렘', back: '새 일을 기다리는 마음' })) }];
  f.write(); assert.equal(f.run().status, 'PASS');
  f.specs.worksheets.cardSets[0].cards[0].front = '가'.repeat(21); f.write();
  assert.ok(f.run().errors.some(e => e.includes('maximum 20')));
  f.specs.worksheets.cardSets[0].cards = [{ front: '' }]; f.write();
  assert.ok(f.run().errors.some(e => e.includes('2–60')));
  assert.ok(f.run().errors.some(e => e.includes('.front')));
});


test('JSON null is invalid, not treated as a missing optional document', t => {
  const f = fixture(t);
  for (const kind of Object.keys(f.specs)) f.specs[kind] = null;
  f.write(); assert.equal(f.run().errors.length, 4); assert.equal(f.run().status, 'FAIL');
});

test('activity rows are optional and limited to four text labels', t => {
  const f = fixture(t);
  f.specs.slides.slides.push({ type: 'activity', frames: ['나', '친구'], rows: [] });
  f.write(); assert.equal(f.run().status, 'PASS');
  f.specs.slides.slides.at(-1).rows = ['하나', '둘', '셋', '넷', '다섯'];
  f.write(); assert.ok(f.run().errors.some(e => e.includes('.rows: expected 0–4')));
});
