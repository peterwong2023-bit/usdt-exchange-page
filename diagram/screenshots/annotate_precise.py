from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image, ImageDraw, ImageFont
import time, json

DPR = 2

opts = Options()
opts.add_argument('--headless')
opts.add_argument('--window-size=1440,900')
opts.add_argument(f'--force-device-scale-factor={DPR}')

driver = webdriver.Chrome(options=opts)
driver.get('file:///Users/wongpeter/Desktop/usdt-exchange-page/docs/mockup/withdraw-stats-tron-usdt.html')
time.sleep(2)

positions = driver.execute_script("""
  function r(el) { if(!el) return null; var b=el.getBoundingClientRect(); return [b.x,b.y,b.right,b.bottom]; }
  var mn = document.querySelector('.mn');
  var res = {};
  res.sidebar_right = document.querySelector('.sb').getBoundingClientRect().right;
  res.content_left = document.querySelector('.mn').children[0].getBoundingClientRect().x;
  res.content_right = document.querySelector('.mn').children[0].getBoundingClientRect().right;
  
  // Module 1: breadcrumb + title + filter row + hint
  var bc = document.querySelector('.bc').getBoundingClientRect();
  var frow = document.querySelector('.frow').getBoundingClientRect();
  // The hint text is the next sibling (inside frow actually)
  // Let's find the bottom of the filter area - it's frow bottom plus a small padding
  res.m1 = [bc.x, bc.y - 4, frow.right, frow.bottom + 20];
  
  // Module 2: KPI row
  var kr = document.querySelector('.kr').getBoundingClientRect();
  res.m2 = [kr.x, kr.y - 4, kr.right, kr.bottom + 4];
  
  // Module 3+4: Water level card (contains bar + status + pills)
  var wl = document.querySelector('.wl-card').getBoundingClientRect();
  // Split into upper (bar) and lower (status+pills)
  // Find the wl-bar and wl-status elements
  var wlBar = document.querySelector('.wl-bar');
  var wlStatus = document.querySelector('.wl-status');
  var wlPills = document.getElementById('wlPills');
  
  if (wlBar && wlStatus) {
    var wlTitle = document.querySelector('.wl-card h3');
    var barR = wlBar.getBoundingClientRect();
    var titleR = wlTitle.getBoundingClientRect();
    var statusR = wlStatus.getBoundingClientRect();
    var pillsR = wlPills ? wlPills.getBoundingClientRect() : statusR;
    
    // Module 3: water level title + bar
    res.m3 = [wl.x, titleR.y - 4, wl.right, barR.bottom + 30];
    // Module 4: status bar + condition pills 
    res.m4 = [wl.x, statusR.y - 4, wl.right, Math.max(pillsR.bottom, statusR.bottom) + 8];
  } else {
    res.m3 = [wl.x, wl.y, wl.right, wl.y + wl.height/2];
    res.m4 = [wl.x, wl.y + wl.height/2, wl.right, wl.bottom];
  }
  
  // Module 5: Storage task panel
  var sp = document.getElementById('storagePanel').getBoundingClientRect();
  res.m5 = [sp.x, sp.y - 4, sp.right, sp.bottom + 4];
  
  // Module 6: Trend chart
  var cds = document.querySelectorAll('.mn > .cd');
  if (cds[0]) {
    var cd0 = cds[0].getBoundingClientRect();
    res.m6 = [cd0.x, cd0.y - 4, cd0.right, cd0.bottom + 4];
  }
  
  // Module 7: Period detail table
  if (cds[1]) {
    var cd1 = cds[1].getBoundingClientRect();
    res.m7 = [cd1.x, cd1.y - 4, cd1.right, cd1.bottom + 4];
  }
  
  // Page scroll height
  res.scrollHeight = document.documentElement.scrollHeight;
  res.viewportHeight = window.innerHeight;
  
  return res;
""")

print(json.dumps(positions, indent=2))

# Screenshot 1: top area (no scroll)
driver.save_screenshot('/tmp/screen1.png')
scroll1_y = 0

