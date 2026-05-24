const Event = require("../models/Event");

// @desc    Get all events (public)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single event by ID (public)
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (admin only)
const createEvent = async (req, res) => {
  const { title, description, date, time, location } = req.body;

  if (!title || !description || !date || !time || !location) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      image: req.file ? req.file.path : "",
      createdBy: req.user.id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (admin only)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { title, description, date, time, location } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    if (req.file) {
      event.image = req.file.path;
    }

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (admin only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add a speaker to an event
// @route   POST /api/events/:id/speakers
// @access  Private (admin only)
const addSpeaker = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { name, title } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ message: "Speaker name is required" });

    event.speakers.push({
      name: name.trim(),
      title: title ? title.trim() : "",
      image: req.file ? req.file.secure_url || req.file.path : "",
    });
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a speaker from an event
// @route   DELETE /api/events/:id/speakers/:speakerId
// @access  Private (admin only)
const deleteSpeaker = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.speakers = event.speakers.filter(
      (s) => s._id.toString() !== req.params.speakerId,
    );
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addSpeaker,
  deleteSpeaker,
};
