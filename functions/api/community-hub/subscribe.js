import {
  jsonResponse,
  optionsResponse,
  normalizeEmail,
  normalizeInterests,
  upsertSubscriber,
} from "./_store.js";

export function onRequestOptions() {
  return optionsResponse();
}

export async function onRequestPost({ request, env }) {
  const token = env.GH_PAT || env.GITHUB_TOKEN;
  if (!token) return jsonResponse(503, { ok: false, detail: "subscribe backend not configured" });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, detail: "invalid json" });
  }

  const email = normalizeEmail(body && body.email);
  if (!email) return jsonResponse(400, { ok: false, detail: "invalid email" });
  const interests = normalizeInterests(body && body.interests);

  try {
    const result = await upsertSubscriber(token, email, interests);
    return jsonResponse(200, { ok: true, email, updated: result.updated });
  } catch (err) {
    const status = err && err.status === 403 ? 503 : 502;
    return jsonResponse(status, { ok: false, detail: "save failed" });
  }
}
