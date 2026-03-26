import os
os.environ["ORT_COREML_ENABLE"] = "0"
from rembg import remove, new_session
from PIL import Image
import sys

def main():
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    input_img = Image.open(input_path)
    session = new_session("u2net", providers=["CPUExecutionProvider"])
    output_img = remove(input_img, session=session)
    output_img.save(output_path, "PNG")
    print(f"Successfully processed and saved to {output_path}")

if __name__ == "__main__":
    main()
