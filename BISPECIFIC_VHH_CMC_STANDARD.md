# Bispecific VHH CMC Assessment Standard — V1.0

**Status:** ACTIVE · MANDATORY  
**Created:** 2026-04-01  
**Applies to:** All dual-VHH bispecific antibody CMC developability assessment projects  
**⚠️ Parallel to VHH Humanization Standard — separate workflow, shared VHH CMC engine**

---

## 1. Scope

This standard defines the **fixed, reproducible workflow** for in silico CMC (Chemistry, Manufacturing & Controls) developability assessment of **dual-VHH bispecific antibody constructs** (VHH-linker-VHH format).

Distinct from VH/VL CMC assessment (`run_ab_evaluator`) and single-chain VHH CMC (`run_vhh_cmc_eval`), this standard addresses the **bispecific-specific layer**: fusion pI modulation, linker engineering for yeast expression, and multi-arm combination optimization.

---

## 2. Architecture — AbEngineCore Position

```
AbEngineCore
├── VH/VL Humanization      → core/humanization/    + scripts/run_ab_evaluator.py
├── VHH Humanization        → core/vhh_humanization/ + scripts/run_vhh_humanization.py
├── VHH CMC (single)        → core/cmc/vhh_cmc_engine.py      + scripts/run_vhh_cmc_eval.py
└── Bispecific VHH CMC ★   → core/cmc/bispecific_cmc_engine.py + scripts/run_bispecific_vhh_cmc.py
                                        ↑
                              imports vhh_cmc_engine (shared)
```

**Key design principle:** `bispecific_cmc_engine` reuses `vhh_cmc_engine` for per-arm assessment. No logic duplication between single-VHH and bispecific-VHH pipelines.

---

## 3. Reference Database

| Item | Value |
|---|---|
| Name | VHH42 |
| n | 42 (39 clinical VHHs + 3 SAbDab humanized VHHs) |
| Percentiles | p5, p25, p50, p75, p95 |
| File | `data/reference/VHH42_reference_stats_v1.json` |
| Comparison | IgG uses AbRef-458 (`data/reference/AbRef458_stats_v1.json`) |

---

## 4. Fixed 4-Phase Workflow

### Phase 1 — Individual VHH CMC Audit (per arm)

**Engine:** `core.cmc.vhh_cmc_engine.evaluate_single_vhh()`

**15 metrics computed:**

| Category | Metric | Gate (WARN / FAIL) |
|---|---|---|
| Charge | pI | >9.5 WARN / >10.0 FAIL |
| Charge | Net charge pH7 | >7.0 WARN / >10.0 FAIL |
| Charge | Charge patch max 7-mer | >4.0 WARN / >6.0 FAIL |
| Hydrophobicity | GRAVY | >−0.05 WARN / >0.10 FAIL |
| Hydrophobicity | Hydrophobic patch max 9-mer | >0.75 WARN / >0.90 FAIL |
| Hydrophobicity | SAP score (7-mer proxy) | >0.857 WARN / >0.99 FAIL |
| Aggregation | Instability index | >50.0 WARN / >65.0 FAIL |
| Aggregation | Aggregation motifs | >5 WARN / >7 FAIL |
| Aggregation | Hydrophobic clusters | >3 WARN / >5 FAIL |
| Chemical | Deamidation sites (NG/NS) | >3 WARN / >5 FAIL |
| Chemical | Isomerization sites (DG/DS) | >3 WARN / >5 FAIL |
| Chemical | Oxidation-prone M/W | >7 WARN / >10 FAIL |
| Chemical | N-glycosylation (NXS/T) | >1 WARN / >2 FAIL |
| Chemical | Free Cys (non-disulfide) | >1 WARN / >3 FAIL |

**Note on free_cys:** Canonical VHH disulfide positions {21, 94} (0-based) are excluded from free Cys count.

**Output per arm:** `risk_flags` (14 × PASS/WARN/FAIL), `percentile_ranks_vs_vhh42`, `adi_score`, `adi_grade`, `overall_status`, `pi_flag`.

