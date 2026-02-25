# Functional Sites: Chain Scope Gating and VL Naming Normalization

## Overview

This document explains the chain scope gating mechanism and VL naming normalization for functional sites in the Antibody Engineer Suite. These mechanisms ensure that functional site rules are correctly applied to the appropriate chain types and that output uses consistent, canonical naming conventions.

## Chain Scope Gating

### Purpose

Chain scope gating prevents functional site rules from being incorrectly applied to incompatible chain types. For example, VH/VHH-specific hallmark rules should never be applied to VL κ or VL λ chains.

### Implementation

The `rule_applies(chain_type, chain_scope)` function in `core/features/scope.py` implements the gating logic.

### Rule Table

| Chain Type | Allowed Scopes | Forbidden Scopes | Special Cases |
|------------|----------------|------------------|---------------|
| **H** (VH/VHH) | `vh`, `vhh`, `vh_vhh`, `any` | `vl`, `vl_kappa`, `vl_lambda` | If `chain_scope` contains any forbidden scope, rule is rejected even if it also contains allowed scopes |
| **K** (VL κ) | `vl`, `vl_kappa`, `any` | `vh`, `vhh`, `vl_lambda` | Same as above |
| **L** (VL λ) | `vl`, `vl_lambda`, `any` | `vh`, `vhh`, `vl_kappa` | Same as above |

### Behavior

1. **None/Empty**: If `chain_scope` is `None`, empty list, or not provided, the rule applies to all chain types.
2. **"any" scope**: If `chain_scope` contains `"any"`, the rule applies to all chain types.
3. **Forbidden scope priority**: If `chain_scope` contains any forbidden scope for the given chain type, the rule is **rejected** (returns `False`), even if it also contains allowed scopes.
4. **Allowed scope check**: Only if no forbidden scopes are present, the function checks if any allowed scope is present.

### Examples

```python
# VH chain
rule_applies("H", ["vh", "vhh"])        # True: both allowed
rule_applies("H", ["vh", "vl"])         # False: contains forbidden "vl"
rule_applies("H", ["any"])              # True: universal rule

# VL κ chain
rule_applies("K", ["vl"])               # True: allowed
rule_applies("K", ["vl_kappa"])         # True: allowed
rule_applies("K", ["vh", "vl"])         # False: contains forbidden "vh"
rule_applies("K", ["vl_lambda"])        # False: forbidden for κ

# VL λ chain
rule_applies("L", ["vl"])               # True: allowed
rule_applies("L", ["vl_lambda"])        # True: allowed
rule_applies("L", ["vl_kappa"])         # False: forbidden for λ
```

## VL Naming Normalization

### Purpose

VL naming normalization ensures that functional site identifiers use consistent, canonical naming conventions in output. This prevents confusion from legacy naming (e.g., `VL_LAMBDA_*` being used for VL κ chains) and ensures semantic consistency in reports.

### Implementation

The `normalize_site_id(site_id, chain_type, aliases_map)` function in `core/features/scope.py` implements the normalization logic.

### Normalization Rules

1. **Alias Resolution**: If `site_id` exists in `aliases_map`, it is replaced with the canonical `site_id` from the map.
2. **VL_LAMBDA_* → VL_GENERIC_***: For VL κ chains (`chain_type="K"`), any `VL_LAMBDA_*` prefix is automatically replaced with `VL_GENERIC_*`.
3. **VL_KAPPA_* → VL_GENERIC_***: For VL λ chains (`chain_type="L"`), any `VL_KAPPA_*` prefix is automatically replaced with `VL_GENERIC_*`.

### Backward Compatibility

- In `functional_sites.yaml`, `VL_GENERIC_*` rules include `aliases: ["VL_LAMBDA_*"]` to maintain backward compatibility with historical data.
- The normalization function automatically handles legacy naming during output generation.
- Historical reports or data using `VL_LAMBDA_*` will be automatically normalized to `VL_GENERIC_*` in new outputs.

### Example

```python
# Input: legacy alias for VL κ
normalize_site_id("VL_LAMBDA_VERNIER_29_30", "K", {"VL_LAMBDA_VERNIER_29_30": "VL_GENERIC_VERNIER_29_30"})
# Output: "VL_GENERIC_VERNIER_29_30"

# Input: direct legacy naming (no alias map)
normalize_site_id("VL_LAMBDA_VERNIER_29_30", "K", None)
# Output: "VL_GENERIC_VERNIER_29_30" (automatic replacement)

# Input: canonical naming (no change)
normalize_site_id("VL_GENERIC_VERNIER_29_30", "K", None)
# Output: "VL_GENERIC_VERNIER_29_30" (unchanged)
```

