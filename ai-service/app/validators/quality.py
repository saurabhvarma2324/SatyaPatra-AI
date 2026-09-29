import cv2
import numpy as np
from PIL import Image
from typing import Dict, Any

class ImageQualityChecker:
    """Calculates blurriness, resolution adequacy, and contrast for government document verification"""

    @staticmethod
    def assess_quality(image: Image.Image) -> Dict[str, Any]:
        img_np = np.array(image.convert('RGB'))
        height, width = img_np.shape[:2]
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        
        # 1. Laplacian Variance for Blur Detection
        # Clean sharp document images typically have variance > 100.
        # Variance < 70 indicates noticeable blur/motion/out-of-focus capture.
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        variance = float(laplacian.var())
        
        is_blurry = variance < 75.0
        
        # 2. Resolution Check
        is_low_resolution = width < 500 or height < 500
        
        # 3. Brightness / Contrast Check
        mean_brightness = float(np.mean(gray))
        contrast = float(np.std(gray))
        is_poor_contrast = contrast < 25.0
        
        flags = []
        if is_blurry:
            flags.append({
                "type": "IMAGE_BLURRY",
                "severity": "HIGH" if variance < 40 else "MEDIUM",
                "message": f"Document image appears blurry or out of focus (sharpness score: {round(variance, 1)} / threshold 75.0)."
            })
        if is_low_resolution:
            flags.append({
                "type": "LOW_RESOLUTION",
                "severity": "MEDIUM",
                "message": f"Document resolution is low ({width}x{height}px). Minimum recommended is 600x600px."
            })
        if is_poor_contrast:
            flags.append({
                "type": "POOR_CONTRAST",
                "severity": "LOW",
                "message": f"Document contrast is suboptimal (contrast index: {round(contrast, 1)})."
            })

        quality_score = max(0, min(100, int(100 - (0 if not is_blurry else (50 if variance < 40 else 25)) - (25 if is_low_resolution else 0) - (15 if is_poor_contrast else 0))))

        return {
            "quality_score": quality_score,
            "laplacian_variance": round(variance, 2),
            "dimensions": {"width": width, "height": height},
            "is_blurry": is_blurry,
            "is_low_resolution": is_low_resolution,
            "mean_brightness": round(mean_brightness, 2),
            "contrast": round(contrast, 2),
            "quality_flags": flags
        }
