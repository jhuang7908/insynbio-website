#!/usr/bin/env python3
"""Regenerate yp_data/manifest.json counts from sharded JSON (industry + area totals)."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
YP_DIR = ROOT / "yp_data"
MANIFEST = YP_DIR / "manifest.json"

AREA_LABELS = {
    "flushing": "法拉盛",
    "chinatown": "唐人街",
    "sunset": "八大道",
    "elmhurst": "艾姆赫斯特",
    "manhattan": "曼哈顿",
    "brooklyn": "布鲁克林",
    "queens": "皇后区",
    "bronx": "Bronx",
    "longisland": "长岛",
    "staten": "史坦顿岛",
    "other": "其他区域",
}


def public_label(n: int) -> str:
    if n <= 0:
        return "0"
    if n < 10:
        return "若干"
    if n < 100:
        return f"{(n // 10) * 10}+"
    bucket = max(100, (n // 100) * 100)
    return f"{bucket}+"


def main() -> None:
    area_totals: dict[str, int] = {k: 0 for k in AREA_LABELS}
    industry_totals: dict[str, int] = {}
    total = 0

    for path in sorted(YP_DIR.glob("*.json")):
        if path.name == "manifest.json":
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        area_id = path.stem
        for cat, rows in data.items():
            if not isinstance(rows, list):
                continue
            n = len(rows)
            total += n
            industry_totals[cat] = industry_totals.get(cat, 0) + n
            if area_id in area_totals:
                area_totals[area_id] += n

    prev = {}
    if MANIFEST.exists():
        prev = json.loads(MANIFEST.read_text(encoding="utf-8"))
    ver_parts = (prev.get("version") or "1.4.0").split(".")
    patch = int(ver_parts[-1]) + 1 if len(ver_parts) == 3 else 5
    version = f"{ver_parts[0]}.{ver_parts[1]}.{patch}"

    manifest = {
        "version": version,
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "public_total_label": public_label(total),
        "industries": {
            cat: {"count": n, "public_label": public_label(n)}
            for cat, n in sorted(industry_totals.items(), key=lambda x: -x[1])
        },
        "areas": [
            {
                "id": aid,
                "label": AREA_LABELS[aid],
                "count": area_totals[aid],
                "public_label": public_label(area_totals[aid]),
            }
            for aid in AREA_LABELS
            if area_totals[aid] > 0
        ],
        "has_pending_review": False,
        "notice": "Community directory — bulk scraping prohibited. Browse via hub UI.",
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    misc = industry_totals.get("其他华人生意", 0)
    print(f"manifest {version} total={total} misc={misc} ({public_label(misc)})")


if __name__ == "__main__":
    main()
