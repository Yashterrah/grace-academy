"""
Generates on-brand placeholder imagery for Grace Muigai Music Academy so the
site is never missing an image out of the box. These are clearly-marked
placeholders — swap them for real photography in /public/images and
/public/gallery whenever it's available (see README).
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, random, os

SERIF_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

TEAL = (11, 79, 74)
TEAL_DARK = (6, 46, 43)
VIOLET = (44, 34, 102)
AZURE = (27, 63, 121)
GOLD = (232, 163, 61)
CREAM = (250, 247, 241)

OUT_IMAGES = "/home/claude/grace-academy/public/images"
OUT_GALLERY = "/home/claude/grace-academy/public/gallery"
os.makedirs(OUT_IMAGES, exist_ok=True)
os.makedirs(OUT_GALLERY, exist_ok=True)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def mesh_gradient(w, h, stops):
    """Diagonal multi-stop gradient similar to the site's hero mesh."""
    img = Image.new("RGB", (w, h), TEAL)
    px = img.load()
    n = len(stops) - 1
    for y in range(h):
        for x in range(0, w, 2):
            t = ((x / w) * 0.5 + (y / h) * 0.5)
            t = min(max(t, 0), 1)
            seg = min(int(t * n), n - 1)
            local_t = t * n - seg
            color = lerp(stops[seg], stops[seg + 1], local_t)
            px[x, y] = color
            if x + 1 < w:
                px[x + 1, y] = color
    return img


def add_staff_lines(draw, w, y_top, spacing=10, opacity=40, color=CREAM, width_frac=1.0):
    for i in range(5):
        y = y_top + i * spacing
        draw.line([(int(w * (1 - width_frac) / 2), y), (int(w * (1 + width_frac) / 2), y)],
                  fill=color + (opacity,), width=2)


def add_notes(draw, positions, color=GOLD, r=7):
    for (x, y) in positions:
        draw.ellipse([x - r, y - r, x + r, y + r], fill=color)


def add_grain(img, amount=6):
    random.seed(42)
    px = img.load()
    w, h = img.size
    for _ in range(w * h // 40):
        x, y = random.randint(0, w - 1), random.randint(0, h - 1)
        r, g, b = px[x, y][:3]
        n = random.randint(-amount, amount)
        px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
    return img


def portrait():
    w, h = 480, 560
    img = mesh_gradient(w, h, [TEAL_DARK, TEAL, VIOLET])
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # staff lines motif, subtle, upper area
    add_staff_lines(draw, w, 90, spacing=9, opacity=35, color=CREAM, width_frac=0.7)

    # avatar circle with initials
    cx, cy, r = w // 2, 300, 110
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, 235))
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=GOLD + (255,), width=5)
    font_big = ImageFont.truetype(SERIF_BOLD, 96)
    bbox = draw.textbbox((0, 0), "GM", font=font_big)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw / 2 - bbox[0], cy - th / 2 - bbox[1]), "GM", font=font_big, fill=TEAL)

    # name plate
    font_name = ImageFont.truetype(SERIF_BOLD, 30)
    label = "Tr. Grace Muigai"
    bbox = draw.textbbox((0, 0), label, font=font_name)
    tw = bbox[2] - bbox[0]
    draw.text((w / 2 - tw / 2, 450), label, font=font_name, fill=CREAM)

    font_small = ImageFont.truetype(SANS, 17)
    label2 = "Music Teacher — CBC & 8-4-4"
    bbox = draw.textbbox((0, 0), label2, font=font_small)
    tw = bbox[2] - bbox[0]
    draw.text((w / 2 - tw / 2, 490), label2, font=font_small, fill=(232, 230, 224))

    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    img = add_grain(img, 4)
    img.save(f"{OUT_IMAGES}/tr-grace-portrait.jpg", quality=90)


def og_cover():
    w, h = 1200, 630
    img = mesh_gradient(w, h, [TEAL_DARK, TEAL, VIOLET, AZURE])
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    add_staff_lines(draw, w, 470, spacing=13, opacity=60, color=CREAM, width_frac=0.86)
    add_notes(draw, [(230, 470), (410, 496), (590, 483), (770, 509), (950, 470)], color=GOLD, r=9)

    font_eyebrow = ImageFont.truetype(SANS_BOLD, 24)
    draw.text((90, 120), "ONLINE CBC & 8-4-4 MUSIC LESSONS", font=font_eyebrow, fill=GOLD)

    font_title = ImageFont.truetype(SERIF_BOLD, 64)
    draw.text((88, 170), "Grace Muigai", font=font_title, fill=CREAM)
    draw.text((88, 245), "Music Academy", font=font_title, fill=CREAM)

    font_tag = ImageFont.truetype(SANS, 26)
    draw.text((90, 340), "Where every learner finds their voice, their rhythm, their grade.",
              font=font_tag, fill=(232, 230, 224))

    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    img = add_grain(img, 4)
    img.save(f"{OUT_IMAGES}/og-cover.jpg", quality=90)


GALLERY_SPECS = [
    ("choir-1", "Grade 6 Choral Practice", [TEAL_DARK, TEAL, VIOLET]),
    ("instrumental-1", "Recorder Ensemble", [VIOLET, AZURE, TEAL]),
    ("recital-1", "KCSE Music Festival", [TEAL, GOLD, VIOLET]),
    ("classroom-1", "Set Piece Coaching", [AZURE, TEAL, TEAL_DARK]),
    ("recital-2", "End of Term Recital", [VIOLET, TEAL, GOLD]),
    ("event-1", "Folksongs Workshop", [TEAL_DARK, AZURE, VIOLET]),
]


def gallery_image(slug, label, stops):
    w, h = 800, 600
    img = mesh_gradient(w, h, stops)
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    add_staff_lines(draw, w, 250, spacing=16, opacity=45, color=CREAM, width_frac=0.75)
    positions = [(200 + i * 90, 250 + (i % 3) * 16) for i in range(5)]
    add_notes(draw, positions, color=GOLD, r=8)

    # soft vignette
    for i in range(80):
        alpha = int(60 * (i / 80))
        draw.rectangle([0, 0, w, i], fill=(0, 0, 0, 0))
    draw.rectangle([0, h - 140, w, h], fill=(6, 30, 28, 140))

    font_label = ImageFont.truetype(SERIF_BOLD, 34)
    draw.text((40, h - 100), label, font=font_label, fill=CREAM)
    font_tag = ImageFont.truetype(SANS, 16)
    draw.text((40, h - 55), "Grace Muigai Music Academy", font=font_tag, fill=(220, 216, 206))

    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    img = add_grain(img, 5)
    img.save(f"{OUT_GALLERY}/{slug}.jpg", quality=88)


portrait()
og_cover()
for slug, label, stops in GALLERY_SPECS:
    gallery_image(slug, label, stops)

print("done")
