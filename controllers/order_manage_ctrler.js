var Order = require("../models/order_model");

module.exports.orderShow = function (req, res) {

    var staff = res.locals.staff;

    Order.find({
        status: "waiting"
    }, {
        _id: 0,
        __v: 0
    }).sort({
        'time_begin': 1
    }).then((orders) => {
        res.render("order", {
            staff: staff,
            orders: orders
        });
    });
}

module.exports.selectOrder = function (req, res) {

    var date = req.body.date;
    var status = req.body.status;

    var selectDate = new Date(date);

    var nextDay = new Date(selectDate);
    nextDay.setDate(selectDate.getDate() + 1);

    Order.find({
        time_begin: {
            $gte: new Date(selectDate),
            $lt: new Date(nextDay)
        },
        status: status
    }, {
        _id: 0,
        __v: 0
    }).sort({
        'time_begin': 1
    }).then((orders) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({"data": orders}));
    });
}

module.exports.confirmOrder = async function (req, res) {

    var order_id = req.body.order_id;
    var now = Date.now();

    var respond = await Order.updateOne({order_id: order_id}, {status: "complete", time_end: now});
    if (respond.nModified == 0) {   
        console.log("update fail");
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.end(JSON.stringify({'msg':"fail",'id': order_id}));
    } else {
        console.log("order done");
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.end(JSON.stringify({'msg':"success",'id': order_id}));
    }
}