const express = require('express');
const router = express.Router();


const loginCtrler = require('../controllers/login_ctrler')

//render trang đăng nhập
router.get('/', loginCtrler.loginPage);
//Yêu cầu đăng nhập
router.post('/', loginCtrler.login);
//Yêu cầu đăng xuất
router.post('/logout', loginCtrler.logout);
//Gửi mã otp đổi mật khẩu
router.post('/changepass/getotp', loginCtrler.getotp);
//Xác nhận OTP
router.post('/changepass/confirmotp', loginCtrler.confirmotp);
//Gửi lại mã otp
router.post('/changepass/resendotp', loginCtrler.resendotp);

module.exports = router;

