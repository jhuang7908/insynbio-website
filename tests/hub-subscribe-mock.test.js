const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { hubApiBusinessOk } = require('../assets/hub-subscribe-state.js');

const root = path.join(__dirname, '..');
const hub = fs.readFileSync(path.join(root, 'us-chinese-life-hub.html'), 'utf8');
const subscribeSrc = fs.readFileSync(path.join(root, 'functions/api/community-hub/subscribe.js'), 'utf8');
const unsubscribeSrc = fs.readFileSync(path.join(root, 'functions/api/community-hub/unsubscribe.js'), 'utf8');
assert.ok(subscribeSrc.includes('return jsonResponse(200, { ok: true, email, updated: result.updated });'));
assert.ok(unsubscribeSrc.includes('return jsonResponse(200, { ok: true, email });'));
assert.ok(subscribeSrc.includes('{ ok: false, detail: "save failed" }'));

function sliceFn(html, start, end) {
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  assert.ok(a >= 0 && b > a, start);
  return html.slice(a, b);
}
const subscribeFn = sliceFn(hub, 'async function subscribeEmail()', 'async function subscribePush()');
const unsubscribeFn = sliceFn(hub, 'async function unsubscribeEmail()', 'async function unsubscribePush()');

function memory(seed) {
  const data = Object.assign({}, seed || {});
  return {
    getItem(key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null; },
    setItem(key, value) { data[key] = String(value); },
    removeItem(key) { delete data[key]; },
    dump() { return Object.assign({}, data); }
  };
}

function mockResponse(status, body, jsonThrows) {
  return {
    ok: status >= 200 && status < 300,
    status: status,
    statusText: String(status),
    json: async function () {
      if (jsonThrows) throw new SyntaxError('invalid json');
      return body;
    }
  };
}

async function run(which, response, seed, email) {
  const storage = memory(seed);
  const nodes = {};
  function node(id) {
    if (!nodes[id]) nodes[id] = { id: id, value: '', style: {}, textContent: '', innerHTML: '' };
    return nodes[id];
  }
  if (email) node(which === 'sub' ? 'sub-email-val' : 'unsub-email-val').value = email;
  const calls = [];
  const context = {
    console: console,
    window: { HUB_COMMUNITY_API: '/api' },
    document: { getElementById: node },
    localStorage: storage,
    selectedInterests: new Set(['亲子·公园']),
    INTEREST_CHIPS: [{ id: '亲子·公园', label: '亲子/公园' }],
    hubApiBusinessOk: hubApiBusinessOk,
    registerMember: function (value) { storage.setItem('member_email', value || ''); },
    alert: function () { throw new Error('alert'); },
    fetch: async function (url, opts) {
      calls.push({ url: url, opts: opts });
      if (response === 'offline') throw new Error('offline');
      return response;
    }
  };
  const source = (which === 'sub' ? subscribeFn : unsubscribeFn) + '\n' +
    (which === 'sub' ? 'subscribeEmail()' : 'unsubscribeEmail()');
  await vm.runInNewContext(source, context);
  return { storage: storage.dump(), nodes: nodes, calls: calls };
}

const seeded = {
  email_subs: JSON.stringify([{ email: 'keep@example.com', interests: ['文化·节庆'], ts: 1 }]),
  member_email: 'keep@example.com'
};

async function assertUntouched(which, response, label) {
  const result = await run(which, response, seeded, 'new-person@example.com');
  assert.deepStrictEqual(result.storage, seeded, label);
  const el = which === 'sub' ? result.nodes['sub-success-email'] : result.nodes['unsub-success-email'];
  assert.ok(!String(el.innerHTML || '').includes('每周两次'), label + ' success copy');
  assert.ok(!String(el.innerHTML || '').includes('已成功退订'), label + ' unsub copy');
  return el;
}

