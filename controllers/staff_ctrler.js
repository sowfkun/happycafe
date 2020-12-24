var Staff = require("../models/staff_model");
var bcrypt = require('bcrypt');
const saltRounds = 10;
var fs = require('fs');

module.exports.staff = function (req, res) {
    //query dữ liệu từ database

    var staff_islogin = res.locals.staff;
    Promise.all([
        Staff.find({}, {
            _id: 0
        })
    ]).then(([staffs]) => {
        res.render('staff', {
            staffs: staffs,
            staff: staff_islogin
        });
    });
    
}
module.exports.create =  function(req,res){
    //get data from ejs

        //get name of img
        var img = typeof(req.file) !== "undefined" ? req.file.filename : "err";
        console.log(img);
        console.log(req.file);
        //other data
        var data = req.body;
        // phone staff
        var staff_phone = typeof(data.phone) !== "undefined" && data.phone !== ""? parseInt(data.phone) : "err";
        // name staff
        var staff_name = typeof(data.name) !== "undefined" && data.name!== ""? data.name : "err";        
        //staff id
        var staff_id = staff_name.split(' ').map(function(item){return item[0].toLowerCase()}).join('');
        staff_id = staff_id + data.phone[data.phone.length -4] + data.phone[data.phone.length - 3] + data.phone[data.phone.length - 2] + data.phone[data.phone.length - 1];
        // sex staff
        var staff_sex = data.sex !== "male" || data.sex !== "female"? data.sex : "err";
        
        //email staff
        var staff_email = typeof(data.email) !== "undefined" && data.email !== ""? data.email : "err";
        //period staff
        var staff_period = data.period !== "sáng" || data.period !== "chiều" || data.period !=="tối" ? data.period : "err";
        //position staff    
        var staff_position = data.position !== "bartender" || data.position !== "cashier" || data.position !=="manager" || data.position !== "waiter" || data.position !== "security" ? data.position : "err";
        //salary staff
        var staff_salary = typeof(data.salary) !== "undefined" && data.salary !== ""? parseInt(data.salary) : "err";
        // staff address
        var staff_address = typeof(data.address) !== "undefined" && data.address !== ""? data.address : "err";
        //password 
        var staff_password = "123456";

        console.log(staff_id, staff_sex, staff_phone, staff_email, staff_address, staff_period, staff_name, staff_position);
        var testArr = [img, staff_id, staff_sex, staff_phone, staff_email, staff_address, staff_period, staff_name, staff_position];
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
    // kiểm tra nhân viên đã tồn tại hay chưa
         Staff.find({staff_id: staff_id}).then((staff) => {
            if(staff.length !== 0){
                console.log("Nhân viên đã tồn tại trong hệ thống");
                var imgPath = 'public/upload/staff/' + img;
                fs.unlink(imgPath, function (err) {
                if (err) throw err;
                console.log(`delete ${img} successfully`);
                });
                console.log("create fail");
            } else{
                bcrypt.hash(staff_password, saltRounds,async function(err, hash) {
                    var staff = new Staff({
                        staff_id: staff_id,
                        name: staff_name,
                        sex: staff_sex,
                        position: staff_position,
                        salary: staff_salary,
                        phone: staff_phone,
                        password: hash,
                        email: staff_email,
                        address: staff_address,
                        status: "working",
                        period: staff_period,
                        img: img
                    });
                    await staff.save((function(err,doc){
                        if (err) throw err;
                        console.log("staff created")
                    }));
                    console.log(1);
                    res.redirect('back');
                });
            }
        })      
}
module.exports.update = function(req, res){
    //lấy tên hình ảnh
    var img = typeof(req.file) !== "undefined" ? req.file.filename : "";
    //các trường dữ liệu khác
    var data = req.body;
    var id = typeof (data.staff_id) == "string" && data.staff_id !== "" ? data.staff_id : "err"; //bắt buộc
    var EditStaffPeriod = data.period !== "sáng" || data.period !== "chiều" || data.period !=="tối" ? data.period : "err";
    var EditStaffPosition = data.position !== "bartender" || data.position !== "cashier" || data.position !=="manager" || data.position !== "waiter" || data.position !== "security" ? data.position : "err";
    var EditStaffSalary = isNaN(data.salary) == false && data.salary !=="" && parseInt(data.salary) >= 1000 ? parseInt(data.salary) : "err"; // Lương phải lớn hơn 1000
    var EditStaffAddress = typeof(data.address) !== "undefined" && data.address !== ""? data.address : "err";
    //Kiểm tra các giá trị, không hợp lệ thì hủy cập nhật
    var testArr = [EditStaffPeriod, EditStaffPosition, EditStaffSalary, EditStaffAddress];
    if (testArr.includes("err") == true) {
        //nếu có chọn ảnh mà các giá trị khác sai thì xóa ảnh
        if (img !== "") {
            var imgPath = 'public/upload/staff/' + img;
            fs.unlink(imgPath, function (err) {
                if (err) throw err;
                console.log('file deleted successfully');
            });
        }
        console.log("update fail");
        return;
    }
    //Sau khi kiểm tra xong, tiến hành cập nhật
    if(img !== ""){ //có thay đổi ảnh, tức giá trị ảnh không bị rỗng
        var update ={
            $set:{
                period: EditStaffPeriod,
                position: EditStaffPosition,
                salary: EditStaffSalary,
                address: EditStaffAddress,
                img: img
            }
        }
    } else { //không có sự thay đổi ảnh
        var update ={
            $set:{
                period: EditStaffPeriod,
                position: EditStaffPosition,
                salary: EditStaffSalary,
                address: EditStaffAddress,
                img: img
            }
    }
    }
    const query = {
        "staff_id" : id
    };
    const options = {
        "upsert": false,
        "multi": false,
    };
    Staff.updateOne(query, update,options,function(err,res){
        if(err) throw err;
        console.log(res.nModified);
        if(res.nModified ==0){
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
            console.log("update complete");
        }
    }).then(() => {
        res.redirect('back');
    })
}