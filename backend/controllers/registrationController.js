const Registration = require("../models/Registration");
const Event = require("../models/Event");

// @desc    Register for an event (public)
// @route   POST /api/registrations/:eventId
// @access  Public
const registerForEvent = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Please provide your name and email" });
  }

  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = await Registration.findOne({
      event: req.params.eventId,
      email,
    });
    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ message: "You have already registered for this event" });
    }

    const registration = await Registration.create({
      event: req.params.eventId,
      name,
      email,
      phone: phone || "",
    });

    res.status(201).json({ message: "Registration successful", registration });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all registrants for an event
// @route   GET /api/registrations/:eventId
// @access  Private (admin only)
const getRegistrantsByEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrants = await Registration.find({
      event: req.params.eventId,
    }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ event: event.title, total: registrants.length, registrants });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerForEvent, getRegistrantsByEvent };
