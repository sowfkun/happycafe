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

router.get('/', drinkCtrler.manage);
router.post('/update', upload.single('new_img'), drinkCtrler.update);

module.exports = router;