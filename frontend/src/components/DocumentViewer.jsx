import React, { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const DOC_TYPE_LABELS = {
  caste_certificate: "Caste / Tribe Certificate",
  income_certificate: "Income Certificate",
  aadhaar_card: "Aadhaar Card",
  mark_sheet: "Latest Mark Sheet",
  bank_passbook: "Bank Passbook",
  admission_proof: "Admission Proof",
};

const getPdfPreviewUrl = (url) => {
  if (!url.includes("/image/upload/")) return url;

  const queryIndex = url.search(/[?#]/);
  const path = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const suffix = queryIndex === -1 ? "" : url.slice(queryIndex);
  let previewPath = path.replace("/image/upload/", "/image/upload/pg_1/");

  if (/\.pdf$/i.test(previewPath)) {
    previewPath = previewPath.replace(/\.pdf$/i, ".jpg");
  } else {
    previewPath = `${previewPath}.jpg`;
  }

  return `${previewPath}${suffix}`;
};

const DocumentViewer = ({ documents = [], selectedType, onSelectType }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filterMode, setFilterMode] = useState("normal"); // 'normal' | 'enhance' | 'invert'
  const [failedPreviewUrl, setFailedPreviewUrl] = useState("");

  const activeDoc =
    documents.find((d) => d.documentType === selectedType) || documents[0];
  const documentUrl =
    activeDoc?.cloudinaryUrl || activeDoc?.signedViewUrl || "";
  const documentUrlPath = documentUrl.split(/[?#]/)[0];
  const fileName = activeDoc?.originalFileName || documentUrlPath;
  const isPdf =
    activeDoc?.format?.toLowerCase() === "pdf" ||
    activeDoc?.mimeType?.toLowerCase() === "application/pdf" ||
    /\.pdf$/i.test(activeDoc?.originalFileName || "") ||
    /\.pdf$/i.test(documentUrlPath) ||
    /^data:application\/pdf/i.test(documentUrl);
  const isImage =
    /^data:image\//i.test(documentUrl) ||
    /\.(png|jpe?g|webp|gif|svg)$/i.test(fileName) ||
    (!isPdf && /\/image\/upload\//i.test(documentUrl));
  const isCloudinaryPdf = isPdf && /\/image\/upload\//i.test(documentUrl);
  const previewUrl = isCloudinaryPdf
    ? getPdfPreviewUrl(documentUrl)
    : documentUrl;
  const isImagePreview = isImage || isCloudinaryPdf;

  const handleZoomIn = () => setZoom((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFilterMode("normal");
  };

  const getFilterStyle = () => {
    if (filterMode === "enhance") return "contrast(135%) brightness(105%)";
    if (filterMode === "invert") return "invert(100%)";
    return "none";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden shadow-xl">
      {/* Top Document Tab Selector */}
      <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        {Object.entries(DOC_TYPE_LABELS).map(([key, label]) => {
          const doc = documents.find((d) => d.documentType === key);
          const isSelected =
            (selectedType || documents[0]?.documentType) === key;
          const hasDoc = !!doc;
          const isBlurry = doc?.qualityCheck?.isBlurry;

          return (
            <button
              key={key}
              onClick={() => {
                onSelectType(key);
                handleReset();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : hasDoc
                    ? "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "bg-slate-900 text-slate-400 opacity-60 hover:opacity-100"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{label}</span>
              {hasDoc && isBlurry && (
                <span
                  className="w-2 h-2 rounded-full bg-amber-400"
                  title="Image Blur Alert"
                />
              )}
              {hasDoc && !isBlurry && (
                <span
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  title="Uploaded & Sharp"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Control Toolbar */}
      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">
            {DOC_TYPE_LABELS[activeDoc?.documentType] || "Document Inspection"}
          </span>
        </div>

        {/* Zoom & Enhance Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRotate}
            title="Rotate 90°"
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition ml-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() =>
              setFilterMode((f) =>
                f === "normal"
                  ? "enhance"
                  : f === "enhance"
                    ? "invert"
                    : "normal",
              )
            }
            title="Toggle Contrast / OCR Invert Filter"
            className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition ml-1 ${
              filterMode !== "normal"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{filterMode}</span>
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="flex-1 bg-slate-950 p-4 relative flex items-center justify-center overflow-auto min-h-[420px]">
        {activeDoc && documentUrl ? (
          isImagePreview ? (
            failedPreviewUrl === previewUrl ? (
              <div className="text-center p-8 text-slate-300">
                <FileText className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                <p className="text-sm font-medium">
                  Preview unavailable. Check Cloudinary PDF delivery
                  permissions.
                </p>
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm text-indigo-300 hover:text-indigo-200"
                >
                  Open original document <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="relative inline-block transition-transform duration-200">
                <img
                  src={previewUrl}
                  alt={`${activeDoc.documentType} preview`}
                  onError={() => setFailedPreviewUrl(previewUrl)}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    filter: getFilterStyle(),
                    maxWidth: "100%",
                    maxHeight: "520px",
                    objectFit: "contain",
                  }}
                  className="rounded-lg shadow-2xl border border-slate-800 transition-all"
                />
                {isCloudinaryPdf && (
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded bg-slate-950/90 px-3 py-2 text-xs text-white"
                  >
                    Open PDF <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )
          ) : isPdf ? (
            <iframe
              src={documentUrl}
              title={
                DOC_TYPE_LABELS[activeDoc.documentType] || "Document preview"
              }
              style={{
                width: "min(100%, 900px)",
                height: "70vh",
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                filter: getFilterStyle(),
              }}
              className="rounded-lg border border-slate-700 bg-white shadow-2xl"
            />
          ) : (
            <div className="text-center p-8 text-slate-300">
              <FileText className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <p className="text-sm font-medium">
                This file type cannot be previewed in the browser.
              </p>
              <a
                href={documentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-sm text-indigo-300 hover:text-indigo-200"
              >
                Open or download document <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )
        ) : (
          <div className="text-center p-8 text-slate-400">
            <FileText className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-40" />
            <p className="text-sm font-medium text-slate-300">
              Document Not Uploaded
            </p>
            <p className="text-xs text-slate-400 mt-1">
              This document slot was omitted or pending submission.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Quality Check Indicator */}
      {activeDoc?.qualityCheck && (
        <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Image Sharpness:</span>
            <span className="font-mono text-slate-200 font-bold">
              {activeDoc.qualityCheck.laplacianVariance || 120} (Laplacian Var)
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">OCR Confidence:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {Math.round((activeDoc.ocrConfidence || 0.85) * 100)}%
            </span>
          </div>

          {activeDoc.qualityCheck.isBlurry ? (
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Blur Warning (Potential low OCR accuracy)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sharp &amp; Clear Image
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
