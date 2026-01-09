const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Employee: Book appointment
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employee') return res.status(403).json({ msg: 'Only employees can book' });
    const { doctorId, datetime, name, email } = req.body;

    // Ensure doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') return res.status(400).json({ msg: 'Invalid doctor' });

    const appt = new Appointment({
      employeeId: req.user._id,
      doctorId: doctorId,
      date: new Date(datetime).toISOString().split('T')[0],
      time: new Date(datetime).toTimeString().split(' ')[0],
      patientName: name,
      patientEmail: email,
      status: 'pending',
    });
    await appt.save();

    // Populate doctor and employee for response
    await appt.populate('doctorId', 'name email').populate('employeeId', 'name email');

    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get appointments (role-based)
router.get('/', auth, async (req, res) => {
  try {
    let appts;
    if (req.user.role === 'employee') {
      appts = await Appointment.find({ employeeId: req.user._id })
        .populate('doctorId', 'name email')
        .populate('employeeId', 'name email');
    } else if (req.user.role === 'doctor') {
      appts = await Appointment.find({ doctorId: req.user._id })
        .populate('doctorId', 'name email')
        .populate('employeeId', 'name email');
    } else if (req.user.role === 'hr') {
      appts = await Appointment.find()
        .populate('doctorId', 'name email')
        .populate('employeeId', 'name email');
    } else {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    res.json(appts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Verify appointment (doctor or hr)
router.put('/:id/verify', auth, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });

    // Check if user is the doctor or hr
    if (req.user.role !== 'hr' && req.user._id.toString() !== appt.doctorId.toString()) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    appt.verified = true;
    appt.status = 'confirmed';
    await appt.save();

    await appt.populate('doctorId', 'name email').populate('employeeId', 'name email');

    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
