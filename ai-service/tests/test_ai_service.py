import unittest
import os
import sys
from PIL import Image, ImageDraw
import numpy as np
import io

# Ensure ai-service root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.validators.quality import ImageQualityChecker
from app.validators.doc_validator import DocumentValidator
from app.cross_check.matcher import CrossDocumentMatcher, calculate_name_similarity
from app.hasher.perceptual import DocumentHasher
from app.ocr.extractors import DocumentExtractor

class TestSatyaPatraAIService(unittest.TestCase):

    def setUp(self):
        # Create a sharp high-contrast test image
        img = Image.new('RGB', (800, 600), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        draw.rectangle([50, 50, 750, 550], outline=(0, 0, 0), width=4)
        draw.text((100, 100), "GOVERNMENT OF INDIA - CASTE CERTIFICATE", fill=(0, 0, 0))
        draw.text((100, 150), "Name: Birsa Munda", fill=(0, 0, 0))
        draw.text((100, 200), "Tribe: Munda (Scheduled Tribe)", fill=(0, 0, 0))
        self.sharp_image = img

        # Create a blurry image
        blurry_np = np.full((300, 300, 3), 128, dtype=np.uint8)
        self.blurry_image = Image.fromarray(blurry_np)

    def test_image_quality_sharp(self):
        quality = ImageQualityChecker.assess_quality(self.sharp_image)
        self.assertGreater(quality["laplacian_variance"], 50.0)
        self.assertFalse(quality["is_blurry"])

    def test_image_quality_blur_detection(self):
        quality = ImageQualityChecker.assess_quality(self.blurry_image)
        self.assertTrue(quality["is_blurry"])
        self.assertGreaterEqual(len(quality["quality_flags"]), 2)

    def test_perceptual_hasher(self):
        hashes = DocumentHasher.compute_hashes(self.sharp_image)
        self.assertIn("phash", hashes)
        self.assertIn("dhash", hashes)
        self.assertIn("composite_hash", hashes)
        # Check hamming distance to itself is 0
        dist = DocumentHasher.compare_hashes(hashes["phash"], hashes["phash"])
        self.assertEqual(dist, 0)

    def test_fuzzy_name_matching(self):
        sim1 = calculate_name_similarity("Birsa Munda", "Birsa Munda")
        self.assertEqual(sim1, 1.0)

        # Minor spelling or salutation variation
        sim2 = calculate_name_similarity("Shri Birsa Munda", "Birsa Munda")
        self.assertGreaterEqual(sim2, 0.90)

        # Mismatch
        sim3 = calculate_name_similarity("Rani Kumari Soren", "Birsa Munda")
        self.assertLess(sim3, 0.50)

    def test_caste_extractor(self):
        text = "This is to certify that Shri Birsa Munda Son of Sugana Munda belongs to Munda Scheduled Tribe. Certificate No: ST/JH/2024/00819. Issued on 14/06/2023 by Tahsildar."
        extracted = DocumentExtractor.extract("caste_certificate", text)
        fields = extracted["extracted_fields"]
        self.assertEqual(fields["applicant_name"], "Birsa Munda")
        self.assertEqual(fields["tribe_name"], "Munda")
        self.assertEqual(fields["certificate_number"], "ST/JH/2024/00819")

    def test_document_validation(self):
        fields = {
            "applicant_name": "Birsa Munda",
            "category": "Scheduled Tribe",
            "tribe_name": "Munda",
            "certificate_number": "ST/2024/9014",
            "issuing_authority": "SDO"
        }
        res = DocumentValidator.validate("caste_certificate", {"extracted_fields": fields}, "Scheduled Tribe Certificate")
        self.assertTrue(res["is_valid"])
        self.assertEqual(len(res["missing_fields"]), 0)

if __name__ == '__main__':
    unittest.main()
