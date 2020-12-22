require('dotenv').config({
    path: "../.env"
});

var Staff = require("../models/staff_model");

var bcrypt = require('bcrypt');
const saltRounds = 10;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

const cookieParams = {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + 18000000)
};


//
// Render login page
//
module.exports.loginPage = function (req, res) {
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
            if (result == false) {
                res.writeHead(200, { 'Content-Type': 'application/json'});
                res.end(JSON.stringify({'msg': "fail",'id': "fail"}));
            } else {
                res.cookie('_id', docs[0].staff_id, cookieParams);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({'msg': "success", 'id': "success"}));
            }
        });
    });
}

//
//Đăng xuất
//
module.exports.logout = function (req, res) {
    res.clearCookie('_id');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({'msg': "logout"}));
}

//
//Gửi mã otp để đổi mật khâu
//
module.exports.getotp = async function (req, res) {

    var cookies = req.signedCookies;
    if(cookies._id){
        //đổi mật khẩu khi đã đăng nhập
        var staff_id = cookies._id;
        //kiểm tra cookies có hợp lệ không
        var checkStaff = await Staff.find({staff_id: staff_id}, {phone: 1});
        if (checkStaff.length == 0) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({'msg': "not-exist"}));
            return;
        } else {
            phone = checkStaff[0].phone;        //nếu tồn tại user thì lấy số đt
        }
    } else {
         //Tính năng quên mật khẩu
        var phone = req.body.phone; 
         //kiểm tra số điện thoại có hợp lệ hay không
        var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        //validate giá trị
        if (phone_regex.test(phone) == false) {
            return;
        }           
        //kiểm tra số điện thoại có trong database hay không;
        var checkPhone = await Staff.find({phone: parseInt(phone)}, {staff_id: 1});
        if (checkPhone.length == 0) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({'msg': "not-exist"}));
            return;
        }
    }

    var vnPhone = "+84" + parseInt(phone);
    console.log(vnPhone);

    client.verify.services(process.env.TWILIO_SERVICE_ID)
             .verifications
             .create({to: vnPhone, channel: 'sms'})
             .then(verification =>{
                console.log(verification.status);
                res.cookie('_vrf', parseInt(phone), {httpOnly: true, signed: true, expires: new Date(Date.now() + 600000)});
                res.writeHead(200, {'Content-Type': 'application/json' });
                res.end(JSON.stringify({'msg': "code-sent" }));
             });
    
}

//
//xác nhận otp và lưu mật khẩu mới vào database
//
module.exports.confirmotp = async function (req, res) {

    //get cookies để xác định số điện thoại
    var cookies = req.signedCookies;
    console.log(cookies._id);
    if(typeof(cookies._id) !== "undefined"){
        
        //đổi mật khẩu khi đã đăng nhập
        var staff_id = cookies._id;
        //Kiểm tra cookies có hợp lệ hay không
        var checkStaff = await Staff.find({staff_id: staff_id}, {phone: 1});
        if (checkStaff.length == 0) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({'msg': "not-exist"}));
            return;
        } else {
            phone = checkStaff[0].phone;
        }
    } else {
        if(cookies._vrf){
            phone = "0" + cookies._vrf
        }
        //kiểm tra số điện thoại có hợp lệ hay không
        var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        //validate giá trị
        if (phone_regex.test(phone) == false) {
            return;
        }
    }

    //kiểm tra mật khẩu và otp
    var otp = typeof (req.body.otp) == "string" && req.body.otp.length >= 6 ? req.body.otp : "err";
    var newpass = typeof (req.body.newpass) == "string" && req.body.newpass.length >= 5 ? req.body.newpass : "err";
    var confirm = req.body.confirm;
    if (otp == "err" || newpass == "err" || confirm !== newpass) {      //nếu lỗi hoặc pass không trung thì return
        return;
    }
    console.log(otp)
    //xác nhận otp
    var vnPhone = "+84" + parseInt(phone)
    console.log(vnPhone);
    client.verify.services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks
      .create({to: vnPhone, code: otp})
      .then(verification_check => {
        if (verification_check.status == "approved") {
            bcrypt.hash(newpass, saltRounds, async function (err, hash) {
                //update
                var respond = await Staff.updateOne({phone: parseInt(phone)}, {$set: {password: hash}});
                if (respond.nModified == 0) { 
                    console.log("update fail");
                    //gửi lại code mới vào số điện thoại
                    client.verify.services(process.env.TWILIO_SERVICE_ID)
                        .verifications
                        .create({to: vnPhone,channel: 'sms'})
                        .then(verification => {
                            res.cookie('_vrf', parseInt(phone), {httpOnly: true, signed: true, expires: new Date(Date.now() + 600000)});
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({'msg': "code-resent"}));
                        });
                } else {
                    //update thành công xóa cookie
                    console.log("update completed");
                    res.clearCookie("_vrf");
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({'msg': "success"}));
                }
            });
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({'msg': "not-match"}));
        }
    });
    
}

//
//Gửi lại mã otp
//
module.exports.resendotp = async function (req, res) {
    //get cookies để xác định số điện thoại
    var cookies = req.signedCookies;
    if(cookies._vrf){
        var phone = "0" + cookies._vrf;
    }

    //kiểm tra số điện thoại có hợp lệ hay không
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    //validate giá trị
    if (phone_regex.test(phone) == false) {
        return;
    }
    
    //kiểm tra số điện thoại có trong database hay không;
    var checkPhone = await Staff.find({phone: parseInt(phone)}, {staff_id: 1});
    if (checkPhone.length == 0) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({'msg': "not-exist"}));
        return;
    }

    //gửi code vào số điện thoại
    var vnPhone = "+84" + parseInt(phone);
    client.verify.services(process.env.TWILIO_SERVICE_ID)
        .verifications
        .create({to: vnPhone, channel: 'sms'})
        .then(verification => {
            console.log("resend")
            res.cookie('_vrf', parseInt(phone), {httpOnly: true, signed: true, expires: new Date(Date.now() + 600000)
            });
            res.writeHead(200, {'Content-Type': 'application/json' });
            res.end(JSON.stringify({'msg': "code-sent" }));
        });

}