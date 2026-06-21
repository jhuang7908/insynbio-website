#!/usr/bin/env python3
"""Generate PNG favicon/OG assets for uslifehub.org (WeChat + Google)."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
RED_RGB = (220, 38, 38)  # red-600 — 手机桌面「红圈」品牌色
ORANGE_RGB = RED_RGB  # legacy alias
WHITE = (255, 255, 255)
BG = "#faf7f2"
TEXT_DARK = "#1f2937"
TEXT_MID = "#64748b"
TEXT_URL = "#475569"
TEXT_FOOT = "#78716c"
HIRES = 512

FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\simhei.ttf"),
    Path(r"C:\Windows\Fonts\msyhbd.ttc"),
    Path(r"C:\Windows\Fonts\msyh.ttc"),
    Path("/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc"),
    Path("/System/Library/Fonts/PingFang.ttc"),
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if not path.exists():
            continue
        for index in (0, 1):
            try:
                return ImageFont.truetype(str(path), size=size, index=index)
            except OSError:
                continue
    return ImageFont.load_default()


def draw_ring_mark(draw: ImageDraw.ImageDraw, size: int) -> None:
    """Vector 圈 mark — crisp at 16–512 px (no CJK font raster artifacts)."""
    cx = cy = size / 2
    stroke = max(2, round(size * 0.07))
    outer = size * 0.31
    inner = size * 0.17
    draw.ellipse(
        (cx - outer, cy - outer, cx + outer, cy + outer),
        outline=WHITE,
        width=stroke,
    )
    draw.ellipse(
        (cx - inner, cy - inner, cx + inner, cy + inner),
        outline=WHITE,
        width=max(2, round(stroke * 0.85)),
    )


def draw_icon_hires(size: int = HIRES) -> Image.Image:
    """Red circle + white double-ring mark (crisp at all PWA sizes)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pad = size * 0.06
    draw.ellipse((pad, pad, size - pad, size - pad), fill=RED_RGB + (255,))
    draw_ring_mark(draw, size)
    bg = Image.new("RGB", (size, size), WHITE)
    bg.paste(img, mask=img.split()[3])
    return bg


def draw_icon(size: int) -> Image.Image:
    hires = draw_icon_hires(HIRES)
    if size == HIRES:
        return hires
    return hires.resize((size, size), Image.Resampling.LANCZOS)


def draw_og() -> Image.Image:
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, w, 8), fill=ORANGE_RGB)
    icon = draw_icon(120)
    img.paste(icon, (80, 120))
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
    images = [draw_icon(s) for s in sizes]
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
