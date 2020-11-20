const express = require('express');
const router = express.Router();


const loginCtrler= require('../controllers/login_ctrler')

router.get('/', loginCtrler.login); 

module.exports = router;