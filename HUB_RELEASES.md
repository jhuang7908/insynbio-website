# NYC Hub Release Notes

## v2.1.0-20260615

- Homepage is now **4 portal tiles only** (no stream/dashboard clutter).
- Latest sub-page: single forum-style feed (removed 24h/7d/enroll split and vague redirect hints).
- Sub-pages show compact chapter nav with Home link.

## v2.0.5-20260615

- Restored hub archive from 112-item snapshot (accidental drop to 28 on 2026-06-15 PM run).
- Channels page now shows full 30-day link list + search/filters (was hidden after page split).
- Client + pipeline: explicit 30-day retention by last activity; merge safeguard against mass data loss.
- Recent-3-day stream includes events from past 3 days and upcoming week.

## v2.0.4-20260615

- DOH vaccines link → `nyc.gov/.../immunization-clinics.page` (specific clinic page).
- Housing Connect → `nyc.gov/housingconnect` (same domain pattern as working rentfreeze link).
- External links: iframe breakout + `<a target=_blank>` fallback when popup blocked.

## v2.0.3-20260615

- Replaced 14 broken official URLs (ACCESS NYC cash assistance, NYC.gov pages, Parks programs, GW Supermarket).
- Added runtime `HUB_URL_FIXES` map so legacy cached links redirect to verified endpoints.
- Official government links in guide modal now open directly (no Google Translate proxy).
- Updated `hub_channel_anchors.json` to v1.0.2 with verified URLs.

## v2.0.0-20260615

- Default home view set to `latest` (`us-chinese-life-hub.html?view=latest`).
- Added independent entry pages:
  - `latest.html`
  - `channels.html`
  - `deals.html`
  - `yellow-pages.html`
- Folded daily dashboard by default (almanac + forecast collapsed).
- Converted content cards to single-row layout.
- Removed "12大" wording from channel navigation and titles.
- Yellow pages switched to alphabetical sorting by merchant name.
- Yellow pages modal behavior:
  - Mobile: call + map actions
  - Desktop: map action only (call hidden)
- Added official domain bypass for translation wrapper in external links.
- Added full-link validator script: `scripts/nyc_community_events/validate_all_hub_links.py`.

