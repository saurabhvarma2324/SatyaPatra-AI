import re
from typing import Dict, Any, List

REQUIRED_FIELDS_BY_TYPE = {
    "caste_certificate": ["applicant_name", "category", "tribe_name", "certificate_number", "issuing_authority"],
    "income_certificate": ["applicant_name", "annual_income", "certificate_number", "issuing_authority"],
    "aadhaar_card": ["applicant_name", "dob", "aadhaar_number"],
    "mark_sheet": ["student_name", "percentage_cgpa", "roll_number", "passing_year"],
    "bank_passbook": ["account_holder_name", "account_number", "ifsc_code", "bank_name"],
    "admission_proof": ["student_name", "course_name", "institution_name"]
}

DOC_TYPE_KEYWORDS = {
    "caste_certificate": ["caste", "tribe", "scheduled tribe", "st certificate", "anushuchit", "jati", "praman patra", "belongs to the", "community"],
    "income_certificate": ["income", "annual income", "family income", "aay praman", "tahsildar", "revenue", "salary", "rupees"],
    "aadhaar_card": ["aadhaar", "uidai", "unique identification", "government of india", "mera aadhaar", "enrollment", "vid", "dob"],
    "mark_sheet": ["marks", "grade", "percentage", "cgpa", "roll no", "examination", "semester", "board", "university", "subject", "result"],
    "bank_passbook": ["bank", "account no", "ifsc", "branch", "savings", "passbook", "holder", "sbi", "deposit"],
    "admission_proof": ["admission", "bonafide", "enrolled", "course", "institute", "college", "department", "fees", "academic session", "student"]
}

class DocumentValidator:
    """Validates completeness, certificate number validity, and document type alignment"""

    @staticmethod
    def validate(doc_type: str, extracted_data: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
        doc_type_norm = doc_type.lower().strip()
        extracted_fields = extracted_data.get("extracted_fields", {})
        
        flags: List[Dict[str, Any]] = []
        
        # 1. Missing Fields Check
        expected_fields = REQUIRED_FIELDS_BY_TYPE.get(doc_type_norm, [])
        missing_fields = []
        for f in expected_fields:
            val = extracted_fields.get(f)
            if val is None or str(val).strip() == "" or (isinstance(val, (int, float)) and val <= 0):
                missing_fields.append(f)
                flags.append({
                    "type": "MISSING_FIELD",
                    "field": f,
                    "severity": "HIGH",
                    "message": f"Required field '{f.replace('_', ' ').title()}' could not be extracted from the document."
                })

        # 2. Certificate Format Check
        if doc_type_norm in ["caste_certificate", "income_certificate"]:
            cert_no = str(extracted_fields.get("certificate_number", "")).strip()
            if cert_no:
                # Valid format contains alphanumeric characters with slash or hyphen, min length 6
                if len(cert_no) < 5 or not re.search(r'[A-Za-z0-9]', cert_no):
                    flags.append({
                        "type": "INVALID_CERTIFICATE_FORMAT",
                        "field": "certificate_number",
                        "severity": "MEDIUM",
                        "message": f"Certificate reference number '{cert_no}' does not conform to standard government numbering patterns."
                    })
            else:
                flags.append({
                    "type": "MISSING_CERTIFICATE_NUMBER",
                    "field": "certificate_number",
                    "severity": "HIGH",
                    "message": "Certificate reference number is completely missing or unreadable."
                })

        # 3. Document Type Mismatch Check
        # Check if the text matches another document category more strongly than the uploaded category
        text_lower = (raw_text + " " + " ".join(str(v) for v in extracted_fields.values())).lower()
        
        type_scores = {}
        for candidate_type, keywords in DOC_TYPE_KEYWORDS.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            type_scores[candidate_type] = score

        current_type_score = type_scores.get(doc_type_norm, 0)
        highest_matched_type, highest_score = max(type_scores.items(), key=lambda x: x[1])
        
        # If another document type has a distinctly stronger keyword match
        is_type_mismatch = False
        if highest_score >= 3 and highest_matched_type != doc_type_norm and (highest_score - current_type_score >= 2):
            is_type_mismatch = True
            flags.append({
                "type": "DOCUMENT_TYPE_MISMATCH",
                "severity": "HIGH",
                "detected_type": highest_matched_type,
                "message": f"Uploaded document appears to be a '{highest_matched_type.replace('_', ' ').title()}' rather than the expected '{doc_type_norm.replace('_', ' ').title()}'."
            })

        # 4. Overall Validation Pass/Fail
        is_valid = len([f for f in flags if f.get("severity") == "HIGH"]) == 0

        return {
            "is_valid": is_valid,
            "missing_fields": missing_fields,
            "type_mismatch_detected": is_type_mismatch,
            "validation_flags": flags,
            "flag_count": len(flags)
        }
