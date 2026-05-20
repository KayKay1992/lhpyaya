const CertificateRequest = require("../models/CertificateRequest");

// POST /api/certificates — public: submit certificate request
exports.submitRequest = async (req, res) => {
  try {
    const { eventId, participantName, certificateName, email } = req.body;

    if (!eventId || !participantName || !certificateName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Payment evidence file is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const request = new CertificateRequest({
      event: eventId,
      participantName: participantName.trim(),
      certificateName: certificateName.trim(),
      email: email.trim().toLowerCase(),
      paymentEvidence: req.file.path,
    });

    await request.save();
    res.status(201).json({
      message: "Certificate request submitted successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/certificates — admin: get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await CertificateRequest.find()
      .populate("event", "title date")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
