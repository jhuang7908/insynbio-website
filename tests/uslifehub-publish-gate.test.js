const assert = require('assert');
const gate = require('../scripts/uslifehub_publish_gate.js');
const policy = require('../assets/hub-listing-policy.js');

const live110 = {
  id: 'live_110',
  title_zh: '皇后区图书馆法拉盛分馆',
  url: 'https://www.queenslibrary.org/about-us/locations/flushing',
  date_kind: 'service',
  listing_role: 'program_intro'
};
const live041 = {
  id: 'live_041',
  title_zh: 'NYPL Flushing Library 法拉盛图书馆',
  title_en: 'NYPL Flushing Library',
  url: 'https://www.nypl.org/locations/flushing',
  date_kind: 'service'
};
const oldSession = {
  id: 'old',
  date_kind: 'event',
  listing_role: 'specific_session',
  event_date: '2026-09-01',
  event_end_date: '2026-09-01',
  title_zh: '已经结束一个月的场次'
};
const recent = {
  id: 'recent',
  date_kind: 'event',
  listing_role: 'specific_session',
  event_date: '2026-11-08',
  event_end_date: '2026-11-08',
  title_zh: '刚结束的场次'
};
const service = {
  id: 'svc',
  date_kind: 'service',
  title_zh: '长期英语课',
  url: 'https://www.example.gov/esl'
};

const retained = gate.applyRetention([live041, live110, oldSession, recent, service], '2026-11-25');
assert.deepStrictEqual(retained.removedDuplicates.map((row) => row.id), ['live_041']);
assert.deepStrictEqual(retained.deleted.map((row) => row.id), ['old']);
assert.ok(retained.hidden.some((row) => row.id === 'recent'));
assert.strictEqual(retained.items.find((item) => item.id === 'recent').listing_state, 'held_past');
assert.ok(retained.items.some((item) => item.id === 'svc'));
assert.ok(retained.items.some((item) => item.id === 'live_110'));
assert.strictEqual(policy.isPublicActivity(retained.items.find((item) => item.id === 'recent'), '2026-11-25'), false);
assert.strictEqual(policy.isPublicActivity(retained.items.find((item) => item.id === 'svc'), '2026-11-25'), true);

assert.strictEqual(gate.classifyFetched(live041, {
  status: 200,
  body: '<title>Flushing Library | The New York Public Library</title><p>Hours and events</p>',
  finalUrl: 'https://www.nypl.org/locations/flushing'
}).state, 'invalid');

assert.strictEqual(gate.classifyFetched(live110, {
  status: 200,
  body: '<html><title>Just a moment...</title><p>Checking your browser before accessing queenslibrary.org</p></html>',
  finalUrl: 'https://www.queenslibrary.org/about-us/locations/flushing'
}).state, 'unverified');

assert.strictEqual(gate.classifyFetched(service, {
  status: 403,
  body: 'forbidden',
  finalUrl: service.url
}).state, 'unverified');

assert.strictEqual(gate.classifyFetched(service, {
  status: 404,
  body: '<title>Page not found</title>',
  finalUrl: service.url
}).state, 'invalid');

assert.strictEqual(gate.classifyFetched(live110, {
  status: 200,
  body: '<title>Flushing Library | Queens Public Library</title><p>ESL and children programs in Flushing</p>',
  finalUrl: live110.url
}).state, 'verified');

const urls = new Set([gate.normalizeUrl(live110.url)]);
assert.strictEqual(gate.candidateDecision({
  url: 'https://www.nycgovparks.org/events/example',
  title_zh: 'Forest Park 新的一场修复',
  event_date: '2026-12-02'
}, urls, '2026-11-25').accept, true);
assert.strictEqual(gate.candidateDecision({
  url: live110.url,
  title_zh: '皇后区图书馆法拉盛分馆',
  event_date: '2026-12-02'
}, urls, '2026-11-25').reason, 'already_listed');
assert.strictEqual(gate.candidateDecision({
  url: 'https://www.nycgovparks.org/events/old',
  title_zh: '已经过去的场次名称',
  event_date: '2026-11-01'
}, urls, '2026-11-25').reason, 'not_a_future_dated_session');
assert.strictEqual(gate.candidateDecision({
  url: 'https://www.nycgovparks.org/events/nav',
  title_zh: '了解更多并参与本活动',
  event_date: '2026-12-02'
}, urls, '2026-11-25').reason, 'nav_title');

const badUi = '<button>查看过期</button>' + CHIPS(gate);
assert.ok(gate.subscribeUiErrors(badUi).some((error) => error.includes('expired')));
assert.strictEqual(gate.CHIPS.length, 13);

function CHIPS(mod) {
  return mod.CHIPS.map((id) => '{ id: "' + id + '"').join('');
}

console.log('uslifehub-publish-gate.test.js ok');
