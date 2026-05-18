# VHH：

## 、

### 1. 
- **Windows 10/11** 
- **Linux** 
- **macOS** 

### 2. Python
- **Python 3.8+** ( 3.9+)
-  `pathlib`, `typing`, `dataclasses`

### 3. 
- **CPU**: （8+）
- ****: 8GB+ (16GB+)
- ****: 10GB+ 
- **GPU**: （ANARCICPU）

## 、

### 

```python
# 
anarcii>=1.0.0          # IMGT
torch>=1.10.0           # PyTorch（ANARCI）
numpy>=1.20.0           # 
gemmi>=0.5.0            # （ANARCI）

# 
anarci                 # ANARCI（HMM，）
abnumber               # 
biopython>=1.79        # 
```

### 

```bash
# 
pip install anarcii torch numpy gemmi

# conda
conda install -c conda-forge numpy
pip install anarcii torch gemmi
```

### 

|  |  |  |
|------|------|------|
| torch | ~2GB | C/D |
| anarcii | ~500MB | C/D |
| numpy | ~50MB | C/D |
| gemmi | ~100MB | C/D |

## 、VHH（Scaffold Library）

### 1. VHH？

**VHH（Scaffold Library）**VHH，：

- **VHH**：73VHH
- **VH3**：VH3
- **VHH-SAFE**：VHH-SAFE

### 2. 

**？**

1. ****：VHHCDR，
2. ****：
3. ****：，
4. ****：

### 3. VHH

****:
- JSON: `data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.json`
- FASTA: `data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.fasta`

****:
```
73VHH
  ↓ (IMGT)
VHH
  ↓ (，0.90)
VHH（~10-20）
```

****:
```json
{
  "scaffold_id": "VHH_SCF_01",
  "n_members": 10,
  "member_ids": ["IGHV1-1", "IGHV1-2", ...],
  "consensus": {
    "fr1": "QVQLVESGGGLVQVGGSLRLSRALS",
    "fr2": "WFRQAPGKEREGVAVITADSGSTTYADSVKG",
    "fr3": "RFTISRDDARNTVYLQMNSLKPEDTAVYY",
    "fr4": "WGQGTQVTVSS",
    "framework_full": "FR1+FR2+FR3+FR4"
  }
}
```

****:
- 
- VHH
- 

### 4. VH3

****:
- JSON: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.json`
- FASTA: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.fasta`

****:
```
IGHV_aa.fasta（VH）
  ↓ (VH3: IGHV3-xx)
VH3（~50-100）
  ↓ (IMGT)
VH3
  ↓ (，0.90)
VH3（~20-30）
```

****:
```json
{
  "scaffold_id": "HUMAN_VH3_SCF_01",
  "n_members": 8,
  "member_ids": ["IGHV3-11*01", "IGHV3-15*01", ...],
  "consensus": {
    "fr1": "...",
    "fr2": "...",
    "fr3": "...",
    "fr4": "...",
    "framework_full": "..."
  }
}
```

****:
- VHH-SAFE
- VHH-SAFE

### 5. VHH-SAFE

****:
- JSON: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json`
- FASTA: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.fasta`

****:
```
VH3
  ↓ (VHH-SAFE)
  ├─ Plan A: （44→Q, 45→R）
  ├─ Plan B: （37→Y/S, 44→Q, 45→R, 47→G）
  └─ Plan C: （37=Y, 44=Q, 45=R, 47=G）
VHH-SAFE（VH33VHH-SAFE）
  ↓ (Developability)
VHH-SAFE
```

****:
```json
{
  "template_id": "HUMAN_VH3_SCF_25_SAFE_A",
  "base_scaffold": "HUMAN_VH3_SCF_25",
  "plan": "A",
  "framework": {
    "FR1": "...",
    "FR2": "...",
    "FR3": "...",
    "FR4": "...",
    "framework_full": "..."
  },
  "mutations": {
    "44": {"from": "G", "to": "Q"},
    "45": {"from": "L", "to": "R"}
  },
  "developability": {
    "score": 0.85,
    "liabilities": [...],
    "notes": "..."
  }
}
```

****:
- ****：VHH
- VHH-SAFE（A/B/C）
- developability，

### 6. 

#### 

