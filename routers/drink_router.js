const express = require('express');
const router = express.Router();

const drinkCtrler = require('../controllers/drink_ctrler')

//middleware kiểm tra đăng nhập
var checkLogin = require('../middleware/loginCheck');


//upload file
var multer = require('multer'); 

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/upload/drink_image');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '_' + file.originalname.replace(/\s/g, ""));
  }
})

var upload = multer({
  storage: storage
})



//trang quản lí
router.get('/', checkLogin.managerOnly, drinkCtrler.manage);
//update
router.post('/update', checkLogin.managerOnly, upload.single('new_img'), drinkCtrler.update);
//tạo mới
router.post('/create', checkLogin.managerOnly, upload.single('drinkImg'), drinkCtrler.create);
//create category
router.post('/categoryCreate', checkLogin.managerOnly, drinkCtrler.categoryCreate);
//update category
router.post('/categoryUpdate', checkLogin.managerOnly, drinkCtrler.categoryUpdate);
//create topping
router.post('/toppingCreate', checkLogin.managerOnly, drinkCtrler.toppingCreate);
//update topping
router.post('/toppingUpdate', checkLogin.managerOnly, drinkCtrler.toppingUpdate);

module.exports = router;