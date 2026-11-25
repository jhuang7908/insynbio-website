#!/usr/bin/env node
/**
 * Pre-publish gate for the USLifeHub 3.3.37 catalog.
 *
 * Does not redesign the page. It only:
 *   - hides sessions that already ended, and deletes those ended for a full calendar month
 *   - removes the known NYPL Flushing duplicate of the Queens Library entry
 *   - checks each public link; confirmed-invalid entries are dropped and reported
 *   - refuses to publish when subscribe UI, image uniqueness, or retention fails
 *
 * Exit 0 means the tree is allowed to publish. Any other exit means do not publish.
 */
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const { URL } = require('url');

const policy = require('../assets/hub-listing-policy.js');
const assigner = require('../assets/hub-image-assign.js');

const CHIPS = [
  '亲子·公园', '健身·户外', '文化·节庆', '语言·教育', '就业·培训', '福利·政务',
  '交通·出行', '公益·义工', '安全·突发', '休闲·运动', '住房·安居', '医疗·健康', 'deals_savings'
];
const STOP = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'your', 'official', 'page',
  'program', 'programs', 'events', 'event', 'nyc', 'new', 'york', 'city', 'about',
  'https', 'http', 'www', 'html', 'index'
]);

function sliceJsonValue(html, start) {
  let arr = 0;
  let obj = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '[') arr++;
    else if (c === ']') arr--;
    else if (c === '{') obj++;
    else if (c === '}') obj--;
    if (i > start && arr === 0 && obj === 0) return { json: html.slice(start, i + 1), end: i + 1 };
  }
  throw new Error('unterminated JSON at ' + start);
}

function readItems(html) {
  const marker = html.indexOf('const ITEMS = ');
  if (marker < 0) throw new Error('ITEMS block missing');
  const start = html.indexOf('[', marker);
  const sliced = sliceJsonValue(html, start);
  return { items: JSON.parse(sliced.json), start, end: sliced.end };
}

function normalizeUrl(value) {
  try {
    const url = new URL(String(value || ''));
    url.hash = '';
    let pathName = url.pathname.replace(/\/+$/, '');
    if (!pathName) pathName = '';
    return (url.hostname.replace(/^www\./, '') + pathName).toLowerCase();
  } catch (err) {
    return '';
  }
}

function isNyplFlushingDuplicate(item, items) {
  if (!item || !/nypl\.org\/locations\/flushing/i.test(item.url || '')) return false;
  return items.some((other) => other !== item && other.id === 'live_110'
    && /queenslibrary\.org/i.test(other.url || '')
    && /flushing|法拉盛/i.test((other.title_zh || '') + (other.url || '')));
}

function applyRetention(items, asOf) {
  const deleted = [];
  const hidden = [];
  const removedDuplicates = [];
  const kept = [];
  for (const item of items) {
    if (isNyplFlushingDuplicate(item, items)) {
      removedDuplicates.push({
        id: item.id,
        url: item.url,
        title_zh: item.title_zh,
        reason: 'nypl_flushing_is_queens_public_library_duplicate_of_live_110'
      });
      continue;
    }
    const disposition = policy.disposition(item, asOf);
    if (disposition.action === 'delete') {
      deleted.push({
        id: item.id,
        title_zh: item.title_zh,
        url: item.url,
        end: disposition.end,
        reason: disposition.reason
      });
      continue;
    }
    if (disposition.action === 'hide' && item.listing_state !== 'held_past') {
      item.listing_state = 'held_past';
      hidden.push({ id: item.id, title_zh: item.title_zh, end: disposition.end });
    } else if (disposition.action === 'hide') {
      hidden.push({ id: item.id, title_zh: item.title_zh, end: disposition.end });
    }
    kept.push(item);
  }
  return { items: kept, deleted, hidden, removedDuplicates };
}

