#!/usr/bin/env python3
"""Generate PNG favicon/OG assets for uslifehub.org (WeChat + Google)."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ORANGE = "#ea580c"
BG = "#faf7f2"
TEXT_DARK = "#1f2937"
TEXT_MID = "#64748b"
TEXT_URL = "#475569"
TEXT_FOOT = "#78716c"

FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\msyhbd.ttc"),
    Path(r"C:\Windows\Fonts\msyh.ttc"),
    Path(r"C:\Windows\Fonts\simhei.ttf"),
    Path("/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc"),
    Path("/System/Library/Fonts/PingFang.ttc"),
]


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = max(8, size // 8)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=ORANGE)
    font = load_font(int(size * 0.52))
    char = "圈"
    bbox = draw.textbbox((0, 0), char, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1] + size * 0.04
    draw.text((x, y), char, fill="#ffffff", font=font)
    return img


def draw_og() -> Image.Image:
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, w, 8), fill=ORANGE)
    draw.rounded_rectangle((80, 120, 200, 240), radius=24, fill=ORANGE)
    icon_font = load_font(72)
    draw.text((140, 148), "圈", fill="#ffffff", font=icon_font, anchor="mm")
    title_font = load_font(56)
    sub_font = load_font(32)
    url_font = load_font(28)
    foot_font = load_font(24)
    draw.text((230, 145), "美东华人生活圈", fill=TEXT_DARK, font=title_font)
    draw.text((230, 210), "纽约 · 社区福利 · 华人黄页 · 民生频道", fill=TEXT_MID, font=sub_font)
    draw.text((230, 285), "www.uslifehub.org", fill=TEXT_URL, font=url_font)
    draw.line((80, 380, 1120, 380), fill="#e6dfd3", width=2)
    draw.text((80, 405), "活动资讯 · 4300+ 商家 · 官方福利", fill=TEXT_FOOT, font=foot_font)
    return img


def save_favicon_ico(sizes: list[int], out_path: Path) -> None:
    images = [draw_icon(s).convert("RGBA") for s in sizes]
    images[0].save(
        out_path,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=images[1:],
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out-dir", type=Path, default=ROOT)
    args = parser.parse_args()
    out = args.out_dir
    out.mkdir(parents=True, exist_ok=True)

    for size, name in [(32, "uslifehub-icon-32.png"), (192, "uslifehub-icon-192.png"), (512, "uslifehub-icon-512.png")]:
        draw_icon(size).save(out / name, "PNG", optimize=True)

    draw_og().save(out / "uslifehub-og.png", "PNG", optimize=True)
    save_favicon_ico([16, 32, 48], out / "favicon.ico")
    print(f"Wrote PNG/ICO assets to {out}")


if __name__ == "__main__":
    main()
