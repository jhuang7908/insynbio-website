## Methods Snippets (copy‑paste) — VHH humanization, IMGT‑only

### ANARCI numbering and IMGT segmentation
All VHH sequences were numbered in the IMGT scheme using **ANARCI** (python package name `anarcii`), and all downstream analyses were performed exclusively in IMGT coordinates. Framework (FR) and complementarity‑determining region (CDR) segments were derived from the ANARCI IMGT numbering output to avoid Kabat/Chothia mixing.

### CMC / developability proxy metrics (sequence‑based)
We computed sequence‑based developability proxies for each variant (native / SR / BM), including: (i) motif liabilities (N‑glycosylation motifs N‑X‑S/T with X≠P; deamidation motifs; isoAsp motifs; oxidation‑prone residues M/W; and extra cysteines), and (ii) global physicochemical descriptors (net charge at pH≈7 proxy; hydrophobic and aromatic fractions). To capture manufacturability‑relevant aggregation risk signals, we additionally computed a **hydrophobic patch** metric using a sliding window (window size = 9) as the maximum hydrophobic fraction across all windows (hp_max9), and a **charge patch** metric using a sliding window (window size = 7) as the maximum absolute net charge magnitude (cp_max7). A transparent composite **developability score (0–100)** was calculated by applying fixed penalties to these features and clipping to the [0,100] interval; higher scores indicate lower predicted developability risk.

### Hydrophilic surface region definition (structure‑based)
When a 3D structure was available, solvent‑accessible surface area (SASA) was computed per residue. Residues were defined as **surface‑exposed** if their relative SASA satisfied relSASA ≥ 0.25. Hydrophilicity was computed using the Kyte–Doolittle hydropathy scale (KD), and residues were defined as **surface‑hydrophilic** if (surface‑exposed) AND (KD ≤ 0.0). Contiguous surface‑hydrophilic residues were grouped into patches to identify candidate “surface resurfacing” regions.

### Structure acquisition (experimental PDB or AlphaFold2)
For structure‑informed analyses, we used either experimentally determined structures (e.g., PDB) or **AlphaFold2** predicted models. When AlphaFold2 models were used, the same downstream surface analyses (SASA/relSASA and surface‑hydrophilic patch identification) were applied. Residues with low confidence (e.g., low pLDDT) should be interpreted cautiously, and conclusions were restricted to high‑confidence regions when applicable.

