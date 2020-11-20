const express = require('express');
const router = express.Router();


const drinkCtrler= require('../controllers/drink_ctrler')


var multer  = require('multer');        //upload file

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/upload/drink_image');
    },
    filename: function (req, file, callback) {
    
    callback(null, file.originalname + Date.now());
    }
  })
  
var upload = multer({ storage: storage })

router.get('/', drinkCtrler.manage); 
module.exports = router;