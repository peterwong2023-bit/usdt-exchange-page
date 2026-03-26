from PIL import Image
import sys

img = Image.open(sys.argv[1])
print(f"Format: {img.format}, Mode: {img.mode}, Size: {img.size}")
if img.mode == 'RGBA':
    extrema = img.getextrema()
    print(f"Alpha extrema: {extrema[3]}")
