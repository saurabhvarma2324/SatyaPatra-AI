const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const crypto = require("crypto");

const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name"
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Uploads a document buffer directly to Cloudinary
 */
const uploadDocumentBuffer = async (
  buffer,
  filename,
  folder = "satyapatra/documents",
) => {
  if (isCloudinaryConfigured()) {
    const resourceType = /\.(pdf|svg)$/i.test(filename) ? "image" : "auto";

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resourceType,
          public_id: `doc_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
            format: result.format,
            bytes: result.bytes,
          });
        },
      );
      Readable.from(buffer).pipe(uploadStream);
    });
  } else {
    // Resilient inline base64 fallback data URI with mock public_id
    const base64Str = buffer.toString("base64");
    const mimeType = filename.endsWith(".png")
      ? "image/png"
      : filename.endsWith(".jpg") || filename.endsWith(".jpeg")
        ? "image/jpeg"
        : "application/pdf";
    const dataUrl = `data:${mimeType};base64,${base64Str}`;
    const publicId = `local_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    return {
      secure_url: dataUrl,
      public_id: publicId,
      resource_type: "image",
      format: filename.split(".").pop(),
      bytes: buffer.length,
    };
  }
};

module.exports = {
  uploadDocumentBuffer,
  isCloudinaryConfigured,
};
