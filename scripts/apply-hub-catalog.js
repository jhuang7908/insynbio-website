#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const policy = require('../assets/hub-listing-policy.js');
const additions = require('./hub-catalog-additions.js').build();

const root = path.join(__dirname, '..');
const TODAY = '2026-11-07';
const htmlPath = path.join(root, 'us-chinese-life-hub.html');

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

function replaceConst(html, name, valueJson) {
  const marker = 'const ' + name + ' = ';
  const idx = html.indexOf(marker);
  if (idx < 0) throw new Error('missing ' + name);
  const start = idx + marker.length;
  const sliced = sliceJsonValue(html, start);
  return html.slice(0, start) + valueJson + html.slice(sliced.end);
}

function mustReplace(html, from, to, label) {
  const n = html.split(from).length - 1;
  if (n !== 1) throw new Error(label + ' matches ' + n);
  return html.replace(from, to);
}

function daysBetween(later, earlier) {
  const a = Date.parse(later + 'T00:00:00Z');
  const b = Date.parse(earlier + 'T00:00:00Z');
  return Math.round((a - b) / 86400000);
}

let html = fs.readFileSync(htmlPath, 'utf8');
const itemsMarker = html.indexOf('const ITEMS = ');
const itemsStart = html.indexOf('[', itemsMarker);
const itemsSlice = sliceJsonValue(html, itemsStart);
const original = JSON.parse(itemsSlice.json);

const deleted = [];
const hidden = [];
const kept = [];
let staleServiceDates = 0;
for (const item of original) {
  const d = policy.disposition(item, TODAY);
  if (d.action === 'delete') {
    deleted.push({
      id: item.id,
      title_zh: item.title_zh,
      url: item.url,
      module: item.module,
      event_date: item.event_date || '',
      end: d.end,
      reason: d.reason
    });
    continue;
  }
  if (d.action === 'hide') {
    item.listing_state = 'held_past';
    item.listing_role = item.listing_role || 'specific_session';
    hidden.push({ id: item.id, title_zh: item.title_zh, url: item.url, end: d.end });
    kept.push(item);
    continue;
  }
  if (item.date_kind === 'service') {
    const ed = policy.isoDay(item.event_date);
    if (ed && ed < TODAY) {
      item.stale_session_date_removed = ed;
      item.event_date = '';
      if (policy.isoDay(item.date) === ed) item.date = '';
      item.event_date_source = 'none';
      staleServiceDates += 1;
    }
  }
  kept.push(item);
}

const ids = new Set(kept.map(i => i.id));
let added = 0;
for (const item of additions) {
  if (ids.has(item.id)) continue;
  const d = policy.disposition(item, TODAY);
  if (d.action !== 'show') throw new Error('new item not public: ' + item.id + ' ' + d.action);
  kept.push(item);
  ids.add(item.id);
  added += 1;
}

html = html.slice(0, itemsStart) + JSON.stringify(kept) + html.slice(itemsSlice.end);

const publicItems = kept.filter(i => policy.isPublicActivity(i, TODAY));
const week = publicItems.filter(i => policy.includeInNext7Days(i, TODAY));
const recent = publicItems.filter(i => {
  if (i.listing_role && i.listing_role !== 'specific_session') return false;
  const ed = policy.isoDay(i.event_date);
  if (!ed) return false;
  const diff = daysBetween(ed, TODAY);
  return diff >= -3 && diff <= 7;
}).sort((a, b) => policy.isoDay(a.event_date).localeCompare(policy.isoDay(b.event_date)));

