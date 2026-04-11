"""
Search for correct PMIDs using NCBI E-search API.
"""
import json
import urllib.parse
import urllib.request
import re

DRUGS = [
    "Risankizumab", "Tildrakizumab", "Bimekizumab", "Toripalimab", 
    "Tarlatamab", "Sacituzumab", "Ravulizumab", "Pembrolizumab",
    "Ozoralizumab", "Itolizumab", "Concizumab", "Clazakizumab",
    "Camrelizumab", "Tisotumab", "Panitumumab"
]

def esearch(drug):
    base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    # Search for drug name + "trial" or "phase 3"
    query = f"{drug}[Title] AND (trial[Title] OR phase[Title])"
    params = urllib.parse.urlencode({
        "db": "pubmed",
        "term": query,
        "retmode": "json",
        "retmax": 5
    })
    url = f"{base}?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "InSynBio-Search/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
        return data.get("esearchresult", {}).get("idlist", [])
    except Exception as e:
        print(f"Error searching {drug}: {e}")
        return []

def esummary(ids):
    if not ids: return {}
    base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    params = urllib.parse.urlencode({
        "db": "pubmed",
        "id": ",".join(ids),
        "retmode": "json"
    })
    url = f"{base}?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "InSynBio-Search/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
        out = {}
        for uid in data.get("result", {}).get("uids", []):
            out[uid] = data["result"][uid].get("title", "")
        return out
    except Exception as e:
        print(f"Error fetching summaries: {e}")
        return {}

def main():
    results = {}
    for drug in DRUGS:
        print(f"Searching for {drug}...")
        ids = esearch(drug)
        titles = esummary(ids)
        results[drug] = [{"pmid": i, "title": t} for i, t in titles.items()]
        
    print("\nResults:")
    for drug, items in results.items():
        print(f"--- {drug} ---")
        for item in items:
            print(f"  {item['pmid']}: {item['title'][:100]}")

if __name__ == "__main__":
    main()
