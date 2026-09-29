import re
from typing import Dict, Any, List
try:
    import Levenshtein
except ImportError:
    # Fallback pure python Levenshtein distance if C-extension not available
    class Levenshtein:
        @staticmethod
        def distance(s1: str, s2: str) -> int:
            if len(s1) < len(s2):
                return Levenshtein.distance(s2, s1)
            if len(s2) == 0:
                return len(s1)
            previous_row = range(len(s2) + 1)
            for i, c1 in enumerate(s1):
                current_row = [i + 1]
                for j, c2 in enumerate(s2):
                    insertions = previous_row[j + 1] + 1
                    deletions = current_row[j] + 1
                    substitutions = previous_row[j] + (c1 != c2)
                    current_row.append(min(insertions, deletions, substitutions))
                previous_row = current_row
            return previous_row[-1]

def normalize_string(s: str) -> str:
    if not s:
        return ""
    # Strip salutations and punctuation
    cleaned = re.sub(r'^(shri|smt|kumari|mr|ms|dr)\.?\s+', '', s.strip(), flags=re.I)
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', cleaned)
    return " ".join(cleaned.lower().split())

def calculate_name_similarity(name1: str, name2: str) -> float:
    n1 = normalize_string(name1)
    n2 = normalize_string(name2)
    
    if not n1 or not n2:
        return 0.0
    if n1 == n2:
        return 1.0

    # Token sort match: order of tokens doesn't fail match (e.g. "Birsa Munda" vs "Munda Birsa")
    tokens1 = sorted(n1.split())
    tokens2 = sorted(n2.split())
    if tokens1 == tokens2:
        return 0.98

    s1 = " ".join(tokens1)
    s2 = " ".join(tokens2)
    max_len = max(len(s1), len(s2))
    if max_len == 0:
        return 1.0
        
    dist = Levenshtein.distance(s1, s2)
    sim = max(0.0, 1.0 - (dist / max_len))
    return round(sim, 2)

def normalize_dob(dob_str: str) -> str:
    if not dob_str:
        return ""
    dob_clean = str(dob_str).strip()
    # 1. Check ISO YYYY-MM-DD format
    m_iso = re.search(r'(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})', dob_clean)
    if m_iso:
        y, mth, d = m_iso.group(1), m_iso.group(2).zfill(2), m_iso.group(3).zfill(2)
        return f"{d}/{mth}/{y}"
    # 2. Check DD/MM/YYYY format
    m = re.search(r'(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})', dob_clean)
    if m:
        d, mth, y = m.group(1).zfill(2), m.group(2).zfill(2), m.group(3)
        if len(y) == 2:
            y = "20" + y if int(y) < 50 else "19" + y
        return f"{d}/{mth}/{y}"
    # 3. If only year
    y_m = re.search(r'\b(19\d{2}|20\d{2})\b', dob_clean)
    if y_m:
        return y_m.group(1)
    return dob_clean

