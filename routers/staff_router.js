const express = require('express');
const router = express.Router();

var multer = require('multer'); 
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/upload/staff');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '_' + file.originalname.replace(/\s/g, ""));
  }
})
var upload = multer({
  storage: storage
})

const staffCtrler= require('../controllers/staff_ctrler');

//middleware kiểm tra đăng nhập
var checkLogin = require('../middleware/loginCheck');
//render trang staff
router.get('/', checkLogin.adminOnly, staffCtrler.staff); 
//get staff data
router.post('/getstaff', checkLogin.adminOnly, staffCtrler.getStaff);
//create staff
router.post('/create', checkLogin.adminOnly, upload.single('staffImg'), staffCtrler.create);
//edit staff
router.post('/update', checkLogin.adminOnly, upload.single('new_img'), staffCtrler.update);


module.exports = router;