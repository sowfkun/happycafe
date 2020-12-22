const express = require('express');
const router = express.Router();


const loginCtrler = require('../controllers/login_ctrler')

router.get('/', loginCtrler.loginPage);
router.post('/', loginCtrler.login);
router.post('/logout', loginCtrler.logout);
router.post('/changepass/getotp', loginCtrler.getotp);
router.post('/changepass/confirmotp', loginCtrler.confirmotp);
router.post('/changepass/resendotp', loginCtrler.resendotp);

module.exports = router;

