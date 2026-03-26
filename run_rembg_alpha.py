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
    
    # Use alpha matting to remove the black fringe smoothly
    output_img = remove(
        input_img, 
        session=session, 
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=7
    )
    output_img.save(output_path, "PNG")
    print(f"Successfully processed with alpha matting and saved to {output_path}")

if __name__ == "__main__":
    main()
