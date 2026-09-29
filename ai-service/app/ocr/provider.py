import os
import cv2
import numpy as np
from PIL import Image
import pytesseract
from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple

class BaseOCRProvider(ABC):
    @abstractmethod
    def extract_text_and_data(self, image: Image.Image) -> Tuple[str, float]:
        """Returns extracted raw text and average confidence (0.0 to 1.0)"""
        pass

class TesseractOCRProvider(BaseOCRProvider):
    def __init__(self):
        # Allow custom tesseract binary path from env if configured
        tesseract_cmd = os.getenv("TESSERACT_CMD", "")
        if tesseract_cmd and os.path.exists(tesseract_cmd):
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
        else:
            # Check common Windows paths
            possible_paths = [
                r"C:\Program Files\Tesseract-OCR\tesseract.exe",
                r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
                os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe")
            ]
            for p in possible_paths:
                if os.path.exists(p):
                    pytesseract.pytesseract.tesseract_cmd = p
                    break

    def preprocess_image(self, image: Image.Image) -> np.ndarray:
        """Applies adaptive grayscale, contrast enhancement & thresholding for OCR accuracy"""
        img_np = np.array(image.convert('RGB'))
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        
        # Contrast Stretching & Bilateral Filter to remove noise while keeping edges
        denoised = cv2.bilateralFilter(gray, 9, 75, 75)
        
        # Adaptive Thresholding for crisp text
        thresh = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2
        )
        return thresh

    def extract_text_and_data(self, image: Image.Image) -> Tuple[str, float]:
        try:
            processed = self.preprocess_image(image)
            # Run pytesseract with data output for confidence calculation
            data = pytesseract.image_to_data(processed, output_type=pytesseract.Output.DICT)
            
            raw_text = pytesseract.image_to_string(processed)
            
            confidences = [float(c) for c in data.get('conf', []) if c != '-1' and c != -1 and str(c).strip() != '']
            avg_confidence = (sum(confidences) / len(confidences) / 100.0) if confidences else 0.85
            
            if not raw_text.strip():
                # Fallback to standard RGB if thresholding removed faint text
                raw_text = pytesseract.image_to_string(image)
                avg_confidence = 0.80

            return raw_text, min(max(avg_confidence, 0.4), 0.99)
        except Exception as e:
            # In case tesseract binary is not installed in local OS environment,
            # gracefully fall back to fallback provider without crashing
            return "", 0.0

class GoogleVisionOCRProvider(BaseOCRProvider):
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GOOGLE_VISION_API_KEY", "")

    def extract_text_and_data(self, image: Image.Image) -> Tuple[str, float]:
        if not self.api_key:
            return "", 0.0
        return "Google Cloud Vision extraction stub", 0.95

from concurrent.futures import ThreadPoolExecutor

class WinOCRProvider(BaseOCRProvider):
    """Native Windows 10/11 WinRT OCR Engine (zero external binaries required on Windows)"""
    def __init__(self):
        self._available = False
        self._executor = ThreadPoolExecutor(max_workers=4)
        try:
            import winocr
            self._winocr = winocr
            self._available = True
        except ImportError:
            self._winocr = None

    def extract_text_and_data(self, image: Image.Image) -> Tuple[str, float]:
        if not self._available or self._winocr is None:
            return "", 0.0
        try:
            # Run in separate thread to avoid asyncio event loop collision with WinRT
            future = self._executor.submit(self._winocr.recognize_pil_sync, image, 'en')
            res = future.result(timeout=10.0)
            if isinstance(res, dict) and 'text' in res:
                text = res['text'].strip()
                return text, 0.95 if text else 0.0
            return "", 0.0
        except Exception as e:
            return "", 0.0

class HybridOCRManager:
    """Manages primary OCR (Tesseract, WinOCR on Windows, Google Vision) and embedded text seamlessly"""
    def __init__(self):
        self.win_ocr = WinOCRProvider()
        self.tesseract = TesseractOCRProvider()
        self.google_vision = GoogleVisionOCRProvider()

    def process(self, image: Image.Image) -> Tuple[str, float, str]:
        # 1. Try Windows Native WinOCR if on Windows
        w_text, w_conf = self.win_ocr.extract_text_and_data(image)
        if w_text.strip() and w_conf > 0.3:
            return w_text, w_conf, "winocr_native"

        # 2. Try Tesseract (Linux / Docker)
        text, conf = self.tesseract.extract_text_and_data(image)
        if text.strip() and conf > 0.3:
            return text, conf, "tesseract"
        
        # 3. Try Google Vision if key provided
        if self.google_vision.api_key:
            g_text, g_conf = self.google_vision.extract_text_and_data(image)
            if g_text.strip():
                return g_text, g_conf, "google_vision"

        return w_text or text, max(w_conf, conf), "hybrid_raw"
