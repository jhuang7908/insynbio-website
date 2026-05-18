# CAR-T Design Standard V1.0

**Status:** OFFICIAL DOCUMENTATION
**Last Updated:** 2026-05-18

This document defines the strict engineering standards, knowledge base admission criteria, and assembly constraints for InSynBio's CAR-T Design System. It is the Single Source of Truth (SSOT) for all CAR-T, CAR-NK, and CAR-M construct generation.

## 1. Scope & Jurisdiction

This standard applies to:
- Assembly of Chimeric Antigen Receptor (CAR) constructs from component modules.
- Admission of new components to the `cart_components_registry.json`.
- The generation of FASTA sequences for cellular therapy products.

**Exclusions:** This standard does not govern scFv/VHH discovery (handled by AbEngineCore), nor does it govern pMHC peptide generation (handled by EpiDesignCore).

## 2. Component Admission Criteria (The "Ning Que Wu Lan" Principle)

Every component admitted to the registry MUST meet the following requirements. Partial or "stub" entries are tracked for curation but must not be served by the automated assembly engine.

### 2.1 Sequence Authenticity
- Must contain an exact, validated amino acid sequence.
- Sequence boundaries must be explicitly mapped to UniProt/RefSeq coordinates (e.g., `P01732 (CD8A_HUMAN) res 138-206`).
- Signal peptides must be verified for correct cleavage prediction.

### 2.2 Domain Taxonomy
Components must be classified into one of the canonical CAR-T layers:
1. `Leader / Signal Peptide`
2. `Binder` (scFv, VHH, CAAR, Peptide ligand)
3. `Linker` (Intra-binder or inter-domain)
4. `Hinge / Spacer`
5. `Transmembrane (TM)`
6. `Costimulatory`
7. `Activation` (ITAM-containing)
8. `Armored Payload` (Secreted cytokines, engagers)
9. `Safety Switch` (e.g., iCasp9, EGFRt)
10. `Regulatory Element` (e.g., 2A peptides, IRES)
11. `Logic Gate` (e.g., synNotch, SUPRA)

### 2.3 Dual-Axis Classification
All therapeutic components must be tagged along two axes to guide the assembly engine:

**A. Technical Axis:**
- `In vivo CAR`: Designed for in situ generation via LV/AAV/LNP.
- `Allogeneic`: Includes depletion tags or TCR knockout compatibility.
- `Armored`: Includes secretion sequences.
- `Logic-gated`: Split CARs or Boolean control mechanisms.

**B. Disease Axis:**
- `Liquid tumor`: Hematologic malignancies (e.g., CD19, BCMA).
- `Solid tumor`: Solid malignancies (e.g., MSLN, GPC3).
- `Autoimmune`: e.g., CAARs for PV, or Treg expansion.
- `Infection`: e.g., HIV, HBV.

### 2.4 Tier System (Clinical Provenance)
- **T1**: FDA/EMA-approved in a commercial CAR-T product; sequence clinically validated.
- **T2**: Published in peer-reviewed clinical trial; IND-filed or Phase I/II.
- **T3**: Research-stage; published in peer-reviewed literature only.

## 3. Rules-Driven Assembly Engine

The `CAR-T Assembler` is a rule-based engine. It is not an LLM hallucination engine. It MUST follow these physical and biological constraints:

### 3.1 Topology Validation
A standard CAR must follow the N-to-C terminus topology:
`[Signal Peptide] - [Binder] - [Hinge] - [Transmembrane] - [Costimulatory]* - [Activation]`

*Tandem costimulatory domains (e.g., 3rd Gen CARs) are permitted but order must be logged.

### 3.2 Compatibility Constraints
1. **CD8α Hinge/TM Pairing:** If a CD8α hinge is used, a CD8α TM domain is strongly recommended over a CD28 TM to prevent unstable heterodimerization.
2. **Costimulatory Proximity:** The primary costimulatory domain (e.g., CD28 or 4-1BB) must immediately follow the TM domain.
3. **Secretion Cleavage:** If an `Armored Payload` is included, it MUST be separated from the primary CAR chain by a validated `Regulatory Element` (e.g., P2A, T2A, E2A, F2A).

## 4. SSOT Data Location

- **Registry:** `config/cart_components_registry.json` (Derived from V3 library)
- **Engine Logic:** `core/car_design/` (Planned)
