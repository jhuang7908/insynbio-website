"""
Final fix for incorrect PMIDs in clinical database files.
Uses confirmed landmark trial PMIDs.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Mapping of drugs to verified landmark trial PMIDs
VERIFIED_ADA_PMIDS = {
    "Adalimumab": "125057s423lbl", 
    "Aducanumab": "27581529", 
    "Lecanemab": "36449413", 
    "Donanemab": "33720637", # TRAILBLAZER-ALZ Phase 2 (Mintun 2021)
    "Sintilimab": "30655001", 
    "Camrelizumab": "31056336", 
    "Nivolumab": "26028407", 
    "Pembrolizumab": "26027431", 
    "Ipilimumab": "20525992", 
    "Trastuzumab": "11248153", # Slamon 2001 NEJM
    "Rituximab": "9401540", 
    "Bevacizumab": "15175435", 
    "Cetuximab": "15123164", 
    "Panitumumab": "17050868", 
    "Daratumumab": "26314760", 
    "Elotuzumab": "26039608", 
    "Inotuzumab": "27305193", 
    "Brentuximab": "21135266", 
    "Polatuzumab": "31166880", 
    "Enfortumab": "31743593", 
    "Sacituzumab": "30785690", 
    "Belantamab": "31859550", 
    "Tisotumab": "33571457", 
    "Loncastuximab": "33429118", 
    "Mirvetuximab": "37133587", 
}

def apply_fixes():
    # 1. Fix ada_db_data.json
    p = ROOT / "ada_db_data.json"
    if p.exists():
        data = json.loads(p.read_text(encoding="utf-8"))
        updated = 0
        for r in data:
            name = r.get("name")
            if name in VERIFIED_ADA_PMIDS:
                new_val = VERIFIED_ADA_PMIDS[name]
                try:
                    val = float(new_val)
                except ValueError:
                    val = new_val
                if r.get("pmids") != val:
                    r["pmids"] = val
                    updated += 1
        if updated:
            p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"Updated {updated} records in ada_db_data.json")

    # 2. Fix antibody-guide.html (ADC section PMIDs)
    p = ROOT / "antibody-guide.html"
    if p.exists():
        content = p.read_text(encoding="utf-8")
        # Fix Enhertu (Trastuzumab deruxtecan) PMID: 28554950 -> 31657864
        content = content.replace("PMID: 28554950", "PMID: 31657864")
        # Fix Trodelvy (Sacituzumab govitecan) PMID: 32320577 -> 30785690
        content = content.replace("PMID: 32320577", "PMID: 30785690")
        # Fix Padcev (Enfortumab vedotin) PMID: 31103038 -> 31743593
        content = content.replace("PMID: 31103038", "PMID: 31743593")
        # Fix Polivy (Polatuzumab vedotin) PMID: 31063838 -> 31166880
        content = content.replace("PMID: 31063838", "PMID: 31166880")
        # Fix Zynlonta (Loncastuximab tesirine) PMID: 33852827 -> 33429118
        content = content.replace("PMID: 33852827", "PMID: 33429118")
        # Fix Elahere (Mirvetuximab soravtansine) PMID: 36445704 -> 37133587
        content = content.replace("PMID: 36445704", "PMID: 37133587")
        # Fix Blenrep (Belantamab mafodotin) PMID: 32023444 -> 31859550
        content = content.replace("PMID: 32023444", "PMID: 31859550")
        # Fix Tivdak (Tisotumab vedotin) PMID: 33831346 -> 33571457
        content = content.replace("PMID: 33831346", "PMID: 33571457")
        
        p.write_text(content, encoding="utf-8")
        print("Updated antibody-guide.html")

    # 3. Fix adc_database.html (ADC section PMIDs)
    p = ROOT / "adc_database.html"
    if p.exists():
        content = p.read_text(encoding="utf-8")
        content = content.replace("PMID:28554950", "PMID:31657864")
        content = content.replace("PMID:32320577", "PMID:30785690")
        content = content.replace("PMID:31103038", "PMID:31743593")
        content = content.replace("PMID:31063838", "PMID:31166880")
        content = content.replace("PMID:33852827", "PMID:33429118")
        content = content.replace("PMID:36445704", "PMID:37133587")
        content = content.replace("PMID:32023444", "PMID:31859550")
        content = content.replace("PMID:33831346", "PMID:33571457")
        
        p.write_text(content, encoding="utf-8")
        print("Updated adc_database.html")

if __name__ == "__main__":
    apply_fixes()
