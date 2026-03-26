import sys
from PIL import Image

def main():
    input_path = sys.argv[1]
    img = Image.open(input_path).convert("RGB")
    width, height = img.size
    
    # Check left edge (column 0)
    left_edge_pixels = set()
    for y in range(height):
        left_edge_pixels.add(img.getpixel((0, y)))
        
    # Check right edge (column width-1)
    right_edge_pixels = set()
    for y in range(height):
        right_edge_pixels.add(img.getpixel((width - 1, y)))
        
    print(f"Left edge unique pixels: {len(left_edge_pixels)}")
    print(f"Right edge unique pixels: {len(right_edge_pixels)}")

if __name__ == "__main__":
    main()
