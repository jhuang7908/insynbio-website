const assert = require('assert');
const p = require('../assets/hub-listing-policy.js');

const TODAY = '2026-11-07';

function session(end, extra) {
  return Object.assign({
    id: 's',
    date_kind: 'event',
    listing_role: 'specific_session',
    event_date: end,
    event_end_date: end
  }, extra || {});
}

assert.strictEqual(p.subtractCalendarMonths('2026-11-07', 1), '2026-10-07');
assert.strictEqual(p.subtractCalendarMonths('2026-03-31', 1), '2026-02-28');
assert.strictEqual(p.subtractCalendarMonths('2024-03-31', 1), '2024-02-29');
assert.strictEqual(p.subtractCalendarMonths('2026-05-31', 1), '2026-04-30');
assert.strictEqual(p.subtractCalendarMonths('2026-01-07', 1), '2025-12-07');
assert.strictEqual(p.nyCalendarDate(new Date('2026-11-07T04:59:00Z')), '2026-11-06');
assert.strictEqual(p.nyCalendarDate(new Date('2026-11-07T05:00:00Z')), '2026-11-07');

assert.strictEqual(p.disposition(session('2026-10-07'), TODAY).action, 'delete');
assert.strictEqual(p.disposition(session('2026-10-08'), TODAY).action, 'hide');
assert.strictEqual(p.disposition(session('2026-11-06'), TODAY).action, 'hide');
assert.strictEqual(p.disposition(session('2026-11-07'), TODAY).action, 'show');
assert.strictEqual(p.disposition(session('2026-09-26'), TODAY).action, 'delete');

const service = { id: 'svc', date_kind: 'service', event_date: '2026-09-28', title_zh: '课程' };
assert.strictEqual(p.disposition(service, TODAY).action, 'show');
assert.strictEqual(p.includeInNext7Days(service, TODAY), false);
assert.strictEqual(p.sessionEndDate(service), '');

const introWithOldSession = {
  id: 'old',
  listing_role: 'program_intro',
  date_kind: 'event',
  event_date: '2026-09-01',
  event_end_date: '2026-09-01',
  sessions: [{ end: '2026-09-01' }]
};
assert.strictEqual(p.disposition(introWithOldSession, TODAY).action, 'show');
assert.strictEqual(p.includeInNext7Days(introWithOldSession, TODAY), false);
assert.strictEqual(p.sessionEndDate(introWithOldSession), '');

const undated = { id: 'u', date_kind: 'event', title_zh: '未公布日期' };
assert.strictEqual(p.disposition(undated, TODAY).action, 'show');
assert.strictEqual(p.disposition(undated, TODAY).reason, 'date_unannounced');
assert.strictEqual(p.includeInNext7Days(undated, TODAY), false);
assert.strictEqual(p.claimsOpenRegistration(undated, TODAY), false);

const deadlineOnly = {
  id: 'dead',
  listing_role: 'annual_edition',
  date_kind: 'event',
  registration_deadline: '2026-09-01',
  event_end_date: '2027-01-11'
};
assert.strictEqual(p.sessionEndDate(deadlineOnly), '2027-01-11');
assert.strictEqual(p.disposition(deadlineOnly, TODAY).action, 'show');

const camp = {
  id: 'camp',
  content_kind: 'camp',
  listing_role: 'annual_edition',
  event_date: '2027-06-21',
  event_end_date: '2027-08-06',
  registration_state: 'opens_later'
};
assert.strictEqual(p.includeInNext7Days(camp, TODAY), false);
assert.strictEqual(p.claimsOpenRegistration(camp, TODAY), false);
assert.notStrictEqual(p.undatedBadgeLabel(camp).day, '报名中');

const bebras = {
  id: 'bebras',
  youth_contest: true,
  content_kind: 'youth_contest',
  listing_role: 'annual_edition',
  event_date: '2026-11-09',
  event_end_date: '2026-11-20',
  registration_state: 'organizer_only'
};
assert.strictEqual(p.disposition(bebras, TODAY).action, 'show');
assert.strictEqual(p.includeInNext7Days(bebras, TODAY), false);
assert.strictEqual(p.claimsOpenRegistration(bebras, TODAY), false);

const yygs = {
  id: 'yygs',
  content_kind: 'camp',
  listing_role: 'annual_edition',
  registration_state: 'official_open',
  registration_deadline: '2027-01-06',
  registration_deadline_at: '2027-01-06T23:59:00-05:00',
  event_end_date: '2027-07-30'
};
assert.strictEqual(p.claimsOpenRegistration(yygs, TODAY, new Date('2026-11-07T15:00:00Z')), true);
assert.strictEqual(p.claimsOpenRegistration(yygs, '2027-01-07', new Date('2027-01-07T05:00:00Z')), false);
assert.strictEqual(p.includeInNext7Days(yygs, TODAY), false);

const conflict = {
  id: 'tech',
  listing_role: 'program_intro',
  content_kind: 'youth_contest',
  youth_contest: true,
  registration_state: 'status_conflict',
  registration_deadline: '2027-03-11'
};
assert.strictEqual(p.isPublicActivity(conflict, TODAY), true);
assert.strictEqual(p.includeInNext7Days(conflict, TODAY), false);
assert.strictEqual(p.claimsOpenRegistration(conflict, TODAY), false);
assert.strictEqual(p.isSearchableActivity(conflict, TODAY), true);

const hidden = session('2026-10-20');
assert.strictEqual(p.isSearchableActivity(hidden, TODAY), false);
assert.strictEqual(p.isSearchableActivity(session('2026-09-22'), TODAY), false);

const gala = { id: 'live_009', date_kind: 'event', event_date: '2026-11-13' };
assert.strictEqual(p.includeInNext7Days(gala, TODAY), true);
assert.strictEqual(p.disposition(gala, TODAY).action, 'show');

const week = session('2026-11-08');
const later = session('2026-11-19');
assert.strictEqual(p.includeInNext7Days(week, TODAY), true);
assert.strictEqual(p.includeInNext7Days(later, TODAY), false);
assert.strictEqual(p.includeInNext7Days(session('2026-11-14'), TODAY), true);
assert.deepStrictEqual(p.publicActivities([], TODAY), []);

const dateOnly = {
  id: 'date-only',
  listing_role: 'program_intro',
  registration_deadline: '2027-03-03',
  registration_deadline_precision: 'date',
  registration_state: 'to_be_announced'
};
assert.strictEqual(p.claimsOpenRegistration(dateOnly, TODAY), false);
assert.strictEqual(p.isoDay(dateOnly.registration_deadline), '2027-03-03');

console.log('hub-listing-policy.test.js ok');
