const express = require('express');
const router = express.Router();


const homeCtrler= require('../controllers/home_ctrler')

router.get('/', homeCtrler.index ); 

module.exports = router;