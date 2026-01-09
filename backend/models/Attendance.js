const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["present", "absent"], required: true },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
