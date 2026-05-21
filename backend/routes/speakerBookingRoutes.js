const express = require("express");
const router = express.Router();
const {
  submitBooking,
  getAllBookings,
} = require("../controllers/speakerBookingController");
const certificateUpload = require("../middleware/certificateUploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public: submit booking with payment evidence upload
router.post("/", certificateUpload.single("paymentEvidence"), submitBooking);

// Admin only: get all bookings
router.get("/", protect, adminOnly, getAllBookings);

module.exports = router;