```python
from core.vhh_humanization import humanize_vhh

# 
result = humanize_vhh(
    seq="VHH_SEQUENCE",
    panel="A",  # Plan AVHH-SAFE
    top_k=3
)

# ：
# - : ALPACA_SCAFFOLDS_FILE
# - : HUMAN_TEMPLATES_FILE
# - : ALIGNMENT_FILE
```

#### 

```python
# core/vhh_humanization.py

def load_alpaca_scaffolds -> List[Dict[str, Any]]:
    """VHH scaffold"""
    #  vhh_scaffolds.json 

def load_human_templates -> List[Dict[str, Any]]:
    """VHH-SAFE"""
    #  human_vh3_vhh_safe_templates.json 
```

### 7. 

#### 

**？**
- VHH
- VH3
- 
- VHH-SAFE

****:
```bash
# 1. VHH
python scripts/alpaca_vhh_numbering_and_split.py
python scripts/generate_vhh_scaffold_panel.py

# 2. VH3
python scripts/human_vh_numbering_and_split.py
python scripts/generate_human_vh3_scaffold_panel.py

# 3. VHH-SAFE
python scripts/generate_human_vhh_safe_templates.py
python scripts/score_vhh_safe_templates.py
```

### 8. 

****:

|  |  |  |
|-----------|------|------|
| **VHH** | **14** | 73VHH（identity0.90） |
| **VH3** | **30** | 198VH3（identity0.90） |
| **VHH-SAFE** | **90** | VH3×3（A/B/C） |

****:
- **VHH**: 14scaffold，cluster33（VHH_SCF_04）
- **VH3**: 30scaffold，cluster58（HUMAN_VH3_SCF_01）
- **VHH-SAFE**: 90（30 scaffolds × 3），developability

### 9. 

****:
- ****：VHH
- **Developability**：0-1，
- **VHH hallmark**：FR2 hallmark（37, 44, 45, 47）
- **CDR**：VHH CDR

****:
- IMGT
- VHH-SAFEdevelopability
- VHH

## 、

### 1. VHH（VHH vs VH）

****: `scripts/alpaca_vhh_classifier.py`

****: FR2 hallmark（37, 44, 45, 47）VHH

****:
```bash
python scripts/alpaca_vhh_classifier.py
# ，
```

****:
- `data/germlines/vicugna_pacos_ig_aa/IGHV_aa.fasta`

****:
- `data/germlines/vicugna_pacos_ig_aa/alpaca_ighv_vhh_label.tsv`

****:
- IMGT（ANARCI）
- FR2 hallmark
- VHH（37, 44, 45, 47）

### 2. VHH

****: `scripts/alpaca_vhh_numbering_and_split.py`

****: VHHIMGTFR/CDR

****:
```bash
python scripts/alpaca_vhh_numbering_and_split.py
# ，
```

****:
- `data/germlines/vicugna_pacos_ig_aa/alpaca_ighv_vhh_label.tsv`
- `data/germlines/vicugna_pacos_ig_aa/IGHV_aa.fasta`

****:
- `data/germlines/vicugna_pacos_ig_aa/vhh_numbered/vhh_numbered_and_split.json`
- `data/germlines/vicugna_pacos_ig_aa/vhh_numbered/vhh_numbered.fasta`
- `data/germlines/vicugna_pacos_ig_aa/vhh_numbered/vhh_summary.tsv`

****:
- IMGT（`core/numbering/imgt_anarcii.py`）
- FR/CDR（IMGT）

### 3. VHH Scaffold Panel

****: `scripts/generate_vhh_scaffold_panel.py`

****: VHH scaffold panel

****:
```bash
python scripts/generate_vhh_scaffold_panel.py
# ，（0.90）
```

****:
- `data/germlines/vicugna_pacos_ig_aa/vhh_numbered/vhh_numbered_and_split.json`

****:
- `data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.json`
- `data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.fasta`

****:
- （Greedy Clustering）
- ：0.90
- 

### 4. Human VH3

****: `scripts/human_vh_numbering_and_split.py`

****: VH3IMGTFR/CDR

****:
```bash
python scripts/human_vh_numbering_and_split.py
# ，
```

****:
- `data/germlines/human_ig_aa/IGHV_aa.fasta`

****:
- `data/germlines/human_ig_aa/vh_numbered/human_vh_numbered_and_split.json`

