const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
    index: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: [
      "caste_certificate",
      "income_certificate",
      "aadhaar_card",
      "mark_sheet",
      "bank_passbook",
      "admission_proof",
    ],
  },
  originalFileName: {
    type: String,
    default: "",
  },
  mimeType: {
    type: String,
    default: "",
  },
  format: {
    type: String,
    default: "",
  },
  resourceType: {
    type: String,
    default: "",
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  cloudinaryPublicId: {
    type: String,
    default: "",
  },
  imageHash: {
    phash: { type: String, default: "" },
    dhash: { type: String, default: "" },
    composite_hash: { type: String, default: "", index: true },
  },
  extractedFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  fieldConfidences: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ocrConfidence: {
    type: Number,
    default: 0.85,
  },
  qualityCheck: {
    qualityScore: { type: Number, default: 95 },
    laplacianVariance: { type: Number, default: 120.0 },
    isBlurry: { type: Boolean, default: false },
    isLowResolution: { type: Boolean, default: false },
    dimensions: {
      width: { type: Number, default: 1200 },
      height: { type: Number, default: 1600 },
    },
    qualityFlags: [mongoose.Schema.Types.Mixed],
  },
  validationFlags: [mongoose.Schema.Types.Mixed],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
