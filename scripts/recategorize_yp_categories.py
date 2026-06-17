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
    (["华人协会", "association", "coalition", "federa", "foundation", "社团", "联谊会", "公所"], "华人协会"),
    (["travel agency", "travel corp", "travel service", " tour ", " tours", "机票", "航空", "旅行社", "一帆旅游"], "旅行社"),
    (["pharmacy", "drugstore", "drug store", "药房", "药堂", "参茸", "參茸", "药材", "藥材", "herbal pharmacy", "medicine shop", "tong ren tang", "同仁堂"], "中国人药店"),
    (["law office", "attorney", "law firm", "legal", " esq", " llp", "律师", "律师楼", "律所", "律师事务所", "移民律"], "律师事务所"),
    (["accounting", "accountant", " cpa", "tax prep", "会计"], "会计事务所"),
    (["real estate", "realty", "realtor", "broker", "地产", "物业", "地产中介", "房产中介", "holding co", "housing llc", " apartment", "公寓"], "地产公司"),
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
    (["jewelry", "jeweller", "珠宝", "奢侈品", "luxury", "名表", "名牌"], "珠宝店"),
    (["courier", "express", "shipping", "freight", "logistics", "快递", "物流", "速运", "速運"], "快递公司"),
    (["temple", "church", "mosque", "synagogue", "佛教", "教会"], "宗教机构"),
    (["chamber of commerce", "商会"], "商会"),
    (["general contractor", "construction", "contracting", "renovation", "装修", "工程"], "装修公司"),
    (["hardware", "building materials", "supply", "建材"], "建材公司"),
    (["auto repair", "auto body", "car repair", "汽修"], "汽车修理"),
]

# Pass-2: google_type / name hints for remaining 其他华人生意 only
PASS2_RULES: list[tuple[list[str], str]] = [
    (["保健品", "灵芝", "中药", "health_food", "health food", "medicine (group)", "wong fung medicine"], "中国人药店"),
    (["employment_agency", "staffing", "recruiting", "职介", "劳务", "人力", "bookkeep"], "职介劳务"),
    (["community_center", "community services", "selfhelp community", "社区中心"], "华人协会"),
    (["wholesaler", " trading", "trading", "trade co", "trade inc", "商行", "distribution inc"], "批发贸易"),
    (["courier_service", "shipping company", "freight", "logistics company"], "快递公司"),
    (["旅游", "travel", " tour", "tours", "巴士", "bus line"], "旅行社"),
    (["deli", "food_store", "catering_service", "bakery", "meal_delivery", "food_delivery"], "中餐馆"),
    (["bar", "pub", "lounge", "night_club"], "中餐馆"),
    (["supplier", "fire-proof", "fireproof", "building_materials", "hardware_store", "home_goods_store"], "建材公司"),
    (["beauty_salon", "hair_salon", "nail_salon"], "美容院"),
    (["laundry", "dry_cleaning"], "洗衣店"),
    (["transportation_service"], "快递公司"),
]

# Pass-3: name-first hints (中文店名 / obvious English suffixes) for 其他华人生意
PASS3_NAME_RULES: list[tuple[list[str], str]] = [
    (["正骨", "针灸", "acupuncture", "chiropractic"], "医疗诊所"),
    (["干洗", "tailoring", "alteration", "dry clean", "laundry", "cleaner"], "洗衣店"),
    (["摄影", "photo studio", "photography"], "印刷招牌"),
    (["花城", "flower", "gift shop", "florist"], "珠宝店"),
    ([" g/c ", "general contractor", "scaffolding", "building solutions", "restoration", "contracting"], "装修公司"),
    (["cabinet", "fire protection", "electric inc", "mechanical inc", "plumbing", "cleaning equipment"], "建材公司"),
    (["industrial", "industries inc", "steel", " iron", "metal"], "钢铁金属"),
    (["expediting", "freight", "logistics", "courier"], "快递公司"),
    (["商城", "ebisu", "wholesale", "trading", "machinery", "机械", "technologies"], "批发贸易"),
    (["attorney", "law firm", "law office", " wong ", "fleming", " p.c.", " esq"], "律师事务所"),
    (["accounting", " cpa", "consultants", "consulting group"], "会计事务所"),
    (["颐康", "幸福堂", "华药堂", "herb", "health food"], "中国人药店"),
    (["环球旅行社", "旅行社"], "旅行社"),
]

# Known misfiles in non-misc buckets (name needle → correct category)
MISFILE_FIXES: list[tuple[list[str], str, set[str]]] = [
    (["ebisu", "e佰搜", "商城 -"], "华裔超市", {"旅行社", "批发贸易", "其他华人生意"}),
    (["historical_landmark", "tourist_attraction"], "其他华人生意", {"华人协会"}),
]

MISFILED_SOURCE = {"其他华人生意", "装修公司", "建材公司"}
STEEL_FROM_CONTRACTOR = {"钢铁金属", "旅行社", "律师事务所", "华人协会", "宗教机构", "中国人药店", "会计事务所", "地产公司", "批发贸易", "职介劳务", "华裔超市", "洗衣店", "印刷招牌", "医疗诊所"}
HOTEL_SKIP = ["hotel", " inn", "motel", "marriott", "fairfield", "renaissance", "suites"]


def blob(item: dict) -> str:
    parts = [
        item.get("name") or "",
        item.get("google_primary_type") or "",
        " ".join(item.get("google_types") or []),
    ]
    return " ".join(parts).lower()


def name_blob(item: dict) -> str:
    return (item.get("name") or "").lower()


def suggest_pass3(item: dict) -> str | None:
    text = name_blob(item)
    if not text:
        return None
    for needles, cat in PASS3_NAME_RULES:
        for n in needles:
            if n.lower() in text:
                return cat
    return None


def suggest_misfile_fix(item: dict, old_cat: str) -> str | None:
    text = blob(item)
    name = name_blob(item)
    for needles, cat, from_cats in MISFILE_FIXES:
        if old_cat not in from_cats:
            continue
        for n in needles:
            nl = n.lower()
            if nl in text or nl in name:
                return cat
    return None


def suggest_pass2(item: dict) -> str | None:
    text = blob(item)
    if any(h in text for h in HOTEL_SKIP):
        return None
    if "manufacturer" in text or "manufacturing" in text:
        if any(m in text for m in ["steel", "iron", "metal", "钢铁", "金属", "electric corp"]):
            return "钢铁金属"
        return None
    for needles, cat in PASS2_RULES:
        for n in needles:
            if n.lower() in text:
                return cat
    return None


def suggest_category(item: dict, old_cat: str) -> str | None:
    fix = suggest_misfile_fix(item, old_cat)
    if fix:
        return fix
    text = blob(item)
    name = name_blob(item)
    # Skip hotels / lodging
    if any(h in text for h in HOTEL_SKIP):
        return None
    for needles, cat in RULES:
        for n in needles:
            if n.lower() in text:
                # Avoid classifying architects as law firms
                if cat == "律师事务所" and "architectural" in name:
                    continue
                return cat
    if old_cat == "其他华人生意":
        p3 = suggest_pass3(item)
        if p3:
            return p3
        return suggest_pass2(item)
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
            new_cat = suggest_category(item, old_cat)
            should_move = (
                new_cat
                and new_cat != old_cat
                and (
                    old_cat in MISFILED_SOURCE
                    or (old_cat == "装修公司" and new_cat in STEEL_FROM_CONTRACTOR)
                    or suggest_misfile_fix(item, old_cat) is not None
                )
            )
            if should_move:
                moved = dict(item)
                moved["category"] = new_cat
                moved["category_source"] = "recategorize_v3"
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
