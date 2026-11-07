const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const policy = require('../assets/hub-listing-policy.js');
const assigner = require('../assets/hub-image-assign.js');

const root = path.join(__dirname, '..');
const TODAY = '2026-11-07';
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'assets/hub-image-catalog.json'), 'utf8'));
const hub = fs.readFileSync(path.join(root, 'us-chinese-life-hub.html'), 'utf8');

function sliceJson(html, marker) {
  const at = html.indexOf(marker);
  assert.ok(at >= 0, marker);
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
    if (i > abs && arr === 0 && obj === 0) return JSON.parse(html.slice(abs, i + 1));
  }
  throw new Error('unterminated ' + marker);
}

const items = sliceJson(hub, 'const ITEMS = ');
const publicItems = items.filter(i => policy.isPublicActivity(i, TODAY));
assert.strictEqual(publicItems.length, 126);

const shas = new Set();
for (const image of Object.values(catalog.images)) {
  assert.ok(image.file.startsWith('assets/hub-event-images/v337/'), image.id);
  assert.ok(!/^https?:/i.test(image.file), image.id);
  const lic = String(image.license || '').toLowerCase();
  assert.ok(!lic.includes('nc') && !lic.includes('nd'), image.id + ' ' + image.license);
  assert.ok(image.author && image.source_page && image.license, image.id);
  const buf = fs.readFileSync(path.join(root, image.file));
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  assert.strictEqual(sha, image.sha256, image.id);
  assert.ok(!shas.has(sha), 'duplicate bytes ' + image.id);
  shas.add(sha);
}

const primaryIds = Object.values(catalog.primaries);
assert.strictEqual(new Set(primaryIds).size, 26);
for (const [itemId, imageId] of Object.entries(catalog.primaries)) {
  assert.ok(items.some(i => i.id === itemId), itemId);
  assert.ok(catalog.images[imageId], imageId);
}

function pagesOf(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size).map(item => ({ ...item })));
  return out;
}

function assertUniquePage(page, label) {
  const result = assigner.assign(page, catalog);
  assert.strictEqual(result.ok, true, label);
  const seen = new Set();
  for (const row of result.assigned) {
    assert.ok(row.unique, label + ' ' + row.id);
    assert.ok(!seen.has(row.sha256), label + ' dup ' + row.id);
    seen.add(row.sha256);
    assert.ok(String(page.find(i => i.id === row.id)._assignedImage.file).startsWith('assets/'), row.id);
  }
}

for (const page of pagesOf(publicItems, catalog.page_size)) assertUniquePage(page, 'all');

const modules = [...new Set(publicItems.map(i => i.module))];
for (const mod of modules) {
  const own = publicItems.filter(i => i.module === mod);
  const pool = new Set(catalog.pools[mod] || []);
  assert.ok(pool.size >= Math.min(catalog.page_size, own.length), mod + ' pool ' + pool.size + ' items ' + own.length);
  for (const page of pagesOf(own, catalog.page_size)) {
    assertUniquePage(page, mod);
    for (const item of page) {
      const imageId = item._assignedImage.id;
      const primary = catalog.primaries[item.id];
      assert.ok(pool.has(imageId) || imageId === primary, mod + ' ' + item.id + ' -> ' + imageId);
    }
  }
}

const weekIds = publicItems.filter(i => policy.includeInNext7Days(i, TODAY)).map(i => i.id);
assertUniquePage(publicItems.filter(i => weekIds.includes(i.id)).map(i => ({ ...i })), 'week');

console.log('hub-image-assign.test.js ok', Object.keys(catalog.images).length);
