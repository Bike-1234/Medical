const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Attendance = require("../models/Attendance");
const Medicine = require("../models/Medicine");

// ✅ Get all employees
router.get("/employees", auth, async (req, res) => {
  try {
    if (req.user.role !== "hr") return res.status(403).json({ msg: "Access denied" });
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Get all doctors
router.get("/doctors", auth, async (req, res) => {
  try {
    if (req.user.role !== "hr") return res.status(403).json({ msg: "Access denied" });
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Get attendance records
router.get("/attendance", auth, async (req, res) => {
  try {
    if (req.user.role !== "hr") return res.status(403).json({ msg: "Access denied" });
    const records = await Attendance.find()
      .populate("employeeId", "name email role")
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Submit attendance
router.post("/attendance", auth, async (req, res) => {
  try {
    if (req.user.role !== "hr") return res.status(403).json({ msg: "Access denied" });
    const { attendance } = req.body;
    const date = new Date().toISOString().split("T")[0];

    const records = await Promise.all(
      attendance.map(async (a) => {
        const existing = await Attendance.findOne({ employeeId: a.employeeId, date });
        if (existing) {
          existing.status = a.status;
          return existing.save();
        } else {
          const newRecord = new Attendance({
            employeeId: a.employeeId,
            date,
            status: a.status,
          });
          return newRecord.save();
        }
      })
    );

    res.json({ msg: "Attendance saved successfully", records });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Get all appointments
router.get("/appointments", auth, async (req, res) => {
  try {
    if (req.user.role !== "hr") return res.status(403).json({ msg: "Access denied" });
    const appointments = await Appointment.find()
      .populate("employeeId", "name email role")
      .populate("doctorId", "name email role");
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Get all medicines
router.get("/medicines", auth, async (req, res) => {
  try {
    if (req.user.role !== "hr") return res.status(403).json({ msg: "Access denied" });
    const medicines = await Medicine.find().populate("uploadedBy", "name email");
    res.json(medicines);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Verify appointment
router.put("/appointments/:id/verify", auth, async (req, res) => {
  try {
    if (req.user.role !== "hr") return res.status(403).json({ msg: "Access denied" });
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    )
      .populate("employeeId", "name email")
      .populate("doctorId", "name email");
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
