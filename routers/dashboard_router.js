const express = require('express');
const router = express.Router();


const dashboard_Ctrler= require('../controllers/dashboard_ctrler')

router.get('/', dashboard_Ctrler.dashboard); 

module.exports = router;