# VH/VL Web Console — Single Source of Truth (Contract)

**Owner:** InSynBio AbEngineCore / Antibody Engineer Suite
**Scope:** Behavior, layout, branding and tenant separation of the VH/VL web console (`/`, `/login`) and adjacent VH/VL job endpoints.
**Status:** LOCKED. Agent may not modify the in-scope files without owner approval and a matching update to this document.

> Companion rule: `.cursor/rules/vhvl-web-console-contract.mdc` (always-applied) enforces consultation of this file before changes.

---

## §0 In-Scope Files (Owner-Locked)

Any change to the following requires reading this contract first **and** owner approval for behavior-affecting edits:

- `api/static/console.html` — InSynBio web console (primary tenant).
- `api/static/therasik_console.html` — Therasik web console (CN-first tenant).
- `api/static/therasik_login.html` — Therasik login / register / verify / reset views.
- `api/routers/humanization.py` — VH/VL job path consumed by the console.
- `api/main.py` — `GET /` and `GET /login` host-based routing, cache-busting, localization helpers (`_localize_therasik_html`), and `/api/tfiles` route.
- `api/models.py` — `VHVLRequest` shape.
- `api/auth_db.py` / `api/routers/auth.py` — multi-tenant auth, email branding, SMTP profiles.

Adjacent ops files (LOCKED for ops discipline):
- `/etc/abenginecore/env` on the production host — tenant SMTP secrets (out-of-repo; do not commit).
- `/etc/systemd/system/abenginecore.service.d/override.conf` — must include `EnvironmentFile=/etc/abenginecore/env`.

---

## §1 Cache-Busting & Build Visibility

- `GET /` must serve `console.html` / `therasik_console.html` with `Cache-Control: no-store` (or equivalent) so users cannot get stuck on a pre-rule build after deploy.
- Each console HTML file's **first line** is a build comment of the form `<!-- console build vNNN YYYY-MM-DD -->`. Bump it on every intentional change to that file.
- `/api/health` returns `version`, `git_sha`, `build_id`, `protocol_version`, `analysis_version`, `report_format_version`, `service_report_versions{...}`. These fields are the gateway for client / third-party version verification and must remain present and non-empty.

---

## §2 Anti-Drift Policy (Non-negotiable)

The following must NOT happen without explicit owner approval **and** a matching change in this document:

1. Re-bundling post-humanization AbEvaluator CMC into the humanization job response.
2. Reintroducing duplicate "Structure conservation" panels in either console.
3. Restoring long Vernier explanatory copy or Chinese text inside the Vernier paragraph (English-only stays).
4. Removing cache-busting headers on `/` or `/login`.
5. Cross-leaking InSynBio and Therasik auth data, branding, payments, or report templates.
6. Disclosing proprietary decision-tree thresholds or "rescue" logic in client-facing reports.

---

## §3 Reporting Discipline (Console Output)

Console-rendered reports and downloadable reports must follow the `docs/CURSOR_REPORT_ENGINE_V4_1_SPEC.md` contract:

1. **13-Section Mandatory Structure (§0–§13).** No section may be omitted in client-facing deliverables.
2. **Professional, objective voice.** No self-talk ("I", "我"), no AI-disclosure language.
3. **Evidence vs. logic split.**
   - Show: professional tool names (e.g., ProteinMPNN, IgFold, ABodyBuilder2) and standard metrics (pLDDT, ΔΔG, SAP, pI).
   - Hide: proprietary decision trees, thresholds, rescue logic, internal cohort identifiers.
4. **Unified terminology** across humanization services (VH/VL, VHH, VH→VHH, dual-VHH bispecific).
5. **Version visibility** in every report and the console UI (`Protocol Version`, `Analysis Version`, `Report Format Version`, timestamp in §0).

---

## §4 External API & Public Gateway

- **InSynBio canonical URL:** `https://console.insynbio.com` / public `https://insynbio.com/console`.
- **Therasik canonical URL:** `https://console.therasik.com` (CN-first).
- Both tenants share the same FastAPI process on the production host; routing is **host-based** in `api/main.py`.
- The console UI may target a user-specified local API endpoint (default `http://localhost:8000`) for offline / bridge mode (see §6).
- CORS must allow the corresponding production origin per tenant.

---

## §5 Security & Anti-Crawler

- All console HTML emits `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">`.
- Internal Engineering Workspace branding is mandatory ("仅限授权算法评估 / Authorized algorithm evaluation only").
- `/api/tfiles/...` (Therasik file proxy) reuses the InSynBio file backend but forces Therasik localization on response.

---

## §6 Bridge Model (Public UI + Local API)

- The system is operational for third parties via `insynbio.com/console` and `console.therasik.com` as long as the local API process is up.
- Public UI must allow the user to switch the API origin to a local endpoint without page reload.
- All API responses include the headers required by the consuming origin (`Access-Control-Allow-Origin` for the matching tenant domain).

---

## §7 Multi-Tenant Separation (InSynBio + Therasik)

This section formalizes the multi-tenant architecture deployed 2026-05-20 (commit `4d494f8`).

### §7.1 Tenant Resolution

`api/routers/auth.py::_tenant_from_request()` resolves the tenant by inspecting (in order):