function subscribeUiErrors(html) {
  const errors = [];
  for (const id of CHIPS) {
    if (!html.includes('{ id: "' + id + '"')) errors.push('missing subscribe chip ' + id);
  }
  if (CHIPS.length !== 13) errors.push('chip list is not 13');
  if (html.includes('已过期') || html.includes('已過期') || html.includes('过期前') || html.includes('過期前')) {
    errors.push('removed expired-option copy came back');
  }
  if (/<option\b[^>]*>[^<]*过期/.test(html) || /<button\b[^>]*>[^<]*过期/.test(html)) {
    errors.push('expired option control came back');
  }
  const required = [
    '每周两次精选民生简报',
    '周一和周四',
    '每周为您发送两次精选社区动态',
    'assets/hub-subscribe-state.js',
    'await hubApiBusinessOk(response)',
    "window.HUB_APP_VERSION = '3.3.37'"
  ];
  for (const text of required) {
    if (!html.includes(text)) errors.push('missing required UI text: ' + text);
  }
  if (html.includes('补发欢迎信') || html.includes('订阅已记录本地')) {
    errors.push('removed subscribe failure copy came back');
  }
  return errors;
}

function significantTokens(item) {
  const blob = [item.title_en, item.title_zh, item.area_en, item.location, item.url].filter(Boolean).join(' ');
  const words = blob.toLowerCase().match(/[a-z][a-z0-9]{3,}/g) || [];
  return [...new Set(words.filter((word) => !STOP.has(word)))].slice(0, 12);
}

