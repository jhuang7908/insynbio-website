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


def draw_centered_glyph(
    draw: ImageDraw.ImageDraw,
    center: tuple[float, float],
    char: str,
    font_size: int,
    fill: str = "#ffffff",
    optical_y_nudge: float = 0,
) -> None:
    font = load_font(font_size)
    cx, cy = center
    draw.text((cx, cy + optical_y_nudge), char, fill=fill, font=font, anchor="mm")


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = max(8, size // 8)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=ORANGE)
    draw_centered_glyph(draw, (size / 2, size / 2), "圈", int(size * 0.46), optical_y_nudge=size * 0.028)
    return img


def draw_og() -> Image.Image:
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, w, 8), fill=ORANGE)
    icon_box = (80, 120, 200, 240)
    draw.rounded_rectangle(icon_box, radius=24, fill=ORANGE)
    icon_cx = (icon_box[0] + icon_box[2]) / 2
    icon_cy = (icon_box[1] + icon_box[3]) / 2
    draw_centered_glyph(draw, (icon_cx, icon_cy), "圈", 68, optical_y_nudge=5)
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