****:
- VH3（`IGHV3-\d+`）
- IMGT
- FR/CDR

### 5. Human VH3 Scaffold Panel

****: `scripts/generate_human_vh3_scaffold_panel.py`

****: VH3 scaffold panel

****:
```bash
python scripts/generate_human_vh3_scaffold_panel.py
# ，（0.90）
```

****:
- `data/germlines/human_ig_aa/vh_numbered/human_vh_numbered_and_split.json`

****:
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.json`
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.fasta`

****:
- 
- 

### 6. VHH-SAFE

****: `scripts/generate_human_vhh_safe_templates.py`

****: VHH-SAFE（：A, B, C）

****:
```bash
python scripts/generate_human_vhh_safe_templates.py
# ，
```

****:
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.json`

****:
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json`
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.fasta`

****:
- FR2 hallmark（37, 44, 45, 47）
- VHH-SAFE：
  - **Plan A**: （Q/E, R, G/L）
  - **Plan B**: 
  - **Plan C**: 

### 7. VHH-SAFEDevelopability

****: `scripts/score_vhh_safe_templates.py`

****: VHH-SAFEdevelopability

****:
```bash
python scripts/score_vhh_safe_templates.py
# ，
```

****:
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json`

****:
-  `human_vh3_vhh_safe_templates.json`（developability）

****:
- CMC liabilities（`core/vhh_developability.py`）
- FR2/FR3
- （0-1）

### 8. VHH

****: `scripts/test_vhh_humanization.py`

****: VHH

****:
```bash
python scripts/test_vhh_humanization.py
# ，
```

****: `core/vhh_humanization.py`

****: `humanize_vhh(seq, panel='A', top_k=3)`

****:
- `seq`: VHH
- `panel`: VHH-SAFE（'A', 'B', 'C', 'all'）
- `top_k`: k
- `species`: （'alpaca'）

****:
- CDR
- 
- （FR1-26, FR2-55, FR3-104）
- ：`0.6 * structure_match_score + 0.4 * dev_score`

****:
- JSON

### 9. 

****: `scripts/generate_affinity_optimization_suggestions.py`

****: 

****:
```bash
python scripts/generate_affinity_optimization_suggestions.py \
    --sequence "VHH_SEQUENCE" \          # VHH
    --panel A \                          # VHH-SAFE（A/B/C/all，A）
    --output "output.json" \             # （affinity_optimization_suggestions.json）
    --yeast-library \                    # 
    --max-mutations 3                    # （5）
```

****:
- VHH

****:
- JSON

****:
- （`core/affinity_optimization_rules.py`）
- Case by case
- 

## 、

### 1. IMGT

****: `core/numbering/imgt_anarcii.py`

****: `imgt_number_anarcii(seq) -> List[Dict]`

****:
- ANARCI
- ：`[{"pos": int, "ins_code": str, "aa": str, ...}]`

****:
- Anarcii
- CPU（`cpu=True`）
- （`mode='accuracy'`）

### 2. FR/CDR

****: `core/vhh_humanization.py` (: `split_regions`)

****:
- IMGT：
  - FR1: 1-26
  - CDR1: 27-38
  - FR2: 39-55
  - CDR2: 56-65
  - FR3: 66-104
  - CDR3: 105-117
  - FR4: 118-128

### 3. 

****: `scripts/generate_vhh_scaffold_panel.py`

****:
```python
1. cluster 1seed
2. ：
   - seed
   -  ≥ （0.90），cluster
   - ，cluster
3. cluster
```

****: identity

### 4. CDR

****: `core/cdr_canonical.py`

****: `classify_cdr_canonical(cdr_seq, cdr_type)`

****:
- 
- CDR1/CDR2: 
- CDR3: （short/canonical/long/very_long）

### 5. Developability

****: `core/vhh_developability.py`

****: `analyze_developability(framework_seq)`

****:
- CMC liabilities（、、、）
- FR2/FR3
- ：`score = 1 - (liability_penalty + aggregation_penalty)`

### 6. 

****: `core/affinity_optimization_rules.py`

****:
- ****: （26, 55, 104）
- **CDR**: （、、）
- ****: IMGT

## 、

### 1. JSON