function visibleText(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function isBotShell(body) {
  const text = String(body || '').slice(0, 12000).toLowerCase();
  const markers = [
    'just a moment', 'cf-browser-verification', 'attention required', 'cdn-cgi/challenge',
    'are you a robot', 'verify you are human', 'pardon our interruption', 'enable javascript and cookies',
    'bot detection', 'captcha', 'incapsula incident', 'akamai', 'request blocked', 'access denied'
  ];
  return markers.some((marker) => text.includes(marker));
}

function isErrorPage(status, body) {
  if (status === 404 || status === 410) return true;
  const text = String(body || '').slice(0, 5000).toLowerCase();
  const title = (text.match(/<title>([^<]{0,140})/) || ['', ''])[1];
  if (/404|page not found|not found|doesn.t exist|no longer available/.test(title)) return true;
  if (status === 200 && text.length < 1800 && /404|page not found|doesn.t exist/.test(text)) return true;
  return false;
}

function classifyFetched(item, fetched) {
  const status = fetched.status || 0;
  const body = fetched.body || '';
  const finalUrl = fetched.finalUrl || item.url || '';
  if (!status) {
    return { state: 'unverified', reason: fetched.error || 'no_response', finalUrl };
  }
  if (status === 401 || status === 403 || status === 408 || status === 429 || status >= 500) {
    return { state: 'unverified', reason: 'http_' + status, finalUrl };
  }
  if (isBotShell(body)) return { state: 'unverified', reason: 'bot_shell_or_block_page', finalUrl };
  if (/nypl\.org\/locations\/flushing/i.test(finalUrl)) {
    return { state: 'invalid', reason: 'flushing_library_is_queens_public_library_not_nypl', finalUrl };
  }
  if (isErrorPage(status, body)) return { state: 'invalid', reason: 'error_page', finalUrl };
  if (status !== 200) return { state: 'unverified', reason: 'http_' + status, finalUrl };
  const tokens = significantTokens(item);
  const hay = ((body.match(/<title>([^<]{0,180})/i) || ['', ''])[1] + ' ' + visibleText(body).slice(0, 7000)).toLowerCase();
  const hits = tokens.filter((token) => hay.includes(token));
  if (!tokens.length || !hits.length) {
    return { state: 'unverified', reason: 'content_not_confirmed', finalUrl, tokens: tokens.slice(0, 6) };
  }
  return { state: 'verified', reason: 'matched:' + hits.slice(0, 4).join(','), finalUrl };
}

function imageProblems(items, catalog, asOf) {
  const problems = [];
  const publicItems = items.filter((item) => policy.isPublicActivity(item, asOf));
  function check(list, label) {
    for (let i = 0; i < list.length; i += catalog.page_size) {
      const page = list.slice(i, i + catalog.page_size).map((item) => Object.assign({}, item));
      const result = assigner.assign(page, catalog);
      if (!result.ok) problems.push(label + ' page ' + (Math.floor(i / catalog.page_size) + 1));
    }
  }
  check(publicItems, 'all');
  const modules = [...new Set(publicItems.map((item) => item.module))];
  for (const mod of modules) check(publicItems.filter((item) => item.module === mod), mod);
  return problems;
}

function candidateDecision(item, existingUrls, asOf) {
  const url = normalizeUrl(item && item.url);
  if (!url) return { accept: false, reason: 'no_url' };
  if (existingUrls.has(url)) return { accept: false, reason: 'already_listed' };
  const end = String((item && (item.event_end_date || item.event_date)) || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(end) || end < asOf) return { accept: false, reason: 'not_a_future_dated_session' };
  const title = String((item && (item.title_zh || item.title_en)) || '').trim();
  if (title.length < 8) return { accept: false, reason: 'title_short' };
  if (/^(查看|更多|了解更多|新闻稿|read more|learn more)/i.test(title)) return { accept: false, reason: 'nav_title' };
  return { accept: true, reason: 'eligible_pending_link_check' };
}

function dropCatalogId(catalog, id) {
  if (catalog.primaries) delete catalog.primaries[id];
  for (const image of Object.values(catalog.images || {})) {
    if (Array.isArray(image.only_item_ids)) image.only_item_ids = image.only_item_ids.filter((itemId) => itemId !== id);
    if (Array.isArray(image.on_site_ids)) image.on_site_ids = image.on_site_ids.filter((itemId) => itemId !== id);
  }
}

function fetchPage(rawUrl, redirectsLeft = 5) {
  return new Promise((resolve) => {
    let url;
    try { url = new URL(rawUrl); } catch (err) {
      resolve({ status: 0, error: 'bad_url', body: '', headers: {}, finalUrl: String(rawUrl || '') });
      return;
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      resolve({ status: 0, error: 'bad_protocol', body: '', headers: {}, finalUrl: url.toString() });
      return;
    }
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8'
      }
    }, (res) => {
      const status = res.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(status) && res.headers.location && redirectsLeft > 0) {
        const next = new URL(res.headers.location, url).toString();
        res.resume();
        fetchPage(next, redirectsLeft - 1).then(resolve);
        return;
      }
      const chunks = [];
      let size = 0;
      res.on('data', (chunk) => {
        if (size < 80000) { chunks.push(chunk); size += chunk.length; }
      });
      res.on('end', () => {
        resolve({
          status,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf8'),
          finalUrl: url.toString(),
          error: ''
        });
      });
    });
    req.setTimeout(12000, () => {
      req.destroy();
      resolve({ status: 0, error: 'timeout', body: '', headers: {}, finalUrl: url.toString() });
    });
    req.on('error', (err) => {
      resolve({ status: 0, error: String(err.code || err.message), body: '', headers: {}, finalUrl: url.toString() });
    });
    req.end();
  });
}

async function mapPool(list, limit, worker) {
  const out = new Array(list.length);
  let cursor = 0;
  async function run() {
    while (cursor < list.length) {
      const index = cursor;
      cursor += 1;
      out[index] = await worker(list[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, list.length) }, run));
  return out;
}

function stampAsOf(html, asOf) {
  const line = "window.HUB_CATALOG_AS_OF = '" + asOf + "';";
  if (/window\.HUB_CATALOG_AS_OF = '\d{4}-\d{2}-\d{2}';/.test(html)) {
    return html.replace(/window\.HUB_CATALOG_AS_OF = '\d{4}-\d{2}-\d{2}';/, line);
  }
  const anchor = "window.HUB_APP_VERSION = '3.3.37';";
  if (!html.includes(anchor)) throw new Error('HUB_APP_VERSION anchor missing');
  return html.replace(anchor, anchor + '\n    ' + line);
}

