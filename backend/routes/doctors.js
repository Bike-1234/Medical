const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// ✅ Get all doctors
router.get("/", auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("_id name email specialization");
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
