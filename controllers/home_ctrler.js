var Drink = require("../models/drink_model");
var Category = require("../models/category_model");
var Topping = require("../models/topping_model");
var Order = require("../models/order_model");

module.exports.home = function (req, res) {

    var staff = res.locals.staff;
    //query dữ liệu từ database
    Promise.all([
        Drink.find({}, {
            _id: 0
        }),
        Category.find({}, {
            _id: 0
        }),
        Topping.find({}, {
            _id: 0
        })

        //render dữ liệu
    ]).then(([drinks, category, topping]) => {
        res.render('home', {
            drinks: drinks,
            category: category,
            topping: topping,
            staff: staff
        });
    });

}

//
//Tạo order
//
module.exports.createOrder = function (req, res) {

    var data = req.body;

    //validate lại dữ liệu
    var customer_name = typeof (data.customer) !== "undefined" && data.customer !== "" ? data.customer.trim() : "err";
    var note = data.note.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var items = typeof (data.items) == "object" && data.items.length >= 1 ? data.items : "err";
    var finalItems = [];

    if (customer_name == "err" || items == "err") {
        console.log("Create order fail");
        return;
    }

    //format lại items và tính tổng tiền
    var total=0;
    items.forEach(item => {
        var newItem = {
            drink_id: item.drink_id,
            drink_name: item.drink_name,
            price: {
                size_m: parseInt(item.size_m),
                size_l: parseInt(item.size_l),
            },
            topping: {
                topping_id: item.topping,
                topping_name: item.toppingName
            },
            qty: parseInt(item.qty)
        };

        //tính tổng tiền
        //giá size m * số lượng
        if (parseInt(item.size_m) !== 0) {
            total += parseInt(item.size_m) * parseInt(item.qty);
        } else {
            //Giá size l * số lượng
            total += parseInt(item.size_l) * parseInt(item.qty);
        }

        //nếu có topping thì cộng thêm 10000 * số lượng
        if (item.topping !== "false") {
            total += 10000 * parseInt(item.qty);
        }

        finalItems.push(newItem);
    });

    var now = Date.now();
    //lấy thời gian kiểu sô làm id
    var id = "order_" + now;

    //thời gian bắt đầu order
    var time_begin = now;

    var order = new Order({
        order_id: id,
        customer_name: customer_name,
        drink: finalItems,
        time_begin: time_begin,
        time_end: time_begin,       //thời gian tạm, cập nhật lại khi nhân viên pha chế xác nhận
        discount: 0,
        note: note,
        total: total,
        status: 'waiting'
    });

    //lưu vào database
    order.save((function(err, doc) {
        if (err || (doc.order_id !== id)){
            res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.end(JSON.stringify({'msg':"fail",'id': id}));
        } else {
            console.log("drink created")
            res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.end(JSON.stringify({'msg':"success",'id': id}));
        } ;
    }));
}