class CrossDocumentMatcher:
    """Performs multi-document cross-examination and consistency scoring"""

    @staticmethod
    def cross_check(application_data: Dict[str, Any], documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        app_name = application_data.get("applicantName", "")
        app_dob = application_data.get("dob", "")
        app_category = application_data.get("category", "ST")
        app_bank_acc = application_data.get("bankAccountNumber", "")
        app_income = application_data.get("income", 0)

        name_comparisons = []
        dob_comparisons = []
        category_comparisons = []
        bank_comparisons = []
        flags = []

        # Compare extracted fields from each uploaded document against application and each other
        doc_names = {}
        for doc in documents:
            dtype = doc.get("documentType", "")
            fields = doc.get("extractedFields", {}) or {}
            
            # 1. Name Check
            extracted_name = fields.get("applicant_name") or fields.get("student_name") or fields.get("account_holder_name") or ""
            if extracted_name:
                sim = calculate_name_similarity(app_name, extracted_name)
                is_match = sim >= 0.75 # >= 75% similarity allows minor OCR/spelling variances
                doc_names[dtype] = extracted_name
                name_comparisons.append({
                    "documentType": dtype,
                    "extractedName": extracted_name,
                    "targetName": app_name,
                    "similarityScore": round(sim * 100, 1),
                    "isMatch": is_match
                })
                if not is_match:
                    flags.append({
                        "type": "NAME_MISMATCH",
                        "severity": "HIGH",
                        "documentType": dtype,
                        "message": f"Name on {dtype.replace('_', ' ').title()} ('{extracted_name}') does not match Application form ('{app_name}') (Similarity: {round(sim * 100, 1)}%)."
                    })

            # 2. DOB Check (Aadhaar, Mark Sheet)
            if dtype in ["aadhaar_card", "mark_sheet"]:
                extracted_dob = fields.get("dob") or fields.get("passing_year")
                if dtype == "aadhaar_card" and extracted_dob:
                    norm_app_dob = normalize_dob(app_dob)
                    norm_ext_dob = normalize_dob(extracted_dob)
                    dob_match = (norm_app_dob == norm_ext_dob) or (norm_app_dob[-4:] == norm_ext_dob[-4:] if len(norm_app_dob) >= 4 and len(norm_ext_dob) >= 4 else False)
                    dob_comparisons.append({
                        "documentType": dtype,
                        "extractedDob": extracted_dob,
                        "applicationDob": app_dob,
                        "isMatch": dob_match
                    })
                    if not dob_match:
                        flags.append({
                            "type": "DOB_MISMATCH",
                            "severity": "HIGH",
                            "documentType": dtype,
                            "message": f"Date of Birth on Aadhaar ('{extracted_dob}') does not match Application record ('{app_dob}')."
                        })

            # 3. Category & Tribe Check
            if dtype == "caste_certificate":
                ext_cat = fields.get("category", "")
                ext_tribe = fields.get("tribe_name", "")
                # Tribe or Category must denote Scheduled Tribe
                cat_valid = "tribe" in ext_cat.lower() or "st" in ext_cat.lower() or len(ext_tribe) > 2
                category_comparisons.append({
                    "documentType": dtype,
                    "extractedCategory": ext_cat,
                    "extractedTribe": ext_tribe,
                    "applicationCategory": app_category,
                    "isMatch": cat_valid
                })
                if not cat_valid:
                    flags.append({
                        "type": "CATEGORY_MISMATCH",
                        "severity": "HIGH",
                        "documentType": dtype,
                        "message": f"Caste certificate indicates category '{ext_cat}', which is not recognized as Scheduled Tribe (ST)."
                    })

            # 4. Bank Account Number Check
            if dtype == "bank_passbook":
                ext_acc = fields.get("account_number", "")
                if ext_acc and app_bank_acc:
                    acc_clean_ext = re.sub(r'\D', '', str(ext_acc))
                    acc_clean_app = re.sub(r'\D', '', str(app_bank_acc))
                    bank_match = (acc_clean_ext == acc_clean_app) or (acc_clean_ext[-6:] == acc_clean_app[-6:])
                    bank_comparisons.append({
                        "documentType": dtype,
                        "extractedAccount": ext_acc,
                        "applicationAccount": app_bank_acc,
                        "isMatch": bank_match
                    })
                    if not bank_match:
                        flags.append({
                            "type": "BANK_ACCOUNT_MISMATCH",
                            "severity": "HIGH",
                            "documentType": dtype,
                            "message": f"Bank Account number on Passbook ('{ext_acc}') does not match account in application form ('{app_bank_acc}')."
                        })

            # 5. Income Check
            if dtype == "income_certificate":
                ext_inc = fields.get("annual_income", 0)
                if ext_inc and app_income:
                    inc_diff = abs(float(ext_inc) - float(app_income))
                    # Allow minor variation, but flag significant discrepancy > 20%
                    if inc_diff > (0.2 * float(app_income)) and inc_diff > 20000:
                        flags.append({
                            "type": "INCOME_DISCREPANCY",
                            "severity": "MEDIUM",
                            "documentType": dtype,
                            "message": f"Declared income ₹{app_income:,} differs significantly from Certificate income ₹{int(ext_inc):,}."
                        })

        # Calculate overall cross-check consistency score
        total_checks = len(name_comparisons) + len(dob_comparisons) + len(category_comparisons) + len(bank_comparisons)
        passed_checks = (
            sum(1 for c in name_comparisons if c["isMatch"]) +
            sum(1 for c in dob_comparisons if c["isMatch"]) +
            sum(1 for c in category_comparisons if c["isMatch"]) +
            sum(1 for c in bank_comparisons if c["isMatch"])
        )
        consistency_score = round((passed_checks / total_checks * 100.0), 1) if total_checks > 0 else 100.0

        return {
            "consistency_score": consistency_score,
            "name_comparisons": name_comparisons,
            "dob_comparisons": dob_comparisons,
            "category_comparisons": category_comparisons,
            "bank_comparisons": bank_comparisons,
            "cross_check_flags": flags,
            "flag_count": len(flags)
        }
