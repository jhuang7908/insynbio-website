# NYC Hub Release Notes

## v2.2.0-20260615

Synthesized P0 from三方评审 (lead + GPT + Gemini):
- **Search-first hero** on homepage: tagline + full-width global search + preset chips (平价房/粮食券/半价地铁卡/免费遛娃) + trust line; search jumps to 民生频道 feed.
- **Header simplified**: 3 selectors (UI lang / link lang / layout) moved into a ⚙️ settings menu; kept a visible 中|EN quick toggle.
- **Slim dashboard**: removed US stock ticker (kept weather + 24h/7d + ✔核验); dashboard stays collapsed by default.
- **XHS funnel hooks** on first screen: 加微信群/订阅 + 加到手机桌面 (PWA).
- i18n strings added for hero/funnel (zh/zht/en); SW cache → v29.

## v2.1.1-20260615

- Removed four-tile portal landing; **最新动态 is the homepage** (`/` → `?view=latest`).
- Chapter nav is four sections only (no separate 首页).

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