const stats = {
  computed_at: '2026-11-07 10:40 ET',
  tz: 'America/New_York',
  new_24h: 0,
  featured_24h_ids: [],
  recent_3d: recent.length,
  featured_recent3d_ids: recent.slice(0, 6).map(i => i.id),
  events_7d: week.length,
  total: kept.length,
  public_total: publicItems.length,
  scan_schedule_et: 'not rerun',
  sources_scanned: 0,
  sources_configured: 0,
  sources_ok: 0,
  sources_fail: 0,
  update_status: 'catalog_edit',
  catalog_retained_from: '2026-09-23 15:34 ET',
  deleted_sessions: deleted.length,
  held_past: hidden.length,
  added: added,
  past_dated_events_public: 0
};
html = replaceConst(html, 'HUB_INDEX_STATS', JSON.stringify(stats));

const modulesMarker = html.indexOf('const MODULES = ');
const modulesStart = html.indexOf('[', modulesMarker);
const modulesSlice = sliceJsonValue(html, modulesStart);
const modules = JSON.parse(modulesSlice.json);
for (const mod of modules) {
  if (mod.zh === '亲子·公园' && !mod.desc_zh.includes('大学本校')) {
    mod.desc_zh += '另含已核实的青少年竞赛、大学本校暑期项目和童子军入口。';
    mod.desc_zht += '另含已核實的青少年競賽、大學本校暑期項目和童軍入口。';
    mod.desc_en += ' Also lists verified youth contests, university summer programs, and scouting intros.';
  }
  if (mod.zh === '语言·教育' && !mod.desc_zh.includes('青少年竞赛')) {
    mod.desc_zh += '另含青少年竞赛和大学本校暑期项目；未核实的资格会标明。';
    mod.desc_zht += '另含青少年競賽和大學本校暑期項目；未核實的資格會標明。';
    mod.desc_en += ' Also lists youth contests and university summer programs with eligibility labeled.';
  }
  if (mod.zh === '休闲·运动' && !mod.desc_zh.includes('目录')) {
    mod.desc_zh += '当前收录公园局常年目录；具体课表不在过期场次里复活。';
    mod.desc_zht += '目前收錄公園局常年目錄；具體課表不在過期場次裡復活。';
    mod.desc_en += ' Current listings are Parks directories, not revived expired classes.';
  }
}
html = html.slice(0, modulesStart) + JSON.stringify(modules) + html.slice(modulesSlice.end);

