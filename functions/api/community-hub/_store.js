const OWNER = "jhuang7908";
const REPO = "Antibody-Engineer-Suite-MVP";
const PATH = "data/community_events/subscriptions.json";
const BRANCH = "master";

const ALLOWED_CHIPS = new Set([
  "亲子·公园",
  "健身·户外",
  "文化·节庆",
  "语言·教育",
  "就业·培训",
  "福利·政务",
  "交通·出行",
  "公益·义工",
  "安全·突发",
  "休闲·运动",
  "住房·安居",
  "医疗·健康",
  "deals_savings",
]);

const CHIP_TO_CHANNEL = {
  "文化·节庆": "culture_festival",
  "语言·教育": "education_lang",
  "福利·政务": "benefits_gov",
  "交通·出行": "transit_travel",
  "住房·安居": "housing_living",
  "医疗·健康": "health_medical",
  "亲子·公园": "culture_festival",
  "健身·户外": "culture_festival",
  "休闲·运动": "culture_festival",
  "就业·培训": "education_lang",
  "公益·义工": "benefits_gov",
  "安全·突发": "benefits_gov",
  "deals_savings": "deals_savings",
};

const ALL_CHANNELS = [
  "benefits_gov",
  "education_lang",
  "health_medical",
  "transit_travel",
  "culture_festival",
  "housing_living",
  "deals_savings",
];

export function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

export function optionsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

export function normalizeEmail(raw) {
  const email = String(raw || "").trim().toLowerCase();
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return "";
  if (email.length > 190) return "";
  return email;
}

export function normalizeInterests(raw) {
  const chips = Array.isArray(raw) ? raw : [];
  const mapped = [];
  const seen = new Set();
  for (const item of chips) {
    const id = String(item || "").trim();
    if (!ALLOWED_CHIPS.has(id)) continue;
    const channel = CHIP_TO_CHANNEL[id];
    if (channel && !seen.has(channel)) {
      seen.add(channel);
      mapped.push(channel);
    }
  }
  return mapped.length ? mapped : ALL_CHANNELS.slice();
}

function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function ghHeaders(token) {
  return {
    Authorization: "Bearer " + token,
    Accept: "application/vnd.github+json",
    "User-Agent": "uslifehub-subscribe",
  };
}

export async function loadSubscriptions(token) {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`,
    { headers: ghHeaders(token) }
  );
  if (!res.ok) {
    const err = new Error("load_failed");
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const text = atob(String(data.content || "").replace(/\n/g, ""));
  const list = JSON.parse(text);
  if (!Array.isArray(list)) throw new Error("invalid_list");
  return { sha: data.sha, list };
}

export async function saveSubscriptions(token, sha, list, message) {
  const content = toBase64(JSON.stringify(list, null, 2) + "\n");
  return fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`, {
    method: "PUT",
    headers: { ...ghHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content, sha, branch: BRANCH }),
  });
}

export async function upsertSubscriber(token, email, interests) {
  let lastStatus = 0;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { sha, list } = await loadSubscriptions(token);
    const now = new Date().toISOString();
    const idx = list.findIndex((row) => String(row.email || "").trim().toLowerCase() === email);
    if (idx >= 0) {
      list[idx].interests = interests;
      list[idx].updated_at = now;
    } else {
      list.push({ email, interests, created_at: now, updated_at: now });
    }
    const res = await saveSubscriptions(
      token,
      sha,
      list,
      idx >= 0 ? "chore(uslifehub): update email subscriber" : "chore(uslifehub): add email subscriber"
    );
    lastStatus = res.status;
    if (res.ok) return { ok: true, updated: idx >= 0 };
    if (res.status !== 409) break;
  }
  const err = new Error("save_failed");
  err.status = lastStatus;
  throw err;
}

export async function removeSubscriber(token, email) {
  let lastStatus = 0;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { sha, list } = await loadSubscriptions(token);
    const next = list.filter((row) => String(row.email || "").trim().toLowerCase() !== email);
    if (next.length === list.length) return { ok: true, removed: false };
    const res = await saveSubscriptions(token, sha, next, "chore(uslifehub): remove email subscriber");
    lastStatus = res.status;
    if (res.ok) return { ok: true, removed: true };
    if (res.status !== 409) break;
  }
  const err = new Error("save_failed");
  err.status = lastStatus;
  throw err;
}
