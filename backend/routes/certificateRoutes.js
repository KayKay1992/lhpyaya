const express = require("express");
const router = express.Router();
const {
  submitRequest,
  getAllRequests,
} = require("../controllers/certificateController");
const certificateUpload = require("../middleware/certificateUploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public: submit certificate request with payment evidence upload
router.post("/", certificateUpload.single("paymentEvidence"), submitRequest);

// Admin only: get all certificate requests
router.get("/", protect, adminOnly, getAllRequests);

module.exports = router;
