#!/usr/bin/env python3
"""Add name_zh + sort_pinyin to yp_data/*.json for Chinese/pinyin sort."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

try:
    from pypinyin import lazy_pinyin
except ImportError:
    print("Install pypinyin: pip install pypinyin", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
YP_DIR = ROOT / "yp_data"
CJK_RE = re.compile(r"[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+")


def extract_name_zh(name: str) -> str:
    parts = CJK_RE.findall(name or "")
    if not parts:
        return ""
    return max(parts, key=len)


def build_sort_pinyin(name: str, name_zh: str) -> str:
    if name_zh:
        return "".join(lazy_pinyin(name_zh, errors="ignore")).lower()
    return re.sub(r"[^a-z0-9]", "", (name or "").lower())


def enrich_item(item: dict) -> dict:
    name = str(item.get("name") or "")
    name_zh = str(item.get("name_zh") or "").strip() or extract_name_zh(name)
    sort_pinyin = str(item.get("sort_pinyin") or "").strip() or build_sort_pinyin(name, name_zh)
    out = dict(item)
    if name_zh:
        out["name_zh"] = name_zh
    out["sort_pinyin"] = sort_pinyin
    return out


def enrich_file(path: Path, dry_run: bool = False) -> tuple[int, int]:
    data = json.loads(path.read_text(encoding="utf-8"))
    total = 0
    with_zh = 0
    for category, items in data.items():
        enriched = []
        for item in items or []:
            row = enrich_item(item)
            total += 1
            if row.get("name_zh"):
                with_zh += 1
            enriched.append(row)
        data[category] = enriched
    if not dry_run:
        path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return total, with_zh


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    grand_total = grand_zh = 0
    for path in sorted(YP_DIR.glob("*.json")):
        if path.name == "manifest.json":
            continue
        total, with_zh = enrich_file(path, dry_run=args.dry_run)
        grand_total += total
        grand_zh += with_zh
        print(f"{path.name}: {total} rows, {with_zh} with name_zh")
    print(f"Done: {grand_total} rows, {grand_zh} with Chinese sort key")


if __name__ == "__main__":
    main()
