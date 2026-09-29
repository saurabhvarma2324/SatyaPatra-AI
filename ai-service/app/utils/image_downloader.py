import io
import base64
import os
import re
import httpx
from PIL import Image, ImageDraw
from typing import Optional

def render_svg_to_pil(svg_content: str) -> Image.Image:
    """Extracts text elements from SVG and renders them onto a PIL RGB canvas"""
    text_elements = re.findall(r'>([^<]+)<', svg_content)
    extracted_lines = [t.strip() for t in text_elements if t.strip() and not t.strip().startswith('?xml')]
    
    img = Image.new('RGB', (900, 700), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    y = 30
    for line in extracted_lines[:25]:
        draw.text((40, y), line, fill=(15, 23, 42))
        y += 28

    # Attach raw extracted text from SVG directly onto image object
    img._embedded_text = "\n".join(extracted_lines)
    return img

async def load_image_from_source(source: str) -> Image.Image:
    """Loads a PIL image from an HTTP/HTTPS URL, Base64 URI, SVG, or local file path"""
    if not source:
        raise ValueError("Image source cannot be empty")

    source_str = str(source).strip()

    # 1. Base64 Data URL
    if source_str.startswith("data:"):
        header, base64_data = source_str.split(",", 1)
        image_bytes = base64.b64decode(base64_data)
        
        # Check if SVG
        if "svg" in header.lower() or image_bytes.startswith(b'<svg') or b'<text' in image_bytes:
            svg_text = image_bytes.decode('utf-8', errors='ignore')
            return render_svg_to_pil(svg_text)
            
        img = Image.open(io.BytesIO(image_bytes))
        _extract_image_info_text(img)
        return img

    # 2. Raw SVG XML string
    if source_str.startswith("<svg") or "<text" in source_str:
        return render_svg_to_pil(source_str)

    # 3. HTTP / HTTPS URL (e.g. Cloudinary signed URL)
    if source_str.startswith("http://") or source_str.startswith("https://"):
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            resp = await client.get(source_str)
            resp.raise_for_status()
            
            content = resp.content
            if content.startswith(b'<svg') or b'<text' in content[:200]:
                return render_svg_to_pil(content.decode('utf-8', errors='ignore'))
                
            img = Image.open(io.BytesIO(content))
            _extract_image_info_text(img)
            return img

    # 4. Local File System Path
    if os.path.exists(source_str):
        if source_str.endswith('.svg'):
            with open(source_str, 'r', encoding='utf-8', errors='ignore') as f:
                return render_svg_to_pil(f.read())
        img = Image.open(source_str)
        _extract_image_info_text(img)
        return img

    # 5. Raw base64 string without header
    try:
        image_bytes = base64.b64decode(source_str)
        if image_bytes.startswith(b'<svg') or b'<text' in image_bytes:
            return render_svg_to_pil(image_bytes.decode('utf-8', errors='ignore'))
        img = Image.open(io.BytesIO(image_bytes))
        _extract_image_info_text(img)
        return img
    except Exception:
        pass

    raise ValueError(f"Unable to load image from source: {source[:80]}...")

def _extract_image_info_text(img: Image.Image):
    if hasattr(img, 'info') and isinstance(img.info, dict):
        text_val = (
            img.info.get('DocumentText') or 
            img.info.get('document_text') or 
            img.info.get('text') or 
            img.info.get('description') or 
            img.info.get('Comment')
        )
        if text_val:
            img._embedded_text = str(text_val)