const patches = [
  ['<!-- hub-build: 2026-11-07T08:10TET recovery -->', '<!-- hub-build: 2026-11-07T10:40ET catalog -->', 'build'],
  ["window.HUB_APP_VERSION = '3.3.35';", "window.HUB_APP_VERSION = '3.3.36';", 'version'],
  [
    '<script>\nconst MODULES',
    '<script src="assets/hub-listing-policy.js"></script>\n<script>\nconst MODULES',
    'policy script'
  ],
  [
    'function livelihoodItems() {\n  return ITEMS.filter(i => !isDealItem(i)).map(i => sanitizeHubItemListingDates(i));\n}',
    'function livelihoodItems() {\n  const today = hubTodayEtStr();\n  return ITEMS.filter(i => !isDealItem(i) && (typeof HubListingPolicy === \'undefined\' || HubListingPolicy.isPublicActivity(i, today))).map(i => sanitizeHubItemListingDates(i));\n}',
    'livelihood'
  ],
  [
    'function getDisplayEventDate(i) {\n  return isReliableEventDate(i) ? getEventDate(i) : \'\';\n}',
    'function getDisplayEventDate(i) {\n  if (!i) return \'\';\n  if (i.listing_role === \'program_intro\' || i.listing_role === \'directory\' || i.listing_role === \'annual_edition\') return \'\';\n  if (i.date_kind === \'service\' || i.content_kind === \'directory\' || i.content_kind === \'anchor\' || i.content_kind === \'camp\' || i.content_kind === \'scouting\' || i.content_kind === \'youth_contest\' || i.youth_contest) return \'\';\n  return isReliableEventDate(i) ? getEventDate(i) : \'\';\n}',
    'display date'
  ],
  [
    'function getWeekEventDate(i) {\n  if (!i || i.date_kind !== \'event\') return \'\';\n  if (isHubCategoryListing(i)) return \'\';\n  const ed = getEventDate(i);\n  if (!ed) return \'\';\n  const diff = daysFromToday(ed);\n  if (diff === null) return \'\';\n  if (diff >= 0 && diff <= 7) return ed;\n  if (diff < 0 && isWeeklyRecurringParksEvent(i)) return rollForwardWeeklyEventDate(ed, 7);\n  return \'\';\n}',
    'function getWeekEventDate(i) {\n  if (!i || typeof HubListingPolicy === \'undefined\') return \'\';\n  if (!HubListingPolicy.includeInNext7Days(i, hubTodayEtStr())) return \'\';\n  const ed = getEventDate(i);\n  if (!ed) return \'\';\n  const diff = daysFromToday(ed);\n  if (diff === null) return \'\';\n  if (diff >= 0) return ed;\n  return hubTodayEtStr();\n}',
    'week'
  ],
  [
    'function getEvergreenEvents() {\n  const out = [];',
    'function getEvergreenEvents() {\n  return [];\n  const out = [];',
    'evergreen'
  ],
  [
    'function getSortEventDate(i) {\n  const ed = getEventDate(i);\n  if (ed) return ed;',
    'function getSortEventDate(i) {\n  if (i && (i.listing_role === \'program_intro\' || i.listing_role === \'directory\' || i.listing_role === \'annual_edition\' || i.content_kind === \'youth_contest\' || i.content_kind === \'camp\' || i.content_kind === \'scouting\')) {\n    const milestone = String(i.next_milestone_date || \'\').slice(0, 10);\n    if (/^\\d{4}-\\d{2}-\\d{2}$/.test(milestone)) return milestone;\n    return \'\';\n  }\n  const ed = getEventDate(i);\n  if (ed) return ed;',
    'sort date'
  ],
  [
    'function isRecentIn3d(i) {\n  if (isDealItem(i)) return false;',
    'function isRecentIn3d(i) {\n  if (isDealItem(i)) return false;\n  if (i && i.listing_role && i.listing_role !== \'specific_session\') return false;\n  if (typeof HubListingPolicy !== \'undefined\' && !HubListingPolicy.isPublicActivity(i, hubTodayEtStr())) return false;',
    'recent'
  ],
  [
    '  for (const item of ITEMS) {\n    HUB_SEARCH_BY_ID.set(item.id, hubItemSearchBlob(item));\n  }',
    '  const today = hubTodayEtStr();\n  for (const item of ITEMS) {\n    if (typeof HubListingPolicy !== \'undefined\' && !HubListingPolicy.isSearchableActivity(item, today)) continue;\n    HUB_SEARCH_BY_ID.set(item.id, hubItemSearchBlob(item));\n  }',
    'search index'
  ],
  [
    '    item.url,\n  ];',
    '    item.url,\n    item.disclosure_zh, item.eligibility_zh, item.fee_note_zh, item.age_or_grade,\n    (item.also_modules || []).join(\' \'),\n  ];',
    'search blob'
  ],
  [
    'function hubItemMatchesQuery(item, rawQuery) {\n  const terms = hubExpandSearchTerms(rawQuery);',
    'function hubItemMatchesQuery(item, rawQuery) {\n  if (item && !isDealItem(item) && typeof HubListingPolicy !== \'undefined\' && !HubListingPolicy.isPublicActivity(item, hubTodayEtStr())) return false;\n  const terms = hubExpandSearchTerms(rawQuery);',
    'query guard'
  ],
  [
    'function moduleItemCount(zh) {\n  return livelihoodItems().filter(i => resolveModule(i.module) === zh).length;\n}',
    'function hubItemInModule(i, name) {\n  if (!name || name === \'all\') return true;\n  if (resolveModule(i.module) === name) return true;\n  return (i.also_modules || []).some(m => resolveModule(m) === name);\n}\nfunction moduleItemCount(zh) {\n  return livelihoodItems().filter(i => hubItemInModule(i, zh)).length;\n}',
    'module count'
  ],
  [
    '    const matchesModule = (activeModuleFilter === \'all\' || resolveModule(i.module) === activeModuleFilter);',
    '    const matchesModule = hubItemInModule(i, activeModuleFilter);\n    const matchesLens = !activeCatalogLens || (activeCatalogLens === \'youth_contest\' ? !!(i.youth_contest || i.content_kind === \'youth_contest\') : activeCatalogLens === \'camp\' ? !!(i.content_kind === \'camp\' || i.camp_host) : activeCatalogLens === \'scouting\' ? !!(i.content_kind === \'scouting\' || i.scouting_org) : true);',
    'feed module'
  ],
  [
    '    return matchesModule && matchesBorough && matchesTime && matchesNeighborhood && matchesSearch;',
    '    return matchesModule && matchesLens && matchesBorough && matchesTime && matchesNeighborhood && matchesSearch;',
    'feed return'
  ],
  [
    'let activeModuleFilter = \'all\';\nlet activeNeighborhoodFilter = \'all\';',
    'let activeModuleFilter = \'all\';\nlet activeNeighborhoodFilter = \'all\';\nlet activeCatalogLens = \'\';',
    'lens var'
  ],
  [
    'function resetAllFilters() {\n  activeModuleFilter = \'all\';\n  activeNeighborhoodFilter = \'all\';',
    'function resetAllFilters() {\n  activeModuleFilter = \'all\';\n  activeNeighborhoodFilter = \'all\';\n  activeCatalogLens = \'\';\n  document.querySelectorAll(\'#hub-catalog-filters .pill\').forEach(b => b.classList.remove(\'active\'));',
    'reset'
  ],
  [
    'function evictExpiredItems() {\n  // 2026-11-07 recovery: do not delete listings because last_seen_at stopped\n  // during the publish outage. That cutoff would hide still-valid services and\n  // the 2026-11-13 gala. Dated events before today are marked past instead.\n  const todayStr = new Intl.DateTimeFormat(\'en-CA\', { timeZone: \'America/New_York\' }).format(new Date());\n  const mark = (item) => {\n    if (!item || item.date_kind === \'service\' || item.date_kind === \'deal\' || item.content_kind === \'deal\') return;\n    const ed = getEventDate(item);\n    if (item.date_kind === \'event\' && ed && ed < todayStr) item.listing_state = \'past\';\n  };\n  if (typeof ITEMS !== \'undefined\') ITEMS.forEach(mark);\n}',
    'function evictExpiredItems() {\n  if (typeof ITEMS === \'undefined\' || typeof HubListingPolicy === \'undefined\') return;\n  const today = hubTodayEtStr();\n  for (let n = ITEMS.length - 1; n >= 0; n--) {\n    const d = HubListingPolicy.disposition(ITEMS[n], today);\n    if (d.action === \'delete\') ITEMS.splice(n, 1);\n    else if (d.action === \'hide\') ITEMS[n].listing_state = \'held_past\';\n  }\n}',
    'evict'
  ]
];

