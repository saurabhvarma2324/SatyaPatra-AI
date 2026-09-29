from PIL import Image
import imagehash
from typing import Dict, Any

class DocumentHasher:
    """Computes perceptual hashes (phash, dhash, average_hash) to detect duplicate or re-used images"""

    @staticmethod
    def compute_hashes(image: Image.Image) -> Dict[str, Any]:
        # Convert to RGB to ensure uniform color space
        img_rgb = image.convert('RGB')
        
        phash_val = str(imagehash.phash(img_rgb))
        dhash_val = str(imagehash.dhash(img_rgb))
        ahash_val = str(imagehash.average_hash(img_rgb))

        return {
            "phash": phash_val,
            "dhash": dhash_val,
            "ahash": ahash_val,
            "composite_hash": f"{phash_val}_{dhash_val}"
        }

    @staticmethod
    def compare_hashes(hash1: str, hash2: str) -> int:
        """Returns Hamming distance between two hex hash strings. Distance <= 5 indicates strong duplicate image."""
        try:
            h1 = imagehash.hex_to_hash(hash1)
            h2 = imagehash.hex_to_hash(hash2)
            return h1 - h2
        except Exception:
            return 999
