# NYC Hub Release Notes

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

