const SpeakerBooking = require("../models/SpeakerBooking");

// POST /api/speaker-bookings — public: submit booking with payment evidence
exports.submitBooking = async (req, res) => {
  try {
    const { eventId, name, phone } = req.body;

    if (!eventId || !name || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Payment evidence file is required" });
    }

    // Basic phone validation: 7-15 digits, optional leading +
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone.trim().replace(/[\s().-]/g, ""))) {
      return res
        .status(400)
        .json({ message: "Please enter a valid phone number (7–15 digits)" });
    }

    const booking = new SpeakerBooking({
      event: eventId,
      name: name.trim(),
      phone: phone.trim(),
      paymentEvidence: req.file.path,
    });

    await booking.save();
    res.status(201).json({
      message: "Booking submitted successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/speaker-bookings — admin only: get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await SpeakerBooking.find()
      .populate("event", "title date")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
