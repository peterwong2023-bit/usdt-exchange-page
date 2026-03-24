from PIL import Image, ImageDraw, ImageFont
import math

def draw_rounded_rect(draw, xy, radius, outline, width):
    x0, y0, x1, y1 = xy
    r = radius
    draw.arc([x0, y0, x0+2*r, y0+2*r], 180, 270, fill=outline, width=width)
    draw.arc([x1-2*r, y0, x1, y0+2*r], 270, 360, fill=outline, width=width)
    draw.arc([x1-2*r, y1-2*r, x1, y1], 0, 90, fill=outline, width=width)
    draw.arc([x0, y1-2*r, x0+2*r, y1], 90, 180, fill=outline, width=width)
    draw.line([x0+r, y0, x1-r, y0], fill=outline, width=width)
    draw.line([x0+r, y1, x1-r, y1], fill=outline, width=width)
    draw.line([x0, y0+r, x0, y1-r], fill=outline, width=width)
    draw.line([x1, y0+r, x1, y1-r], fill=outline, width=width)

def draw_callout_circle(draw, cx, cy, num, color, radius=32):
    white = (255, 255, 255)
    draw.ellipse([cx-radius-3, cy-radius-3, cx+radius+3, cy+radius+3], fill=white)
    draw.ellipse([cx-radius, cy-radius, cx+radius, cy+radius], fill=color)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
    except:
        font = ImageFont.load_default()
    text = str(num)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw//2, cy - th//2 - 2), text, fill=white, font=font)

COLORS = {
    'blue':   (21, 101, 192),
    'green':  (46, 125, 50),
    'orange': (230, 81, 0),
    'purple': (106, 27, 154),
    'red':    (229, 57, 53),
}

# ====== Screenshot 1: 1832 x 1314 ======
img1 = Image.open('section1-overview.png').convert('RGBA')
overlay = Image.new('RGBA', img1.size, (0,0,0,0))
draw = ImageDraw.Draw(overlay)

sidebar_right = 240
content_left = 248
content_right = 1600
circle_x = 224

modules_s1 = [
    # (label, y_top, y_bottom, color_name)
    ('1', 50,  170, 'blue'),     # breadcrumb + title + filter + hint
    ('2', 182, 278, 'green'),    # KPI cards
    ('3', 288, 400, 'orange'),   # water level bar
    ('4', 404, 498, 'purple'),   # status bar + condition pills
    ('5', 506, 722, 'red'),      # storage task list
    ('6', 730, 1310, 'blue'),    # trend chart
]

for label, y_top, y_bot, cname in modules_s1:
    color = COLORS[cname]
    color_a = color + (140,)
    draw_rounded_rect(draw, (content_left, y_top, content_right, y_bot), 8, color_a, 4)
    fill_a = color + (18,)
    inner_draw = ImageDraw.Draw(overlay)

result1 = Image.alpha_composite(img1, overlay).convert('RGB')
draw_final = ImageDraw.Draw(result1)

for label, y_top, y_bot, cname in modules_s1:
    color = COLORS[cname]
    cy = y_top + 30
    draw_callout_circle(draw_final, circle_x, cy, label, color, radius=30)

result1.save('section1-annotated.png', quality=95)
print('Section 1 annotated OK')

# ====== Screenshot 2: 1832 x 1314 ======
img2 = Image.open('section2-trend-detail.png').convert('RGBA')
overlay2 = Image.new('RGBA', img2.size, (0,0,0,0))
draw2 = ImageDraw.Draw(overlay2)

sidebar_right_s2 = 150
content_left_s2 = 100
content_right_s2 = 1600
circle_x_s2 = 82

modules_s2 = [
    ('5', 4,   180, 'red'),      # storage task list (continued)
    ('6', 190, 530, 'blue'),     # trend chart
    ('7', 542, 1270, 'orange'),  # period detail table
]

for label, y_top, y_bot, cname in modules_s2:
    color = COLORS[cname]
    color_a = color + (140,)
    draw_rounded_rect(draw2, (content_left_s2, y_top, content_right_s2, y_bot), 8, color_a, 4)

result2 = Image.alpha_composite(img2, overlay2).convert('RGB')
draw_final2 = ImageDraw.Draw(result2)

for label, y_top, y_bot, cname in modules_s2:
    color = COLORS[cname]
    cy = y_top + 30
    draw_callout_circle(draw_final2, circle_x_s2, cy, label, color, radius=30)

detail_points = [
    ('A', 850, 196, 'green'),   # legend checkboxes
    ('B', 820, 586, 'purple'),  # net flow column header
    ('C', 1540, 586, 'green'),  # detail link
    ('D', 1100, 1278, 'red'),   # pagination
]

for label, cx, cy, cname in detail_points:
    color = COLORS[cname]
    draw_callout_circle(draw_final2, cx, cy, label, color, radius=24)

result2.save('section2-annotated.png', quality=95)
print('Section 2 annotated OK')
