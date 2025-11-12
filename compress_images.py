from PIL import Image
import os

def compress_images(input_dir, output_dir, quality=85, max_size=(800, 800)):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            
            try:
                with Image.open(input_path) as img:
                    img.thumbnail(max_size, Image.Resampling.LANCZOS)
                    
                    if filename.lower().endswith('.png'):
                        img = img.convert('RGB')
                        output_path = output_path.replace('.png', '.jpg')
                    
                    img.save(output_path, 'JPEG', quality=quality, optimize=True)
                    
                    original_size = os.path.getsize(input_path) / 1024
                    compressed_size = os.path.getsize(output_path) / 1024
                    print(f"{filename}: {original_size:.1f}KB → {compressed_size:.1f}KB")
            
            except Exception as e:
                print(f"Error con {filename}: {e}")

compress_images('public/products', 'public/products_compressed')