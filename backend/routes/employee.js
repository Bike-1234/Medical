const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// ✅ Employee: Get own appointments
router.get("/appointments", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ employeeId: req.user._id })
      .populate("doctorId", "name email");
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Employee: Book appointment
router.post("/appointments", auth, async (req, res) => {
  try {
    if (req.user.role !== "employee") return res.status(403).json({ msg: "Access denied" });
    const { doctorId, datetime, name, email } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") return res.status(400).json({ msg: "Invalid doctor" });

    const appt = new Appointment({
      employeeId: req.user._id,
      doctorId,
      date: new Date(datetime).toISOString().split('T')[0],
      time: new Date(datetime).toTimeString().split(' ')[0],
      patientName: name,
      patientEmail: email,
      status: "pending",
    });
    await appt.save();
    await appt.populate("doctorId", "name email");
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Employee: Get attendance history
router.get("/attendance", auth, async (req, res) => {
  try {
    const records = await Attendance.find({ employeeId: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Employee: Mark attendance
router.post("/attendance", auth, async (req, res) => {
  try {
    if (req.user.role !== "employee") return res.status(403).json({ msg: "Access denied" });
    const { status } = req.body;
    const date = new Date().toISOString().split("T")[0];

    const existing = await Attendance.findOne({ employeeId: req.user._id, date });
    if (existing) {
      existing.status = status;
      await existing.save();
      res.json(existing);
    } else {
      const record = new Attendance({
        employeeId: req.user._id,
        date,
        status,
      });
      await record.save();
      res.json(record);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
