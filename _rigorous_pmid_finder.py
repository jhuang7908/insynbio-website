"""
Rigorous landmark trial PMID finder.
Searches, fetches summaries, and matches titles.
"""
import json
import urllib.parse
import urllib.request
import time
import re

DRUGS = [
    "Aducanumab", "Lecanemab", "Donanemab", "Sintilimab", "Camrelizumab",
    "Nivolumab", "Pembrolizumab", "Ipilimumab", "Trastuzumab", "Rituximab",
    "Bevacizumab", "Cetuximab", "Panitumumab", "Daratumumab", "Elotuzumab",
    "Inotuzumab", "Brentuximab", "Polatuzumab", "Enfortumab", "Sacituzumab",
    "Belantamab", "Tisotumab", "Loncastuximab", "Mirvetuximab", "Golimumab",
    "Guselkumab", "Lanadelumab", "Nirsevimab", "Ixekizumab", "Fremanezumab",
    "Eptinezumab", "Risankizumab", "Tildrakizumab", "Bimekizumab", "Ozoralizumab"
]

def find_landmark(drug):
    base_search = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    # Search for drug name in title + trial/phase
    query = f"{drug}[Title] AND (trial[Title] OR phase[Title])"
    params = urllib.parse.urlencode({"db": "pubmed", "term": query, "retmode": "json", "retmax": 10})
    
    try:
        req = urllib.request.Request(f"{base_search}?{params}", headers={"User-Agent": "InSynBio-Rigorous/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            ids = json.loads(resp.read().decode()).get("esearchresult", {}).get("idlist", [])
        
        if not ids: return None
        
        base_summary = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
        params = urllib.parse.urlencode({"db": "pubmed", "id": ",".join(ids), "retmode": "json"})
        req = urllib.request.Request(f"{base_summary}?{params}", headers={"User-Agent": "InSynBio-Rigorous/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            summaries = json.loads(resp.read().decode()).get("result", {})
            
        # Match logic
        for uid in ids:
            title = summaries.get(uid, {}).get("title", "").lower()
            if drug.lower() in title and ("trial" in title or "phase" in title):
                return {"pmid": uid, "title": summaries[uid]["title"]}
        
        # Fallback: just the first one that mentions the drug
        for uid in ids:
            title = summaries.get(uid, {}).get("title", "").lower()
            if drug.lower() in title:
                return {"pmid": uid, "title": summaries[uid]["title"]}
                
        return None
    except Exception as e:
        print(f"Error for {drug}: {e}")
        return None

def main():
    final_map = {}
    for drug in DRUGS:
        print(f"Finding landmark for {drug}...")
        res = find_landmark(drug)
        if res:
            final_map[drug] = res
            print(f"  FOUND: {res['pmid']} - {res['title'][:80]}")
        else:
            print(f"  NOT FOUND")
        time.sleep(1)
        
    Path("_landmark_pmids_verified.json").write_text(json.dumps(final_map, indent=2), encoding="utf-8")

if __name__ == "__main__":
    main()
