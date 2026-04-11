"""
Refined deep audit of PMIDs.
Specifically handles JSON records and HTML blocks for better context.
"""
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def fetch_metadata(ids: list[str]) -> dict[str, dict]:
    base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    out = {}
    ids = sorted(list(set(ids)), key=lambda x: int(x) if x.isdigit() else 0)
    ids = [i for i in ids if i.isdigit()]
    for i in range(0, len(ids), 200):
        chunk = ids[i : i + 200]
        params = urllib.parse.urlencode({"db": "pubmed", "id": ",".join(chunk), "retmode": "json"})
        url = f"{base}?{params}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "InSynBio-Deep-Audit/2.0"})
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

def check_relevance(title: str, keywords: list[str]) -> bool:
    t = title.lower()
    for kw in keywords:
        if not kw: continue
        kw = kw.lower().strip()
        if len(kw) < 3: continue
        if kw in t: return True
        # Check for drug name without 'mab' etc
        if kw.endswith('mab') and kw[:-3] in t: return True
    return False

def audit_ada_json(meta_map):
    p = ROOT / "ada_db_data.json"
    if not p.exists(): return []
    data = json.loads(p.read_text(encoding="utf-8"))
    results = []
    for r in data:
        pm = r.get("pmids")
        if not pm or str(pm) == "nan": continue
        pid = str(int(float(pm))) if isinstance(pm, (int, float)) else str(pm).split('.')[0]
        if not pid.isdigit(): continue
        
        meta = meta_map.get(pid, {"error": "Not found"})
        name = r.get("name", "")
        targets = r.get("targets", "")
        keywords = [name] + targets.split('|')
        relevant = check_relevance(meta.get("title", ""), keywords)
        
        results.append({
            "pmid": pid,
            "drug": name,
            "title": meta.get("title", ""),
            "relevant": relevant,
            "error": meta.get("error"),
            "file": "ada_db_data.json"
        })
    return results

def audit_html_file(fname, meta_map):
    p = ROOT / fname
    if not p.exists(): return []
    content = p.read_text(encoding="utf-8")
    # Find PMIDs and look at surrounding 500 chars for keywords
    results = []
    for m in re.finditer(r"PMID[:\s]*([0-9]{6,9})", content, re.I):
        pid = m.group(1)
        start = max(0, m.start() - 300)
        end = min(len(content), m.end() + 300)
        context = content[start:end]
        
        meta = meta_map.get(pid, {"error": "Not found"})
        # Extract potential drug names from context (capitalized words ending in mab/nib/etc)
        keywords = re.findall(r'\b[A-Z][a-z]+(?:mab|nib|tib|cept|mab)\b', context)
        # Also look for common targets
        keywords += re.findall(r'\b(?:HER2|CD19|CD20|PD-L1|EGFR|TNF|BCMA|TROP2)\b', context, re.I)
        
        relevant = check_relevance(meta.get("title", ""), keywords)
        results.append({
            "pmid": pid,
            "title": meta.get("title", ""),
            "relevant": relevant,
            "error": meta.get("error"),
            "file": fname,
            "context_sample": context[250:350].strip()
        })
    return results

def main():
    # Collect all unique PMIDs first
    all_pids = set()
    
    # 1. From ADA JSON
    p_ada = ROOT / "ada_db_data.json"
    if p_ada.exists():
        data = json.loads(p_ada.read_text(encoding="utf-8"))
        for r in data:
            pm = r.get("pmids")
            if pm and str(pm) != "nan":
                pid = str(int(float(pm))) if isinstance(pm, (int, float)) else str(pm).split('.')[0]
                if pid.isdigit(): all_pids.add(pid)
                
    # 2. From HTML files
    html_files = ["adc_database.html", "antibody-guide.html"]
    for f in html_files:
        p = ROOT / f
        if p.exists():
            content = p.read_text(encoding="utf-8")
            for m in re.finditer(r"PMID[:\s]*([0-9]{6,9})", content, re.I):
                all_pids.add(m.group(1))
                
    print(f"Total unique PMIDs to fetch: {len(all_pids)}")
    meta_map = fetch_metadata(list(all_pids))
    
    report = []
    report += audit_ada_json(meta_map)
    for f in html_files:
        report += audit_html_file(f, meta_map)
        
    # Summary
    failed = [r for r in report if r.get("error")]
    irrelevant = [r for r in report if not r.get("error") and not r.get("relevant")]
    
    print(f"\nFinal Audit Summary:")
    print(f"Total References Checked: {len(report)}")
    print(f"PubMed Resolution Failures: {len(failed)}")
    print(f"Heuristic Relevance Failures: {len(irrelevant)}")
    
    # Save report
    (ROOT / "_final_pmid_audit_report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    
    if irrelevant:
        print(f"\nTop 15 Suspicious References (Relevance Failures):")
        for r in irrelevant[:15]:
            print(f"[{r['file']}] PMID {r['pmid']} | Context: {r.get('drug') or r.get('context_sample')}")
            print(f"  Title: {r['title'][:120]}")
            print("-" * 40)

if __name__ == "__main__":
    main()