(async function main() {
  assert.strictEqual(await hubApiBusinessOk(mockResponse(200, { ok: true })), true);
  assert.strictEqual(await hubApiBusinessOk(mockResponse(200, { ok: false, detail: 'save failed' })), false);
  assert.strictEqual(await hubApiBusinessOk(mockResponse(200, {})), false);
  assert.strictEqual(await hubApiBusinessOk(mockResponse(200, null)), false);
  assert.strictEqual(await hubApiBusinessOk(mockResponse(200, { ok: 'true' })), false);
  assert.strictEqual(await hubApiBusinessOk(mockResponse(200, { ok: 1 })), false);
  assert.strictEqual(await hubApiBusinessOk(mockResponse(200, { ok: true }, true)), false);
  assert.strictEqual(await hubApiBusinessOk(mockResponse(502, { ok: false, detail: 'save failed' })), false);
  assert.strictEqual(await hubApiBusinessOk(null), false);

  const failures = [
    ['200 ok false', mockResponse(200, { ok: false, detail: 'save failed' })],
    ['200 empty object', mockResponse(200, {})],
    ['200 missing body', mockResponse(200, null)],
    ['200 string ok', mockResponse(200, { ok: 'true' })],
    ['200 numeric ok', mockResponse(200, { ok: 1 })],
    ['200 invalid json', mockResponse(200, null, true)],
    ['502 save failed', mockResponse(502, { ok: false, detail: 'save failed' })]
  ];
  for (const row of failures) {
    const subEl = await assertUntouched('sub', row[1], 'subscribe ' + row[0]);
    assert.strictEqual(subEl.textContent, '订阅没有保存成功，请再试一次。', row[0]);
    const unEl = await assertUntouched('unsub', row[1], 'unsubscribe ' + row[0]);
    assert.strictEqual(unEl.textContent, '退订没有完成，请再试一次。', row[0]);
  }

  const offlineSub = await run('sub', 'offline', seeded, 'new-person@example.com');
  assert.deepStrictEqual(offlineSub.storage, seeded);
  assert.strictEqual(offlineSub.nodes['sub-success-email'].textContent, '网络没有连上，订阅没有保存。请再试一次。');
  const offlineUn = await run('unsub', 'offline', seeded, 'keep@example.com');
  assert.deepStrictEqual(offlineUn.storage, seeded);
  assert.strictEqual(offlineUn.nodes['unsub-success-email'].textContent, '网络没有连上，退订没有完成。请再试一次。');

  const saved = await run('sub', mockResponse(200, { ok: true, email: 'new-person@example.com', updated: false }), seeded, 'new-person@example.com');
  const subs = JSON.parse(saved.storage.email_subs);
  assert.strictEqual(subs.length, 2);
  assert.strictEqual(subs[1].email, 'new-person@example.com');
  assert.deepStrictEqual(subs[1].interests, ['亲子·公园']);
  assert.ok(subs[1].ts);
  assert.strictEqual(saved.storage.member_email, 'new-person@example.com');
  assert.ok(saved.nodes['sub-success-email'].innerHTML.includes('每周两次精选民生简报'));
  assert.strictEqual(saved.nodes['sub-email-val'].value, '');
  assert.strictEqual(saved.calls.length, 1);
  assert.ok(saved.calls[0].url.endsWith('/community-hub/subscribe'));

  const removed = await run('unsub', mockResponse(200, { ok: true, email: 'keep@example.com' }), seeded, 'keep@example.com');
  assert.deepStrictEqual(JSON.parse(removed.storage.email_subs), []);
  assert.strictEqual(removed.storage.member_email, undefined);
  assert.ok(removed.nodes['unsub-success-email'].innerHTML.includes('已成功退订邮件推送'));
  assert.strictEqual(removed.calls.length, 1);
  assert.ok(removed.calls[0].url.endsWith('/community-hub/unsubscribe'));

  console.log('hub-subscribe-mock.test.js ok');
})().catch(function (err) {
  console.error(err);
  process.exit(1);
});
