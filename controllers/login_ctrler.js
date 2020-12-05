var Staff = require("../models/staff_model");
var bcrypt = require('bcrypt');
const saltRounds = 10;
const chalk = require('chalk');

const cookieParams = {
    httpOnly: true,
    signed: true,
    maxAge: 300000,
  } ;
//
// Render login page
//
module.exports.loginPage = function (req, res) {
    console.log(chalk.blue('Hello world!'));
    res.render("login");
}

//
//Đăng nhập
module.exports.login = function (req, res) {
    //regex kiểm tra số điện thoại
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

    //lấy thông tin đăng nhập
    var login = req.body;
    //Validate
    var phone = isNaN(login.phone) == false && phone_regex.test(login.phone) == true ? login.phone : "err";
    var password = typeof (login.password) == "string" && login.password.length >= 5 ? login.password : "err";

    if (phone == "err" || password == "err") {
        console.log("Thông tin đăng nhập không hợp lệ");
        return;
    }
    //tìm và so sánh password
    Staff.find({phone: phone}, {_id: 0, staff_id: 1, password: 1}).then((docs) => {
        bcrypt.compare(password, docs[0].password, function (err, result) {
            if(result == false){
                res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.end(JSON.stringify({'msg':"fail",'id': "fail"}));
            } else {
                res.cookie('_id', docs[0].staff_id , cookieParams);
                res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.end(JSON.stringify({'msg':"success",'id': "success"}));
            }
        });
    });

    

}