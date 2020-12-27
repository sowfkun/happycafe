var Staff = require("../models/staff_model");
var bcrypt = require('bcrypt');
const saltRounds = 10;
var fs = require('fs');

require('dotenv').config({
    path: "../.env"
});

//
//render trang quản lí nhân viên
//
module.exports.staff = function (req, res) {
    //query dữ liệu từ database
    var staff = res.locals.staff;
    res.render('staff', {
        staff: staff
    });
    
}
//
//Lấy thông tin các staff
//
module.exports.getStaff = function (req, res) {
    //query dữ liệu từ database
    var status = req.body.status;

    Staff.find({status: status},{_id: 0}).then(result => {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({"data": result}));
    });
    
}
module.exports.create = async function(req,res){
    
    var data = req.body;
    // phone staff
    var staff_phone = data.phone;
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (phone_regex.test(staff_phone) == false) {
        return;
    }     
    // name staff
    var staff_name = typeof(data.name) !== "undefined" && data.name!== ""? data.name.trim() : "err";        
    // sex staff
    var staff_sex = data.sex !== "male" || data.sex !== "female"? data.sex : "err";
    //email staff
    var staff_email =data.email;
    var mail_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(mail_regex.test(email) == false){
        return;
    }
    //period staff
    var staff_period = data.period !== "sáng" || data.period !== "chiều" || data.period !=="tối" ? data.period : "err";
    //position staff    
    var staff_position = data.position !== "bartender" || data.position !== "cashier" || data.position !=="manager" || data.position !== "waiter" || data.position !== "security" ? data.position : "err";
    //salary staff
    var staff_salary = typeof(data.salary) !== "undefined" && data.salary !== ""? parseInt(data.salary) : "err";
    // staff address
    var staff_address = typeof(data.address) !== "undefined" && data.address !== ""? data.address.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;") : "err";
    //password 
    var staff_password = Math.random().toString(36).substring(7, 13);

    var img = typeof(req.file) !== "undefined" ? req.file.filename : "err";

    //
    //kiểm tra lại dữ liệu
    //
    var testArr = [img, staff_sex, staff_address, staff_period, staff_name, staff_position];
    if (testArr.includes("err") == true) {
        //nếu có chọn ảnh mà các giá trị khác sai thì xóa ảnh
        if (img !== "err") {
            var imgPath = 'public/upload/staff/' + img;
            fs.unlink(imgPath, function (err) {
                if (err) throw err;
                console.log(`delete ${img} successfully`);
            });
        }
        console.log("create fail");
        return;
    }

    //
    //đếm số nhân viên
    //
    var countStaff = await Staff.find({}).countDocuments().then(result => {
        return result;
    });

    countStaff = countStaff + 1;
    if(countStaff < 10){
        countStaff = "0" + countStaff;
    }
    //staff_id == chữ cái đầu + 4 số cuối số đt + số thứ tự trong database
    var staff_id = staff_name.split(' ').map(function(item){return item[0].toLowerCase()}).join('');
    staff_id = staff_id + data.phone[data.phone.length -4] + data.phone[data.phone.length - 3] + data.phone[data.phone.length - 2] + data.phone[data.phone.length - 1];
    staff_id = staff_id + countStaff;

    //
    //kiểm tra số điện thoại, email đã tồn tại hay chưa
    // 
    var msg1 = "";
    var msg2 = "";
    var flag = await Promise.all([
       Staff.find({phone: parseInt(staff_phone)},{_id: 0, phone: 1}),
       Staff.find({email: staff_email},{_id: 0, email: 1})
    ]).then(([phone, email]) => {

        var flag = 0;
        console.log(phone)
        console.log(email);
        if(phone.length !== 0){
            msg1 = "phone-exist";
            flag = 1;
        }
        if(email.length !== 0){
            msg2 = "email-exist";
            flag = 1; 
        }
        return flag;
    });
    //
    //phone hoặc email đã tồn tại
    //
    if (flag == 1){
        //nếu có chọn ảnh mà các giá trị khác sai thì xóa ảnh
        if (img !== "err") {
            var imgPath = 'public/upload/staff/' + img;
            fs.unlink(imgPath, function (err) {
                if (err) throw err;
                console.log(`delete ${img} successfully`);
            });
        }
        console.log("create fail");

        res.writeHead(200, {"Content-Type": "application/json" });
        res.end(JSON.stringify({"msg1": msg1, "msg2": msg2}));
        return;
    }

    //
    //các giá trị đều hợp lệ
    //
    bcrypt.hash(staff_password, saltRounds, function(err, hash) {
        var staff = new Staff({
            staff_id: staff_id,
            name: staff_name,
            sex: staff_sex,
            position: staff_position,
            salary: staff_salary,
            phone: parseInt(staff_phone),
            password: hash,
            email: staff_email,
            address: staff_address,
            status: "working",
            period: staff_period,
            img: img
        });
        staff.save((function(err, doc){
            if (err || (doc.staff_id !== staff_id)){
                res.writeHead(200, { 'Content-Type': 'application/json'}); 
                res.end(JSON.stringify({'msg':"fail"}));
            } else {
                console.log("staff created");
                res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.end(JSON.stringify({'msg':"success", "data": doc}));
            } ;
        }));
    });
    
}