#### VHH
```json
{
  "id": "VHH_ID",
  "sequence": "QVQLVES...",
  "length": 117,
  "imgt_numbering": [
    {"pos": 1, "ins_code": " ", "aa": "Q", ...},
    ...
  ],
  "regions": {
    "FR1": "QVQLVESGGGLVQVGGSLRLSRALS",
    "CDR1": "GFWYNHMG",
    "FR2": "WFRQAPGKEREGVAVITADSGSTTYADSVKG",
    "CDR2": "RFTISRDDARNTVYLQMNSLK",
    "FR3": "PEDTAVYY",
    "CDR3": "CAAGGVGWPYFDY",
    "FR4": "WGQGTQVTVSS"
  }
}
```

#### 
```json
{
  "success": true,
  "best_match": {
    "human_template": "HUMAN_VH3_SCF_25_SAFE_A",
    "humanized_sequence": "...",
    "framework_identity": 0.725,
    "combined_score": 0.537,
    "cdr_canonical": {...},
    "developability_score": 0.85,
    "affinity_risk": {
      "level": "medium",
      "factors": [...],
      "recommendation": "..."
    }
  },
  "best_by_plan": {
    "A": {...},
    "B": {...},
    "C": {...}
  }
}
```

#### 
```json
{
  "strategy": "systematic",
  "mutations": [
    {
      "position": 26,
      "from": "S",
      "to": "A",
      "region": "FR1",
      "rationale": "FR1-26...",
      "priority": "high",
      "rule_id": "POS_26_RESTORE",
      "expected_impact": "positive"
    }
  ],
  "systematic_suggestions": [...],
  "case_specific_suggestions": [...],
  "rules_applied": ["POS_26_RESTORE", "CDR_HYDROPHOBIC_OPTIMIZE"],
  "summary": {
    "total_mutations": 10,
    "systematic_count": 5,
    "case_specific_count": 5,
    "high_priority": 2,
    "medium_priority": 8
  }
}
```

### 2. TSV

#### VHH
```tsv
id	length	label	vhh_score	aa37	aa44	aa45	aa47
IGHV1-1	117	VHH	2.5	Y	Q	R	W
IGHV1-2	115	VH	1.0	F	G	L	W
```

#### VHH
```tsv
id	length	fr1_len	cdr1_len	fr2_len	cdr2_len	fr3_len	cdr3_len	fr4_len
VHH_001	117	26	8	17	10	39	13	11
```

### 3. FASTA

#### Scaffold Panel
```fasta
>VHH_SCF_01 | n_members=10 | fr_len=(26,17,39,11)
QVQLVESGGGLVQVGGSLRLSRALSGFWYNHMGWFRQAPGKEREGVAVITADSGSTTYADSVKGRFTISRDDARNTVYLQMNSLKPEDTAVYYCAAGGVGWPYFDYWGQGTQVTVSS
```

## 、

### 1. Markdown

****: `docs/` 

****:
- `VHH_HUMANIZATION_MODULE.md`: 
- `VHH_DEVELOPABILITY_SCORING.md`: Developability
- `AFFINITY_OPTIMIZATION_STRATEGY.md`: 
- `AFFINITY_OPTIMIZATION_RULES.md`: 

### 2. 

****: 

****:
```
================================================================================
VHH
================================================================================

: QVQLVESGGGLVQVGGSLRLSRALSGFWYNHMGWFRQAPGKEREGVAVIT...
: 117aa
: A

[1] VHH...
✓ 
  : HUMAN_VH3_SCF_25_SAFE_A
  identity: 72.5%
  : 0.537

[2] ...
✓ 
  : systematic
  : 10
  : 5
  Case by case: 5
  : 2
  : 8
```

## 、

### 1. 

#### 

|  |  |  |  |
|------|------|------|--------|
| **generate_affinity_optimization_suggestions.py** | `--sequence, -s` | VHH |  |
| | `--panel, -p` | VHH-SAFE | `A` |
| | `--output, -o` | JSON | `affinity_optimization_suggestions.json` |
| | `--yeast-library, -y` |  | `False` |
| | `--max-mutations, -m` |  | `5` |
| **v3_immunogenicity.py** | `--project, -p` |  |  |
| | `--base-dir, -b` |  |  |
| | `--use-iedb` | IEDB API | `False` |
| | `--hla-panel` | HLA | `ext27` |
| | `--alleles` | HLA |  |
| | `--output, -o` |  | /v3_immunogenicity/result_v3.json |
| **run_vhh_cli.py** | `--fasta, -f` | FASTA |  |
| | `--source` | VHH | `llama` |
| | `--target` |  | `human` |
| | `--strategy` |  | `balanced` |
| | `--out, -o` | JSON | （stdout） |

