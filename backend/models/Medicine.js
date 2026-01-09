const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  uploadedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Medicine', MedicineSchema);
