# v5.2 

## 
- ****: v5.2 (Production Lock)
- ****: 2025-12-13
- ****: ，

---

## 1. FR4 / J 

### ✅ 

1. **Curated FR4 **
   - ✅ `data/ighj_curated_fr4.json` 
   - ✅  IGHJ1-6（01） FR4 
   - ✅  FR4  11 aa
   - ✅  FR4  WGxG（WGQG  WGRG）

2. **FR4 **
   - ✅ `scripts/validate_ighj_curated_fr4.py` 
   - ✅ ：6 、fr4_len=11、fr4_aa  ^WG.G

### ❌ 

1. **`core/vhh_humanization.py` - `graft_cdrs_to_template` **
   - ****:  436-492 
   - ****: FR4  v5.2 
   - ****:
     ```python
     fr4 = consensus.get('fr4', '')
     if not fr4:
         #  framework_full 
         fr4 = framework_full[-11:]
     if not fr4:
         # 
         fr4 = "WGQGTQVTVSS"
     ```
   - ****: 
     - ❌ FR4  `consensus`  `framework_full` （"FR4  IGHJ1-6"）
     - ❌ （"FR4 is a curated structural constant"）
   - ****: 
     -  `data/ighj_curated_fr4.json`  FR4
     -  IGHJ （ IGHJ1*01） FR4
     -  FR4 

2. **`core/vhh_scaffolds/graft_engine.py` - `graft_cdrs` **
   - ****:  34-76 
   - ****: FR4  scaffold  `framework_sequences` 
   - ****:
     ```python
     fw_seqs = scaffold.data.get("framework_sequences") or {}
     grafted_regions = {
         "FR4": fw_seqs["FR4"],  # ❌  scaffold 
     }
     ```
   - ****: FR4  scaffold 
   - ****:  curated FR4 

3. **`core/vhh/vhh_scaffold_match_and_craft.py` - `craft_humanized_vhh` **
   - ****:  249-286 
   - ****: FR4  scaffold  `imgt_positions` 
   - ****:  `sc_map.get(pos, ...)`  FR4 （118-128）
   - ****: FR4  scaffold 
   - ****:  curated FR4 

---

## 2. CDR3 

### ✅ 

1. **CDR3 **
   - ✅ ，CDR3  query 
   - ✅  CDR3 、

2. **CDR3 **
   - ✅ QA  CDR3 

---

## 3. 

### ✅ 

1. **IMGT **
   - ✅  IMGT 
   - ✅ FR4 = IMGT 118-128 

2. **Kabat **
   - ✅ Kabat  hallmark （37/44/45/47）
   - ✅ Kabat 

---

## 4. 

### ❌ 

1. ****
   -  FR4 
   - ：`Human Germline FR1-FR3 + Query CDR3 + Curated Human FR4 (11 aa)`

2. ****
   -  anarcii(IMGT) 
   -  IMGT 118-128 
   -  IMGT 118-128  curated FR4

---

## 5. QA / 

### ✅ 

1. ****
   - ✅  IMGT 
   - ✅ 

### ❌ 

1. **FR4 **
   -  IMGT 118-128  curated FR4
   -  FR4  11 aa
   -  FR4  WGxG

2. ****
   - ❌  J motif
   - ❌  J  FASTA

---

## 6. 

### ✅ 

1. **Curated FR4 **
   - ✅ JSON ，
   - ✅  6 ，

---

## 

### 🔴 

1. ** `graft_cdrs_to_template` **
   -  curated FR4  FR4
   - 

2. ** `graft_cdrs` **
   -  curated FR4  FR4
   -  scaffold  FR4 

3. ** `craft_humanized_vhh` **
   -  curated FR4  FR4
   -  scaffold  FR4 

### 🟡 

1. ****
   - 
   -  FR4 

2. ** FR4 **
   -  QA  FR4 
   -  IMGT 118-128  curated FR4

### 🟢 

1. ****
   - 
   -  v5.2 

---

## 

### 1.  FR4 

