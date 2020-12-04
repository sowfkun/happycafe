var Drink = require("../models/drink_model");
var Category = require("../models/category_model");
var Topping = require("../models/topping_model");
var fs = require('fs');

module.exports.manage = function (req, res) {
    
    //kiểm tra đăng nhập
    var staff = res.locals.staff;
    //nếu chưa đăng nhập thì quay về trang đăng nhập
    if(res.locals.isLogin == false){
        res.redirect('/login');
        return;
    } 

    //nếu đã đăng nhập mà không phải manager thì quay về trang trước
    if(res.locals.isLogin == true && staff.position !== "manager") {
        console.log(staff.position);
        res.redirect('back');
        return;
    } 

    console.log(staff.position);
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
            topping: topping,
            staff: staff
        });
    });
    
}

//
//cập nhật thông tin thức uống
//
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
    }).then(() => {
        res.redirect('back');
    })
}

//
//Thêm sản phẩm mới
//
module.exports.create = function (req, res) {
    //lấy tên hình ảnh
    var img = typeof(req.file) !== "undefined" ? req.file.filename : "err"; //bắt buộc

    //các trường dữ liệu khác
    var data = req.body;
    //category id
    var category_id = typeof(data.category) !== "undefined" && data.category !== "" ? data.category : "err";
    //drink name
    var drink_name = typeof(data.name) !== "undefined" && data.name !== "" ? data.name.trim() : "err";
    //tạo id từ tên 
    var drink_id = drink_name.split(' ').map(function(item){return item[0].toLowerCase()}).join('');

    //size_m, size_l phải là số, và tối thiểu là 30000
    var size_m = isNaN(data.size_m) == false && data.size_m !== "" && (parseInt(data.size_m) >= 30000 || parseInt(data.size_m) == 0) ? parseInt(data.size_m) : "err"; //có thể bằng 0
    var size_l = isNaN(data.size_l) == false && data.size_l !== "" && parseInt(data.size_l) >= 30000 ? parseInt(data.size_l) : "err"; //bắt buộc
    //size_m phải nhỏ hơn size_l
    if (size_m >= size_l) {
        size_m = "err";
        size_l = "err";
    }

    //topping và trạng thái
    var topping = data.topping == "true" || data.topping == "false" ? data.topping : "err"; //bắt buộc
    var status = data.status == "active" || data.status == "inactive" ? data.status : "err"; //bắt buộc

    var testArr = [img, drink_id, drink_name, size_m, size_l, topping, status];
    console.log(testArr);
    if (testArr.includes("err") == true) {
        //nếu có chọn ảnh mà các giá trị khác sai thì xóa ảnh
        if (img !== "err") {
            var imgPath = 'public/upload/drink_image/' + img;
            fs.unlink(imgPath, function (err) {
                if (err) throw err;
                console.log(`delete ${img} successfully`);
            });
        }
        console.log("create fail");
        return;
    }

    //kiểm tra drink mới đã tồn tại hay chưa
    Drink.find({drink_id: drink_id}).then((drink) => {
        if(drink.length !== 0){
            console.log("sản phẩm đã tồn tại")
            //nếu có chọn ảnh mà các giá trị khác sai thì xóa ảnh
            var imgPath = 'public/upload/drink_image/' + img;
            fs.unlink(imgPath, function (err) {
                if (err) throw err;
                console.log(`delete ${img} successfully`);
            });
            console.log("create fail");
        } else {
            var drink = new Drink({
                drink_id: drink_id,
                category_id: category_id,
                name: drink_name,
                price: {
                    size_m: size_m,
                    size_l: size_l
                },
                status: status,
                img: img,
                topping: topping
            });

            //lưu vào database
            drink.save((function(err, doc) {
                if (err) throw err;
                console.log("drink created")
            }));
        }
    }).then(()=>{
        res.redirect('back');
    });
}

