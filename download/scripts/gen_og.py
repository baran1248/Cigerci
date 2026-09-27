#!/usr/bin/env python3
"""Generate a branded 1200x630 OG/Twitter card image for Ciğerci Yusuf. (v2: auto-fit text)"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
CREAM = (250, 239, 218)      # #faefda
INK = (29, 20, 15)           # #1d140f
BRAND_RED = (195, 18, 20)    # #c31214
ORANGE = (239, 108, 1)       # #ef6c01
WA_GREEN = (37, 211, 102)    # #25D366
CARD = (254, 250, 240)       # #fefaf0

canvas = Image.new("RGB", (W, H), CREAM)
draw = ImageDraw.Draw(canvas)

# --- subtle radial texture ---
for cx, cy, color, radius in [
    (int(W * 0.12), int(H * 0.18), ORANGE, 380),
    (int(W * 0.55), int(H * 0.10), BRAND_RED, 320),
    (int(W * 0.78), int(H * 0.90), ORANGE, 300),
]:
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color + (12,))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), glow).convert("RGB")

draw = ImageDraw.Draw(canvas)

NARROW = "/usr/share/fonts/opentype/urw-base35/NimbusSansNarrow-Bold.otf"
SANS_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

# right photo card geometry (needed to size left text column)
pw, ph = 440, 450
card_x = W - pw - 70
LX = 70
MAX_TEXT_W = card_x - LX - 40  # usable left column width

def fit_font(path, text, max_w, start_size):
    size = start_size
    while size > 40:
        f = ImageFont.truetype(path, size)
        bbox = draw.textbbox((0, 0), text, font=f)
        if bbox[2] - bbox[0] <= max_w:
            return f, bbox[2] - bbox[0], size
        size -= 4
    f = ImageFont.truetype(path, size)
    bbox = draw.textbbox((0, 0), text, font=f)
    return f, bbox[2] - bbox[0], size

f_upper = ImageFont.truetype(SANS_B, 26)
f_edirne, w1, s1 = fit_font(NARROW, "EDİRNE", MAX_TEXT_W, 130)
f_tava, w2, s2 = fit_font(NARROW, "TAVA CİĞER", MAX_TEXT_W, 130)
title_size = min(s1, s2)
f_edirne = ImageFont.truetype(NARROW, title_size)
f_tava = ImageFont.truetype(NARROW, title_size)

f_sub = ImageFont.truetype(SANS, 26)
f_small = ImageFont.truetype(SANS_B, 25)
f_price = ImageFont.truetype(SANS_B, 38)

tagline = "İnce kesim, yağda kızartma · 160 gr porsiyon"
while True:
    f_sub = ImageFont.truetype(SANS, f_sub.size)
    bb = draw.textbbox((0, 0), tagline, font=f_sub)
    if bb[2] - bb[0] <= MAX_TEXT_W or f_sub.size <= 18:
        break
    f_sub = ImageFont.truetype(SANS, f_sub.size - 2)

wa_text = "WhatsApp Sipariş: +90 543 486 07 22"
bb = draw.textbbox((0, 0), wa_text, font=f_small)
strip_w = (bb[2] - bb[0]) + 62 + 40

# --- kicker ---
draw.text((LX, 58), "CIĞERCİ YUSUF", font=f_upper, fill=INK)
draw.rounded_rectangle([LX, 104, LX + 250, 110], radius=3, fill=ORANGE)

# --- title (two lines, two colors) ---
line1_y = 140
line2_y = line1_y + int(title_size * 0.94)
draw.text((LX - 3, line1_y), "EDİRNE", font=f_edirne, fill=BRAND_RED)
draw.text((LX - 3, line2_y), "TAVA CİĞER", font=f_tava, fill=ORANGE)

# --- tagline ---
tag_y = line2_y + int(title_size * 1.18)
draw.text((LX, tag_y), tagline, font=f_sub, fill=(89, 73, 65))

# --- WhatsApp strip ---
strip_y = tag_y + 62
draw.rounded_rectangle([LX, strip_y, LX + strip_w, strip_y + 62], radius=31, fill=WA_GREEN)
px, py = LX + 32, strip_y + 31
draw.ellipse([px - 13, py - 13, px + 13, py + 13], outline=(255, 255, 255), width=3)
bb = draw.textbbox((0, 0), wa_text, font=f_small)
draw.text((LX + 58, strip_y + (62 - (bb[3] - bb[1])) // 2 - bb[1]), wa_text, font=f_small, fill=(255, 255, 255))

# --- right: photo card ---
photo = Image.open("/home/z/my-project/public/ciger-yusuf-portion.jpg").convert("RGB")
photo = photo.resize((pw, ph), Image.LANCZOS)

mask = Image.new("L", (pw, ph), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, pw, ph], radius=36, fill=255)

card_y = (H - ph) // 2 - 10
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(sh).rounded_rectangle(
    [card_x + 10, card_y + 14, card_x + pw + 10, card_y + ph + 14], radius=36, fill=(29, 20, 15, 70)
)
sh = sh.filter(ImageFilter.GaussianBlur(18))
canvas = Image.alpha_composite(canvas.convert("RGBA"), sh).convert("RGB")
draw = ImageDraw.Draw(canvas)

draw.rounded_rectangle([card_x - 10, card_y - 10, card_x + pw + 10, card_y + ph + 10], radius=44, fill=CARD, outline=(227, 205, 177), width=2)
canvas.paste(photo, (card_x, card_y), mask)
draw = ImageDraw.Draw(canvas)

# --- price badge on photo ---
badge_w, badge_h = 145, 54
bx, by = card_x + pw - badge_w - 18, card_y + ph - badge_h - 18
draw.rounded_rectangle([bx, by, bx + badge_w, by + badge_h], radius=27, fill=CREAM, outline=INK, width=2)
bb = draw.textbbox((0, 0), "420 ₺", font=f_price)
draw.text((bx + (badge_w - (bb[2] - bb[0])) // 2, by + (badge_h - (bb[3] - bb[1])) // 2 - bb[1]), "420 ₺", font=f_price, fill=BRAND_RED)

canvas.save("/home/z/my-project/public/og-card.jpg", quality=90)
print(f"saved og-card.jpg {canvas.size} title_size={title_size} strip_w={strip_w}")
