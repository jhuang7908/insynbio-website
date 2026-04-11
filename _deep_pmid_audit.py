"""
Deep audit of all PMIDs across all clinical databases.
Checks for existence and relevance (drug/target in title).
"""
import json
import math
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent

CLINICAL_FILES = [
    "ada_db_data.json",
    "adc_database.html",
    "antibody-guide.html",
    "car_kb_data_public.json",
    "car_kb_public.json",
    "vaccine_kb_data.json",
]

PMID_PATTERNS = [
    re.compile(r"PMID[:\s]*([0-9]{6,9})", re.I),
    re.compile(r'"pmids?"\s*:\s*([0-9]{6,9}(?:\.0)?)', re.I),
    re.compile(r'"pmid"\s*:\s*"?([0-9]{6,9})"?', re.I),
    re.compile(r"pubmed[^0-9/]*([0-9]{6,9})", re.I),
    re.compile(r"ncbi\.nlm\.nih\.gov/pubmed/([0-9]{6,9})", re.I),
]

def normalize_id(s: str) -> str:
    s = str(s).strip()
    if s.endswith(".0"): s = s[:-2]
    return s

def extract_with_context(text: str, filename: str) -> list[dict]:
    results = []
    lines = text.splitlines()
    for i, line in enumerate(lines):
        for pat in PMID_PATTERNS:
            for m in pat.finditer(line):
                pmid = normalize_id(m.group(1))
                # Grab some context (drug name or target nearby)
                context = line.strip()
                if len(context) > 200: context = context[:200] + "..."
                results.append({
                    "pmid": pmid,
                    "file": filename,
                    "line": i + 1,
                    "context": context
                })
    return results

def fetch_metadata(ids: list[str]) -> dict[str, dict]:
    base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    out = {}
    ids = sorted(list(set(ids)), key=int)
    for i in range(0, len(ids), 200):
        chunk = ids[i : i + 200]
        params = urllib.parse.urlencode({"db": "pubmed", "id": ",".join(chunk), "retmode": "json"})
        url = f"{base}?{params}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "InSynBio-Deep-Audit/1.0"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode())
            for uid in data.get("result", {}).get("uids", []):
                if uid == "error": continue
                rec = data["result"].get(uid, {})
                if rec.get("error"):
                    out[uid] = {"error": rec.get("error")}
                else:
                    out[uid] = {
                        "title": rec.get("title", ""),
                        "pubdate": rec.get("pubdate", ""),
                        "source": rec.get("source", "")
                    }
        except Exception as e:
            print(f"Error fetching chunk: {e}")
    return out

def check_relevance(pmid: str, meta: dict, context: str) -> bool:
    """Heuristic check: does title or source relate to context?"""
    if "error" in meta: return False
    title = meta.get("title", "").lower()
    # Extract potential keywords from context (capitalized words, drug-like suffixes)
    keywords = re.findall(r'[A-Z][a-z]{3,}', context)
    # Add common drug suffixes
    keywords += re.findall(r'\w+mab|\w+nib|\w+tib|\w+cept', context.lower())
    
    for kw in set(keywords):
        if len(kw) < 4: continue
        if kw.lower() in title: return True
        # Check if keyword is a target (e.g. HER2, CD19)
        if re.search(r'\b' + re.escape(kw.lower()) + r'\b', title): return True
    
    return False

def main():
    all_refs = []
    for fname in CLINICAL_FILES:
        p = ROOT / fname
        if not p.exists(): continue
        text = p.read_text(encoding="utf-8", errors="replace")
        all_refs += extract_with_context(text, fname)
    
    unique_ids = list(set(r["pmid"] for r in all_refs if r["pmid"].isdigit()))
    print(f"Total unique PMIDs to audit: {len(unique_ids)}")
    
    meta_map = fetch_metadata(unique_ids)
    
    report = []
    for ref in all_refs:
        pmid = ref["pmid"]
        if not pmid.isdigit(): continue
        meta = meta_map.get(pmid, {"error": "Not found in PubMed"})
        relevant = check_relevance(pmid, meta, ref["context"])
        
        report.append({
            "pmid": pmid,
            "file": ref["file"],
            "line": ref["line"],
            "context": ref["context"],
            "title": meta.get("title", ""),
            "relevant_heuristic": relevant,
            "error": meta.get("error")
        })
    
    # Summary
    failed = [r for r in report if r.get("error")]
    irrelevant = [r for r in report if not r.get("error") and not r["relevant_heuristic"]]
    
    print(f"\nAudit Summary:")
    print(f"Total References: {len(report)}")
    print(f"PubMed Resolution Failures: {len(failed)}")
    print(f"Heuristic Relevance Failures: {len(irrelevant)}")
    
    # Save detailed report
    (ROOT / "_deep_pmid_audit.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    
    print(f"\nTop 20 Potential Irrelevant/Wrong References:")
    for r in irrelevant[:20]:
        print(f"[{r['file']}:{r['line']}] PMID {r['pmid']}")
        print(f"  Context: {r['context'][:100]}")
        print(f"  Title:   {r['title'][:100]}")
        print("-" * 40)

if __name__ == "__main__":
    main()
