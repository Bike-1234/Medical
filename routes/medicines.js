const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Medicine = require('../models/Medicine');

// Doctor: upload medicine
router.post('/', auth, async (req,res)=>{
  try{
    if(req.user.role !== 'doctor') return res.status(403).json({msg:'Only doctors can upload medicines'});
    const {name, description} = req.body;
    const med = new Medicine({name, description, uploadedBy: req.user._id});
    await med.save();
    res.json(med);
  }catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// Everyone: view medicines (employees can view)
router.get('/', auth, async (req,res)=>{
  try{
    const meds = await Medicine.find().populate('uploadedBy','name email');
    res.json(meds);
  }catch(err){ console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
