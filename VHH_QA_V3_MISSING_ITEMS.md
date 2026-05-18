# VHH QA v3.0 

****: 20251210  
****: v3.0.2  
****: ✅ 

---

## 

CRO，3：
1. （mutation map）
2. （Conformation Risk Summary）
3. （Experimental Recommendations）

---

## 1：（Mutation Map）✅

### 

，：
- FR1–FR2–FR3–FR4 （IMGT）
-  IMGT 
- 

### 

`core/vhh_qa_mutation_map.py`

### 

1. **germline_adoption**: germline
   - ：germline

2. **structure_preserving**: 
   - ：（BLOSUM62）

3. **risk_induced**: 
   - ：（deamidation, oxidation, isomerization hotspots）

4. **deviation_from_germline**: germline
   - ：VHHgermline

### 

```python
mutation_map = {
    "regions": {
        "FR1": {
            "start": 1,
            "end": 26,
            "sequence": "...",
            "mutations": [
                {
                    "region": "FR1",
                    "imgt_position": 5,
                    "from": "A",
                    "to": "S",
                    "category": "structure_preserving",
                    "local_position": 5
                }
            ]
        },
        ...
    },
    "mutations_by_category": {
        "germline_adoption": [...],
        "structure_preserving": [...],
        "risk_induced": [...],
        "deviation_from_germline": [...]
    },
    "summary": {
        "total_mutations": 15,
        "by_category": {
            "germline_adoption": 8,
            "structure_preserving": 5,
            "risk_induced": 1,
            "deviation_from_germline": 1
        },
        "by_region": {
            "FR1": 3,
            "FR2": 5,
            "FR3": 7,
            "FR4": 0
        }
    }
}
```

### 

`validate_vhh_humanization_result_v3`，`qa_v3["mutation_map"]`。

---

## 2：（Conformation Risk Summary）✅

### 

CRO，：
- CDR3 anchor（IMGT 101/102）
- FR2 hydrophilic patch
- CDR1 torsion compatibility
- Overall structural feasibility

### 

`core/vhh_qa_conformation_risk.py`

### 

#### 1. CDR3 Anchor

****:
- anchor（IMGT 101-102）
- ，

****:
```python
{
    "stability": "high/medium/low",
    "score": 85.0,  # 0-100
    "details": {
        "anchor_sequence": "AA",
        "anchor_positions": "IMGT 101-102",
        "fr3_length": 39
    }
}
```

#### 2. FR2 Hydrophilic Patch

****:
- VHH hallmark（44, 45）
- 

****:
```python
{
    "retention": "high/medium/low",
    "score": 75.0,  # 0-100
    "details": {
        "hydrophilic_count": 1,
        "total_hallmarks": 2,
        "retention_ratio": 0.5
    }
}
```

#### 3. CDR1 Torsion Compatibility

****:
- CDR1（rule set v3.0）
- FR1FR2

****:
```python
{
    "compatibility": "acceptable/marginal/poor",
    "score": 80.0,  # 0-100
    "details": {
        "cdr1_length": 8,
        "fr1_end": "A",
        "fr2_start": "M",
        "rule_set": "v3.0"
    }
}
```

#### 4. Overall Structural Feasibility

****:
- CDR3 anchor、FR2 patch、CDR1 torsion
- structural_compatgrafting_impact（qa_v3）

****:
```python
{
    "score": 85.0,  # 0-100
    "level": "high/medium/low"
}
```

### 

```python
conformation_risk_summary = {
    "cdr3_anchor_stability": {...},
    "fr2_hydrophilic_patch": {...},
    "cdr1_torsion_compatibility": {...},
    "overall_structural_feasibility": {
        "score": 85.0,
        "level": "high"
    }
}
```

### 

`validate_vhh_humanization_result_v3`，`qa_v3["conformation_risk_summary"]`。

---

## 3：（Experimental Recommendations）✅

### 

QA v3.0，：
- （directed evolution）
- 
- 
-  ΔTm / ΔΔG

