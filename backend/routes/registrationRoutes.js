const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getRegistrantsByEvent,
} = require("../controllers/registrationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// POST /api/registrations/:eventId  (public)
router.post("/:eventId", registerForEvent);

// GET /api/registrations/:eventId  (admin only)
router.get("/:eventId", protect, adminOnly, getRegistrantsByEvent);

module.exports = router;
