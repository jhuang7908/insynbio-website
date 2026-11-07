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
const requiredPrimaries = {
  fpt_fairy_20261108: 'forest-playground',
  camp_harvard_precollege_2027: 'harvard-yard',
  camp_yale_yygs_2027: 'yale-campus',
  camp_mit_mites: 'mit-campus',
  camp_nyu_precollege: 'washington-square',
  dir_nyc_recreation_centers: 'asser-levy-rec',
  scout_girlscouts_nyc: 'girl-scouts-flag',
  live_041: 'flushing-library',
  live_110: 'flushing-library',
  live_043: 'sunset-park-library',
  live_111: 'chatham-library',
  live_132: 'job-06',
  live_133: 'job-06'
};
for (const [itemId, imageId] of Object.entries(requiredPrimaries)) {
  assert.strictEqual(catalog.primaries[itemId], imageId, itemId);
}
for (const [itemId, imageId] of Object.entries(catalog.primaries)) {
  assert.ok(items.some(i => i.id === itemId), itemId);
  assert.ok(catalog.images[imageId], imageId);
}
assert.ok(primaryIds.length >= 26);
const retired = ['benefit-04', 'benefit-05', 'benefit-06', 'girl-guides', 'indoor-pool', 'family-park', 'civic-06', 'job-04', 'job-07', 'job-11', 'job-12'];
const referenced = new Set([...Object.values(catalog.primaries), ...Object.values(catalog.pools).flat(), ...(catalog.reserve || [])]);
for (const id of retired) assert.ok(!referenced.has(id), id);
assert.ok(!catalog.images['benefit-04']);
assert.ok(!catalog.images['girl-guides']);
assert.strictEqual(catalog.images['job-09'].attribution, 'UNESCO / Dominique Roger');
assert.ok(catalog.images['job-02'].attribution.includes('Otava / JOKA / Museovirasto'));
assert.ok(!catalog.images['job-02'].author.includes('未具名'));
assert.deepStrictEqual(catalog.images['job-06'].only_item_ids, ['live_132', 'live_133']);
assert.ok(catalog.images['mit-campus'].only_item_ids.includes('camp_mit_mites'));
assert.ok(!(catalog.images['mit-campus'].on_site_ids || []).includes('live_050'));

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

const credit = require('../assets/hub-image-credit.js');
function assignments(list) {
  return assigner.assign(list.map(item => ({ ...item })), catalog).assigned;
}
const allAssigned = [];
for (const page of pagesOf(publicItems, catalog.page_size)) allAssigned.push(...assignments(page));
for (const mod of modules) {
  for (const page of pagesOf(publicItems.filter(i => i.module === mod), catalog.page_size)) {
    allAssigned.push(...assignments(page));
  }
}
for (const row of allAssigned) {
  if (row.image === 'mit-campus') assert.strictEqual(row.id, 'camp_mit_mites', row.id);
  if (row.image === 'harvard-yard') assert.strictEqual(row.id, 'camp_harvard_precollege_2027', row.id);
  if (row.image === 'yale-campus') assert.strictEqual(row.id, 'camp_yale_yygs_2027', row.id);
  if (row.image === 'washington-square') assert.strictEqual(row.id, 'camp_nyu_precollege', row.id);
  if (row.image === 'job-06') assert.ok(['live_132', 'live_133'].includes(row.id), row.id);
  if (row.image === 'girl-scouts-flag') assert.strictEqual(row.id, 'scout_girlscouts_nyc', row.id);
  if (row.image === 'asser-levy-rec') assert.strictEqual(row.id, 'dir_nyc_recreation_centers', row.id);
  assert.ok(!retired.includes(row.image), row.image);
}
const rec = assignments(publicItems.filter(i => i.id === 'dir_nyc_recreation_centers'));
assert.strictEqual(rec[0].image, 'asser-levy-rec');
const flushing = assignments(publicItems.filter(i => i.id === 'live_041'));
assert.strictEqual(flushing[0].image, 'flushing-library');
const girl = assignments(publicItems.filter(i => i.id === 'scout_girlscouts_nyc'));
assert.strictEqual(girl[0].image, 'girl-scouts-flag');
const areaa = publicItems.find(i => i.id === 'live_050');
const areaaImage = assignments([areaa])[0].image;
assert.notStrictEqual(areaaImage, 'mit-campus');
assert.notStrictEqual(areaaImage, 'girl-scouts-flag');
const sapa = assignments([publicItems.find(i => i.id === 'live_056')])[0].image;
assert.notStrictEqual(sapa, 'job-06');
const snap = assignments([publicItems.find(i => i.id === 'live_088')])[0].image;
assert.ok(!/benefit-0[456]|military/.test(snap), snap);
assert.ok(hub.includes('assets/hub-image-credit.js'));
assert.ok(!hub.includes("img.kind === 'place' ? '实地'"));
const forestItem = { id: 'fpt_fairy_20261108', _assignedImage: catalog.images['forest-playground'] };
const wrongPlace = { id: 'live_050', _assignedImage: catalog.images['indoor-pool'] };
assert.strictEqual(credit.label(forestItem, forestItem._assignedImage), '实地，不是本场活动现场');
assert.strictEqual(credit.label(wrongPlace, wrongPlace._assignedImage), '主题示意，非本项目现场');
const job09 = credit.html({ id: 'live_116', _assignedImage: catalog.images['job-09'] });
assert.ok(job09.includes('UNESCO / Dominique Roger'));
assert.ok(job09.includes('href="https://creativecommons.org/licenses/by-sa/3.0/igo/deed.en"'));
assert.ok(job09.includes('主题示意，非本项目现场'));
assert.ok(!job09.includes('title="'));
const runners = credit.html({ id: 'dir_shape_up_nyc', _assignedImage: catalog.images['outdoor-runners'] });
assert.ok(runners.includes('Runners in outdoor exercise class, Hyde Park by David Hawgood'));
assert.ok(runners.includes('https://creativecommons.org/licenses/by-sa/2.0'));
const job02 = credit.html({ id: 'live_059', _assignedImage: catalog.images['job-02'] });
assert.ok(job02.includes('Otava / JOKA / Museovirasto'));
assert.ok(!job02.includes('未具名'));

const weekIds = publicItems.filter(i => policy.includeInNext7Days(i, TODAY)).map(i => i.id);
assertUniquePage(publicItems.filter(i => weekIds.includes(i.id)).map(i => ({ ...i })), 'week');

console.log('hub-image-assign.test.js ok', Object.keys(catalog.images).length);
