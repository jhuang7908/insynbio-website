const assert = require('assert');
const fs = require('fs');
const path = require('path');
const policy = require('../assets/hub-listing-policy.js');

const root = path.join(__dirname, '..');
const TODAY = '2026-11-07';
const hub = fs.readFileSync(path.join(root, 'us-chinese-life-hub.html'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.strictEqual(hub, index, 'index and activity page diverged');

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
const byId = new Map(items.map(i => [i.id, i]));
const publicItems = items.filter(i => policy.isPublicActivity(i, TODAY));
const week = publicItems.filter(i => policy.includeInNext7Days(i, TODAY)).map(i => i.id);

assert.strictEqual(items.length, 127);
assert.strictEqual(publicItems.length, 126);
assert.ok(week.includes('live_009'));
assert.ok(week.includes('fpt_fairy_20261108'));
assert.ok(week.includes('fpt_restore_forest_20261113'));
assert.ok(week.includes('fpt_native_20261114'));
for (const id of ['fpt_foliage_20261119', 'fpt_restore_forest_20261120', 'fpt_restore_highland_20261120', 'camp_harvard_precollege_2027', 'camp_yale_yygs_2027', 'camp_mit_mites', 'camp_nyu_precollege', 'contest_bebras2026', 'contest_technovation2027', 'scout_gnyc', 'dir_shape_up_nyc']) {
  assert.ok(!week.includes(id), id + ' leaked into 7-day');
}

for (const item of publicItems) {
  const end = policy.sessionEndDate(item);
  if (end) assert.ok(end >= TODAY, item.id + ' public with end ' + end);
}

const hidden = items.filter(i => !policy.isPublicActivity(i, TODAY) && !policy.isSearchableActivity(i, TODAY));
assert.deepStrictEqual(hidden.map(i => i.id), ['live_004']);
assert.strictEqual(policy.disposition(byId.get('live_004'), TODAY).action, 'hide');

const required = [
  'fpt_fairy_20261108', 'fpt_restore_forest_20261113', 'fpt_native_20261114', 'fpt_foliage_20261119',
  'fpt_restore_forest_20261120', 'fpt_restore_highland_20261120',
  'dir_shape_up_nyc', 'dir_nyc_recreation_centers',
  'contest_bebras2026', 'contest_exploravision2027', 'contest_ecyber2027', 'contest_jfk2027',
  'contest_studentcam2027', 'contest_swb2027', 'contest_technovation2027', 'contest_juniorhistory2027',
  'contest_nocti2027', 'contest_sealo2027',
  'camp_harvard_precollege_2027', 'camp_yale_yygs_2027', 'camp_mit_mites', 'camp_nyu_precollege',
  'scout_gnyc', 'scout_cub', 'scout_bsa', 'scout_girlscouts_nyc', 'live_009'
];
for (const id of required) assert.ok(byId.has(id), 'missing ' + id);

function text(item) {
  return [item.summary_zh, item.disclosure_zh, item.event_time, item.title_zh, item.age_or_grade].filter(Boolean).join('\n');
}
const internalPhrases = ['不标免费', '不能补', '不能宣称', '不能称当前开放', '不能承诺适格', '不能写成', '本站不选用', '不能当作', '不能推断', '不进未来7日', '不要写成', '未核实'];
for (const item of items) {
  if (!/^(contest_|camp_|scout_|fpt_|dir_)/.test(item.id)) continue;
  const blob = text(item);
  for (const phrase of internalPhrases) {
    assert.ok(!blob.includes(phrase), item.id + ' still has internal phrase ' + phrase);
  }
  assert.ok(!blob.includes('尚未公布'), item.id + ' claims the organizer has not published');
  assert.ok(!blob.includes('未公布'), item.id + ' claims the organizer has not published');
}

const bebras = text(byId.get('contest_bebras2026'));
assert.ok(bebras.includes('截止时间未注明'));
assert.ok(!bebras.includes('尚未公布'));
assert.ok(bebras.includes('老师'));
assert.ok(bebras.includes('免费'));
assert.ok(!bebras.includes('23:59'));

const explora = text(byId.get('contest_exploravision2027'));
assert.ok(explora.includes('美国或加拿大公民'));
assert.ok(explora.includes('2027年1月27日 20:00'));
assert.ok(explora.includes('费用待更新，请查官网'));
assert.ok(!explora.includes('费用未公布'));

const ecyber = text(byId.get('contest_ecyber2027'));
assert.ok(ecyber.includes('2027年2月24日'));
assert.ok(ecyber.includes('2027年3月3日'));
assert.ok(ecyber.includes('该页未写具体钟点'));
assert.ok(ecyber.includes('绿卡'));

const jfk = text(byId.get('contest_jfk2027'));
assert.ok(jfk.includes('禁止使用人工智能'));
assert.ok(jfk.includes('老师'));
assert.ok(jfk.includes('23:59'));

const cam = text(byId.get('contest_studentcam2027'));
assert.ok(cam.includes('02:59'));
assert.ok(cam.includes('身份资格请核对官方规则'));

const swb = text(byId.get('contest_swb2027'));
assert.ok(swb.includes('免费'));
assert.ok(swb.includes('人工智能'));
assert.ok(swb.includes('老师'));

for (const id of ['contest_technovation2027', 'contest_juniorhistory2027', 'contest_nocti2027', 'contest_sealo2027']) {
  assert.ok(text(byId.get(id)).includes('报名状态待核实'), id);
}
assert.ok(text(byId.get('contest_sealo2027')).includes('该页未写具体钟点'));
assert.ok(text(byId.get('contest_juniorhistory2027')).includes('2026年12月23日'));
assert.ok(text(byId.get('contest_juniorhistory2027')).includes('资格要求请查官网'));
assert.ok(text(byId.get('contest_juniorhistory2027')).includes('该页未写具体钟点'));
assert.ok(!text(byId.get('contest_juniorhistory2027')).includes('23:59'));
assert.ok(text(byId.get('contest_nocti2027')).includes('资格要求请查官网'));

const harvardItem = byId.get('camp_harvard_precollege_2027');
const harvard = text(harvardItem);
assert.strictEqual(harvardItem.registration_opens, '2026-12-01');
assert.strictEqual(harvardItem.registration_deadline, '2027-02-10');
assert.notStrictEqual(harvardItem.registration_deadline, harvardItem.registration_opens);
assert.ok(!harvardItem.registration_deadline_at);
assert.strictEqual(policy.sessionEndDate(harvardItem), '2027-08-06');
assert.strictEqual(policy.disposition(harvardItem, '2026-12-02').action, 'show');
assert.strictEqual(policy.claimsOpenRegistration(harvardItem, '2026-12-02'), false);
assert.ok(harvard.includes('申请开放日'));
assert.ok(harvard.includes('常规截止'));
assert.ok(harvard.includes('6,250'));
assert.ok(harvard.includes('本校'));
assert.ok(harvard.includes('不等于被哈佛录取'));
assert.ok(!harvard.includes('12月1日截止'));
assert.ok(!/2026年12月1日[^。；]*截止/.test(harvard));

const yygs = text(byId.get('camp_yale_yygs_2027'));
assert.ok(yygs.includes('申请已开放'));
assert.ok(yygs.includes('2027年1月6日 23:59'));
assert.ok(yygs.includes('费用待更新，请查官网'));
assert.ok(!yygs.includes('费用未公布'));
assert.ok(yygs.includes('10或11年级'));

const mites = text(byId.get('camp_mit_mites'));
assert.ok(mites.includes('2027日期待更新'));
assert.ok(mites.includes('报名时间待更新，请查官网'));
assert.ok(!mites.includes('尚未公布'));
assert.ok(mites.includes('交通自理'));
assert.ok(mites.includes('绿卡'));
assert.ok(!mites.includes('2027-02-01'));

const nyu = text(byId.get('camp_nyu_precollege'));
assert.ok(nyu.includes('2027日期待更新'));
assert.ok(nyu.includes('费用待更新，请查官网'));
assert.ok(!nyu.includes('尚未公布'));
assert.ok(nyu.includes('国际生'));
assert.ok(nyu.includes('15岁'));

const bsa = text(byId.get('scout_bsa'));
assert.ok(bsa.includes('2024年5月1日'));
assert.ok(bsa.includes('2026年费用请以官网为准'));
assert.ok(bsa.includes('男女'));

const gs = text(byId.get('scout_girlscouts_nyc'));
assert.ok(gs.includes('65'));
assert.ok(gs.includes('45'));
assert.ok(gs.includes('30'));
assert.ok(gs.includes('请向官方确认'));
assert.ok(gs.includes('具体年龄段请看官网'));

const fairy = text(byId.get('fpt_fairy_20261108'));
assert.ok(fairy.includes('免费'));
assert.ok(fairy.includes('3–12'));
assert.ok(fairy.includes('报名时间待更新，请查官网'));
assert.ok(!fairy.includes('须提前报名'));

const forestFive = ['fpt_restore_forest_20261113', 'fpt_native_20261114', 'fpt_foliage_20261119', 'fpt_restore_forest_20261120', 'fpt_restore_highland_20261120'];
for (const id of forestFive) {
  const item = byId.get(id);
  const blob = text(item);
  assert.ok(blob.includes('须提前报名'), id);
  assert.ok(blob.includes('截止时间未注明'), id);
  assert.ok(blob.includes('名额以官网为准'), id);
  assert.ok(!blob.includes('尚未公布'), id);
  assert.ok(!blob.includes('未公布'), id);
  assert.strictEqual(item.registration_url, item.url, id);
  assert.notStrictEqual(item.registration_state, 'official_open', id);
}
for (const id of forestFive.slice(0, 4)) assert.ok(text(byId.get(id)).includes('Buddy Monument'), id);
assert.ok(text(byId.get('fpt_restore_highland_20261120')).includes('Vermont Place'));
assert.ok(!text(byId.get('fpt_restore_highland_20261120')).includes('Buddy Monument'));
assert.strictEqual(byId.get('fpt_foliage_20261119').module, '健身·户外');
assert.strictEqual(byId.get('fpt_fairy_20261108').module, '亲子·公园');
assert.strictEqual(byId.get('fpt_restore_forest_20261113').module, '公益·义工');

assert.ok(text(byId.get('dir_shape_up_nyc')).includes('不是某一天的课程') || text(byId.get('dir_shape_up_nyc')).includes('不是已经排好'));
assert.ok(text(byId.get('dir_shape_up_nyc')).includes('费用请看官网'));
assert.ok(hub.includes('https://www.nycgovparks.org/events/shape-up-nyc'));
assert.ok(hub.includes('https://www.nycgovparks.org/facilities/recreationcenters'));
assert.ok(!hub.includes('precollege.sps.columbia.edu'));
assert.ok(!hub.includes('girlscouts.org/en/members/for-girl-scouts/grade-levels.html'));
assert.ok(hub.includes('balanceHeroChipRows'));
assert.ok(hub.includes('functions/api/community-hub/subscribe') || fs.existsSync(path.join(root, 'functions/api/community-hub/subscribe.js')));
assert.strictEqual(hub.includes("window.HUB_APP_VERSION = '3.3.36'"), true);

const camps = items.filter(i => i.content_kind === 'camp');
assert.ok(camps.every(i => i.camp_host === 'university_official'));
assert.strictEqual(camps.length, 4);
assert.strictEqual(items.filter(i => i.content_kind === 'scouting').length, 4);
assert.strictEqual(items.filter(i => i.youth_contest).length, 10);

const countFn = hub.slice(hub.indexOf('function updateHubSearchCount'), hub.indexOf('function hubLinkMeta'));
assert.ok(countFn.includes('livelihoodItems'));
assert.ok(!countFn.includes('ITEMS.length'));
assert.ok(hub.includes('function readerMaySeeItem'));
assert.ok(hub.includes('milestone !== opens'));
assert.ok(!hub.includes('已过期'));
assert.ok(!hub.includes('已過期'));
assert.ok(!hub.includes('过期前'));
assert.ok(!hub.includes('過期前'));
assert.ok(!/diff >= -3/.test(hub));
assert.ok(!/<option\b[^>]*>[^<]*过期/.test(hub));
assert.ok(!/<button\b[^>]*>[^<]*过期/.test(hub));
assert.ok(hub.includes('📋 当前信息</div>') || hub.includes('feed_title: "📋 当前信息"'));
assert.strictEqual(policy.isPublicActivity(byId.get('dir_shape_up_nyc'), TODAY), true);
assert.strictEqual(policy.disposition(byId.get('dir_shape_up_nyc'), TODAY).action, 'show');

console.log(JSON.stringify({
  items: items.length,
  public: publicItems.length,
  hidden: hidden.map(i => i.id),
  week
}, null, 2));
const { resolveAsOf } = require('../scripts/build_hub_search_index.js');
assert.strictEqual(resolveAsOf('2026-12-15'), '2026-12-15');
assert.strictEqual(resolveAsOf('', new Date('2026-11-08T15:00:00Z')), '2026-11-08');
assert.ok(!fs.readFileSync(path.join(root, 'scripts/build_hub_search_index.js'), 'utf8').includes("const TODAY = '2026-11-07'"));

console.log('hub-catalog-audit.test.js ok');
