const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const hub = fs.readFileSync(path.join(root, 'us-chinese-life-hub.html'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const store = fs.readFileSync(path.join(root, 'functions/api/community-hub/_store.js'), 'utf8');
const subscribe = fs.readFileSync(path.join(root, 'functions/api/community-hub/subscribe.js'), 'utf8');
assert.strictEqual(hub, index);

const chips = [
  '亲子·公园', '健身·户外', '文化·节庆', '语言·教育', '就业·培训', '福利·政务',
  '交通·出行', '公益·义工', '安全·突发', '休闲·运动', '住房·安居', '医疗·健康', 'deals_savings'
];
for (const id of chips) {
  assert.ok(hub.includes('{ id: "' + id + '"'), 'missing chip ' + id);
  assert.ok(store.includes('"' + id + '"'), 'store missing ' + id);
}
assert.ok(store.includes('亲子·公园": "culture_festival"'));
assert.ok(store.includes('就业·培训": "education_lang"'));
assert.ok(store.includes('公益·义工": "benefits_gov"'));
assert.ok(!store.includes('function parseInterests'));
assert.ok(!fs.existsSync(path.join(root, 'functions/api/community-hub/_mail.js')));
assert.ok(subscribe.includes('normalizeInterests'));
assert.ok(!subscribe.includes('mailDeliveryStatus'));
assert.ok(!subscribe.includes('onRequestGet'));

function sliceFn(html, start, end) {
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  assert.ok(a >= 0 && b > a, start);
  return html.slice(a, b);
}
const sub = sliceFn(hub, 'async function subscribeEmail()', 'async function subscribePush()');
assert.ok(sub.indexOf('fetch(') < sub.indexOf("localStorage.setItem('email_subs'"));
assert.ok(sub.indexOf('fetch(') < sub.indexOf('registerMember('));
assert.ok(sub.includes('每周两次精选民生简报'));
assert.ok(sub.includes('周一和周四'));
assert.ok(!sub.includes('订阅已记录本地'));
assert.ok(!sub.includes('补发欢迎信'));
assert.ok(sub.includes('await hubApiBusinessOk(response)'));
assert.ok(!sub.includes('.catch(() => ({})'));
assert.ok(sub.includes('订阅没有保存成功，请再试一次。'));
assert.ok(sub.includes('网络没有连上，订阅没有保存。请再试一次。'));

const unsub = sliceFn(hub, 'async function unsubscribeEmail()', 'async function unsubscribePush()');
assert.ok(unsub.includes('await hubApiBusinessOk(response)'));
assert.ok(!unsub.includes('if (!response.ok)'));
assert.ok(unsub.indexOf('fetch(') < unsub.indexOf("localStorage.setItem('email_subs'"));
assert.ok(unsub.includes('已成功退订邮件推送'));
assert.ok(!unsub.includes('已从本地退订'));
assert.ok(unsub.includes('退订没有完成，请再试一次。'));
assert.ok(hub.includes('每周为您发送两次精选社区动态'));
assert.ok(hub.includes('assets/hub-subscribe-state.js'));
assert.ok(hub.includes('订阅会员'));
assert.ok(!hub.includes('HubSubscribeClient'));

console.log('hub-subscribe-ui.test.js ok');