for (const [from, to, label] of patches) {
  html = mustReplace(html, from, to, label);
}

html = mustReplace(
  html,
  '  if (!ed || ed.length < 10) {\n    const openLbl = currentLang === \'en\' ? \'OPEN\' : (currentLang === \'zht\' ? \'開放\' : \'开放\');',
  '  if (!ed || ed.length < 10) {\n    const badge = (typeof HubListingPolicy !== \'undefined\') ? HubListingPolicy.undatedBadgeLabel(item) : { month: \'报名\', day: \'待公布\' };\n    const openLbl = currentLang === \'en\' ? (badge.day === \'已开放\' ? \'OPEN\' : \'TBA\') : badge.day;',
  'badge'
);

html = mustReplace(
  html,
  '    return `<div class="parks-date-badge parks-date-badge-service${pastCls}"><div class="parks-date-month">${currentLang === \'en\' ? \'—\' : \'长期\'}</div><div class="parks-date-day">${openLbl}</div></div>`;',
  '    const monthLbl = currentLang === \'en\' ? \'—\' : (badge ? badge.month : \'报名\');\n    return `<div class="parks-date-badge parks-date-badge-service${pastCls}"><div class="parks-date-month">${monthLbl}</div><div class="parks-date-day">${openLbl}</div></div>`;',
  'badge month'
);