1. `Host` header
2. `X-Forwarded-Host` header
3. `request.url.hostname`
4. `X-Public-Site` header
5. `?site=` query parameter

If any field contains `therasik`, tenant = **therasik**; otherwise **insynbio** (default).

### §7.2 ContextVar Binding Rule (Critical)

FastAPI dispatches **synchronous handlers** through a thread pool. `ContextVar` values set in a router dependency (`_tenant_scope`) do **not** propagate across that thread switch reliably.

**Rule:** every synchronous handler that touches `auth_db` (or any other tenant-aware module) MUST call `_bind_tenant(request)` as the first statement in the handler body. Relying solely on the router-level dependency is forbidden.

Currently bound handlers: `register`, `verify_email`, `resend_verification`, `login`, `forgot_username`, `forgot_password`, `reset_password`, `me`, `gate_me`, `debit`, `gate_debit`, `ledger`, `gate_ledger`, `get_session_payload`.

### §7.3 Tenant SQLite Stores

- InSynBio: `api/.data/insynbio_auth.db`
- Therasik: `api/.data/therasik_auth.db`

A user account in one tenant has no automatic counterpart in the other. The only allowed cross-tenant operation is **admin sync** (`_sync_admin_from_peer_tenant`), and only on successful credential match.

### §7.4 Email Branding & SMTP Profiles

`api/auth_db.py::_mail_profile()` returns per-tenant SMTP credentials and branding.

| Tenant | SMTP Host | Port | Sender | Subject (verification) | Body language |
|---|---|---|---|---|---|
| InSynBio | `INSYNBIO_SMTP_HOST` | `INSYNBIO_SMTP_PORT` (587) | `contact@insynbio.com` | "InSynBio Console Verification Code" | English |
| Therasik | `THERASIK_SMTP_HOST` (`mail.privateemail.com`) | `THERASIK_SMTP_PORT` (587) | `contact@therasik.com` | "Therasik Console 验证码 / Verification Code" | 中文 + English |

**Therasik MUST NOT fall back to InSynBio SMTP.** If `THERASIK_SMTP_PASS` is unset, the verification flow logs `[AUTH][therasik] ... SMTP not configured` and returns success to the user (no information leak) but does not actually email.

### §7.5 Production Secret Loading

Server systemd unit `abenginecore.service` references `/etc/abenginecore/env` via an override:

```ini
[Service]
EnvironmentFile=/etc/abenginecore/env
```

The env file is `chmod 600`, root-owned, and contains tenant SMTP secrets. Never commit this file. Never echo `THERASIK_SMTP_PASS` in logs or chat transcripts.

### §7.6 Domain Email Authentication (Recommended)

For Therasik (`therasik.com`), the following DNS records improve Gmail / Outlook deliverability and avoid spam classification:

- **SPF (TXT, root):** `v=spf1 include:spf.privateemail.com ~all`
- **DKIM:** enable in Namecheap → Private Email → DKIM; publish the resulting TXT.
- **DMARC (TXT, `_dmarc.therasik.com`):** `v=DMARC1; p=none; rua=mailto:contact@therasik.com`

Same recommendation applies to `insynbio.com`. These are infrastructure changes (DNS), not code; track status in this contract.

---

## §8 Operations Discipline

1. **No ghost uvicorn.** When debugging, always `sudo systemctl stop abenginecore` before launching a manual uvicorn; `Ctrl+C` and `sudo systemctl start abenginecore` afterwards. Running both simultaneously causes 8000-port contention and a systemd restart loop where business logs (e.g., `RESET_CODE[therasik] ...`) never reach `/tmp/uvicorn.log`.
2. **Deploy flow:**
   ```bash
   cd /root/Antibody-Engineer-Suite-MVP
   git pull
   find api -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
   sudo systemctl restart abenginecore
   curl -s http://127.0.0.1:8000/api/health | grep git_sha
   ```
3. **Smoke test (Therasik email):**
   ```bash
   : > /tmp/uvicorn.log
   curl -s -X POST http://127.0.0.1:8000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -H "X-Public-Site: therasik" \
     -d '{"username_or_email":"<test-user>"}'
   grep -E 'RESET_CODE\[therasik\]|Failed to send' /tmp/uvicorn.log
   ```
   Pass criterion: a `RESET_CODE[therasik]` line and no `Failed to send` within 5 seconds; recipient receives a `contact@therasik.com`-branded bilingual email.

---

## §9 Change Protocol

1. **Read this file** (and the always-applied rule) before editing any in-scope file.
2. For behavior-affecting changes: append an `[OBSERVATION]` or `[PROPOSAL]` entry to `docs/EVOLUTION_LOG.md`, wait for owner approval, then edit.
3. After approved edits:
   - Update the relevant section of this contract.
   - Bump the affected console HTML's first-line build comment.
   - Append an `[EXECUTED]` entry to `docs/EVOLUTION_LOG.md`.
4. Pure ops / DNS / secret-rotation changes do not require code edits but should still be noted here (§7.5, §7.6).

---

## §10 Change History

| Date | Change | Reference |
|------|--------|-----------|
| 2026-05-20 | Initial publication. Codifies multi-tenant (InSynBio + Therasik) separation, Therasik Private Email SMTP, sync-handler `_bind_tenant` rule. | EVOLUTION_LOG entry 2026-05-20; commit `4d494f8` |