---

### Phase 2 — ADI Scoring (flag-discrete, VHH42-calibrated)

**Engine:** `core.cmc.vhh_cmc_engine.compute_adi_vhh()`

**Scoring method:** PASS = 100 / WARN = 50 / FAIL = 0, averaged within 4 categories, then weighted:

| Category | Weight | Metrics |
|---|---|---|
| Hydrophobicity | 30% | GRAVY, hydro_patch_max9, SAP_score |
| Charge | 25% | pI, net_charge_pH7, charge_patch_max7 |
| Chemical | 25% | deamidation, isomerization, oxidation, glycosylation, free_cys |
| Aggregation | 20% | instability_index, agg_motifs, hydro_cluster_count |

**ADI interpretation:**

| Score | Grade |
|---|---|
| 80–100 | Excellent |
| 60–79 | Acceptable |
| 40–59 | Moderate risk |
| < 40 | High risk |

**Consistency requirement:** ADI method MUST remain identical to `run_vhh_cmc_eval` (flag-discrete, 4-category). Do NOT use the tent-function ADI from `adi_score.py` for VHH assessment.

---

### Phase 3 — Fusion pI Matrix

**Engine:** `core.cmc.bispecific_cmc_engine.compute_fusion_matrix()`

Compute pI and net charge at pH 7 for all `(arm_a × arm_b × linker)` combinations.

**ER Electrostatic Expression Model:**

| Zone | Condition | Interpretation |
|---|---|---|
| PASS ✅ | Fusion pI < 8.5 | Near-neutral/negative in ER lumen → recommended |
| WARN ⚠️ | Fusion pI 8.5–9.0 | Moderately positive → consider charged linker |
| CRITICAL 🔴 | Fusion pI > 9.0 | Highly cationic → poor secretion expected |

**Mechanistic basis:** ER lumen pH ≈ 7.2. A bispecific with fusion pI > 8.5 carries net positive charge in the secretory pathway, promoting non-specific adsorption to BiP/GRP78, calreticulin, and ER membrane phospholipids. Extended ER dwell time increases ERAD susceptibility and reduces yeast secretion yield.

**Default linker panel (7 linkers):**

| Name | Sequence | Net charge at pH7 |
|---|---|---|
| (G4S)3 | GGGGSGGGGSGGGGS | ~0 |
| (G4S)4 | GGGGSGGGGSGGGGSGGGGS | ~0 |
| (G4S)3+2E | GGGGSGGGGSGGGGSEE | −2 |
| (G4S)3+3E | GGGGSGGGGSGGGGSEEE | −3 |
| (G4S)3+4E | GGGGSGGGGSGGGGSEEEE | −4 |
| Whitlow | GSTSGSGKPGSGEGSTKG | ~0 |
| EAAAK3 | EAAAKEAAAKEAAAK | −3 |

---

### Phase 4 — SmartLink™ Recommendation

**Engine:** `core.cmc.bispecific_cmc_engine.select_recommendations()`

Selection criteria (in order):
1. **PASS** (fusion pI < threshold): select lowest pI construct
2. If no PASS: select lowest pI among WARN
3. Primary + Runner-up reported

Output: primary construct, runner-up, `n_passing`, `n_warning`, `n_critical`.

---

## 5. Standard CLI Invocation

**Tool:** `scripts/run_bispecific_vhh_cmc.py` v2.0.0

```bash
# Panel mode (recommended — multi-variant screening)
python scripts/run_bispecific_vhh_cmc.py \
    --panel-a armA.fasta \
    --panel-b armB.fasta \
    --outdir ./results/project_name

# Single pair
python scripts/run_bispecific_vhh_cmc.py \
    --seq-a EVQLLES...VSS --name-a "Target-A-v1" \
    --seq-b EVQLLES...VSS --name-b "Target-B-v1" \
    --outdir ./results/project_name

# Custom linkers
python scripts/run_bispecific_vhh_cmc.py \
    --panel-a a.fasta --panel-b b.fasta \
    --linkers "(G4S)3:GGGGSGGGGSGGGGS" "EK3:EEEKEEEK" \
    --outdir ./results/project_name
```