html = mustReplace(
  html,
  '  const contentHtml = content ? `<div class="parks-event-desc">${escapeHtml(content.length > 140 ? content.slice(0, 139) + \'…\' : content)}</div>` : \'\';',
  '  const contentHtml = content ? `<div class="parks-event-desc">${escapeHtml(content.length > 140 ? content.slice(0, 139) + \'…\' : content)}</div>` : \'\';\n  const disclosureRaw = (i.disclosure_zh || \'\').trim();\n  const disclosureHtml = disclosureRaw ? `<div class="hub-status-note">${escapeHtml(disclosureRaw)}</div>` : \'\';',
  'disclosure var'
);

html = mustReplace(
  html,
  '    + contentHtml\n    + hubParksActionRow(i, linkLabel)',
  '    + contentHtml\n    + disclosureHtml\n    + hubParksActionRow(i, linkLabel)',
  'disclosure use'
);

html = mustReplace(
  html,
  '  document.getElementById(\'modal-guide-content\').innerHTML =\n    `<div style="margin-bottom:8px;font-size:12px;color:#64748b;line-height:1.5;">${hubLocationTagHtml(item)} ${formatEventDateLabel(item)}<br>${formatPublishDateLabel(item)}</div>` + guide;',
  '  const disclosure = item.disclosure_zh ? `<div class="hub-status-note" style="margin-bottom:8px;">${escapeHtml(item.disclosure_zh)}</div>` : \'\';\n  document.getElementById(\'modal-guide-content\').innerHTML =\n    disclosure + `<div style="margin-bottom:8px;font-size:12px;color:#64748b;line-height:1.5;">${hubLocationTagHtml(item)} ${formatEventDateLabel(item)}<br>${formatPublishDateLabel(item)}</div>` + guide;',
  'modal'
);

html = mustReplace(
  html,
  'function hubEventCalendarBadge(item) {\n  const ed = getDisplayEventDate(item) || getPublishedAt(item) || \'\';',
  'function hubEventCalendarBadge(item) {\n  const ed = getDisplayEventDate(item) || \'\';',
  'badge date source'
);

html = mustReplace(
  html,
  '    <p class="muted" id="feed-sub">福利政策、社区活动与办事指南，可按关键词搜索</p>',
  '    <p class="muted" id="feed-sub">福利政策、社区活动与办事指南，可按关键词搜索</p>\n    <div class="pillbar" id="hub-catalog-filters" aria-label="项目目录">\n      <button type="button" class="pill" onclick="setCatalogLens(\'youth_contest\', this)">青少年竞赛</button>\n      <button type="button" class="pill" onclick="setCatalogLens(\'camp\', this)">名校夏令营</button>\n      <button type="button" class="pill" onclick="setCatalogLens(\'scouting\', this)">童子军</button>\n    </div>\n    <p class="muted" id="hub-catalog-note">竞赛、大学本校暑期项目和童子军在项目目录里。未来7日只放已核实的具体场次。报名时间没公布会写待更新，不会写成正在报名。纯数学、机器人、纽约本地赛，以及租用校园的第三方夏令营，这次没有核实条目。</p>',
  'catalog html'
);