```python
# core/fr4_loader.py
def load_curated_fr4(ighj_id: str = "IGHJ1*01") -> str:
    """
     curated FR4  FR4 
    
    Args:
        ighj_id: IGHJ  ID， "IGHJ{1-6}*01"
    
    Returns:
        FR4 （11 aa）
    
    Raises:
        ValueError:  ighj_id 
    """
    fr4_json_path = PROJECT_ROOT / "data" / "ighj_curated_fr4.json"
    with open(fr4_json_path, "r", encoding="utf-8") as f:
        curated_data = json.load(f)
    
    if ighj_id not in curated_data:
        raise ValueError(f"IGHJ ID {ighj_id} not found in curated FR4 library")
    
    fr4_aa = curated_data[ighj_id]["fr4_aa"]
    
    #  FR4 
    if len(fr4_aa) != 11:
        raise ValueError(f"FR4 length mismatch: expected 11, got {len(fr4_aa)}")
    
    if not re.match(r'^WG.G', fr4_aa):
        raise ValueError(f"FR4 does not match pattern ^WG.G: {fr4_aa}")
    
    return fr4_aa
```

### 2.  `graft_cdrs_to_template` 

```python
def graft_cdrs_to_template(
    vhh_cdrs: Dict[str, str], 
    human_template: Dict[str, Any],
    ighj_id: str = "IGHJ1*01"  # 
) -> str:
    """
    VHHCDRHuman
    
    v5.2 ：FR4  curated IGHJ1-6 
    """
    from core.fr4_loader import load_curated_fr4
    
    consensus = human_template['consensus']
    
    # FR1-3
    fr1 = consensus.get('fr1', '')
    fr2 = consensus.get('fr2', '')
    fr3 = consensus.get('fr3', '')
    
    # v5.2: FR4  curated 
    fr4 = load_curated_fr4(ighj_id)
    
    # 
    regions = {
        'FR1': fr1,
        'CDR1': vhh_cdrs.get('CDR1', ''),
        'FR2': fr2,
        'CDR2': vhh_cdrs.get('CDR2', ''),
        'FR3': fr3,
        'CDR3': vhh_cdrs.get('CDR3', ''),
        'FR4': fr4,  #  curated 
    }
    
    humanized_seq = rebuild_v_region_from_regions(regions)
    return humanized_seq
```

### 3.  FR4 

```python
# core/vhh_qa_validation.py 
def validate_fr4_source(
    humanized_seq: str,
    expected_ighj_id: str = "IGHJ1*01"
) -> Dict[str, Any]:
    """
     FR4  curated 
    
    v5.2 ：
    - IMGT 118-128 
    - IMGT 118-128  curated FR4
    """
    from core.fr4_loader import load_curated_fr4
    from core.segmentation.anarcii_adapter import run_anarcii_imgt
    
    #  FR4
    expected_fr4 = load_curated_fr4(expected_ighj_id)
    
    #  IMGT 
    imgt_result = run_anarcii_imgt(humanized_seq)
    
    #  IMGT 118-128
    pos_to_aa = imgt_result.get("pos_to_aa", {})
    fr4_118_128 = "".join([pos_to_aa.get(pos, "-") for pos in range(118, 129)])
    
    # 
    validation_result = {
        "pass": False,
        "expected_ighj_id": expected_ighj_id,
        "expected_fr4": expected_fr4,
        "detected_fr4": fr4_118_128,
        "matches": fr4_118_128 == expected_fr4,
        "errors": []
    }
    
    if not all(pos in pos_to_aa for pos in range(118, 129)):
        validation_result["errors"].append("IMGT 118-128 not fully present")
    
    if fr4_118_128 != expected_fr4:
        validation_result["errors"].append(
            f"FR4 mismatch: expected {expected_fr4}, got {fr4_118_128}"
        )
    
    validation_result["pass"] = len(validation_result["errors"]) == 0
    
    return validation_result
```

---

## 

### 
- ✅ Curated FR4 
- ✅ CDR3 
- ✅ IMGT 
- ❌ FR4 （3 ）
- ❌ FR4 

### 
1.  FR4 
2.  3  FR4 
3.  FR4 
4. 

---

## 

 v5.2  7 ：

> v5.2 ：
> - ❌ " FR4 / J"
> - ❌  J 
> - ❌ " case"

**。**













