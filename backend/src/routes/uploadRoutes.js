const express = require("express");
const upload = require("../middleware/upload");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

const router = express.Router();

// Helper function (buffer → Cloudinary)
const streamUpload = (buffer, folder = "studyvault") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // supports pdf, doc, image
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });

// ✅ MULTI FILE ROUTE
router.post(
  "/",
  upload.fields([
    { name: "casteCertificate", maxCount: 1 },
    { name: "incomeCertificate", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "bankPassbook", maxCount: 1 },
    { name: "admissionCertificate", maxCount: 1 }, // ✅ added
  ]),
  async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedFiles = [];

      // Loop through each document type
      for (const fieldName in req.files) {
        const file = req.files[fieldName][0];

        const result = await streamUpload(
          file.buffer,
          "studyvault"
        );

        uploadedFiles.push({
          documentType: fieldName,
          fileName: file.originalname,
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      res.status(200).json({
        message: "Files uploaded successfully",
        files: uploadedFiles,
      });

    } catch (error) {
      if (error.http_code === 403) {
        return res.status(502).json({
          message:
            "Cloudinary denied this upload. Enable upload permission.",
        });
      }

      res.status(500).json({
        message: "Upload failed",
        error: error.message,
      });
    }
  }
);

module.exports = router;