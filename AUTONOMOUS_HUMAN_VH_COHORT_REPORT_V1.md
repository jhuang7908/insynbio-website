# Autonomous Human VH Cohort Analysis — V1.0
## Deep EngVH Algorithm Evidence Report

**Report ID:** ISB-COHORT-AutonomousHumanVH-V1  
**Report Format Version:** V4.1  
**Analysis Version:** cohort_v1_0_2026-05-14  
**Protocol Version:** autonomous_human_vh_v1_0_2026-05-14  
**Generated:** 2026-05-14  
**Audience:** Internal Engineering — Deep EngVH Standard Review  
**Status:** PRELIMINARY — Pending V1.8.6 Owner Review  

---

## §0 Metadata

| Field | Value |
|---|---|
| Source DB | `data/sabdab_vhh_atlas/autonomous_human_vh_db.json` |
| Source entries (raw) | 138 |
| Contamination filter | 21 removed (keyword-match + camelid hallmark E44+R45) |
| After contamination filter | 117 |
| Non-redundant (V-region SHA1) | **36** |
| Kabat positions analyzed | 18, 37, 44, 45, 47, 50, 68, 89, 94 |
| Numbering tool | ANARCII v2 → `to_scheme("kabat")` |
| Build script | `scripts/build_autonomous_human_vh_cohort.py` |
| Cohort outputs | `data/reference/AutonomousHumanVH_Cohort_v1.{json,csv}` |

---

## §1 Purpose

This report provides the data foundation for evaluating whether VH → VHH Conversion Standard V1.8.5 rules (`Kabat 50 R/K preservation`, `F68Y exemption`, `L18S`, `G44E`, `W47F/G`) are empirically supported by authentic autonomous human VH sequences, and whether a CDR3-conditional hallmark framework (proposed V1.8.6) is better justified.

---

## §2 Cohort Construction

### 2.1 Contamination Filter (two criteria)

1. **Keyword match** in `entry_name` or `target` field: nanobody, vhh, xaperone, llama, camel, dromedary, caplacizumab, envafolimab, ozoralizumab.  
2. **Camelid hallmark signature**: `pos44 == E` AND `pos45 == R` (the canonical VHH FR2 hallmark pair).

Result: 21 entries removed (keyword-match and/or camelid hallmark).

### 2.2 Deduplication

V-region defined as Kabat positions 1–113. SHA1 hash computed on the ordered amino-acid string at those positions. 117 clean entries → **36 unique V-region sequences**.

### 2.3 ANARCII Kabat Verification

All 36 unique sequences numbered via `ANARCII.to_scheme("kabat")`. Cross-check: pre-computed `hallmark_motif` in DB (K37/K44/K45/K47) matched ANARCII Kabat recomputation in **36/36 entries (100%)** — confirming that the DB pre-annotation used Kabat coordinates.

---

## §3 Key Findings

### 3.1 Hallmark Position Frequencies (n=36, Kabat)

| Position | #1 Residue | #2 | #3 | Germline VH | VHH Hallmark |
|---|---|---|---|---|---|
| **K18** | L:97% | V:3% | — | L | (L18S = sdAb lit.) |
| **K37** | V:100% | — | — | Y | V (VHH) |
| **K44** | G:89% | A:8% | T:3% | G | **E (VHH)** |
| **K45** | L:69% | E:14% | P:8%  R:6% | L | **R (VHH)** |
| **K47** | W:83% | L:11% | R:3% | W | **F/G (VHH)** |
| **K50** | S:31% | R:22% | A:11% | varied | — |
| **K68** | T:100% | — | — | T | (F68Y lit.) |
| **K89** | V:81% | M:8% | — | V | — |
| **K94** | R:53% | K:22% | S:14% | varied | — |

### 3.2 CDR3 Length Distribution

| CDR3 Bucket | n | % |
|---|---|---|
| Short ≤7 aa | 5 | 14% |
| Mid 8–14 aa | 16 | 44% |
| Long ≥15 aa | 15 | 42% |

CDR3 integer range (Kabat 95–102): 3 to 24 aa (median 13 aa).

### 3.3 CDR3-Stratified Hallmark Frequencies

