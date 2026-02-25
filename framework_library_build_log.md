# Framework Library Build Log

**Started:** 2026-01-09 23:25:02
**Targets:** `D:/InSynBio-AI-Research/Antibody_Engineer_Suite/core/data/framework_library/targets.yaml`
**IMGT FASTA dir:** `D:/InSynBio-AI-Research/Antibody_Engineer_Suite/core/data/imgt_ref`

## FASTA Scan

- **Scanned files:** 0

## Summary

- **Success:** 0
- **Failed:** 1
- **Skipped (TODO targets):** 0

## Failure Entries (build aborted)

| chain | allele | reason | details |
|---|---|---|---|
| VH | IGHV3-23*01 | RuntimeError | Allele not found in scanned FASTA headers: IGHV3-23*01
Candidates with same family (IGHV3): [] |

## Notes

- Fail-fast: any numbering/segmentation failure aborts the build.
- No sequences are inferred; all sequences are extracted directly from FASTA records.
- FR definition: FR1–FR3 only (FR4 excluded by definition).
