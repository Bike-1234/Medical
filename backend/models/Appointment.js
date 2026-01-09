const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
