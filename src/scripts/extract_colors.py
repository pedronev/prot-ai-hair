from PIL import Image
import colorsys
import json
import os

def get_dominant_color(image_path):
    img = Image.open(image_path)
    img = img.resize((150, 150))
    pixels = list(img.getdata())
    
    r_total = sum(p[0] for p in pixels) / len(pixels)
    g_total = sum(p[1] for p in pixels) / len(pixels)
    b_total = sum(p[2] for p in pixels) / len(pixels)
    
    h, l, s = colorsys.rgb_to_hls(r_total/255, g_total/255, b_total/255)
    
    return {
        'hex': '#{:02x}{:02x}{:02x}'.format(int(r_total), int(g_total), int(b_total)),
        'hue': int(h * 360),
        'saturation': int(s * 100),
        'lightness': int(l * 100)
    }

products_dir = r'C:\Users\pedro\Documents\prot-ai-hair\public\products'

for filename in sorted(os.listdir(products_dir)):
    if filename.endswith(('.png', '.jpg')):
        code = filename.split('.')[0]
        color_data = get_dominant_color(os.path.join(products_dir, filename))
        print(f'"{code}": {json.dumps(color_data, indent=2)},')