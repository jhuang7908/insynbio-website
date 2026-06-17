#!/usr/bin/env python3
"""Reclassify yp_data entries from 其他华人生意 / misfiled buckets into proper categories."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
YP_DIR = ROOT / "yp_data"

RULES: list[tuple[list[str], str]] = [
    (["慈济", "tzu chi", "tzuchi", "buddhist"], "宗教机构"),
    (["交通罚单", "traffic ticket", "traffic tickets", "summons", "violation", "dwi defense"], "律师事务所"),
    (["钢铁", "steel", " iron ", "metal indust", "stainless steel", "iron inc"], "钢铁金属"),
    (["华人协会", "association", "coalition", "federa", "foundation", "社团", "联谊会"], "华人协会"),
    (["travel agency", "travel corp", "travel service", " tour ", " tours", "机票", "航空"], "旅行社"),
    (["pharmacy", "drugstore", "drug store", "药房", "参茸", "herbal pharmacy", "medicine shop"], "中国人药店"),
    (["law office", "attorney", "law firm", "legal", " esq", " llp", "律师", "律师事务所"], "律师事务所"),
    (["accounting", "accountant", " cpa", "tax prep", "会计"], "会计事务所"),
    (["real estate", "realty", "realtor", "broker", "地产", "物业"], "地产公司"),
    (["insurance agency", "insurance broker", "保险"], "保险"),
    (["chauffeur", "limousine", " limo", "car service"], "快递公司"),
    (["restaurant", "kitchen", "dumpling", "noodle", "bistro", "cafe", "餐", "饭店", "酒楼"], "中餐馆"),
    (["supermarket", "grocery", "market", "超市"], "华裔超市"),
    (["clinic", "medical", "dental", "dentist", "doctor", "acupuncture", "诊所", "牙医"], "医疗诊所"),
    (["daycare", "preschool", "child care", "幼儿园", "托儿"], "幼儿园"),
    (["tutor", "tutoring", "learning center", "education center", "补习"], "补习学校"),
    (["salon", "barber", "hair", "理发"], "理发店"),
    (["nail", "美甲"], "指甲店"),
    (["massage", "spa", "reflexology", "按摩", "足疗"], "按摩店"),
    (["laundry", "dry clean", "洗衣"], "洗衣店"),
    (["jewelry", "jeweller", "珠宝"], "珠宝店"),
    (["courier", "express", "shipping", "freight", "logistics", "快递", "物流"], "快递公司"),
    (["temple", "church", "mosque", "synagogue", "佛教", "教会"], "宗教机构"),
    (["chamber of commerce", "商会"], "商会"),
    (["general contractor", "construction", "contracting", "renovation", "装修", "工程"], "装修公司"),
    (["hardware", "building materials", "supply", "建材"], "建材公司"),
    (["auto repair", "auto body", "car repair", "汽修"], "汽车修理"),
]

MISFILED_SOURCE = {"其他华人生意", "装修公司", "建材公司"}
STEEL_FROM_CONTRACTOR = {"钢铁金属", "旅行社", "律师事务所", "华人协会", "宗教机构", "中国人药店", "会计事务所", "地产公司"}


def blob(item: dict) -> str:
    parts = [
        item.get("name") or "",
        item.get("google_primary_type") or "",
        " ".join(item.get("google_types") or []),
    ]
    return " ".join(parts).lower()


def suggest_category(item: dict) -> str | None:
    text = blob(item)
    for needles, cat in RULES:
        for n in needles:
            if n.lower() in text:
                return cat
    return None


def process_file(path: Path) -> tuple[int, dict[str, int]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = 0
    by_target: dict[str, int] = {}
    out: dict[str, list] = {}

    for old_cat, rows in data.items():
        if not isinstance(rows, list):
            out[old_cat] = rows
            continue
        for item in rows:
            if not isinstance(item, dict):
                out.setdefault(old_cat, []).append(item)
                continue
            new_cat = suggest_category(item)
            should_move = (
                new_cat
                and new_cat != old_cat
                and (
                    old_cat in MISFILED_SOURCE
                    or (old_cat == "装修公司" and new_cat in STEEL_FROM_CONTRACTOR)
                )
            )
            if should_move:
                moved = dict(item)
                moved["category"] = new_cat
                moved["category_source"] = "recategorize_v1"
                out.setdefault(new_cat, []).append(moved)
                changed += 1
                by_target[new_cat] = by_target.get(new_cat, 0) + 1
            else:
                out.setdefault(old_cat, []).append(item)

    if changed:
        path.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return changed, by_target


def main() -> None:
    total = 0
    summary: dict[str, int] = {}
    for path in sorted(YP_DIR.glob("*.json")):
        if path.name == "manifest.json":
            continue
        n, by_target = process_file(path)
        total += n
        for k, v in by_target.items():
            summary[k] = summary.get(k, 0) + v
        if n:
            print(f"{path.name}: reclassified {n}")
    print(f"Total reclassified: {total}")
    for k, v in sorted(summary.items(), key=lambda x: -x[1]):
        print(f"  -> {k}: {v}")


if __name__ == "__main__":
    main()
