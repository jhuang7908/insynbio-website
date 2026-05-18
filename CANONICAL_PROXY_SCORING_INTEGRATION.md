# Canonical Proxy 

## 

Canonical Proxy  scaffold/germline ，。

## 

- ****: 2025-12-13
- ****: scaffold-ranking-canonical-proxy-v1
- **Germline Asset **: v1_clean

## 

### （，）

 `data/germlines/v1_clean/manifest.json` ：

```json
{
  "canonical_proxy": {
    "agg_mode": "min",
    "weight": 0.10,
    "formula": "0.6 * percentile + 0.4 * rep_identity",
    "enabled": true
  },
  "scaffold_ranking": {
    "canonical_proxy_enabled": true,
    "germline_asset_version": "v1_clean"
  }
}
```

****：，：
1.  manifest.json 
2. 
3. 

## 

### 1. 

```python
canonical_proxy_agg = min(proxy_cdr1, proxy_cdr2)  # 
total_score_new = total_score_old + 0.10 * canonical_proxy_agg
```

### 2. 

- **Germline Assets**: `data/germlines/v1_clean/germline_assets_clean_with_canonical_proxy.jsonl`
- **Canonical Proxy Clusters**: `data/germlines/v1_clean/clusters/`

### 3. 

Scaffold  `member_ids`  germline assets  `sequence_id` ：
- Scaffold member_id: `"M99652|IGHV3-11*01|Homo sapiens|..."`
- Germline sequence_id: `"M99652|IGHV3-11*01|Homo"`
- ：（ `"M99652|IGHV3-11*01"`）

## 

### 

- ✅ proxy_agg : 10/10
- ✅ score_diff : 10/10
- ✅ : 5/10（ canonical_proxy ）

### 

- **HUMAN_VH3_SCF_24**: rank 9 → 5（ 4 ，proxy_agg=0.9538）
- **HUMAN_VH3_SCF_13**: rank 10 → 7（ 3 ，proxy_agg=0.8895）
- **HUMAN_VH3_SCF_30**: rank 5 → 10（ 5 ，proxy_agg=0.6308）

## 

###  1：Canonical Proxy " germline "

****：
- （ VHH  germline、），canonical_proxy  `cluster_percentile` 
-  germline  canonical_proxy 

****：
-  scaffold  `germline_asset_version = "v1_clean"`
- （、JSON）
-  germline ， canonical_proxy clusters

###  2：

****：
-  0.10 
-  EGFR VHH 

****：
-  EGFR VHH ，""：
  - weight ∈ {0.05, 0.10, 0.15, 0.20}
  -  top1 
  - 

****：，。

## 

### 

 scaffold ，：
- proxy_cdr1 / proxy_cdr2 / proxy_agg
- canonical_proxy_weight
- score_diff
- rank_old → rank_new

### 

> canonical_proxy  canonical ， scaffold ； agg=min， 0.10。

## 

### 
- `core/scoring/canonical_proxy.py` - Canonical Proxy 
- `scripts/test_canonical_proxy_scoring.py` - 
- `scripts/show_canonical_proxy_debug.py` - Debug 
- `scripts/generate_scaffold_ranking_report_section.py` - 

### 
- `scripts/stage12_germline_selection.py` -  canonical_proxy 
- `core/config.py` -  `CanonicalProxyConfig`
- `config.yaml` -  canonical_proxy 
- `data/germlines/v1_clean/manifest.json` - 

## Git 

```bash
git add core/scoring/canonical_proxy.py
git add scripts/stage12_germline_selection.py
git add scripts/test_canonical_proxy_scoring.py
git add scripts/show_canonical_proxy_debug.py
git add scripts/generate_scaffold_ranking_report_section.py
git add core/config.py
git add config.yaml
git add data/germlines/v1_clean/manifest.json
git commit -m "feat: integrate canonical_proxy scoring into scaffold ranking

- Add canonical_proxy scoring module (core/scoring/canonical_proxy.py)
- Integrate canonical_proxy into stage1_select_scaffold
- Add configuration (config.yaml, core/config.py)
- Freeze parameters in manifest.json (agg_mode=min, weight=0.10)
- Add debug table generation for validation
- Add report section generation

Version: scaffold-ranking-canonical-proxy-v1
Germline Asset Version: v1_clean"

git tag scaffold-ranking-canonical-proxy-v1
```

## 

### 

```bash
python scripts/test_canonical_proxy_scoring.py \
  --input "projects/EGFR_7D12_VHH/input/egfr_vhh.fasta" \
  --scaffold "data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.json" \
  --output "output/canonical_proxy_scoring_debug.csv"
```

### 

```bash
python scripts/generate_scaffold_ranking_report_section.py \
  --input "output/result_stage12.json" \
  --output "output/scaffold_ranking_report_section.md"
```

## 

1. ✅ 
2. ✅ 
3. ⏳ （ `scaffold_ranking_report_section.md` ）
4. ⏳ （，）













