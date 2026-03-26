import sys
from PIL import Image

def main():
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    # Just removing absolute black or very close to it (<10 for RGB)
    # The platform in the user's latest image has some white/gray/blue
    # So a very tight threshold on black will only remove the pure black background
    for item in datas:
        if item[0] < 12 and item[1] < 12 and item[2] < 12:
            new_data.append((0, 0, 0, 0)) # transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

if __name__ == "__main__":
    main()
