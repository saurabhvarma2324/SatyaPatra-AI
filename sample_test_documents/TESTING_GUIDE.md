# 📑 SatyaPatra AI — Sample Test Documents & Verification Guide

This directory contains realistic sample documents designed for testing all features of the **SatyaPatra AI Verification & Cross-Examination Platform**.

---

## 📁 Document Folders Overview

```
sample_test_documents/
│
├── 01_Genuine_ST_Applicant_Birsa_Munda/       <-- Complete matching authentic set
│   ├── 01_Caste_Certificate_ST_Munda.png
│   ├── 01_Caste_Certificate_ST_Munda.svg
│   ├── 02_Income_Certificate_120000.png
│   ├── 02_Income_Certificate_120000.svg
│   ├── 03_Aadhaar_Card_Birsa_Munda.png
│   ├── 03_Aadhaar_Card_Birsa_Munda.svg
│   ├── 04_Marksheet_78_Percent.png
│   ├── 04_Marksheet_78_Percent.svg
│   ├── 05_Bank_Passbook_SBI.png
│   ├── 05_Bank_Passbook_SBI.svg
│   ├── 06_Admission_Bonafide_NIT_Ranchi.png
│   └── 06_Admission_Bonafide_NIT_Ranchi.svg
│
├── 02_Fraud_Discrepancy_Applicant/            <-- Injected cross-check & eligibility defects
│   ├── 01_Caste_Certificate_General_Category.png  (Invalid Category: General)
│   ├── 02_Income_Certificate_High_Income_950000.png (Income ₹9.5L > ₹6L Limit)
│   ├── 03_Aadhaar_Card_Mismatched_Name_Suresh.png  (Name Mismatch: Suresh Kumar)
│   ├── 04_Marksheet_Mismatched_Candidate.png      (Low %: 42%, Name: Rajesh)
│   ├── 05_Bank_Passbook_Mismatched_Account.png    (Account holder: Vikram Singh)
│   └── 06_Random_Utility_Bill_Non_Document.png    (Electricity bill instead of bonafide)
│
└── 03_Blurry_Low_Quality/                     <-- Blur test for Laplacian filter
    └── 01_Blurry_Degraded_Caste_Certificate.png   (Sharpness < 75.0, Blurry Alert)
```

---

## 🚀 How to Test in the Web Application

### Scenario A: Testing a Clean Genuine ST Application (Low Risk 🟢)

1. Open **[http://localhost:3000/apply](http://localhost:3000/apply)** in your browser (or login as Applicant).
2. Click **"Preset: Clean ST Application"** button (or manually fill using values from `sample_applicant_data.json`).
3. Drag & drop or browse to select each document from `sample_test_documents/01_Genuine_ST_Applicant_Birsa_Munda/`.
4. Click **"Submit Application"**.
5. Switch / Login as Officer (`officer@satyapatra.gov.in` / `Password@123`).
6. Click **"Inspect & Verify"** on the application.
7. **Expected Result**:
   - Risk Score: **`< 20 / 100` (LOW RISK - Emerald Green)**
   - Cross-Document Consistency: **`> 95%`**
   - Scheme Eligibility: **`ELIGIBLE`**

---

### Scenario B: Testing Fraud & Mismatched Document Flags (High Risk 🔴)

1. Open **[http://localhost:3000/apply](http://localhost:3000/apply)**.
2. Fill the form with name **Birsa Munda**.
3. Upload documents from `sample_test_documents/02_Fraud_Discrepancy_Applicant/`:
   - Caste Certificate: `01_Caste_Certificate_General_Category.png`
   - Income Certificate: `02_Income_Certificate_High_Income_950000.png`
   - Aadhaar Card: `03_Aadhaar_Card_Mismatched_Name_Suresh.png`
   - Marksheet: `04_Marksheet_Mismatched_Candidate.png`
   - Bank Passbook: `05_Bank_Passbook_Mismatched_Account.png`
   - Admission Proof: `06_Random_Utility_Bill_Non_Document.png`
4. Click **"Submit Application"**.
5. Login as Officer and open the application dossier.
6. **Expected Result**:
   - Risk Score: **`100 / 100` (HIGH RISK - Crimson Red)**
   - Flags Raised:
     - `INVALID_CATEGORY`: Caste certificate shows General Category
     - `INCOME_LIMIT_EXCEEDED`: ₹9,50,000 exceeds ₹6,00,000 limit
     - `NAME_MISMATCH`: Aadhaar name `Suresh Kumar Verma` vs `Birsa Munda`
     - `DOB_MISMATCH`: DOB `01/01/1998` vs `15/11/2002`
     - `BANK_ACCOUNT_MISMATCH`: Bank passbook belongs to `Vikram Singh`
     - `DOCUMENT_TYPE_MISMATCH`: Electricity bill does not contain student admission fields

---

### Scenario C: Testing Blurry Document Detection 🔍

1. Upload `03_Blurry_Low_Quality/01_Blurry_Degraded_Caste_Certificate.png` as the Caste Certificate.
2. Inspect the application in Officer review mode.
3. **Expected Result**:
   - The AI quality panel highlights: **`IMAGE_BLURRY` (Sharpness score < 75.0)** with recommendation for officer to request clear resubmission.