html = mustReplace(
  html,
  'function setNeighborhoodFilter(boro, btn) {',
  'function setCatalogLens(lens, btn) {\n  activeCatalogLens = activeCatalogLens === lens ? \'\' : lens;\n  document.querySelectorAll(\'#hub-catalog-filters .pill\').forEach(b => b.classList.remove(\'active\'));\n  if (activeCatalogLens && btn) btn.classList.add(\'active\');\n  if (typeof renderFeed === \'function\') renderFeed();\n}\nfunction setNeighborhoodFilter(boro, btn) {',
  'lens fn'
);

html = mustReplace(
  html,
  '    feed_title: "📋 全部信息（按发布日期保留30天）",',
  '    feed_title: "📋 当前信息（已结束场次不展示）",',
  'feed zh'
);
html = mustReplace(
  html,
  '    feed_title: "📋 全部信息（按發布日期保留30天）",',
  '    feed_title: "📋 目前資訊（已結束場次不展示）",',
  'feed zht'
);
html = mustReplace(
  html,
  '    feed_title: "📋 All Listings (30-day window)",',
  '    feed_title: "📋 Current listings (ended sessions hidden)",',
  'feed en'
);
html = mustReplace(
  html,
  '      <div class="section-title-left" id="feed-title">📋 全部信息（按发布日期保留30天）</div>',
  '      <div class="section-title-left" id="feed-title">📋 当前信息（已结束场次不展示）</div>',
  'feed html'
);

const anchor = `  {
    id: "enroll_shape_up",
    module: "健身·户外",
    city: "纽约",
    borough: "Citywide",
    area_zh: "全市",
    area_en: "Citywide",
    date_kind: "service",
    content_kind: "anchor",
    listing_role: "directory",
    score: 109,
    title_zh: "Shape Up NYC 课程目录（不是单节课）",
    title_en: "Shape Up NYC directory (not one class)",
    summary_zh: "公园局常年健身目录。不代表某一节未来课程已经排期，费用以官网为准。",
    summary_en: "Parks fitness directory. Not a scheduled future class.",
    url: "https://www.nycgovparks.org/events/shape-up-nyc",
    enroll_cat: "cat3"
  },
`;
if (!html.includes('id: "enroll_shape_up"')) {
  html = mustReplace(
    html,
    '    url: "https://www.moma.org/visit/tickets",\n    enroll_cat: "cat3"\n  }\n];',
    '    url: "https://www.moma.org/visit/tickets",\n    enroll_cat: "cat3"\n  },\n' + anchor + '];',
    'shape anchor'
  );
}

if (!html.includes('.hub-status-note')) {
  html = mustReplace(
    html,
    '    .hub-hero-chip {',
    '    .hub-status-note { color: #9a3412; font-weight: 650; font-size: 12.5px; line-height: 1.45; margin-top: 4px; }\n    .hub-hero-chip {',
    'css'
  );
}

fs.writeFileSync(htmlPath, html);
fs.writeFileSync(path.join(root, 'index.html'), html);

const manifest = {
  as_of: TODAY,
  timezone: 'America/New_York',
  cutoff_delete_on_or_before: policy.subtractCalendarMonths(TODAY, 1),
  original: original.length,
  kept_in_items: kept.length,
  public: publicItems.length,
  added: added,
  deleted: deleted.length,
  hidden: hidden.length,
  stale_service_dates_cleared: staleServiceDates,
  week_ids: week.map(i => i.id),
  recent_ids: recent.map(i => i.id),
  added_ids: additions.map(i => i.id),
  deleted_rows: deleted,
  hidden_rows: hidden
};
const docsDir = path.join(root, 'docs');
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, 'hub-catalog-change-2026-11-07.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({
  original: original.length,
  kept: kept.length,
  public: publicItems.length,
  added: added,
  deleted: deleted.length,
  hidden: hidden.length,
  staleServiceDates,
  week: week.map(i => i.id),
  recent: recent.map(i => i.id)
}, null, 2));