**Key parameters:**

| Parameter | Default | Description |
|---|---|---|
| `--er-pi-threshold` | 8.5 | Fusion pI warning threshold |
| `--er-ph` | 7.2 | ER lumen pH for charge calculation |
| `--ref` | VHH42_reference_stats_v1.json | Reference database |
| `--no-percentile` | — | Skip percentile ranking (large panels) |
| `--prefix` | cmc_report | Output file prefix |

---

## 6. Output Schema

```
{outdir}/
  cmc_report.json    ← machine-readable (meta + arm_a + arm_b + fusion_matrix + recommendations)
  cmc_report.md      ← human-readable (ADI summary + 15-metric table per arm + fusion matrix top-10)
```

**JSON structure:**

```json
{
  "meta": {
    "tool": "InSynBio AbEngineCore — Bispecific VHH CMC Pipeline",
    "version": "2.0.0",
    "adi_method": "flag_discrete_4cat (aligned with run_vhh_cmc_eval)",
    "reference": "VHH42_reference_stats_v1.json"
  },
  "arm_a": [{ "name", "metrics" (15), "risk_flags" (14), "percentile_ranks_vs_vhh42", "adi_score", "overall_status", "pi_flag" }],
  "arm_b": [...],
  "fusion_matrix": [{ "arm_a", "arm_b", "linker", "fusion_pi", "fusion_nc", "fusion_len", "pi_flag" }],
  "recommendations": { "primary", "runner_up", "n_passing", "n_warning", "n_critical" }
}
```

---

## 7. Module Dependencies

```
scripts/run_bispecific_vhh_cmc.py
  └── core.cmc.bispecific_cmc_engine
        ├── core.cmc.vhh_cmc_engine       (per-arm VHH CMC)
        │     └── core.cmc.cmc_metrics    (15 metric functions)
        └── core.cmc.cmc_metrics          (pI, net_charge for fusion)
```

---

## 8. QA Checklist

Before submitting any bispecific VHH CMC report:

- [ ] Standard document reviewed: `BISPECIFIC_VHH_CMC_STANDARD.md`
- [ ] Both arms evaluated with full 15-metric panel
- [ ] ADI method: flag-discrete, VHH42 reference
- [ ] `free_cys` filtered for VHH conserved Cys {21, 94}
- [ ] `SAP_score` present in metrics and included in ADI
- [ ] Fusion pI matrix covers ≥ 5 linker variants
- [ ] ER expression threshold applied (default pI > 8.5)
- [ ] Primary + runner-up recommendation documented
- [ ] JSON + Markdown reports generated
- [ ] Sequences NOT included in client-facing report (confidentiality)

---

## 9. Compliance Rules

### MUST DO:
- ✅ Follow this standard for all dual-VHH bispecific CMC projects
- ✅ Use `core.cmc.vhh_cmc_engine` for per-arm assessment (do not reimplement)
- ✅ Apply VHH42 reference database (n=42)
- ✅ Filter `free_cys` for conserved disulfide positions {21, 94}
- ✅ Include SAP_score in metrics
- ✅ Report both individual arm CMC and fusion-level assessment

### MUST NOT DO:
- ❌ Use tent-function ADI for VHH assessment (IgG-only)
- ❌ Use AbRef-458 as reference for VHH (IgG-only)
- ❌ Report `free_cys` without conserved Cys filtering
- ❌ Use single fusion pI without linker panel comparison
- ❌ Disclose client sequences or variant IDs in public case studies

---

## 10. Version History

| Date | Version | Changes |
|---|---|---|
| 2026-04-01 | 1.0 | Initial creation — 4-phase workflow, VHH42 reference, SmartLink™ linker panel, ER electrostatic model |

---

*InSynBio AbEngineCore · Bispecific VHH CMC Assessment Standard · All standards are MANDATORY.*
