const express = require('express');
const router = express.Router();


const queue_orderCtrler= require('../controllers/queue_order_ctrler')

router.get('/', queue_orderCtrler.queue); 

module.exports = router;