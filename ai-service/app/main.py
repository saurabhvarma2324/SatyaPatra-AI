import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

from app.ocr.provider import HybridOCRManager
from app.ocr.extractors import DocumentExtractor
from app.validators.quality import ImageQualityChecker
from app.validators.doc_validator import DocumentValidator
from app.cross_check.matcher import CrossDocumentMatcher
from app.hasher.perceptual import DocumentHasher
from app.utils.image_downloader import load_image_from_source

app = FastAPI(
    title="SatyaPatra AI — Document Intelligence & OCR Engine",
    description="Microservice for ST Scholarship document OCR extraction, blur validation, fuzzy cross-checking, and perceptual hashing",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ocr_manager = HybridOCRManager()

# --- Request / Response Models ---
class ExtractRequest(BaseModel):
    document_url: str = Field(..., description="Cloudinary signed URL, base64, or file path")
    document_type: str = Field(..., description="caste_certificate, income_certificate, aadhaar_card, mark_sheet, bank_passbook, admission_proof")

class ValidateRequest(BaseModel):
    document_type: str
    extracted_fields: Dict[str, Any]
    raw_text: Optional[str] = ""

class CrossCheckRequest(BaseModel):
    application_data: Dict[str, Any]
    documents: List[Dict[str, Any]]

class ImageHashRequest(BaseModel):
    document_url: str

class PipelineRequest(BaseModel):
    document_url: str
    document_type: str

@app.get("/")
def root():
    return {
        "service": "SatyaPatra AI - OCR & Document Verification Microservice",
        "ministry": "Ministry of Tribal Affairs, Government of India",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "ocr_provider": "pytesseract_hybrid",
        "supported_documents": [
            "caste_certificate",
            "income_certificate",
            "aadhaar_card",
            "mark_sheet",
            "bank_passbook",
            "admission_proof"
        ]
    }

@app.post("/extract")
async def extract_document_fields(payload: ExtractRequest):
    try:
        image = await load_image_from_source(payload.document_url)
        raw_text, conf, provider_used = ocr_manager.process(image)
        embedded = getattr(image, '_embedded_text', '')
        if embedded:
            raw_text = embedded + "\n" + raw_text
            conf = max(conf, 0.95)
        
        extracted = DocumentExtractor.extract(payload.document_type, raw_text, conf)
        extracted["ocr_provider"] = provider_used
        
        return extracted
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Extraction failed: {str(e)}")

@app.post("/validate")
async def validate_document(payload: ValidateRequest):
    try:
        res = DocumentValidator.validate(
            payload.document_type,
            {"extracted_fields": payload.extracted_fields},
            payload.raw_text or ""
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validation failed: {str(e)}")

@app.post("/cross-check")
async def cross_check_documents(payload: CrossCheckRequest):
    try:
        res = CrossDocumentMatcher.cross_check(payload.application_data, payload.documents)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Cross-check failed: {str(e)}")

@app.post("/image-hash")
async def generate_image_hash(payload: ImageHashRequest):
    try:
        image = await load_image_from_source(payload.document_url)
        hashes = DocumentHasher.compute_hashes(image)
        return hashes
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Hashing failed: {str(e)}")

@app.post("/pipeline")
async def execute_document_pipeline(payload: PipelineRequest):
    """Executes Quality Assessment + Perceptual Hash + OCR Extraction + Validation in one call"""
    try:
        image = await load_image_from_source(payload.document_url)
        
        # 1. Quality & Blur Assessment
        quality = ImageQualityChecker.assess_quality(image)
        
        # 2. Perceptual Hash
        hashes = DocumentHasher.compute_hashes(image)
        
        # 3. OCR Text & Data
        raw_text, conf, provider = ocr_manager.process(image)
        embedded = getattr(image, '_embedded_text', '')
        if embedded:
            raw_text = embedded + "\n" + raw_text
            conf = max(conf, 0.95)

        extraction = DocumentExtractor.extract(payload.document_type, raw_text, conf)
        
        # 4. Document Specific Validation
        validation = DocumentValidator.validate(
            payload.document_type,
            extraction,
            raw_text
        )

        return {
            "document_type": payload.document_type,
            "quality_check": quality,
            "image_hashes": hashes,
            "ocr_confidence": extraction.get("confidence", conf),
            "ocr_provider": provider,
            "extracted_fields": extraction.get("extracted_fields", {}),
            "field_confidences": extraction.get("field_confidences", {}),
            "raw_text": raw_text,
            "validation": validation
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Pipeline error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
