var Drink = require("../models/drink_model");
var Category = require("../models/category_model");
var Topping = require("../models/topping_model");


module.exports.home = function(req, res) {

    //kiểm tra đăng nhập
    var staff = res.locals.staff;
    if(res.locals.isLogin == true){
        //query dữ liệu từ database
        Promise.all([       
            Drink.find({}, {_id : 0}),
            Category.find({},{_id : 0}),
            Topping.find({},{_id : 0})
            
            //render dữ liệu
        ]).then( ([drinks, category, topping]) => {
            res.render('home',{
                drinks: drinks,
                category: category,
                topping: topping,
                staff: staff
            });
        });
    } else {
        res.redirect('/login');
    }
}