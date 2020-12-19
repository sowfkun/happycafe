const express = require('express');
const router = express.Router();

//middleware kiểm tra đăng nhập
var checkLogin = require('../middleware/loginCheck');

const orderManageCtrler= require('../controllers/order_manage_ctrler')

router.get('/', checkLogin.allowAll, orderManageCtrler.orderShow); 
router.post('/selectOrder', checkLogin.allowAll, orderManageCtrler.selectOrder); 
router.post('/confirmOrder', checkLogin.allowAll, orderManageCtrler.confirmOrder); 

module.exports = router;