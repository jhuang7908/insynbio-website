/**
 * USLifeHub listing policy. America/New_York calendar dates.
 * Specific sessions expire. Program introductions, annual editions, and
 * directories stay available when a date was never published.
 * A registration deadline is not an event end.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.HubListingPolicy = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const TZ = 'America/New_York';

  function isoDay(value) {
    const s = String(value || '').slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
  }

  function nyCalendarDate(now) {
    const d = now instanceof Date ? now : new Date(now || Date.now());
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);
  }

  function addCalendarDays(iso, days) {
    const day = isoDay(iso);
    if (!day) return '';
    const [y, m, d] = day.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + days));
    return dt.toISOString().slice(0, 10);
  }

  function subtractCalendarMonths(iso, months) {
    const day = isoDay(iso);
    if (!day) return '';
    const [y, m, d] = day.split('-').map(Number);
    const shifted = new Date(Date.UTC(y, m - 1 - months, 1));
    const yy = shifted.getUTCFullYear();
    const mm = shifted.getUTCMonth();
    const last = new Date(Date.UTC(yy, mm + 1, 0)).getUTCDate();
    const dd = Math.min(d, last);
    return yy + '-' + String(mm + 1).padStart(2, '0') + '-' + String(dd).padStart(2, '0');
  }

  function isDeal(item) {
    return !!(item && (item.date_kind === 'deal' || item.content_kind === 'deal'));
  }

  function isOngoingIntro(item) {
    if (!item || isDeal(item)) return false;
    const role = item.listing_role || '';
    if (role === 'program_intro' || role === 'directory') return true;
    if (item.date_kind === 'service') return true;
    if (item.content_kind === 'directory' || item.content_kind === 'anchor') return true;
    return false;
  }

  function sessionEndDate(item) {
    if (!item || isOngoingIntro(item) || isDeal(item)) return '';
    const role = item.listing_role || '';
    if (role === 'annual_edition' || role === 'specific_session' || item.has_specific_window) {
      return isoDay(item.event_end_date) || isoDay(item.event_date);
    }
    if (!role && item.date_kind === 'event') {
      return isoDay(item.event_end_date) || isoDay(item.event_date);
    }
    return '';
  }

  function disposition(item, today) {
    today = isoDay(today) || nyCalendarDate(new Date());
    const cutoff = subtractCalendarMonths(today, 1);
    if (!item) return { action: 'pending', reason: 'missing', cutoff: cutoff, end: '' };
    if (isDeal(item)) return { action: 'deal', reason: 'deal', cutoff: cutoff, end: '' };
    if (isOngoingIntro(item)) return { action: 'show', reason: 'ongoing_or_intro', cutoff: cutoff, end: '' };
    const end = sessionEndDate(item);
    const role = item.listing_role || '';
    const dated = role === 'specific_session' || role === 'annual_edition' || (!role && item.date_kind === 'event');
    if (dated && end) {
      if (end < today) {
        if (end <= cutoff) {
          return { action: 'delete', reason: 'ended_full_calendar_month', cutoff: cutoff, end: end };
        }
        return { action: 'hide', reason: 'ended_under_one_calendar_month', cutoff: cutoff, end: end };
      }
      return { action: 'show', reason: 'current_dated', cutoff: cutoff, end: end };
    }
    return { action: 'show', reason: 'date_unannounced', cutoff: cutoff, end: '' };
  }

  function isPublicActivity(item, today) {
    return disposition(item, today).action === 'show';
  }

  function isSearchableActivity(item, today) {
    if (isDeal(item)) return false;
    return isPublicActivity(item, today);
  }

  function includeInNext7Days(item, today) {
    today = isoDay(today) || nyCalendarDate(new Date());
    if (!item || !isPublicActivity(item, today)) return false;
    if (item.youth_contest || item.content_kind === 'youth_contest' || item.content_kind === 'camp' || item.content_kind === 'scouting') return false;
    if (item.listing_role === 'program_intro' || item.listing_role === 'directory' || item.listing_role === 'annual_edition') return false;
    const concrete = item.listing_role === 'specific_session' || (!item.listing_role && item.date_kind === 'event');
    if (!concrete) return false;
    const start = isoDay(item.event_date);
    const end = sessionEndDate(item) || start;
    if (!end) return false;
    const horizon = addCalendarDays(today, 7);
    if (end < today) return false;
    if (start && start > horizon) return false;
    return true;
  }

  function claimsOpenRegistration(item, today, now) {
    if (!item || item.registration_state !== 'official_open') return false;
    if (item.eligibility_status === 'unverified' || item.registration_state === 'status_conflict') return false;
    today = isoDay(today) || nyCalendarDate(now || new Date());
    const deadlineDay = isoDay(item.registration_deadline);
    if (deadlineDay && deadlineDay < today) return false;
    if (item.registration_deadline_at) {
      const endMs = Date.parse(item.registration_deadline_at);
      const nowMs = now instanceof Date ? now.getTime() : Date.parse(now || new Date());
      if (!Number.isNaN(endMs) && !Number.isNaN(nowMs) && nowMs > endMs) return false;
    }
    return true;
  }

  function undatedBadgeLabel(item) {
    const state = (item && item.registration_state) || '';
    if (state === 'official_open') return { month: '申请', day: '已开放' };
    if (state === 'status_conflict' || state === 'eligibility_unverified') return { month: '状态', day: '待核' };
    if (state === 'opens_later') return { month: '尚未', day: '开放' };
    if (item && (item.listing_role === 'directory' || item.content_kind === 'directory')) return { month: '目录', day: '常年' };
    if (item && item.date_kind === 'service') return { month: '长期', day: '服务' };
    return { month: '报名', day: '待公布' };
  }

  function publicActivities(items, today) {
    return (items || []).filter(function (item) { return isPublicActivity(item, today); });
  }

  return {
    TZ: TZ,
    isoDay: isoDay,
    nyCalendarDate: nyCalendarDate,
    addCalendarDays: addCalendarDays,
    subtractCalendarMonths: subtractCalendarMonths,
    sessionEndDate: sessionEndDate,
    disposition: disposition,
    isPublicActivity: isPublicActivity,
    isSearchableActivity: isSearchableActivity,
    includeInNext7Days: includeInNext7Days,
    claimsOpenRegistration: claimsOpenRegistration,
    undatedBadgeLabel: undatedBadgeLabel,
    publicActivities: publicActivities,
    isOngoingIntro: isOngoingIntro
  };
});