| Position | Short ≤7 (n=5) | Mid 8–14 (n=16) | Long ≥15 (n=15) |
|---|---|---|---|
| **K37** | V:100% | V:100% | V:100% |
| **K44** | G:100% | G:75%, A:19% | G:100% |
| **K45** | L:80%, R:20% | L:56%, E:12%, R:6% | L:80%, E:20% |
| **K47** | W:80%, R:20% | W:88%, L:6% | W:80%, L:20% |
| **K50** | A/E/T/S mixed | S:56%, N:12% | R:47%, D:13%, A:13% |
| **K68** | T:100% | T:100% | T:100% |
| **K89** | V:100% | V:62%, M:19% | V:93% |

---

## §4 Interpretation for Deep EngVH V1.8.6

### 4.1 K18 (sdAb adaptation L18S)

K18 = L in 97% of authentic autonomous human VH sequences. **L18S has no empirical support as a default transformation step.** Recommended: remove from mandatory steps; retain as rescue option only.

### 4.2 K37 (hallmark V37 / VHH Y→V)

K37 = V:100%. The human VH germline already carries V at position 37 in IGHV3 (which constitutes 100% of this cohort). No transformation needed.

### 4.3 K44 (hallmark G44E)

K44 = G:89% across all CDR3 buckets (100% in short and long buckets). **G44E is essentially absent in authentic autonomous human VH.** Recommendation: do not mandate G44E in Deep EngVH regardless of CDR3 length.

### 4.4 K45 (hallmark L45R — the critical residue)

K45 shows the most VHH-like adaptation: R/E collectively 20–31% across buckets.  
- Short CDR3: L:80%, R:20% — some already adapted.  
- Mid CDR3: most complex distribution (L:56%, E:12%, P:8%, R:6%).  
- Long CDR3: L:80%, E:20%.  

**K45 is the primary and best-supported hallmark position.** L45R remains justified as the single core Deep EngVH transformation. The relatively high L retention even in short-CDR3 sequences suggests L45R is not strictly required in all cases, but it is the most common departure from germline when any hallmark change occurs.

### 4.5 K47 (hallmark W47F/G)

K47 = W:83% overall; L appears in 11%, concentrated in the mid-CDR3 bucket. **W47F/G has no consistent support.** The non-W variants (L, R, V) are not VHH-typical F/G, and appear idiosyncratic. Recommendation: do not mandate W47F/G; preserve W47 as default.

### 4.6 K50 (V1.8.5 "R/K preservation" rule)

K50 shows no dominant residue (S:31%, R:22%, A:11%, D:6%, N:6%). The R:22% is concentrated in long-CDR3 sequences (R:47%) and is absent in short/mid buckets. **There is no coherent R/K-dominant pattern at K50.** The V1.8.5 rule "preserve R/K at K50" was derived from IMGT position 50 data (which maps to Kabat 45, not Kabat 50) — this is confirmed as a coordinate error. **K50 R/K rule should be reverted.** No replacement Stealth rule is justified without an EngVH-specific Stealth cohort.

### 4.7 K68 (sdAb adaptation F68Y)

K68 = T:100% in this cohort. F68Y targets F→Y, but human VH K68 is already T — **F68Y has no applicable residue in authentic autonomous human VH.** The V1.8.5 "A/P/T exemption" is correct in spirit but should be simplified: F68Y should only trigger when input K68 = F, which is rare in human VH frameworks.

### 4.8 K89 (VHH Stealth K89E)

K89 = V:81%. No K detected. VHH Stealth K89E targets VHH-specific K at position 89; **this is inapplicable to human VH where K89 is not a germline residue.** Recommendation: remove K89E from Deep EngVH Stealth; build separate EngVH Stealth cohort statistics before re-enabling.

---

## §5 Summary Table for V1.8.6 Algorithm Changes

| Step | V1.8.5 Current | Evidence from n=36 | V1.8.6 Proposal |
|---|---|---|---|
| K45R hallmark | Core; CDR3-gated | R/E appear in all buckets; best-supported position | **Retain as primary** |
| K44E hallmark | Gated (long+compact CDR3) | G:89%–100% across all buckets | **Remove default; disable** |
| K47F/G hallmark | Gated | W:80–88% across all buckets | **Remove default; disable** |
| K37 adaptation | Not applied (already V) | V:100% confirmed | No change needed |
| L18S sdAb | Mandatory default | L:97%; zero support for S18 | **Disable default; rescue only** |
| F68Y sdAb | Default with A/P/T exemption | T:100% — trigger residue F never present | **Gate: trigger only if K68=F** |
| K50 R/K preserve | V1.8.5 new rule | No dominant pattern; prior rule was coord error | **Revert/remove** |
| K89E Stealth | Inherited from VHH | V:81%; K not present | **Remove; requires EngVH-specific cohort** |