### 

`core/vhh_qa_experimental_recommendations.py`

### 

#### 1. Directed Evolution

****:
- Grafting impact normalized score ≥ 0.4
- Structural compatibilityERROR

****: high

****: "grafting impact，directed evolution"

#### 2. 

****:
- Biological feasibility < 80
- Ranking sanityERROR
- Grafting impact normalized score ≥ 0.2

****: high (feasibility < 70)  medium

****: "，"

#### 3. 

****:
- Ranking sanityERRORWARNING

****: medium

****: "，"

#### 4. （ΔTm / ΔΔG）

****:
- Overall structural feasibility < 70
- Grafting impact normalized score ≥ 0.3

****: high (feasibility < 60)  medium

****: "，（ΔTm/ΔΔG）"

### 

```python
experimental_recommendations = {
    "directed_evolution": {
        "recommended": True/False,
        "priority": "high/medium/low",
        "reason": "...",
        "details": [...]
    },
    "yeast_display_validation": {...},
    "multi_template_comparison": {...},
    "thermodynamic_analysis": {...},
    "summary": {
        "overall_risk": "low/medium/high",
        "critical_issues": [...],
        "recommended_actions": [
            {
                "action": "directed_evolution",
                "priority": "high",
                "recommended": True
            },
            ...
        ]
    }
}
```

### 

`validate_vhh_humanization_result_v3`，`qa_v3["experimental_recommendations"]`。

---

## qa_v3

```python
qa_v3 = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "checks": {
        "integrity": {...},
        "structural_compat": {...},
        "grafting_impact": {...},
        "ranking_sanity": {...},
        "delta_risk": {...}
    },
    "summary_score": {
        "biological_feasibility": float,
        "risk_level": "low/medium/high"
    },
    "metadata": {...},
    "mutation_map": {  # 
        "regions": {...},
        "mutations_by_category": {...},
        "summary": {...}
    },
    "conformation_risk_summary": {  # 
        "cdr3_anchor_stability": {...},
        "fr2_hydrophilic_patch": {...},
        "cdr1_torsion_compatibility": {...},
        "overall_structural_feasibility": {...}
    },
    "experimental_recommendations": {  # 
        "directed_evolution": {...},
        "yeast_display_validation": {...},
        "multi_template_comparison": {...},
        "thermodynamic_analysis": {...},
        "summary": {...}
    }
}
```

---

## 

### 

1. ✅ `core/vhh_qa_mutation_map.py` - 
2. ✅ `core/vhh_qa_conformation_risk.py` - 
3. ✅ `core/vhh_qa_experimental_recommendations.py` - 

### 

1. ✅ `core/vhh_qa_validation.py` - 3qa_v3

---

## 

### 

```python
from core.vhh_qa_validation import validate_vhh_humanization_result_v3

result = {
    "sequence_analysis": {
        "original_regions": {...},
        "humanized_regions": {...}
    },
    "mutations": {"list": [...]},
    "best_match": {"template": {...}},
    ...
}

qa_v3 = validate_vhh_humanization_result_v3(result, strict=True)

# mutation map
mutation_map = qa_v3["mutation_map"]
print(f": {mutation_map['summary']['total_mutations']}")
print(f"Germline adoption: {mutation_map['summary']['by_category']['germline_adoption']}")

# 
conformation_risk = qa_v3["conformation_risk_summary"]
print(f"CDR3 anchor: {conformation_risk['cdr3_anchor_stability']['stability']}")
print(f"Overall structural feasibility: {conformation_risk['overall_structural_feasibility']['score']}/100")

# 
recommendations = qa_v3["experimental_recommendations"]
if recommendations["yeast_display_validation"]["recommended"]:
    print(f": {recommendations['yeast_display_validation']['reason']}")
```

---

## 

✅ **3**

1. ✅ （mutation map）- 
2. ✅  - CRO
3. ✅  - QA

**CRO**: ✅   
****: ✅ 

---

****: 1.0  
****: 20251210

















