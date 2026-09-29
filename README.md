# SatyaPatra AI &mdash; Automated ST Scholarship Document Verification & Cross-Examination Platform

> **"AI Extracts, Validates & Flags &mdash; Human Officers Decide."**  
> **Authority**: Ministry of Tribal Affairs, Government of India  
> **System**: National ST Higher Education Verification & Forensic Document Intelligence Directorate  
> **Category**: Production-Ready Government Enterprise Platform

---

## 🌟 Project Overview

**SatyaPatra AI** is an enterprise-grade, AI-powered document verification and cross-examination platform engineered for government verification officers scrutinizing scholarship and fellowship applications submitted by Scheduled Tribe (ST) applicants across schemes such as the *National Fellowship for ST Students (NFST)*, *Post-Matric Scholarship (PMS-ST)*, and *Top Class Education Scheme (TCES-ST)*.

The system strictly adheres to the principle that **AI assists while human officers decide**:
1. **Extracts** structured data from 6 document types using modular OCR (Tesseract / Google Cloud Vision ready).
2. **Validates** document completeness, certificate reference numbering, and image quality / blur detection (Laplacian variance).
3. **Cross-Checks** applicant details across all uploaded documents using fuzzy string matching (Levenshtein distance).
4. **Detects Duplicates & Fraud** using perceptual image hashing (dHash/pHash) and cross-application database lookups.
5. **Evaluates Scheme Eligibility** against dynamic, configurable criteria (income ceiling, ST category, minimum academic percentage/CGPA, approved course lists).
6. **Calculates Weighted Risk Score (0-100)** and produces a human-readable verification report with plain-English reasons.
7. **Empowers Officers** with a dual-pane side-by-side inspection dashboard (signed expiring Cloudinary URLs) and decision locking.
8. **Maintains Tamper-Evident Audit Trails** for compliance and administrative oversight.

---

## 🏛️ System Architecture

```
                       [ APPLICANT / OPERATOR ]
                                   │
                                   ▼
                    [ Multi-Document Upload Dropzone ]
                    - Caste / Tribe Certificate
                    - Income Certificate
                    - Aadhaar Card (Masked)
                    - Latest Academic Mark Sheet
                    - Bank Passbook / Cheque
                    - Admission Proof / Bonafide
                                   │
                                   ▼
                   [ Cloudinary Direct Stream Upload ]
                   (Signed, Time-Limited URLs & Zero Local Storage)
                                   │
                                   ▼
            ┌──────────────────────────────────────────────┐
            ▼                                              ▼
   [ Node.js Express REST API ]                [ Python FastAPI Microservice ]
   - Scheme Eligibility Evaluator              - Laplacian Blur & Sharpness Check
   - Multi-Factor Weighted Risk Score          - Tesseract / Vision OCR Extractor
   - Tamper-Evident Audit Logging              - Levenshtein Fuzzy Cross-Matcher
   - PDF Dossier Export Service                - Perceptual Hasher (dHash/pHash)
            │                                              │
            └──────────────────────┬───────────────────────┘
                                   ▼
                       [ MongoDB Atlas Database ]
                                   │
                                   ▼
                       [ VERIFICATION OFFICER ]
                  (Side-by-Side Document Inspection,
                   AI Flag Reviews & Decision Locking)
```

---

## 📱 100% Fully Responsive Layout

The frontend is built with Tailwind CSS and responsive design patterns:
- **Mobile Phones (< 640px)**: Collapsible hamburger drawer navigation, touch-optimized form dropzones, stacked dual-pane inspector, horizontal card scrolling.
- **Tablets (640px &mdash; 1024px)**: 2-column form grids, flexible KPI rows, touch zoom & pan controls.
- **Desktop (>= 1024px)**: Full dual-pane side-by-side document inspection viewport with real-time AI intelligence tabs.

---

## 🚀 Cloud Deployment Guide

### Option 1: Docker Compose (All-in-One Production)
```bash
docker-compose up --build -d
```
Services deployed:
- Frontend: `http://localhost:3000` (Nginx SPA)
- Backend: `http://localhost:5000` (Node.js)
- Python AI Engine: `http://localhost:8000` (FastAPI)
- Database: `localhost:27017` (MongoDB 7.0)

### Option 2: Render / Railway / Cloud Hosting
1. **Python Microservice (`ai-service/`)**:
   - Runtime: Python 3.11+
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. **Node Backend (`backend/`)**:
   - Runtime: Node.js 18+
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables:
     - `PORT=5000`
     - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/satyapatra_ai`
     - `JWT_SECRET=your_production_secret_key`
     - `AI_ENGINE_URL=https://your-ai-service.onrender.com`
     - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
     - `CLOUDINARY_API_KEY=your_api_key`
     - `CLOUDINARY_API_SECRET=your_api_secret`
3. **React Frontend (`frontend/`)**:
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL=https://your-backend.onrender.com/api`

---

## ⚡ Local Development Quick Start

### 1-Click Windows Launch:
Double-click [`start-dev.bat`](file:///c:/Users/Ashu%20Yadav/OneDrive/Desktop/ArthaDhristiAi/start-dev.bat) or run:
```powershell
.\start-dev.ps1
```

### Manual Terminal Commands:
```bash
# 1. AI Microservice
cd ai-service && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 2. Node Backend
cd backend && npm run dev

# 3. React Frontend
cd frontend && npm run dev
```

---

## 🧪 Automated Testing

```bash
# Run both Backend and AI test suites
npm test
```

---

## 👥 Demo Officer & Administrator Accounts

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Verification Officer** | `officer@satyapatra.gov.in` | `Password@123` | Review dossiers, inspect signed documents, decide & sign off |
| **Scheme Administrator** | `admin@satyapatra.gov.in` | `Password@123` | Manage scheme rules, view audit logs, view system stats |
| **Applicant** | `applicant@satyapatra.gov.in` | `Password@123` | Submit applications and upload 6 verification documents |

---

## 📜 Official Ministry Notice
SatyaPatra AI &copy; Ministry of Tribal Affairs, Government of India. All Rights Reserved.
