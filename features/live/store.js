// Server only. A room is one expiring value: atomic compare-and-swap prevents
// lost votes and makes close delete all room data without a scan/race window.
export const TTL_SECONDS = 3 * 60 * 60;

export function storageConfig(env = process.env) {
  const kv = env.KV_REST_API_URL && env.KV_REST_API_TOKEN;
  const url = kv ? env.KV_REST_API_URL : env.UPSTASH_REDIS_REST_URL;
  const token = kv ? env.KV_REST_API_TOKEN : env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { kind: "upstash", url: url.replace(/\/$/, ""), token };
  return { kind: env.VERCEL || env.NODE_ENV === "production" ? "disabled" : "memory" };
}

const CAS = `local old = redis.call('GET', KEYS[1])
if not old or old ~= ARGV[1] then return 0 end
if ARGV[2] == '' then redis.call('DEL', KEYS[1])
else redis.call('SET', KEYS[1], ARGV[2], 'KEEPTTL') end
return 1`;
const LIMIT = `local raw = redis.call('GET', KEYS[1])
local v = raw and cjson.decode(raw) or {at=tonumber(ARGV[1]), n=0}
if tonumber(ARGV[1]) - v.at >= tonumber(ARGV[2]) then v.at=tonumber(ARGV[1]); v.n=0 end
v.n=v.n+1
if raw then redis.call('SET', KEYS[1], cjson.encode(v), 'KEEPTTL')
else redis.call('SET', KEYS[1], cjson.encode(v), 'EX', ARGV[3]) end
return v.n`;

export function createStore({ config = storageConfig(), now = Date.now, memory = new Map(), fetcher = fetch } = {}) {
  const enabled = config.kind !== "disabled";
  function getMemory(key) {
    const item = memory.get(key);
    if (item && item.until <= now()) { memory.delete(key); return null; }
    return item || null;
  }
  async function command(...args) {
    const response = await fetcher(config.url, {
      method: "POST", headers: { authorization: `Bearer ${config.token}`, "content-type": "application/json" },
      body: JSON.stringify(args), cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Live storage unavailable");
    const data = await response.json();
    if (data.error) throw new Error("Live storage command failed");
    return data.result;
  }
  function ready() { if (!enabled) throw new Error("Live storage disabled"); }
  return {
    enabled, kind: config.kind,
    async get(key) {
      ready();
      return config.kind === "memory" ? getMemory(key)?.value ?? null : command("GET", key);
    },
    async create(key, value) {
      ready();
      if (config.kind !== "memory") return (await command("SET", key, value, "NX", "EX", TTL_SECONDS)) === "OK";
      // Bounded sweep: development rooms and limits expire even if never read again.
      for (const candidate of memory.keys()) getMemory(candidate);
      if (getMemory(key)) return false;
      memory.set(key, { value, until: now() + TTL_SECONDS * 1000 });
      return true;
    },
    async compareSwap(key, previous, next) {
      ready();
      if (config.kind !== "memory") return Number(await command("EVAL", CAS, 1, key, previous, next ?? "")) === 1;
      const item = getMemory(key);
      if (!item || item.value !== previous) return false;
      if (next === null) memory.delete(key);
      else item.value = next;
      return true;
    },
    async limit(key, windowMs, maximum) {
      ready();
      let count;
      if (config.kind !== "memory") count = Number(await command("EVAL", LIMIT, 1, key, now(), windowMs, TTL_SECONDS));
      else {
        let item = getMemory(key);
        if (!item) { item = { value: { at: now(), n: 0 }, until: now() + TTL_SECONDS * 1000 }; memory.set(key, item); }
        if (now() - item.value.at >= windowMs) item.value = { at: now(), n: 0 };
        count = ++item.value.n;
      }
      return count <= maximum;
    },
  };
}

// Preserve the local dev store across Next hot reloads; production never falls back.
export function getStore() {
  const config = storageConfig();
  const memory = globalThis.__levlabLiveMemory ??= new Map();
  return createStore({ config, memory });
}