function writeCatalog(root, catalog) {
  const jsonPath = path.join(root, 'assets', 'hub-image-catalog.json');
  const jsPath = path.join(root, 'assets', 'hub-image-catalog.js');
  fs.writeFileSync(jsonPath, JSON.stringify(catalog, null, 2) + '\n');
  fs.writeFileSync(jsPath, 'window.HUB_IMAGE_CATALOG = ' + JSON.stringify(catalog) + ';\n');
}

function parseArgs(argv) {
  const args = { apply: false, skipNetwork: false, asOf: '', candidates: '', report: '' };
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === '--apply') args.apply = true;
    else if (token === '--skip-network') args.skipNetwork = true;
    else if (token === '--as-of') args.asOf = argv[++i];
    else if (token === '--candidates') args.candidates = argv[++i];
    else if (token === '--report') args.report = argv[++i];
    else throw new Error('unknown argument ' + token);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const root = path.join(__dirname, '..');
  const htmlPath = path.join(root, 'us-chinese-life-hub.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  const asOf = args.asOf || policy.nyCalendarDate(new Date());
  const parsed = readItems(html);
  let items = parsed.items;
  const retention = applyRetention(items, asOf);
  items = retention.items;

  const subscribeErrors = subscribeUiErrors(html);
  const linkRows = [];
  const removedInvalid = [];
  if (!args.skipNetwork) {
    const publicItems = items.filter((item) => policy.isPublicActivity(item, asOf) && item.url);
    const checked = await mapPool(publicItems, 6, async (item) => {
      const fetched = await fetchPage(item.url);
      const verdict = classifyFetched(item, fetched);
      return {
        id: item.id,
        url: item.url,
        finalUrl: verdict.finalUrl,
        title_zh: item.title_zh,
        state: verdict.state,
        reason: verdict.reason
      };
    });
    linkRows.push(...checked);
    const invalidIds = new Set(checked.filter((row) => row.state === 'invalid').map((row) => row.id));
    if (invalidIds.size) {
      items = items.filter((item) => {
        if (!invalidIds.has(item.id)) return true;
        removedInvalid.push(checked.find((row) => row.id === item.id));
        return false;
      });
    }
  }

  const added = [];
  const skippedCandidates = [];
  if (args.candidates && fs.existsSync(args.candidates)) {
    const payload = JSON.parse(fs.readFileSync(args.candidates, 'utf8'));
    const candidates = Array.isArray(payload) ? payload : (payload.items || []);
    const existingUrls = new Set(items.map((item) => normalizeUrl(item.url)).filter(Boolean));
    for (const candidate of candidates) {
      const decision = candidateDecision(candidate, existingUrls, asOf);
      if (!decision.accept) {
        skippedCandidates.push({ url: candidate.url, title_zh: candidate.title_zh, reason: decision.reason });
        continue;
      }
      if (args.skipNetwork) {
        skippedCandidates.push({ url: candidate.url, title_zh: candidate.title_zh, reason: 'network_skipped' });
        continue;
      }
      const fetched = await fetchPage(candidate.url);
      const verdict = classifyFetched(candidate, fetched);
      linkRows.push({
        id: candidate.id || '',
        url: candidate.url,
        finalUrl: verdict.finalUrl,
        title_zh: candidate.title_zh,
        state: verdict.state,
        reason: verdict.reason,
        candidate: true
      });
      if (verdict.state !== 'verified') {
        skippedCandidates.push({ url: candidate.url, title_zh: candidate.title_zh, reason: verdict.state + ':' + verdict.reason });
        continue;
      }
      const copy = Object.assign({}, candidate, {
        id: candidate.id || ('cand_' + normalizeUrl(candidate.url).replace(/[^a-z0-9]+/g, '_').slice(0, 48)),
        listing_role: 'specific_session',
        date_kind: candidate.date_kind || 'event'
      });
      const trial = items.concat([copy]);
      const catalog = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'hub-image-catalog.json'), 'utf8'));
      if (imageProblems(trial, catalog, asOf).length) {
        skippedCandidates.push({ url: candidate.url, title_zh: candidate.title_zh, reason: 'image_page_not_unique' });
        continue;
      }
      items.push(copy);
      existingUrls.add(normalizeUrl(copy.url));
      added.push({ id: copy.id, url: copy.url, title_zh: copy.title_zh });
    }
  }

  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'hub-image-catalog.json'), 'utf8'));
  for (const row of retention.removedDuplicates.concat(removedInvalid)) dropCatalogId(catalog, row.id);
  const images = imageProblems(items, catalog, asOf);
  const stillDelete = items.filter((item) => policy.disposition(item, asOf).action === 'delete').map((item) => item.id);
  const publicCount = items.filter((item) => policy.isPublicActivity(item, asOf)).length;
  const failures = [];
  if (subscribeErrors.length) failures.push('subscribe_ui');
  if (images.length) failures.push('image_uniqueness');
  if (stillDelete.length) failures.push('expired_month_still_present');
  if (items.some((item) => isNyplFlushingDuplicate(item, items))) failures.push('live_041_still_present');
  if (!args.skipNetwork && removedInvalid.length && items.some((item) => removedInvalid.some((row) => row.id === item.id))) {
    failures.push('invalid_link_still_present');
  }

  const report = {
    as_of: asOf,
    timezone: 'America/New_York',
    publish_allowed: failures.length === 0,
    failures,
    subscribe_errors: subscribeErrors,
    image_problems: images,
    items_kept: items.length,
    public: publicCount,
    hidden: retention.hidden,
    deleted_expired: retention.deleted,
    removed_duplicates: retention.removedDuplicates,
    removed_invalid: removedInvalid,
    added_candidates: added,
    skipped_candidates: skippedCandidates.slice(0, 80),
    link_check: {
      checked: linkRows.length,
      verified: linkRows.filter((row) => row.state === 'verified').length,
      unverified: linkRows.filter((row) => row.state === 'unverified').length,
      invalid: linkRows.filter((row) => row.state === 'invalid').length,
      rows: linkRows
    }
  };
  const reportPath = args.report
    ? path.resolve(args.report)
    : path.join(root, 'docs', 'uslifehub-publish-gate-latest.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');

  if (args.apply && report.publish_allowed) {
    const payload = JSON.stringify(items);
    html = html.slice(0, parsed.start) + payload + html.slice(parsed.end);
    html = stampAsOf(html, asOf);
    fs.writeFileSync(htmlPath, html);
    fs.writeFileSync(path.join(root, 'index.html'), html);
    writeCatalog(root, catalog);
    const { spawnSync } = require('child_process');
    const rebuilt = spawnSync(process.execPath, [path.join(root, 'scripts', 'build_hub_search_index.js')], {
      cwd: root,
      env: Object.assign({}, process.env, { HUB_AS_OF: asOf })
    });
    if (rebuilt.status !== 0) {
      process.stderr.write(rebuilt.stderr);
      process.exit(1);
    }
  }

  const summary = {
    publish_allowed: report.publish_allowed,
    failures,
    items_kept: items.length,
    public: publicCount,
    hidden: retention.hidden.length,
    deleted_expired: retention.deleted.length,
    removed_duplicates: retention.removedDuplicates.map((row) => row.id),
    removed_invalid: removedInvalid.map((row) => row.id),
    added: added.length,
    verified: report.link_check.verified,
    unverified: report.link_check.unverified,
    invalid: report.link_check.invalid,
    report: reportPath
  };
  console.log(JSON.stringify(summary, null, 2));
  if (!report.publish_allowed) process.exit(2);
  if (args.skipNetwork) process.exit(3);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = {
  CHIPS,
  normalizeUrl,
  isNyplFlushingDuplicate,
  applyRetention,
  subscribeUiErrors,
  classifyFetched,
  candidateDecision,
  imageProblems,
  significantTokens
};