//
//Create category
//
module.exports.categoryCreate = function (req, res) {
    var data = req.body;
    console.log(data);
    //validate dữ liệu
    var id = typeof(data.category_id) == "string" && data.category_id !== "" ? data.category_id.trim() : "err";
    var name = typeof(data.name) == "string" && data.name !== "" ? data.name.trim() : "err";

    //redirect nếu phát hiện lỗi
    if(id == "err" || name == "err"){
        console.log("update fail");
        res.redirect('back');
        return;
    }
    console.log(id, name)
     //kiểm tra category mới đã tồn tại hay chưa
    Category.find({category_id: id},{category_id: 1}).then( (cate) => {
        if(cate.length !== 0){
            console.log("category đã tồn tại");
            res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.end(JSON.stringify({'msg':"exist",'id': id}));
        } else {
            var cate = new Category({
               category_id : id,
               name: name,
               status: "inactive"
            });

            //lưu vào database
            cate.save((function(err, doc) {
                if (err || (doc.category_id !== id)){
                    res.writeHead(200, { 'Content-Type': 'application/json' }); 
                    res.end(JSON.stringify({'msg':"fail",'id': id}));
                    throw err;
                } else {
                    console.log("drink created")
                    res.writeHead(200, { 'Content-Type': 'application/json' }); 
                    res.end(JSON.stringify({'msg':"success",'id': id, name: name}));
                } ;
               
            }));
        }
    });
}

//
//update category
//
module.exports.categoryUpdate = async function (req, res) {
    //kiểm tra đăng nhập
    var staff = res.locals.staff;
    if(res.locals.isLogin == false || staff.position !== "manager"){
        res.end(JSON.stringify({"msg":'require login'}));
        return;
    } 

    var data = req.body;
    console.log(data);
    //validate dữ liệu
    var id = typeof(data.category_id) == "string" && data.category_id !== "" ? data.category_id : "err";
    var status = data.status == "false" || data.status == "true" ? data.status : "err";
    console.log(id);
    console.log(status);

    //redirect nếu phát hiện lỗi
    if(id == "err" || status == "err"){
        console.log("update fail");
        return;
    }

    //status isChecked == true => active, else =>false
    status = status == "true" ? 'active' : 'inactive';
    //up datr giá trị status
    var update = {
        $set: {
           status : status
        }
    }
    //tìm category cần update
    const query = {
        "category_id": id
    };
    
    //update
    var respond = await Category.updateOne(query, update);
    if (respond.nModified == 0) {   
        console.log("update fail");
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.end(JSON.stringify({'msg':"fail",'id': id}));
    } else {
        console.log("update completed");
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.end(JSON.stringify({'msg':"success",'id': id}));
    }
    
}

//
//Create topping
//
module.exports.toppingCreate = function (req, res) {
    var data = req.body;
    //validate dữ liệu
    var id = typeof(data.topping_id) == "string" && data.topping_id !== "" ? data.topping_id.trim() : "err";
    var name = typeof(data.name) == "string" && data.name !== "" ? data.name.trim() : "err";

    //redirect nếu phát hiện lỗi
    if(id == "err" || name == "err"){
        console.log("create fail");
        return;
    }
    console.log(id, name)
     //kiểm tra topping mới đã tồn tại hay chưa
    Topping.find({topping_id: id}).then( async (topping) => {
        if(topping.length !== 0){
            console.log("Topping đã tồn tại");
            res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.end(JSON.stringify({'msg':"exist",'id': id}));
        } else {
            var topping = new Topping({
               topping_id : id,
               name: name,
               status: "inactive"
            });

            //lưu vào database
            topping.save((function(err, doc) {
                if (err || (doc.topping_id !== id)){
                    res.writeHead(200, { 'Content-Type': 'application/json' }); 
                    res.end(JSON.stringify({'msg':"fail",'id': id}));
                    throw err;
                } else {
                    console.log("drink created")
                    res.writeHead(200, { 'Content-Type': 'application/json' }); 
                    res.end(JSON.stringify({'msg':"success",'id': id, name: name}));
                } ;
            }));
        }
    });
}

//
//update topping
//
module.exports.toppingUpdate = async function (req, res) {
    var data = req.body;
    //validate dữ liệu
    var id = typeof(data.topping_id) == "string" && data.topping_id !== "" ? data.topping_id : "err";
    var status = data.status == "false" || data.status == "true" ? data.status : "err";

    //redirect nếu phát hiện lỗi
    if(id == "err" || status == "err"){
        console.log("update fail");
        res.redirect('back');
        return;
    }

    //status isChecked == true => active, else =>false
    status = status == "true" ? 'active' : 'inactive';
    //up datr giá trị status
    var update = {
        $set: {
           status : status
        }
    }
    //tìm category cần update
    const query = {
        "topping_id": id
    };
    
    //update
    var respond = await Topping.updateOne(query, update);
    if (respond.nModified == 0) {   
        console.log("update fail");
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.end(JSON.stringify({'msg':"fail",'id': id}));
    } else {
        console.log("update completed");
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.end(JSON.stringify({'msg':"success",'id': id}));
    }
    
}