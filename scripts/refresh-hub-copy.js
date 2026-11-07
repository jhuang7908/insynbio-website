#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const policy = require('../assets/hub-listing-policy.js');
const fresh = new Map(require('./hub-catalog-additions').build().map(item => [item.id, item]));

function sliceJson(html, marker) {
  const at = html.indexOf(marker);
  if (at < 0) throw new Error(marker);
  const abs = at + marker.length;
  let arr = 0, obj = 0, inStr = false, esc = false;
  for (let i = abs; i < html.length; i++) {
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
    if (i > abs && arr === 0 && obj === 0) return { json: html.slice(abs, i + 1), start: abs, end: i + 1 };
  }
  throw new Error('unterminated');
}

const root = path.join(__dirname, '..');
const hubPath = path.join(root, 'us-chinese-life-hub.html');
let html = fs.readFileSync(hubPath, 'utf8');
const sliced = sliceJson(html, 'const ITEMS = ');
const items = JSON.parse(sliced.json).map(item => fresh.has(item.id) ? fresh.get(item.id) : item);
html = html.slice(0, sliced.start) + JSON.stringify(items) + html.slice(sliced.end);
html = html.replace('"events_7d":3', '"events_7d":4');
html = html.replace(
  '报名时间没公布时，卡片会写“尚未公布”。',
  '本页未核实的费用、日期或资格会写“待更新，请查官网”。'
);
html = html.replace(
  '公园局常年健身目录。不代表某一节未来课程已经排期，费用以官网为准。',
  '公园局健身课程目录，不是已经排好的某一节课。上课时间和费用请看官网。'
);
const today = '2026-11-07';
const week = items.filter(item => policy.includeInNext7Days(item, today)).map(item => item.id);
fs.writeFileSync(hubPath, html);
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(JSON.stringify({ items: items.length, week }, null, 2));
