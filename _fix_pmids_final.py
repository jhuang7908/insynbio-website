"""
Final verified PMID fixes for major drugs.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

VERIFIED_ADA_PMIDS = {
    "Tildrakizumab": "28596043", # reSURFACE 1/2 (Reich et al. 2017 Lancet)
}

def apply_fixes():
    p = ROOT / "ada_db_data.json"
    if p.exists():
        data = json.loads(p.read_text(encoding="utf-8"))
        updated = 0
        for r in data:
            name = r.get("name")
            if name in VERIFIED_ADA_PMIDS:
                new_val = VERIFIED_ADA_PMIDS[name]
                if r.get("pmids") != new_val:
                    r["pmids"] = new_val
                    updated += 1
        if updated:
            p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"Updated {updated} records in ada_db_data.json")

if __name__ == "__main__":
    apply_fixes()
