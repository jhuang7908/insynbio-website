#!/usr/bin/env node
/**
 * Rebuild hub_search_index.json from embedded ITEMS in us-chinese-life-hub.html.
 * Run after ITEMS bulk update: node scripts/build_hub_search_index.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'us-chinese-life-hub.html');
const outPath = path.join(root, 'hub_search_index.json');

const html = fs.readFileSync(htmlPath, 'utf8');
const marker = 'const ITEMS = ';
const idx = html.indexOf(marker);
if (idx < 0) throw new Error('ITEMS block not found');
const start = html.indexOf('[', idx);
let depth = 0;
let end = start;
for (let i = start; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
const ITEMS = JSON.parse(html.slice(start, end));

function searchBlob(item) {
  const parts = [
    item.id, item.module,
    item.title_zh, item.title_en, item.title_zht,
    item.summary_zh, item.summary_en, item.summary_zht,
    item.area_zh, item.area_en, item.borough,
    item.location, item.event_date, item.url,
  ];
  return parts.filter(Boolean).join(' ').toLowerCase();
}

const records = ITEMS.map(item => ({
  id: item.id,
  module: item.module,
  title_zh: item.title_zh,
  summary_zh: item.summary_zh,
  location_tag_zh: item.location_tag_zh,
  location_kind: item.location_kind,
  area_zh: item.area_zh,
  borough: item.borough,
  location: item.location,
  event_date: item.event_date,
  event_time: item.event_time,
  published_at: item.published_at,
  source_published_at: item.source_published_at,
  first_indexed_at: item.first_indexed_at,
  last_seen_at: item.last_seen_at,
  date_kind: item.date_kind,
  url: item.url,
  search_text: searchBlob(item),
}));

const payload = {
  version: 2,
  generated_at: new Date().toISOString(),
  source: 'us-chinese-life-hub.html ITEMS',
  count: records.length,
  records,
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log('Wrote', outPath, 'records:', records.length);
