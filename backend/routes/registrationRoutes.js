const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getRegistrantsByEvent,
  deleteRegistrant,
} = require("../controllers/registrationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// POST /api/registrations/:eventId  (public)
router.post("/:eventId", registerForEvent);

// GET /api/registrations/:eventId  (admin only)
router.get("/:eventId", protect, adminOnly, getRegistrantsByEvent);

// DELETE /api/registrations/:registrationId  (admin only)
router.delete("/:registrationId", protect, adminOnly, deleteRegistrant);

module.exports = router;
