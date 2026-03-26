import sys
from PIL import Image

def flood_fill_bg(img, threshold=20):
    # img is RGBA
    width, height = img.size
    pixels = img.load()
    
    # We will do a simple BFS flood fill from the edges to find contiguous black pixels
    visited = set()
    queue = []
    
    # Add borders
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
        
    for q in queue:
        visited.add(q)
        
    transparent_pixels = set()
    
    while queue:
        x, y = queue.pop(0)
        r, g, b, a = pixels[x, y]
        
        # Check if it's "black" enough
        if r < threshold and g < threshold and b < threshold:
            transparent_pixels.add((x, y))
            pixels[x, y] = (0, 0, 0, 0)
            
            # Neighbors
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = x+dx, y+dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))

    # Feathering step to smooth the edges a bit
    for x, y in list(transparent_pixels):
        # check if it touches non-transparent
        touches_solid = False
        for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
            nx, ny = x+dx, y+dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in transparent_pixels:
                    touches_solid = True
                    break
        if touches_solid:
            # We could soften it, but let's see how raw flood fill looks
            pass

    return img

def main():
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    img = Image.open(input_path).convert("RGBA")
    # Using the original image provided in the new prompt
    img = flood_fill_bg(img, threshold=40)
    
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

if __name__ == "__main__":
    main()
