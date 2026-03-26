from rembg import remove
from PIL import Image
import sys

def main():
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    input_img = Image.open(input_path)
    # The default rembg behavior does an AI matting of the subject
    output_img = remove(input_img)
    output_img.save(output_path, "PNG")
    print(f"Successfully processed and saved to {output_path}")

if __name__ == "__main__":
    main()
