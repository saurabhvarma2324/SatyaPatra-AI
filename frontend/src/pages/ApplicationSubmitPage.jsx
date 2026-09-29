import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import {
  FilePlus2,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  Eye,
  Trash2,
  Loader2,
  Lock,
} from "lucide-react";

const REQUIRED_DOC_TYPES = [
  {
    id: "caste_certificate",
    label: "Caste / Tribe Certificate",
    desc: "Issued by Tahsildar / SDO / DM",
  },
  {
    id: "income_certificate",
    label: "Income Certificate",
    desc: "Family income certificate for current FY",
  },
  {
    id: "aadhaar_card",
    label: "Aadhaar Card",
    desc: "UIDAI card with DOB & Name visible",
  },
  {
    id: "mark_sheet",
    label: "Latest Mark Sheet",
    desc: "Previous academic qualifying exam score",
  },
  {
    id: "bank_passbook",
    label: "Bank Passbook / Cancelled Cheque",
    desc: "Showing Name, Account No & IFSC",
  },
  {
    id: "admission_proof",
    label: "Admission Proof / Bonafide",
    desc: "College allotment or fee receipt",
  },
];

const ApplicationSubmitPage = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    applicantName: "",
    dob: "",
    gender: "",
    category: "Scheduled Tribe (ST)",
    subTribe: "",
    aadhaarNumber: "",
    income: "",
    course: "",
    institution: "",
    academicPercentage: "",
    bankAccountNumber: "",
    ifscCode: "",
    bankName: "",
    schemeId: "",
  });

  // Files State: { docType: { file: File, previewUrl: string } }
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const res = await api.get("/schemes");
        if (res.data?.success && res.data.schemes.length > 0) {
          setSchemes(res.data.schemes);
          setFormData((prev) => ({
            ...prev,
            schemeId: res.data.schemes[0]._id,
          }));
        }
      } catch (err) {
        console.error("Failed to load schemes:", err);
      }
    };
    loadSchemes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (docType, e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [docType]: {
          file,
          previewUrl: URL.createObjectURL(file),
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingDocuments = REQUIRED_DOC_TYPES.filter(
      (doc) => !uploadedFiles[doc.id]?.file,
    );
    if (missingDocuments.length > 0) {
      setError(
        `Upload all 6 required documents. Missing: ${missingDocuments.map((doc) => doc.label).join(", ")}`,
      );
      return;
    }

    setError("");
    setSubmitting(true);
    setUploadProgress(10);
    setStatusMessage("Creating application record in database...");
    let submissionStep = "creating the application";

    try {
      // 1. Create Application
      const appRes = await api.post("/applications", formData);
      if (!appRes.data?.success) throw new Error("Application creation failed");
      const application = appRes.data.application;

      setUploadProgress(30);
      setStatusMessage("Uploading verification documents to secure storage...");

      // 2. Upload all documents in one batch
      const docTypesToUpload = REQUIRED_DOC_TYPES.map((d) => d.id);
      const fd = new FormData();
      for (const docType of docTypesToUpload) {
        const file = uploadedFiles[docType].file;
        fd.append(docType, file, file.name);
      }

      submissionStep = "uploading verification documents";
      await api.post(`/applications/${application._id}/documents`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadProgress(70);

      setUploadProgress(75);
      setStatusMessage(
        "Triggering Automated AI OCR, Cross-Check & Risk Engine...",
      );

      // 3. Trigger Verification Pipeline
      submissionStep = "starting document verification";
      await api.post(`/applications/${application._id}/verify`);

      setUploadProgress(100);
      setStatusMessage(
        "Verification complete! Redirecting to Officer Verification Dossier...",
      );

      setTimeout(() => {
        navigate(`/applications/${application._id}`);
      }, 1000);
    } catch (err) {
      console.error("Submission Error:", err);
      const message =
        err.response?.data?.message || err.message || "Submission failed";
      setError(`Failed while ${submissionStep}: ${message}`);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FilePlus2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
            <span>ST Scholarship Application Submission</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill applicant particulars and upload all 6 required verification
            certificates.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submission & Verification Progress Overlay */}
      {submitting && (
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              <span className="truncate">{statusMessage}</span>
            </span>
            <span className="font-mono text-xs text-indigo-400 font-bold shrink-0">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full transition-all duration-500 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Step 1: Applicant Particulars */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-2">
            1. Applicant &amp; Academic Particulars
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Applicant Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Applicant Name *
              </label>
              <input
                type="text"
                required
                name="applicantName"
                value={formData.applicantName}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <input
                type="text"
                disabled
                value="Scheduled Tribe (ST)"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold"
              />
            </div>

            {/* Sub-Tribe */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tribe / Community Name *
              </label>
              <input
                type="text"
                required
                name="subTribe"
                value={formData.subTribe}
                onChange={handleInputChange}
                placeholder="e.g. Munda, Santhal, Oraon, Gond, Bhil"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Aadhaar Number (12 Digits) *
              </label>
              <input
                type="text"
                required
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleInputChange}
                placeholder="5432 9876 1234"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Family Annual Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Annual Family Income (INR) *
              </label>
              <input
                type="number"
                required
                name="income"
                value={formData.income}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Scheme Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Scholarship / Fellowship Scheme *
              </label>
              <select
                name="schemeId"
                value={formData.schemeId}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 truncate"
              >
                {schemes.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} (Limit: ₹{s.incomeLimit.toLocaleString("en-IN")})
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Percentage / CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Academic Score (% or CGPA*10) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                name="academicPercentage"
                value={formData.academicPercentage}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Degree / Course Name *
              </label>
              <input
                type="text"
                required
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Institution */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enrolled Institution / College *
              </label>
              <input
                type="text"
                required
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Bank Details Sub-grid */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bank Account Number *
              </label>
              <input
                type="text"
                required
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bank IFSC Code *
              </label>
              <input
                type="text"
                required
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Multi-Document Upload Dropzones */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-2">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
              2. Document Uploads (Direct Cloudinary Storage)
            </h2>
            <span className="text-[10px] sm:text-[11px] text-slate-400">
              All 6 documents required for verification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {REQUIRED_DOC_TYPES.map((doc) => {
              const fileObj = uploadedFiles[doc.id];
              return (
                <div
                  key={doc.id}
                  className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    fileObj
                      ? "bg-indigo-950/20 border-indigo-500/50"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate">
                        {doc.label}
                      </span>
                      {fileObj ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mb-3 line-clamp-2">
                      {doc.desc}
                    </p>
                  </div>

                  {/* Thumbnail Preview if present */}
                  {fileObj ? (
                    <div className="relative mb-2 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 h-28 flex items-center justify-center">
                      <img
                        src={fileObj.previewUrl}
                        alt={doc.label}
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFiles((prev) => {
                            const copy = { ...prev };
                            delete copy[doc.id];
                            return copy;
                          });
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-[10px] transition"
                        title="Remove Document"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center text-center transition bg-slate-900/50 mb-2">
                      <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-300">
                        Click to Upload
                      </span>
                      <span className="text-[9px] text-slate-400">
                        PNG, JPG, PDF up to 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileSelect(doc.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Submit & Run Verification */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <span>
              {submitting
                ? "Processing Application..."
                : "Submit & Execute AI Verification Pipeline"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationSubmitPage;