### 2. 

#### 

```python
# 
PROJECT_ROOT = Path(__file__).resolve.parents[1]

# VHH
ALPACA_DIR = PROJECT_ROOT / "data" / "germlines" / "vicugna_pacos_ig_aa"
ALPACA_FASTA = ALPACA_DIR / "IGHV_aa.fasta"
ALPACA_LABEL = ALPACA_DIR / "alpaca_ighv_vhh_label.tsv"
ALPACA_NUMBERED = ALPACA_DIR / "vhh_numbered" / "vhh_numbered_and_split.json"
ALPACA_SCAFFOLDS = ALPACA_DIR / "vhh_scaffolds" / "vhh_scaffolds.json"

# VH3
HUMAN_DIR = PROJECT_ROOT / "data" / "germlines" / "human_ig_aa"
HUMAN_FASTA = HUMAN_DIR / "IGHV_aa.fasta"
HUMAN_NUMBERED = HUMAN_DIR / "vh_numbered" / "human_vh_numbered_and_split.json"
HUMAN_SCAFFOLDS = HUMAN_DIR / "vh_scaffolds" / "human_vh3_scaffolds.json"
HUMAN_TEMPLATES = HUMAN_DIR / "vh_scaffolds" / "human_vh3_vhh_safe_templates.json"
```

### 3. 

****: 

****:
```python
# 
DATA_ROOT = Path(os.getenv("VHH_DATA_ROOT", "data/germlines"))
OUTPUT_ROOT = Path(os.getenv("VHH_OUTPUT_ROOT", "output"))
```

### 4. 

****: 

**** (`config.yaml`):
```yaml
paths:
  data_root: "data/germlines"
  output_root: "output"
  alpaca_dir: "{data_root}/vicugna_pacos_ig_aa"
  human_dir: "{data_root}/human_ig_aa"

parameters:
  clustering_threshold: 0.90
  max_mutations: 5
  default_panel: "A"

anarcii:
  mode: "accuracy"
  cpu: true
  batch_size: 32
```

### 5. 

****: 

****:
```python
# 
"{PROJECT_ROOT}"    # 
"{DATA_ROOT}"       # 
"{SPECIES}"         # （human, alpaca）
"{REGION}"          # （vh_numbered, vh_scaffolds）
"{VERSION}"         # 
"{DATE}"            # （YYYY-MM-DD）
"{TIMESTAMP}"       # 

# 
path_template = "{DATA_ROOT}/{SPECIES}_ig_aa/{REGION}/output.json"
path = path_template.format(
    DATA_ROOT="data/germlines",
    SPECIES="human",
    REGION="vh_scaffolds"
)
```

### 6. 

****: argparse，

****:
```bash
# 
python script.py --sequence "SEQ" --panel A

# 
export VHH_SEQUENCE="SEQ"
export VHH_PANEL="A"
python script.py

# 
python script.py --config config.yaml
```

### 7. 

|  |  |  |
|---------|--------|------|
| **** | `0.90` | `scripts/generate_vhh_scaffold_panel.py` |
| **VHH-SAFE** | `'A'` | `core/vhh_humanization.py` |
| **Top K** | `3` | `core/vhh_humanization.py` |
| **** | `5` | `scripts/generate_affinity_optimization_suggestions.py` |
| **ANARCI** | `'accuracy'` | `core/numbering/imgt_anarcii.py` |
| **ANARCI CPU** | `True` | `core/numbering/imgt_anarcii.py` |
| **Batch Size** | `32` | `core/numbering/imgt_anarcii.py` |

## 、

### 

