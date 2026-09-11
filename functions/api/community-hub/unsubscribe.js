import {
  jsonResponse,
  optionsResponse,
  normalizeEmail,
  removeSubscriber,
} from "./_store.js";

export function onRequestOptions() {
  return optionsResponse();
}

async function handleUnsubscribe(email, env, asHtml) {
  const token = env.GH_PAT || env.GITHUB_TOKEN;
  if (!token) {
    if (asHtml) return htmlPage(503, "退订暂不可用，请稍后重试或写信到 info@uslifehub.org。");
    return jsonResponse(503, { ok: false, detail: "unsubscribe backend not configured" });
  }
  if (!email) {
    if (asHtml) return htmlPage(400, "缺少有效邮箱。");
    return jsonResponse(400, { ok: false, detail: "invalid email" });
  }
  try {
    await removeSubscriber(token, email);
    if (asHtml) return htmlPage(200, "已退订 US Life Hub 邮件。以后可在网站重新订阅。");
    return jsonResponse(200, { ok: true, email });
  } catch {
    if (asHtml) return htmlPage(502, "退订未完成，请稍后重试或写信到 info@uslifehub.org。");
    return jsonResponse(502, { ok: false, detail: "save failed" });
  }
}

function htmlPage(status, message) {
  return new Response(
    `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>US Life Hub</title></head><body style="font-family:Segoe UI,Arial,sans-serif;padding:32px;max-width:40rem;line-height:1.6">${message}<p><a href="https://www.uslifehub.org/">返回 US Life Hub</a></p></body></html>`,
    {
      status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    }
  );
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const email = normalizeEmail(url.searchParams.get("email"));
  return handleUnsubscribe(email, env, true);
}

export async function onRequestPost({ request, env }) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const email = normalizeEmail(body.email);
  return handleUnsubscribe(email, env, false);
}