## Rationale

### Why Chain Scope Gating?

1. **Prevent Rule Contamination**: Without gating, VH/VHH-specific rules (e.g., `HALLMARK_VHH_37_39`) could be incorrectly applied to VL chains, leading to false annotations and incorrect engineering recommendations.
2. **Semantic Correctness**: Functional sites are chain-type-specific. VH hallmark positions (e.g., IMGT 37, 44, 45) have no meaning for VL chains.
3. **Report Quality**: Incorrect rule application would produce misleading reports, potentially causing downstream engineering errors.

### Why VL Naming Normalization?

1. **Semantic Consistency**: `VL_LAMBDA_*` naming incorrectly implies lambda-specificity when the rules are actually generic (κ/λ common). Using `VL_GENERIC_*` accurately reflects that these rules apply to both κ and λ chains.
2. **Report Clarity**: Consistent naming prevents confusion in reports. A VL κ chain should not show `VL_LAMBDA_*` identifiers.
3. **Backward Compatibility**: Automatic normalization allows historical data to be processed without manual updates, while new outputs use canonical naming.

## Example: VL κ Resolved Sites Output

The following is a minimal example of `resolved_sites` output for a VL κ chain:

```json
{
  "functional_sites": {
    "resolved_sites": {
      "VL_GENERIC_VERNIER_29_30": {
        "site_id": "VL_GENERIC_VERNIER_29_30",
        "role": "vernier",
        "chain_scope": ["vl"],
        "resolved_imgt_positions": ["29", "30"],
        "mapping_status": "conflict"
      },
      "VL_GENERIC_BOUNDARY_CDR1_START": {
        "site_id": "VL_GENERIC_BOUNDARY_CDR1_START",
        "role": "fr_cdr_boundary",
        "chain_scope": ["vl"],
        "resolved_imgt_positions": ["26", "27", "28"],
        "mapping_status": "conflict"
      },
      "VL_GENERIC_VERNIER_94_96": {
        "site_id": "VL_GENERIC_VERNIER_94_96",
        "role": "vernier",
        "chain_scope": ["vl"],
        "resolved_imgt_positions": ["94", "95", "96"],
        "mapping_status": "scheme_shift"
      }
    }
  }
}
```

**Key Observations:**
- All `site_id` values use `VL_GENERIC_*` prefix (not `VL_LAMBDA_*`)
- No `HALLMARK_VHH_*` or VH-specific rules are present
- All rules have `chain_scope: ["vl"]`, which is compatible with VL κ chains

## Integration Points

### Where Gating is Applied

1. **`resolve_functional_sites_on_sequence()`** (`core/numbering/dual_map.py`):
   - Filters functional sites using `rule_applies()` before resolution
   - Ensures only compatible rules are processed

2. **`normalize_site_id()`** is called during output generation:
   - Applied in `resolve_functional_sites_on_sequence()` when building `resolved_sites` dictionary
   - Ensures output keys and `site_id` fields use canonical naming

### Configuration

Functional site definitions in `kb/10_parameters/functional_sites.yaml` must include:
- `chain_scope`: List of allowed chain scopes (e.g., `[vh, vhh]`, `[vl]`)
- `site_id`: Canonical identifier (e.g., `VL_GENERIC_VERNIER_29_30`)
- `aliases`: Optional list of legacy identifiers for backward compatibility

## Testing

See `tests/test_feature_annotation.py` for comprehensive test coverage:
- `test_kappa_no_vh_vhh_rules()`: Verifies VL κ chains do not receive VH/VHH rules
- `test_kappa_not_labeled_lambda()`: Verifies VL κ chains do not use `VL_LAMBDA_*` naming
- `test_resolved_sites_no_vh_vhh_for_kappa()`: Verifies `resolved_sites` output correctness
- `test_resolved_sites_use_normalized_site_id()`: Verifies naming normalization in output
- `test_rule_applies_mixed_scopes()`: Verifies mixed scope handling

## Related Documentation

- `core/features/scope.py`: Implementation of gating and normalization functions
- `core/numbering/dual_map.py`: Integration of gating in functional site resolution
- `kb/10_parameters/functional_sites.yaml`: Functional site definitions with chain scope metadata
- `kb/00_schema/numbering_and_functional_sites_principles.md`: Schema principles for functional sites