# Screenshot 2: scroll to show trend chart + period table
scroll2_y = 500
driver.execute_script(f'window.scrollTo(0, {scroll2_y})')
time.sleep(1)
driver.save_screenshot('/tmp/screen2.png')

driver.quit()

# =========== Annotate images ===========

COLORS = {
    'blue':   (21, 101, 192),
    'green':  (46, 125, 50),
    'orange': (230, 81, 0),
    'purple': (106, 27, 154),
    'red':    (229, 57, 53),
}

def draw_rounded_rect(draw, x0, y0, x1, y1, radius, color, width):
    r = radius
    ca = color + (180,)
    draw.arc([x0, y0, x0+2*r, y0+2*r], 180, 270, fill=ca, width=width)
    draw.arc([x1-2*r, y0, x1, y0+2*r], 270, 360, fill=ca, width=width)
    draw.arc([x1-2*r, y1-2*r, x1, y1], 0, 90, fill=ca, width=width)
    draw.arc([x0, y1-2*r, x0+2*r, y1], 90, 180, fill=ca, width=width)
    draw.line([x0+r, y0, x1-r, y0], fill=ca, width=width)
    draw.line([x0+r, y1, x1-r, y1], fill=ca, width=width)
    draw.line([x0, y0+r, x0, y1-r], fill=ca, width=width)
    draw.line([x1, y0+r, x1, y1-r], fill=ca, width=width)

def draw_circle(draw, cx, cy, label, color, radius=34):
    white = (255, 255, 255)
    draw.ellipse([cx-radius-3, cy-radius-3, cx+radius+3, cy+radius+3], fill=white)
    draw.ellipse([cx-radius, cy-radius, cx+radius, cy+radius], fill=color)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 30)
    except:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), label, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw//2, cy - th//2 - 2), label, fill=white, font=font)

def annotate_screenshot(img_path, modules, scroll_y, output_path):
    img = Image.open(img_path).convert('RGBA')
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)
    
    sidebar_right_px = int(positions['sidebar_right'] * DPR)
    
    for label, key, color_name in modules:
        if key not in positions:
            continue
        coords = positions[key]
        x0 = int(coords[0] * DPR) - 6
        y0 = int((coords[1] - scroll_y) * DPR) - 4
        x1 = int(coords[2] * DPR) + 6
        y1 = int((coords[3] - scroll_y) * DPR) + 4
        
        if y1 < 0 or y0 > img.height:
            continue
        
        y0 = max(y0, 4)
        y1 = min(y1, img.height - 4)
        
        color = COLORS[color_name]
        draw_rounded_rect(draw_ov, x0, y0, x1, y1, 10, color, 5)
    
    result = Image.alpha_composite(img, overlay).convert('RGB')
    draw_final = ImageDraw.Draw(result)
    
    circle_cx = sidebar_right_px - 10
    
    for label, key, color_name in modules:
        if key not in positions:
            continue
        coords = positions[key]
        y0 = int((coords[1] - scroll_y) * DPR)
        
        if y0 < 0 or y0 > img.height:
            continue
        
        cy = max(y0 + 36, 40)
        color = COLORS[color_name]
        draw_circle(draw_final, circle_cx, cy, label, color)
    
    result.save(output_path, quality=95)
    print(f'Saved: {output_path} ({result.size})')

OUT = '/Users/wongpeter/Desktop/usdt-exchange-page/diagram/screenshots/'

modules_s1 = [
    ('1', 'm1', 'blue'),
    ('2', 'm2', 'green'),
    ('3', 'm3', 'orange'),
    ('4', 'm4', 'purple'),
    ('5', 'm5', 'red'),
    ('6', 'm6', 'blue'),
]

annotate_screenshot('/tmp/screen1.png', modules_s1, scroll1_y, OUT + 'section1-annotated.png')

modules_s2 = [
    ('5', 'm5', 'red'),
    ('6', 'm6', 'blue'),
    ('7', 'm7', 'orange'),
]

annotate_screenshot('/tmp/screen2.png', modules_s2, scroll2_y, OUT + 'section2-annotated.png')