//
//Update user
//
module.exports.update = async function(req, res){
    //lấy tên hình ảnh
    var img = typeof(req.file) !== "undefined" ? req.file.filename : "";
    //các trường dữ liệu khác
    var data = req.body;
    //Xác định id cần update
    var id = typeof (data.staff_id) == "string" && data.staff_id !== "" ? data.staff_id : "err"; //bắt buộc
    //Ca làm việc chỉ gồm sáng, chiều, tối
    var period = data.period !== "sáng" || data.period !== "chiều" || data.period !=="tối" ? data.period : "err";
    
    //số điện thoại
    var phone = data.phone;
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (phone_regex.test(phone) == false) {
        return;
    }           
    //email
    var email = data.email;
    var mail_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(mail_regex.test(email) == false){
        return;
    }
    //Vị trí công việc chỉ bao gồm các giá trị sau
    var arrPosition = ["bartender", "manager", "cashier", "waiter", "security"];
    var position = arrPosition.includes(data.position) == true ? data.position : "err";
    console.log(position);
    //Mức lương phải từ 3 triệu trở lên
    var salary = isNaN(data.salary) == false && data.salary !=="" && parseInt(data.salary) >= 3000000 ? parseInt(data.salary) : "err"; // Lương phải lớn hơn 1000
    //Địa chỉ
    var address = typeof(data.address) !== "undefined" && data.address !== ""? data.address.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;") : "err";
    
    //Kiểm tra các giá trị, không hợp lệ thì hủy cập nhật
    var testArr = [id, period, position, salary, address];
    if (testArr.includes("err") == true) {
        //nếu có chọn ảnh mà các giá trị khác sai thì xóa ảnh
        if (img !== "") {
            var imgPath = 'public/upload/staff/' + img;
            fs.unlink(imgPath, function (err) {
                if (err) throw err;
                console.log('file deleted successfully');
            });
        }
        return;
    }

    //
    //Kiểm tra email và phone có tồn tại chưa
    //
    //
    //kiểm tra số điện thoại, email đã tồn tại hay chưa
    // 
    var msg1 = "";
    var msg2 = "";
    var flag = await Promise.all([
       Staff.find({phone: parseInt(phone)},{_id: 0, staff_id:1, phone: 1}),
       Staff.find({email: email},{_id: 0, staff_id:1, email: 1})
    ]).then(([phone, email]) => {
        var flag = 0;
        console.log(phone)
        console.log(email);
        if(phone.length !== 0 && phone[0].staff_id !== id ){
            msg1 = "phone-exist";
            flag = 1;
        }
        if(email.length !== 0 && email[0].staff_id !== id){
            msg2 = "email-exist";
            flag = 1; 
        }
        return flag;
    });
    //
    //phone hoặc email đã tồn tại
    //
    if (flag == 1){
        //nếu có chọn ảnh mà các giá trị khác sai thì xóa ảnh
        if (img !== "") {
            var imgPath = 'public/upload/staff/' + img;
            fs.unlink(imgPath, function (err) {
                if (err) throw err;
                console.log(`delete ${img} successfully`);
            });
        }
        res.writeHead(200, {"Content-Type": "application/json" });
        res.end(JSON.stringify({"msg1": msg1, "msg2": msg2}));
        return;
    }

    //Sau khi kiểm tra xong, tiến hành cập nhật
    if(img !== ""){ //có thay đổi ảnh, tức giá trị ảnh không bị rỗng
        var update ={
            $set:{
                position: position,
                salary: salary,
                phone: parseInt(phone),
                email: email,
                period: period,
                address: address,
                img: img
            }
        }
    } else { //không có sự thay đổi ảnh
        var update ={
            $set:{
                position: position,
                salary: salary,
                phone: parseInt(phone),
                email: email,
                period: period,
                address: address
            }
        }
    }

    var respond = await Staff.updateOne({staff_id: id}, update)
    console.log(respond.nModified);
    if(respond.nModified == 0){
        console.log("update fail");
        // nếu có chọn ảnh mà giá trị khác không hợp lệ thì xóa ảnh
        if(img !== ""){
            var imgPath = 'public/upload/staff' + img;
            fs.unlink(imgPath, function (err) {
                if (err) throw err;
                console.log('file delete successfully')
            });
        }
        return;
    } else {
        //update thành công
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.end(JSON.stringify({'msg':"success", "data": update, "id": id}));
    }
}