require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Routes
const upload = require("./src/middleware/upload");

// Controllers
const authController = require("./src/controllers/authController");
const applicationController = require("./src/controllers/applicationController");
const schemeController = require("./src/controllers/schemeController");
const auditController = require("./src/controllers/auditController");

// Middleware
const {
  protect,
  optionalProtect,
  authorizeRoles,
} = require("./src/middleware/authMiddleware");

const seedDatabase = require("./src/seed/seedData");
const { initMemoryStore } = require("./src/services/memoryStore");

mongoose.set("bufferCommands", false);
initMemoryStore();

const app = express();
const PORT = process.env.PORT || 5000;

// ================== MIDDLEWARE ==================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ================== HEALTH CHECK ==================
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    project: "SatyaPatra AI - ST Scholarship Verification Backend",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "connecting/disconnected",
    timestamp: new Date(),
  });
});

// ================== ROUTES ==================

// --- AUTH ---
app.post("/api/auth/signup", authController.signup);
app.post("/api/auth/login", authController.login);
app.get("/api/auth/me", protect, authController.getMe);

// --- SCHEMES ---
app.get("/api/schemes", schemeController.getSchemes);
app.post(
  "/api/schemes",
  protect,
  authorizeRoles("admin"),
  schemeController.createScheme,
);
app.put(
  "/api/schemes/:id",
  protect,
  authorizeRoles("admin"),
  schemeController.updateScheme,
);

// --- APPLICATIONS ---
app.post("/api/applications", applicationController.createApplication);

app.post(
  "/api/applications/:id/documents",
  upload.fields([
    { name: "caste_certificate", maxCount: 1 },
    { name: "income_certificate", maxCount: 1 },
    { name: "aadhaar_card", maxCount: 1 },
    { name: "mark_sheet", maxCount: 1 },
    { name: "bank_passbook", maxCount: 1 },
    { name: "admission_proof", maxCount: 1 },
  ]),
  applicationController.uploadDocument,
);

app.get(
  "/api/applications/stats/summary",
  optionalProtect,
  authorizeRoles("officer", "admin", "applicant"),
  applicationController.getApplicationStats,
);

app.get(
  "/api/applications",
  optionalProtect,
  authorizeRoles("officer", "admin", "applicant"),
  applicationController.getApplications,
);

app.get(
  "/api/applications/:id",
  optionalProtect,
  authorizeRoles("officer", "admin", "applicant"),
  applicationController.getApplicationById,
);

app.post(
  "/api/applications/:id/verify",
  optionalProtect,
  applicationController.triggerVerification,
);

app.post(
  "/api/applications/:id/decision",
  protect,
  authorizeRoles("officer", "admin"),
  applicationController.recordOfficerDecision,
);

app.get(
  "/api/applications/:id/report/pdf",
  optionalProtect,
  authorizeRoles("officer", "admin", "applicant"),
  applicationController.generatePdfReport,
);

// --- AUDIT ---
app.get(
  "/api/audit-logs",
  protect,
  authorizeRoles("admin"),
  auditController.getAuditLogs,
);

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ================== DB CONNECTION ==================
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/satyapatra_ai";

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
  .then(async () => {
    console.log("✔ Connected to MongoDB");

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`✔ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn(`⚠ MongoDB Connection Issue: ${err.message}`);

    app.listen(PORT, () => {
      console.log(`✔ Server running without DB on port ${PORT}`);
    });
  });

module.exports = app;
