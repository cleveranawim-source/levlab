/*
 * Local QR Model 2 encoder: UTF-8 byte mode, ECC M, versions 1–40.
 * No network service or runtime dependency. Tables and geometric algorithms
 * adapted from Project Nayuki (https://www.nayuki.io/page/qr-code-generator-library).
 * Copyright (c) Project Nayuki. (MIT License)
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions: The above copyright notice and this
 * permission notice shall be included in all copies or substantial portions of
 * the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
 * EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
const ECC = [-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28];
const BLOCKS = [-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49];
const bit = (n, i) => Boolean((n >>> i) & 1);
const masks = [
  (x,y) => (x+y)%2 === 0, (x,y) => y%2 === 0, (x) => x%3 === 0,
  (x,y) => (x+y)%3 === 0, (x,y) => (Math.floor(x/3)+Math.floor(y/2))%2 === 0,
  (x,y) => (x*y)%2+(x*y)%3 === 0, (x,y) => ((x*y)%2+(x*y)%3)%2 === 0,
  (x,y) => ((x+y)%2+(x*y)%3)%2 === 0,
];
function rawWords(version) {
  let bits = (16 * version + 128) * version + 64;
  if (version >= 2) { const n = Math.floor(version / 7) + 2; bits -= (25*n-10)*n-55; if (version >= 7) bits -= 36; }
  return Math.floor(bits / 8);
}
function multiply(a, b) {
  let out = 0;
  for (let i = 7; i >= 0; i--) { out = (out << 1) ^ ((out >>> 7) * 0x11d); out ^= ((b >>> i) & 1) * a; }
  return out;
}
function divisor(degree) {
  const out = Array(degree).fill(0); out[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) { out[j] = multiply(out[j], root); if (j + 1 < degree) out[j] ^= out[j + 1]; }
    root = multiply(root, 2);
  }
  return out;
}
function remainder(data, polynomial) {
  const out = Array(polynomial.length).fill(0);
  for (const byte of data) {
    const factor = byte ^ out.shift(); out.push(0);
    polynomial.forEach((coefficient, i) => { out[i] ^= multiply(coefficient, factor); });
  }
  return out;
}
function codewords(bytes, version) {
  const capacity = rawWords(version) - ECC[version] * BLOCKS[version];
  const bits = [];
  const append = (n, count) => { for (let i = count - 1; i >= 0; i--) bits.push((n >>> i) & 1); };
  append(4, 4); append(bytes.length, version < 10 ? 8 : 16);
  bytes.forEach((byte) => append(byte, 8));
  append(0, Math.min(4, capacity * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((n, b) => (n << 1) | b, 0));
  for (let pad = 0xec; data.length < capacity; pad ^= 0xec ^ 0x11) data.push(pad);
  const count = BLOCKS[version], ecc = ECC[version], total = rawWords(version);
  const shortCount = count - total % count, shortLength = Math.floor(total / count);
  const polynomial = divisor(ecc), blocks = [];
  let at = 0;
  for (let i = 0; i < count; i++) {
    const block = data.slice(at, at + shortLength - ecc + (i < shortCount ? 0 : 1)); at += block.length;
    const parity = remainder(block, polynomial);
    if (i < shortCount) block.push(0);
    blocks.push(block.concat(parity));
  }
  const out = [];
  for (let i = 0; i < blocks[0].length; i++) blocks.forEach((block, j) => { if (i !== shortLength - ecc || j >= shortCount) out.push(block[i]); });
  return out;
}
function penalty(matrix) {
  const n = matrix.length;
  let score = 0, dark = 0;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (matrix[y][x]) dark++;
      if (x && y && matrix[y][x] === matrix[y-1][x] && matrix[y][x] === matrix[y][x-1] && matrix[y][x] === matrix[y-1][x-1]) score += 3;
    }
    for (const line of [matrix[y], matrix.map((row) => row[y])]) {
      let run = 1;
      for (let i = 1; i < n; i++) {
        if (line[i] === line[i-1]) { run++; if (run === 5) score += 3; else if (run > 5) score++; } else run = 1;
      }
      const str = line.map(Number).join("");
      for (let i = 0; i <= n-11; i++) if (["00001011101", "10111010000"].includes(str.slice(i, i+11))) score += 40;
    }
  }
  return score + Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
}

export function makeQR(text, { mask = -1 } = {}) {
  if (typeof text !== "string" || !Number.isInteger(mask) || mask < -1 || mask > 7) throw new RangeError("Invalid QR input");
  const bytes = new TextEncoder().encode(text);
  let version = 1;
  for (; version <= 40; version++) {
    const countBits = version < 10 ? 8 : 16;
    if (bytes.length < 2 ** countBits && bytes.length * 8 + countBits + 4 <= (rawWords(version) - ECC[version] * BLOCKS[version]) * 8) break;
  }
  if (version > 40) throw new RangeError("QR input is too long");
  const size = version * 4 + 17;
  const modules = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const set = (x, y, value) => { modules[y][x] = Boolean(value); reserved[y][x] = true; };
  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  for (const [cx,cy] of [[3,3],[size-4,3],[3,size-4]]) {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx+dx, y = cy+dy, distance = Math.max(Math.abs(dx), Math.abs(dy));
      if (x >= 0 && y >= 0 && x < size && y < size) set(x, y, distance !== 2 && distance !== 4);
    }
  }
  if (version > 1) {
    const n = Math.floor(version / 7) + 2;
    const step = Math.floor((version * 8 + n * 3 + 5) / (n * 4 - 4)) * 2;
    const positions = [6];
    for (let pos = size - 7; positions.length < n; pos -= step) positions.splice(1, 0, pos);
    positions.forEach((x, i) => positions.forEach((y, j) => {
      if ((i === 0 && (j === 0 || j === n-1)) || (i === n-1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(x+dx, y+dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }));
  }
  function format(m) {
    let rem = m; // M's format indicator is 00.
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((m << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) set(8, i, bit(bits, i));
    set(8, 7, bit(bits, 6)); set(8, 8, bit(bits, 7)); set(7, 8, bit(bits, 8));
    for (let i = 9; i < 15; i++) set(14-i, 8, bit(bits, i));
    for (let i = 0; i < 8; i++) set(size-1-i, 8, bit(bits, i));
    for (let i = 8; i < 15; i++) set(8, size-15+i, bit(bits, i));
    set(8, size-8, true);
  }
  format(0);
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) { const a = size-11+i%3, b = Math.floor(i/3); set(a, b, bit(bits, i)); set(b, a, bit(bits, i)); }
  }
  const words = codewords(bytes, version);
  let at = 0;
  for (let right = size-1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let row = 0; row < size; row++) for (let j = 0; j < 2; j++) {
      const x = right-j, y = ((right+1)&2) === 0 ? size-1-row : row;
      if (!reserved[y][x] && at < words.length*8) { modules[y][x] = bit(words[at >>> 3], 7-(at&7)); at++; }
    }
  }
  const apply = (m) => { for (let y=0;y<size;y++) for (let x=0;x<size;x++) if (!reserved[y][x] && masks[m](x,y)) modules[y][x] = !modules[y][x]; };
  if (mask === -1) {
    let best = Infinity;
    for (let m=0;m<8;m++) { apply(m); format(m); const score = penalty(modules); if (score < best) { best = score; mask = m; } apply(m); }
  }
  apply(mask); format(mask);
  // Four-module quiet zone is part of the viewBox, including at small sizes.
  const path = modules.flatMap((row,y) => row.map((dark,x) => dark ? `M${x+4},${y+4}h1v1h-1z` : "")).join("");
  return { version, size, mask, modules, path, viewBox: `0 0 ${size+8} ${size+8}` };
}
