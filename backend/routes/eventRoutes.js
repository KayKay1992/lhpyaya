const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// GET /api/events  (public)
router.get("/", getEvents);

// GET /api/events/:id  (public)
router.get("/:id", getEventById);

// POST /api/events  (admin only)
router.post("/", protect, adminOnly, upload.single("image"), createEvent);

// PUT /api/events/:id  (admin only)
router.put("/:id", protect, adminOnly, upload.single("image"), updateEvent);

// DELETE /api/events/:id  (admin only)
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
