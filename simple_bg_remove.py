from PIL import Image
import sys

def main():
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Simple threshold to remove solid black background
        # The GPT image background is pure black (0,0,0) or very close.
        # We will make anything very dark transparent.
        # But to avoid black fringe, let's use a soft threshold.
        max_val = max(item[0], item[1], item[2])
        if max_val < 35:
            # the closer to 0, the more transparent
            # at max_val = 0 -> alpha = 0
            # at max_val = 35 -> alpha = 255
            alpha = int((max_val / 35.0) * 255)
            newData.append((item[0], item[1], item[2], alpha))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

if __name__ == "__main__":
    main()
