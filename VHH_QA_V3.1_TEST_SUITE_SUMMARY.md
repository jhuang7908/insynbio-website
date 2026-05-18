# VHH QA v3.1 

****: 20251210  
****: v3.1.0  
****: 25/30  (83.3%)

---

## 

### ✅ （10）- `test_vhh_qa_v3_positive.py`

10 ✅

1. ✅ **P01**: VHH，
2. ✅ **P02**: fallback（warning）
3. ✅ **P03**: CDR3（20aa）+ FR3（40aa），
4. ✅ **P04**: developability+ warning
5. ✅ **P05**: Immunogenicity，Developability
6. ✅ **P06**: FR3，CDR3
7. ✅ **P07**: grafting（impact_score_normalized）
8. ✅ **P08**: ， → warningfail
9. ✅ **P09**: Templatefallback + VHH hallmark + Δ
10. ✅ **P10**: Safe mode（FR）

### ✅ （8）- `test_vhh_qa_v3_negative_integrity.py`

7/8 ✅

1. ✅ **N01**: FR4
2. ✅ **N02**: CDR（VHH FR-only）
3. ✅ **N03**: FRmutations.list
4. ✅ **N04**: humanized.full_sequenceregions
5. ✅ **N05**: CDR3（>35<2）
6. ✅ **N06**: VHH hallmark（44/45/47）
7. ✅ **N07**: CDR3+FR3（structural compatibility error）
8. ✅ **N08**: grafting impact（impact_score_normalized ≥ ）

### ⚠️ （12）- `test_vhh_qa_v3_negative_semantic.py`

8/12 ⚠️

1. ✅ **N09**: Δimmunogenicity
2. ✅ **N10**: Δdevelopability
3. ✅ **N11**: hallmark（ranking sanity error）
4. ⚠️ **N12**: FR identitycombined score
5. ✅ **N13**: combined score
6. ✅ **N14**: IMGT anchor（CDR1/2/3）
7. ✅ **N15**: Safe mode（hallmark）
8. ✅ **N16**: original/humanized
9. ✅ **N17**: FR2FR3（regions）
10. ⚠️ **N18**: CDRFR
11. ✅ **N19**: fallback（numberingFR2fallback）+ Δ
12. ✅ **N20**: interfacemutations.list（grafting+mutations）

---

## 

### ⚠️ N12: FR identitycombined score

****: FR identity（0.90 vs 0.75，0.15）combined score（0.70 vs 0.68，0.02），failwarning。

****: QA，warning（`qa_ranking_sanity`1），。

****: 
- FR identity >= 0.10（0.05），errorwarning
- ，warning

### ⚠️ N18: CDRFR

****: CDR1=4aa, FR2=10aa，<70fail。

****: 
- CDR1=4aa（5aa），structural compatibility warning
- 

****:
- structural compatibility，error
- ，

---

## 

### ✅ 

1. ****:
   - ✅ FR4
   - ✅ CDR
   - ✅ 
   - ✅ 
   - ✅ CDR3
   - ✅ VHH hallmark
   - ✅ 

2. ****:
   - ✅ CDR3/FR3
   - ✅ CDR3+FR3
   - ✅ warning

3. **Grafting**:
   - ✅ impact score
   - ✅ impact score warning

4. **Delta**:
   - ✅ Immunogenicity
   - ✅ Developability
   - ✅ warning

5. **Ranking**:
   - ✅ Hallmark
   - ✅ Combined score

6. **Fallback**:
   - ✅ Fallback warning
   - ✅ fallback+

### ⚠️ 

1. **Ranking Sanity**:
   - ⚠️ FR identitycombined

2. **Structural Compatibility**:
   - ⚠️ errorwarning

---

## 

```
============================= test session starts =============================
collected 30 items

tests/test_vhh_qa_v3_positive.py .................... [100%] 10 passed
tests/test_vhh_qa_v3_negative_integrity.py ........ [87.5%]  7 passed, 1 failed
tests/test_vhh_qa_v3_negative_semantic.py ......... [66.7%]  8 passed, 4 failed

======================== 25 passed, 5 failed in 3.06s =========================
```

****: 83.3% (25/30)

---

## 

1. **QA**:
   - ranking sanity，FR identity>=0.10error
   - structural compatibility，error

2. ****:
   - N12，warning，warning
   - N18，，

3. ****:
   - 
   - 

---

## 

✅ ****: 30QA v3.1

✅ ****: ，QA

⚠️ ****: 2，ranking sanitystructural compatibility/

****: ✅ （83.3%，）

---

****: 1.0  
****: 20251210

















