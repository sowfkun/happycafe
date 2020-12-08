var Drink = require("../models/drink_model");
var Category = require("../models/category_model");
var Topping = require("../models/topping_model");


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

    var customer = typeof(data.customer) !== "undefined" && data.customer !== "" ? data.customer.trim() : "err";
    var note = data.note.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var items = typeof(data.items) == "object" && data.items.length >=1 ? data.items : "err";
    var finalItems = [];
    //format lại items
    items.forEach(item => {
        var newItem = {
            drink_id: item.drink_id,
            drink_name: item.drink_name,
            price: {
                size_m: item.size_m,
                size_l: item.size_l,
            },
            topping: {
                topping_id: item.topping,
                topping_name: item.toppingName
            },
            qty: item.qty
        };

        finalItems.push(newItem);
    });
    console.log(finalItems);
    
    
}