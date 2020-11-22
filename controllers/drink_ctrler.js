var Drink = require("../models/drink_model");
var Category = require("../models/category_model");
var Topping = require("../models/topping_model");
var fs = require('fs');
module.exports.manage = function (req, res) {
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

    ]).then(([drinks, category, topping]) => {
        res.render('drink', {
            drinks: drinks,
            category: category,
            topping: topping
        });
    });
}

//cập nhật thông tin thức uống
module.exports.update = function (req, res) {
        //lấy tên hình ảnh
        var img = typeof (req.file) !== "undefined" ? req.file.filename : ""; //có thể ko cập nhật hình ảnh

        //các trường dữ liệu khác
        var data = req.body;

        var id = typeof (data.drink_id) == "string" && data.drink_id !== "" ? data.drink_id : "err"; //bắt buộc
        var topping = data.topping == "true" || data.topping == "false" ? data.topping : "err"; //bắt buộc
        var status = data.status == "active" || data.status == "inactive" ? data.status : "err"; //bắt buộc

        //size_m, size_l phải là số, và tối thiểu là 30000
        var size_m = isNaN(data.size_m) == false && data.size_m !== "" && (parseInt(data.size_m) >= 30000 || parseInt(data.size_m) == 0) ? parseInt(data.size_m) : "err"; //có thể bằng 0
        var size_l = isNaN(data.size_l) == false && data.size_l !== "" && parseInt(data.size_l) >= 30000 ? parseInt(data.size_l) : "err"; //bắt buộc
        //size_m phải nhỏ hơn size_l
        if (size_m >= size_l) {
            size_m = "err";
            size_l = "err";
        }

        //kiểm tra nếu có giá trị không hợp lệ thì hủy cập nhật
        var testArr = [id, size_m, size_l, topping, status];
        if (testArr.includes("err") == true) {
            //nếu có chọn ảnh mà các giá trị khác sai thì xóa ảnh
            if (img !== "") {
                var imgPath = 'public/upload/drink_image/' + img;
                fs.unlink(imgPath, function (err) {
                    if (err) throw err;
                    console.log('file deleted successfully');
                });
            }
            console.log("update fail");
            return;
        }

        //các giá trị hợp lệ, tiến hành cập nhật
        if (img !== "") { //có thay đổi ảnh
            var update = {
                $set: {
                    price: {
                        size_m: size_m,
                        size_l: size_l
                    },
                    status: status,
                    img: img,
                    topping: topping
                }
            }
        } else { //không thay đổi ảnh
            var update = {
                $set: {
                    price: {
                        size_m: size_m,
                        size_l: size_l
                    },
                    status: status,
                    topping: topping
                }
            }
        }

        const query = {
            "drink_id": id
        };
        const options = {
            "upsert": false,
            "multi": false
        };
        //update
        Drink.updateOne(query, update, options, function (err, res) {
            if (err) throw err;
            console.log(res.nModified);
            if (res.nModified == 0) {
                console.log("update fail");
                //nếu có chọn ảnh mà các giá trị khác sai thì xóa ảnh
                if (img !== "") {
                    var imgPath = 'public/upload/drink_image/' + img;
                    fs.unlink(imgPath, function (err) {
                        if (err) throw err;
                        console.log('file deleted successfully');
                    });
                }
                return;
            } else {
                console.log("update completed");
            }
        }).then(()=>{
             res.redirect('back');
        })
}