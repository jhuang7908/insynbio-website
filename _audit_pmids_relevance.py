"""Check whether ADA DB PMIDs resolve and mention the drug (heuristic)."""
import json
import math
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ADA_PATH = ROOT / "ada_db_data.json"


def fetch_titles(ids: list[str]) -> dict[str, str]:
    base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    out: dict[str, str] = {}
    for i in range(0, len(ids), 200):
        chunk = ids[i : i + 200]
        params = urllib.parse.urlencode(
            {"db": "pubmed", "id": ",".join(chunk), "retmode": "json"}
        )
        url = f"{base}?{params}"
        req = urllib.request.Request(
            url, headers={"User-Agent": "InSynBio-PMID-audit/1.0"}
        )
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode())
        for uid in data.get("result", {}).get("uids", []):
            if uid == "error":
                continue
            rec = data["result"].get(uid, {})
            if rec.get("error"):
                out[uid] = f"[ERROR: {rec.get('error')}]"
            else:
                out[uid] = rec.get("title", "")
    return out


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def title_matches_drug(title: str, drug: str) -> bool:
    """True if generic name or obvious token appears in title."""
    t = title.lower()
    d = drug.lower().strip()
    if d in t:
        return True
    # INN stem: e.g. adalimumab -> -mab often not in paper title; try first 6 chars
    if len(d) >= 6 and d[:6] in t.replace("-", ""):
        return True
    # fusion proteins: try without hyphen
    if norm(d) and norm(d) in norm(title):
        return True
    return False


def main() -> None:
    rows = json.loads(ADA_PATH.read_text(encoding="utf-8"))
    pmid_to_drugs: dict[str, list[str]] = {}
    missing_pmid: list[str] = []
    for r in rows:
        name = r.get("name") or ""
        pm = r.get("pmids")
        if pm is None or (isinstance(pm, float) and math.isnan(pm)):
            missing_pmid.append(name)
            continue
        pid = str(int(float(pm))) if isinstance(pm, float) else str(pm).split(".")[0]
        pmid_to_drugs.setdefault(pid, []).append(name)

    ids = sorted([k for k in pmid_to_drugs.keys() if k.isdigit()], key=int)
    non_digit_ids = sorted([k for k in pmid_to_drugs.keys() if not k.isdigit()])
    print(f"ADA records: {len(rows)}; with PMID: {len(rows) - len(missing_pmid)}; missing PMID: {len(missing_pmid)}")
    
    titles = fetch_titles(ids)
    
    # Add dummy titles for non-digit IDs (likely FDA labels)
    for nid in non_digit_ids:
        titles[nid] = f"[Non-PMID Reference: {nid}]"
    
    all_ids_to_check = ids + non_digit_ids

    mismatches = []
    errors = []
    for pid in all_ids_to_check:
        title = titles.get(pid, "")
        if title.startswith("[ERROR"):
            errors.append((pid, pmid_to_drugs[pid], title))
            continue
        if title.startswith("[Non-PMID"):
            continue # Skip relevance check for FDA labels for now
        for drug in pmid_to_drugs[pid]:
            if not title_matches_drug(title, drug):
                mismatches.append((pid, drug, title[:200]))

    print(f"\nPubMed esummary errors: {len(errors)}")
    for pid, drugs, err in errors[:20]:
        print(f"  {pid} {drugs} {err}")

    print(f"\nHeuristic title mismatch (drug name not obvious in title): {len(mismatches)}")
    for pid, drug, tit in mismatches[:40]:
        print(f"  PMID {pid} | drug={drug}")
        print(f"    {tit}")

    out_path = ROOT / "_pmid_ada_relevance.json"
    out_path.write_text(
        json.dumps(
            {
                "missing_pmid_records": missing_pmid,
                "pubmed_errors": [{"pmid": a, "drugs": b, "msg": c} for a, b, c in errors],
                "title_mismatches": [
                    {"pmid": a, "drug": b, "title": titles.get(a, "")} for a, b, _ in mismatches
                ],
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"\nWrote {out_path}")


if __name__ == "__main__":
    main()
