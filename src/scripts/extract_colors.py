from PIL import Image
import numpy as np
import colorsys
import json
import os

def extract_hair_color(image_path):
    img = Image.open(image_path).convert('RGB')
    width, height = img.size
    
    # Zona central donde típicamente está el cabello
    crop_box = (
        int(width * 0.3),   # left
        int(height * 0.1),  # top  
        int(width * 0.7),   # right
        int(height * 0.6)   # bottom
    )
    
    cropped = img.crop(crop_box)
    pixels = np.array(cropped).reshape(-1, 3)
    
    # Filtrar pixels que NO son cabello
    filtered = []
    for pixel in pixels:
        r, g, b = pixel / 255.0
        brightness = (r + g + b) / 3
        saturation = max(r, g, b) - min(r, g, b)
        
        # Excluir fondos blancos y piel
        if brightness > 0.9 and saturation < 0.1:
            continue
        if brightness < 0.15:  # Muy oscuro
            continue
            
        filtered.append(pixel)
    
    if not filtered:
        return None
        
    # Promedio de los pixels filtrados
    filtered = np.array(filtered)
    avg_color = np.median(filtered, axis=0)  # Mediana es más robusta
    
    r, g, b = avg_color / 255.0
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    
    return {
        'hex': '#{:02x}{:02x}{:02x}'.format(
            int(avg_color[0]), 
            int(avg_color[1]), 
            int(avg_color[2])
        ),
        'hue': round(h * 360),
        'saturation': round(s * 100),
        'lightness': round(l * 100)
    }

# Ejecutar
products_dir = r'C:\Users\pedro\Documents\prot-ai-hair\public\products'
results = []

for filename in sorted(os.listdir(products_dir)):
    if filename.endswith(('.png', '.jpg')):
        code = filename.split('.')[0]
        color = extract_hair_color(os.path.join(products_dir, filename))
        
        if color:
            # Mapear códigos a nombres
            names = {
                '60': 'Rubio Claro',
                '01': 'Negro Intenso (Negro Ébano)',
                '613': 'Rubio Platino',
                '1B': 'Negro Natural (Negro Seda)',
                '02': 'Marrón oscuro (Castaño Expresso)',
                '04': 'Castaño Chocolate Intenso',
                '05': 'Castaño Medio (Castaño caramelo)',
                '06': 'Castaño (Castaño Avellana)',
                '08': 'Castaño Claro Cenizo (Castaño Humo)',
                '10': 'Castaño Claro (Castaño Miel Suave)',
                '12': 'Rubio Cenizo Oscuro',
                '14': 'Castaño Claro Dorado',
                '16': 'Rubio Oscuro',
                '27': 'Rubio Oscuro Dorado',
                '33': 'Rojo Cobrizo Intenso',
                '35': 'Rojo Cobrizo',
                '37': 'Rojo Caoba Oscuro',
                '99J': 'Rojo oscuro (Vino Burdeos)',
                '2-613': 'Castaño Claro Cenizo',
                '04-613': 'Castaño Medio con Reflejos Rubio Platinado',
                '06-613': 'Castaño con Reflejos Dorados Platinados',
                '27-613': 'Rubio Oscuro Dorado con Reflejo Rubio Platinado'
            }
            
            results.append({
                'id': code,
                'name': names.get(code, f'Producto {code}'),
                'code': f'#{code}',
                'image': f'/products/{filename}',
                'colorHex': color['hex'],
                'hue': color['hue'],
                'saturation': color['saturation'],
                'lightness': color['lightness']
            })
            
            print(f"{code}: {color}")

# Guardar
with open('src/data/products.json', 'w') as f:
    json.dump(results, f, indent=2)