---

## Verification Status

- [verified] Cohort source: `data/sabdab_vhh_atlas/autonomous_human_vh_db.json` — pre-built from SAbDab-nano (2422 entries), filtered to Database A (138 autonomous human VH).
- [verified] ANARCII Kabat numbering consistency: 36/36 hallmark motifs match DB pre-annotation (cross-check passed).
- [verified] K68 = T:100% — reproducible across all CDR3 buckets.
- [verified] K18 = L:97% — consistent with human IGHV3-23 germline.
- [verified] K44 = G:89–100% across CDR3 buckets — G44 is canonical human VH.
- [estimated] VHH contamination filter completeness: keyword + camelid-hallmark criteria remove known contaminants; edge cases (early-passage humanized VHH without classic E44+R45) may remain.
- [inferred] K45R as "primary hallmark": supported by its being the only position with consistent VHH-like adaptation signal (R/E 6–20% across buckets); causal link to single-domain stability assumed from literature but not directly measured in this cohort.
- [inferred] CDR3-stratified interpretation: small per-bucket n (5/16/15) limits statistical conclusions; trends are directional, not definitive.

---

## Adversarial Checks

- **Alternative explanation:** K44 = G dominance may partly reflect IGHV3-23 germline bias (100% of cohort is IGHV3). If IGHV1 or IGHV6 sequences were included, K44 germline could differ — though IGHV3 is the dominant therapeutic VH family. **PASS** (bias acknowledged; scope is IGHV3 which is the relevant baseline for Deep EngVH).
- **Failure mode:** The contamination filter may not catch all humanized VHH: sequences that underwent humanization to near-human germline but retain VHH hallmarks at E44/R45 would pass the keyword filter, and if they mutated E44 back to G or R45 to L, they would also pass the hallmark filter. Such sequences would inflate the G44/L45 counts. **WARN** (acknowledged; mitigated by hallmark cross-check but not fully eliminated).
- **Boundary condition:** n=36 non-redundant sequences, with per-bucket n as small as 5. The short-CDR3 bucket (n=5) is underpowered for strong positional claims. Any rule derived from short-CDR3 data alone should be treated as directional, not statistical. **WARN** (explicitly flagged in §4; conclusions from short bucket are held to lower confidence).
- **Assumption at risk:** Treating "K50 distribution" as informative for a Stealth rule assumes that the Stealth positions are identical between VHH and human VH frameworks. This assumption was already violated for K89 (VHH has K89 germline; human VH has V89). If K50 similarly has different germline backgrounds, the absence of a dominant pattern may simply reflect scaffold heterogeneity rather than a meaningful biological signal. **PASS** (consistent with the recommendation to not apply VHH Stealth rules to human VH without a dedicated EngVH Stealth cohort).

---

## Sources

1. SAbDab-nano — Dunbar J et al., *Nucleic Acids Research* (2014) https://doi.org/10.1093/nar/gkt1043 — structural antibody database; local snapshot `data/sabdab_vhh_atlas/` (downloaded 2026-04). [verified]
2. Davies & Riechmann — *Nature Biotechnology* (1995) https://doi.org/10.1038/nbt0595-475 — original G44E/L45R/W47G mutations for human VH sdAb engineering. [verified — hallmark source]
3. ANARCII antibody numbering tool — Kabat scheme implementation. Local conda env `anarcii`. [verified]
4. Kabat & Wu — *Annals of the New York Academy of Sciences* 190 (1971) — canonical Kabat numbering. https://doi.org/10.1111/j.1749-6632.1971.tb13100.x [verified — numbering authority]
5. Internal: `data/sabdab_vhh_atlas/autonomous_human_vh_db.json` — pre-built from SAbDab-nano with ANARCII (IMGT + Kabat cross-annotation). [verified]
6. Internal: `data/reference/Atlas24_EngVH_stats_v1.json` — frozen Atlas-24 CMC benchmark (n=24 non-redundant engineered human VH). [verified]
