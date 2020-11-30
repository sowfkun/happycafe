const express = require('express');
const router = express.Router();


const drinkCtrler = require('../controllers/drink_ctrler')


var multer = require('multer'); //upload file

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
router.get('/', drinkCtrler.manage);
//update
router.post('/update', upload.single('new_img'), drinkCtrler.update);
//tạo mới
router.post('/create', upload.single('drinkImg'), drinkCtrler.create);
//create category
router.post('/categoryCreate', drinkCtrler.categoryCreate);
//update category

router.post('/categoryUpdate', drinkCtrler.categoryUpdate);
//update topping
router.post('/toppingUpdate', drinkCtrler.toppingUpdate);

module.exports = router;