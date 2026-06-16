# NYC Hub Release Notes

## v2.6.2-20260615

Ultra-compact layout (owner direction: "窄一些。2-3行一个信息"):
- **Narrower reading column**: constrained reading width from 760px to **600px max-width** (centered) on desktop.
- **Ultra-compact cards (2-3 lines of text height)**:
  - Reduced padding from 16-18px to **10px 14px**.
  - Tightened grid gap from 11px to **8px**.
  - Reduced margins between meta, title, brief, and footer.
  - Title font size reduced from 16.5px to **15px** with tighter 1.4 line-height.
  - **1-line brief snippet**: changed `.card-brief-zh` line-clamp from 2 to **1 line** (13px font, 1.5 line-height) to keep the text footprint strictly to 2-3 lines of content.
  - Foot border changed to a subtle dashed separator with tighter padding.
- SW cache → v38.

## v2.6.1-20260615

Less-is-more reading layout (owner direction: single column, bigger/cleaner cards):
- **Back to single column** for the feed; **constrained reading width to 760px** (centered) so rows are no longer too wide. One clean card per row, scan vertically.
- **Bigger, roomier cards**: padding 12–14 → 16–18px, radius 10 → 12, title 15 → 16.5px, brief 13.5 → 14px / line-height 1.65, more vertical spacing between meta/title/brief.
- **Removed the column-layout selector** from settings (收敛选项 — no longer meaningful with a fixed single-column design). Card content stays lean (one category tag, one location, one date, title, brief, verified + action).
- SW cache → v37. (Supersedes the v2.6.0 multi-column experiment.)

## v2.6.0-20260615

Feed density fix (owner: "信息页太宽，一屏看不了多少信息"):
- **Root cause**: the feed grid was hard-forced to a single 1040px-wide column on desktop — the `body.grid-cols-*` CSS overrode every layout option to one column, so each row was very wide and few items fit per screen.
- **Fix**: feed now uses **AUTO responsive columns** — `repeat(auto-fill, minmax(300px, 1fr))` — so wide screens show 3 columns, tablets ~2, phones stay 1. More items per view without manual tuning.
- **Layout selector now actually works**: 自动（推荐）/ 四列 / 三列 / 双列 / 单列. Added an **Auto (recommended)** option, set as the new default. Fixed counts (1–4) apply on desktop (≥769px); phones remain single column.
- **Grid alignment**: card footer (查看链接 button) anchored to the bottom (`margin-top:auto`) so buttons line up across equal-height cards.
- SW cache → v36.

## v2.5.2-20260615

- **Removed the WeChat subscribe funnel button from the hero** (owner request): the hero first screen is now tagline → weather bar → search. Subscription remains available via the bottom-right floating FAB (same `openSubModal`). SW cache → v35.

## v2.5.1-20260615

Hero layout tweaks (owner request):
- **Weather/daily bar moved above the search box**: the slim 天气 + 24h新增/7日场次 dashboard now sits directly above the search input on every view (relocated into the hero at boot via `relocateDashboardAboveSearch`). Stays collapsed by default.
- **"加到手机桌面" demoted from hero to a compact header button**: removed the large PWA funnel button from the first screen; added a small 📱 加桌面 button in the top "生活圈" header row (icon-only on mobile). The 微信群订阅 button is now the single prominent hero CTA. Rationale: add-to-home is a one-time, low-frequency action and shouldn't occupy prime hero space.
- i18n `pwa_quick` (zh/zht/en); SW cache → v34.

## v2.5.0-20260615

Typography & color polish (referencing commercial content sites: Dealmoon/省钱快报, The Skint, Yelp, Stripe/Linear neutral systems):
- **Larger, more readable text**: base 14→15px; card titles 13.5→15px; card brief/summary 12→13.5px; card footer 10.5→12px; "搜索" button 11→12.5px; yellow-page name 14→15px. Improves legibility for older readers without relying on the A+ toggle.
- **Looser CJK line-height**: titles 1.32→1.42; brief 1.45→1.6; global relaxed 1.6→1.7; normal 1.5→1.55 (Chinese text needs more leading than Latin).
- **Roomier cards** (less "大杂烩"): feed-card padding 7→12–14px, grid gap 5→9px, radius 8→10px; yellow-page cards padding 8→11–13px, gap 6→8px. Softer hover shadow.
- **Unified neutral-slate palette + single orange accent**: body text #5c6470→#4b5563 (stronger contrast); removed off-brand warm brown (#431407) from card brief → neutral #475569; headings standardized to #1f2937; muted text token added (#6b7280).
- **iOS input zoom fix**: hero search input forced to 16px so focusing it no longer auto-zooms the page on iPhone.
- Lint: added standard `line-clamp` alongside `-webkit-line-clamp` everywhere; SW cache → v33.

## v2.4.0-20260615

- **Search box now persists on every view** (latest/channels/deals/yellow pages); the hero decorations (tagline/funnel/chips/trust) stay homepage-only.
- **Section-scoped search**: placeholder + results match the current section — livelihood (最新/民生), businesses (黄页), deals (打折). Deals search filters `DEAL_ITEMS` into the online tab (shows all matches).
- **Cross-section fallback**: when the current section returns 0 results, a notice shows hit counts in the other sections (民生/黄页/打折) with one-tap jump (`globalGo`). Note: 黄页 counts depend on lazy-loaded YP data.
- i18n placeholders + fallback copy (zh/zht/en); SW cache → v32.

## v2.3.0-20260615

P1 batch (lead + GPT + Gemini consensus):
- **Mobile sticky bottom tab bar** (最新/黄页/频道/打折): icon+label, ≥54px tap height, iOS `safe-area-inset` padding, FAB bumped above bar, top chapter-nav hidden on mobile to avoid redundancy.
- **"即将举行" countdown badge** on event cards — honest semantics (event date, not application deadline; data has no deadline field). Shows 今天/明天/X天后 only for reliable dates within 7 days (reuses `isReliableEventDate`); past events & ongoing services get no badge. Data audit: 75/112 items have event_date; 24 fall within 7 days.
- **A-/A+ font-size toggle** in ⚙️ menu (accessibility for older readers); scales content area via persisted zoom level.
- i18n (zh/zht/en) for badge + tabs + font label; SW cache → v30.

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

