# Sequence Cleaning Rules v1

## 

""（、linker、、、、）。

## 

### 

：

- **`cleaned_input_sequence`**: 
- **`variable_domain`**: V
  - `detected`: bool - 
  - `v_start`: int - （0-based）
  - `v_end`: int - （0-based，）
  - `variable_domain_length`: int - 
  - `v_length`: int - （， STOP ）
  - `trimmed_constant_region`: bool - 
  - `variable_domain_sequence`: str - V
- **`variable_domain_sequence`**: V
- **`imgt_numbering`**: IMGT（V）
- **`kabat_numbering`**: Kabat（V）
- **`dual_map`**: （IMGT↔Kabat↔index）
- **`qa_flags`**: QA
- **`stop_reason`**: STOP
- **`warn_reason`**: WARN（，）
- **`warn_reasons`**: WARN
- **`cleaning_log`**: 
- **`tool_versions`**: 

### 

， `STOP_INCONSISTENT_BOUNDARIES`：

```
v_length == variable_domain_length
v_end - v_start == v_length
len(variable_domain_sequence) == v_length
```

## 

### 

- ****: 20（ACDEFGHIKLMNPQRSTVWY）
- ****: X
- ****
- **、、**

### FASTA/

-  `>` ，，
- （、），

### 

**：，；X  x_count。**

1. ：、、、、、X
2. ：、、、、
3. ：AAX（Xx_count）

### 

- **< 60 aa**: V（STOP：`too_short`）
- **> 800 aa**: （/），""（WARN：`too_long_suspicious_fusion`）

## 

### V

1.  HMM/（ANARCI/anarcii） V-domain 
2. ：H（VH/VHH） K/L（VL κ/λ）

### V

V（ scFv、VHH、）：

- "V"（`variable_domain`）
-  `extra_domains: List[dict]`，：
  - `v_start`: 
  - `v_end`: 
  - `length`: 
  - `chain_type`: （None）
  - `score`: 
  - `sequence`: 
  - `detection_method`: 
-  `WARN_MULTI_DOMAIN`

### 

-  V `v_start > 0`， `0..v_start-1` V（//）
- ""，V，
-  `cleaning_log` ：
  - `upstream_length`: 
  - `upstream_tail_15`: 15aa

### /

-  `v_end < original_length`， `v_end..end` V（ CH1/CL、Fc、His-tag、linker）
-  `trimmed_constant_region = True`
-  `cleaning_log` ：
  - `downstream_length`: 
  - `downstream_head_15`: 15aa

## Vgap

- **V**
- V（gap）
- /，gapV
- （IMGT↔Kabat）IMGT""

## STOP / WARN 

###  STOP（/）

- `variable_domain.detected == False`
- V：
  - VH/VHH：< 90  > 150
  - VL：< 85  > 140
- VX（> 5%）
- （`STOP_INCONSISTENT_BOUNDARIES`）
-  `*`

###  WARN（""）

- `status=conflict`
- V- `WARN_MULTI_DOMAIN`
- V（ VH 149–150）
- （ poly-G/S、）linker
- （`v_start` ）N/
- （`v_end < original_length` ）C/

### WARN

- **`warn_reasons`**: `List[str]` - WARN
- **`warn_reason`**: `str` - （， `warn_reasons` ）
- WARN，
- `qa_flags`  `warn_reasons` （qa_flags"+"，warn_reasons""）

## 

：

- **`raw_input_hash`**: SHA256
- **`cleaning_log`**: 
  - `original_length`: 
  - `cleaned_length`: 
  - `removed_chars`: 
  - `removed_count`: 
  - `x_count`: X
  - `invalid_chars`: 
  - `invalid_count`: 
  - `has_fasta_header`: FASTA
  - `fasta_header`: FASTA
  - `upstream_length`: 
  - `upstream_tail_15`: 15aa
  - `downstream_length`: 
  - `downstream_head_15`: 15aa
- **`variable_domain`**: V
- **`extra_domains`**: V
- **`tool_versions`**: （ANARCI/anarcii、scheme=imgt/kabat）
- **`qa_flags`**: QA
- **`stop_reason`**: STOP
- **`warn_reason`**: WARN（，）
- **`warn_reasons`**: WARN

## 

/：

- **Clean (Green)**: V、、X≈0、dual_map
- **Usable with Warnings (Yellow)**: conflict / V / ，
- **Reject (Red)**: V，

## 

### 

，：

```python
v_length == variable_domain_length
v_end - v_start == v_length
len(variable_domain_sequence) == v_length
```

， `STOP_INCONSISTENT_BOUNDARIES`  `cleaning_log` 。

### V

：
1. V
2. （>100aa），V
3. score `variable_domain`
4.  `extra_domains`

：V（、）。

---

****: 1.0  
****: 2025-12-14  
****: 2025-12-14  
****: antibody_engineering  
****: computational_structures








