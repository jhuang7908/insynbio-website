"""Extract PMIDs from clinical KB files and verify against PubMed (NCBI eutils)."""
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Files that represent "clinical databases" / KB content
CLINICAL_GLOBS = [
    "ada_database.html",
    "ada_db_data.json",
    "adc_database.html",
    "vaccine_kb_data.html",
    "vaccine_kb_data.json",
    "antibody-guide.html",
    "component-browser.html",
    "car_kb_data_public.json",
    "car_kb_public.json",
    "component_library_public.json",
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
    if s.endswith(".0"):
        s = s[:-2]
    return s


def extract_from_text(text: str) -> set[str]:
    out: set[str] = set()
    for pat in PMID_PATTERNS:
        for m in pat.finditer(text):
            out.add(normalize_id(m.group(1)))
    return out


def fetch_pubmed_batch(ids: list[str], batch_size: int = 200) -> dict[str, dict]:
    """Return dict pmid -> {title, error}"""
    base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    result: dict[str, dict] = {}
    for i in range(0, len(ids), batch_size):
        chunk = ids[i : i + batch_size]
        params = urllib.parse.urlencode(
            {
                "db": "pubmed",
                "id": ",".join(chunk),
                "retmode": "json",
            }
        )
        url = f"{base}?{params}"
        req = urllib.request.Request(url, headers={"User-Agent": "InSynBio-PMID-audit/1.0 (contact@insynbio.com)"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode())
        uids = data.get("result", {}).get("uids", [])
        for uid in uids:
            if uid == "error":
                continue
            rec = data["result"].get(uid, {})
            if rec.get("error"):
                result[uid] = {"error": rec.get("error")}
            else:
                result[uid] = {"title": rec.get("title", "")}
    return result


def main() -> None:
    by_file: dict[str, set[str]] = {}
    all_ids: set[str] = set()

    for name in CLINICAL_GLOBS:
        fp = ROOT / name
        if not fp.exists():
            print(f"MISSING: {name}")
            continue
        text = fp.read_text(encoding="utf-8", errors="replace")
        found = extract_from_text(text)
        by_file[name] = found
        all_ids |= found

    print("=== PMID extraction (clinical KB files) ===\n")
    for name in sorted(by_file.keys()):
        print(f"{name}: {len(by_file[name])} unique PMIDs")
    print(f"\nTotal unique IDs across listed files: {len(all_ids)}\n")

    # Validate
    ids_sorted = sorted(all_ids, key=lambda x: int(x))
    print("Fetching PubMed metadata (esummary)...")
    meta = fetch_pubmed_batch(ids_sorted)

    missing = [i for i in ids_sorted if i not in meta or meta[i].get("error")]
    ok = [i for i in ids_sorted if i in meta and not meta[i].get("error")]

    print(f"\nResolved: {len(ok)}")
    print(f"Missing or error in PubMed: {len(missing)}")
    if missing:
        print("IDs:", ", ".join(missing[:50]), ("..." if len(missing) > 50 else ""))

    # Sample titles for spot-check
    print("\n=== Sample verified titles (first 15) ===")
    for pmid in ids_sorted[:15]:
        m = meta.get(pmid, {})
        if m.get("title"):
            print(f"{pmid}: {m['title'][:120]}...")

    # Save full report
    report_path = ROOT / "_pmid_audit_report.json"
    out = {
        "files": {k: sorted(v) for k, v in by_file.items()},
        "total_unique": len(all_ids),
        "pubmed_ok": len(ok),
        "pubmed_failed": missing,
        "titles": {pid: meta.get(pid, {}) for pid in ids_sorted},
    }
    report_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nFull report written to {report_path}")


if __name__ == "__main__":
    main()
