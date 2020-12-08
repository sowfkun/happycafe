const express = require('express');
const router = express.Router();

const homeCtrler = require('../controllers/home_ctrler')

//middleware kiểm tra đăng nhập
var checkLogin = require('../middleware/loginCheck');

router.get('/', checkLogin.allowAll, homeCtrler.home);
router.post('/createOrder', checkLogin.allowAll, homeCtrler.createOrder);

module.exports = router;