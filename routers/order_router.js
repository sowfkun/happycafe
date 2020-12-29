const express = require('express');
const router = express.Router();

//middleware kiểm tra đăng nhập
var checkLogin = require('../middleware/loginCheck');

const orderManageCtrler= require('../controllers/order_manage_ctrler')
//Render trang quản lí order
router.get('/', checkLogin.allowAll, orderManageCtrler.orderShow);
//Xem order theo ngày
router.post('/selectOrder', checkLogin.allowAll, orderManageCtrler.selectOrder); 
//Xác nhận hoàn tất order
router.post('/confirmOrder', checkLogin.allowAll, orderManageCtrler.confirmOrder); 

module.exports = router;