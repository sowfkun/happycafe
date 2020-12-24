const express = require('express');
const router = express.Router();

//middleware kiểm tra đăng nhập
var checkLogin = require('../middleware/loginCheck');

const dashboard_Ctrler= require('../controllers/dashboard_ctrler')

router.get('/', checkLogin.managerOnly, dashboard_Ctrler.dashboard); 

//lấy doanh thu
router.post('/getincome', checkLogin.managerOnly, dashboard_Ctrler.getIncome); 
//lấy lượt khách
router.post('/getcustomervisit', checkLogin.managerOnly, dashboard_Ctrler.getCustomerVisit); 


module.exports = router;