```
1. VHH
   scripts/alpaca_vhh_classifier.py
   ↓
2. VHH
   scripts/alpaca_vhh_numbering_and_split.py
   ↓
3. VHH Scaffold Panel
   scripts/generate_vhh_scaffold_panel.py
   ↓
4. Human VH3
   scripts/human_vh_numbering_and_split.py
   ↓
5. Human VH3 Scaffold Panel
   scripts/generate_human_vh3_scaffold_panel.py
   ↓
6. VHH-SAFE
   scripts/generate_human_vhh_safe_templates.py
   ↓
7. Developability
   scripts/score_vhh_safe_templates.py
   ↓
8. VHH
   core/vhh_humanization.py (humanize_vhh)
   ↓
9. 
   scripts/generate_affinity_optimization_suggestions.py
```

### 

```
1. VHH
   from core.vhh_humanization import humanize_vhh
   result = humanize_vhh(seq, panel='A')
   ↓
2. 
   scripts/generate_affinity_optimization_suggestions.py --sequence "SEQ"
```

## 、

```
data/germlines/
├── human_ig_aa/
│   ├── IGHV_aa.fasta
│   ├── vh_numbered/
│   │   └── human_vh_numbered_and_split.json
│   └── vh_scaffolds/
│       ├── human_vh3_scaffolds.json
│       └── human_vh3_vhh_safe_templates.json
└── vicugna_pacos_ig_aa/
    ├── IGHV_aa.fasta
    ├── alpaca_ighv_vhh_label.tsv
    ├── vhh_numbered/
    │   ├── vhh_numbered_and_split.json
    │   └── vhh_summary.tsv
    └── vhh_scaffolds/
        ├── vhh_scaffolds.json
        └── vhh_scaffolds.fasta
```

## 、

### 1. 
****: `FileNotFoundError: vhh_scaffolds.json not found`
****: 
****: 
```bash
# VHH
python scripts/alpaca_vhh_numbering_and_split.py
python scripts/generate_vhh_scaffold_panel.py

# VH3
python scripts/human_vh_numbering_and_split.py
python scripts/generate_human_vh3_scaffold_panel.py

# VHH-SAFE
python scripts/generate_human_vhh_safe_templates.py
```

### 2. 
****: 
****: 
****: ，

### 3. Developability
****: `KeyError: 'developability'`
****: VHH-SAFEdevelopability
****: 
```bash
python scripts/score_vhh_safe_templates.py
```

### 4. 
****: JSON
****: 
****: JSON，

## 、

### 1. IMGT
****: ANARCI
****: ANARCI，（ANARCI/abnumber）

### 2. 
****: 
****: ，

### 3. 
****: ANARCI
****: CPU，batch_size

### 4. （Windows）
****: GBK
****: UTF-8，

## 、

### 1. 

，：

```python
from pathlib import Path
from core.vhh_humanization import ALPACA_SCAFFOLDS_FILE, HUMAN_TEMPLATES_FILE

# 
if not ALPACA_SCAFFOLDS_FILE.exists:
    raise FileNotFoundError(f"VHH: {ALPACA_SCAFFOLDS_FILE}")

if not HUMAN_TEMPLATES_FILE.exists:
    raise FileNotFoundError(f"VHH-SAFE: {HUMAN_TEMPLATES_FILE}")
```

### 2. 

JSON：

```json
{
  "version": "1.0.0",
  "generated_date": "2024-01-01",
  "source_sequences": 73,
  "n_scaffolds": 15,
  "clustering_threshold": 0.90,
  "scaffolds": [...]
}
```

### 3. 

，：

```bash
# 
cp data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.json \
   backups/vhh_scaffolds_v1.0.0.json

cp data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json \
   backups/human_vh3_vhh_safe_templates_v1.0.0.json
```

### 4. 

：

```python
# 
def validate_scaffold_library(json_file):
    with open(json_file) as f:
        data = json.load(f)
    
    # 
    required_fields = ['scaffold_id', 'n_members', 'consensus']
    for scaffold in data:
        for field in required_fields:
            if field not in scaffold:
                raise ValueError(f": {field}")
    
    # 
    for scaffold in data:
        consensus = scaffold['consensus']
        if not all(k in consensus for k in ['fr1', 'fr2', 'fr3', 'fr4']):
            raise ValueError(f": {scaffold['scaffold_id']}")
```

## 、

### 1. 
 `core/affinity_optimization_rules.py` 

### 2. 


### 3. 
germline，

## 、

### 1. 
- Anarcii
- （lazy loading）

### 2. 
- ANARCIbatch_size
- 

### 3. 
- 
- 

