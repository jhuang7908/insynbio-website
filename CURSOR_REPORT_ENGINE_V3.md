# CURSOR_REPORT_ENGINE v3.0 · 

**：** v3.0  
**：** 2025-12-10  
**：** （VHH·VH·VL··）

---

## 

1. [](#part-1-)
2. [](#part-2-)
3. [](#part-3-)
4. [](#part-4-)
5. [](#part-5-)
6. [](#part-6-)
7. [](#part-7-)

---

## PART 1 · 

：
1. **Client Report**
2. **Developer Report**

，。

### Client Report 

#### 1. 
- 、、、

#### 2. 
- " + "
- /

#### 3. 
：
- （confidence / severity / evidence level）
- （Low / Medium / High）
- （、）

#### 4. 

0. ****（、）  
1. ** QC**  
2. **IMGT **（ + ）  
3. **Germline  + **  
4. **Vernier Zone **  
5. **VHH hallmark / VH hallmark **  
6. **CMC Liabilities**（ + ）  
7. **Immunogenicity**（MHC-II  + ）  
8. **Developability**（ + pI + TANGO / AggScore）  
9. ****（Tier 0–3）  
10. ****（Seq1–3）  
11. ****（ 8 ）  
12. ****  
13. ** Glossary**（FR/CDR/Vernier/CMC/Hallmark ）

#### 5. 
- 
- 

#### 6. 
：
- ""
- ""
- "/"

#### 7. 
- 
- 
- 
-  scoring formula

。

### Developer Report 

，：

#### 1. 
- Client Report 
- ，：
  - IMGT residue vector
  - Germline similarity matrix
  - Vernier zone risk matrix
  - Hallmark scoring
  - CMC 
  - Immunogenicity  MHC allele  affinity table
  - Developability scoring 
  - Affinity optimization  30–100 
  - Tier classification rule logs
  - （Mutation conflict matrix）
  - Stability / Aggregation estimator raw scores
  -  pseudocode
  -  debug-friendly logs（ +  + ）

#### 2. 
（Reproducibility）：
- 
- 
- （IEDB / TANGO / IgFold / ANARCI ）

#### 3. 
。

---

## PART 2 · 

 **EXACTLY 3 **：

### Seq1 = Base Humanized · Mandatory Tier 1 Only

-  +  Tier 1 
- （Tier 2 / Tier 3）
- 

### Seq2 = Safety-Optimized · Tier 1 + 2–4  Tier 2

-  Tier 1 + /CMC/Developability  Tier 2
- 
- 

### Seq3 = Affinity-Optimized · Tier 1 + T2/T3（≤4 ）

-  Tier 1 + （Tier 2/3）
- 
-  SPR  Seq1 ， Seq3

---

## PART 3 · 

：

### Tier 0

- CDR 
- VHH hallmark：FR2 37/44/45/47
- Vernier critical packing
- Cys pairing

### Tier 1

-  FR mismatch
-  CMC（NXS/T、NG、DG、）
-  anchor residue（ FR ）

### Tier 2

- 
-  CMC
-  aggregation
-  paratope

### Tier 3（/）

- CDR aromatic enrichment
- Apex rigidification
- Electrostatic steering
- ** Tier 3  warning**

---

## PART 4 · 

：

1. **IMGT **
2. **Germline mismatch ""**
3. **Vernier zone **
4. **Hallmark **
5. **CMC Liabilities **（//）
6. **MHC-II **（： + ）
7. **Aggregation hotspot **
8. **pI / hydrophobicity **
9. ****（/）
10. **Affinity hotspot **

### 

- ：//
- （alpha 0.3–0.8）
- 

---

## PART 5 · 

### Client Report

- 
- 
- 
- " +  + "
- 
- /

### Developer Report

- 
- 
- 
- 、、、、

---

## PART 6 · 

 Glossary，：

- **FR / CDR **
- **Vernier zone**
- **Hallmark residues**（VH / VHH）
- **CMC liabilities**（、、）
- **MHC-II epitope**
- **Aggregation risk**
- **Affinity optimization **
- **Tier **

---

## PART 7 · 

### 

```python
generate_developer_report(sequence, options)
```

### 

```python
generate_client_report(sequence, options)
```

---

## 

### Client Report 

- [ ] 
- [ ]  13 
- [ ] " +  + "
- [ ] 
- [ ] 
- [ ] ///
- [ ]  Glossary

### Developer Report 

- [ ]  Client Report 
- [ ] （、、）
- [ ] （、、）
- [ ]  debug-friendly logs
- [ ] 

### 

- [ ]  EXACTLY 3 
- [ ] Seq1 = Base Humanized（ Tier 1）
- [ ] Seq2 = Safety-Optimized（Tier 1 + 2–4  Tier 2）
- [ ] Seq3 = Affinity-Optimized（Tier 1 + T2/T3 ≤4 ）

### 

- [ ] （Tier 0/1/2/3）
- [ ] Tier 0 
- [ ] Tier 1 
- [ ] Tier 3  warning

### 

- [ ]  10 
- [ ] （//）
- [ ] （alpha 0.3–0.8）
- [ ] 

---

## 

- **v3.0** (2025-12-10): ，
















