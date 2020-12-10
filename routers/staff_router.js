const express = require('express');
const router = express.Router();


const staffCtrler= require('../controllers/staff_ctrler')
//get staff info
router.get('/', staffCtrler.staff); 
//post staff info
router.post('/create',staffCtrler.create);

module.exports = router;