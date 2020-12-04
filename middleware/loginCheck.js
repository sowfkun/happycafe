var Staff = require("../models/staff_model");

module.exports.check = async (req, res, next) => {
    //get cookies từ req
    var cookies = req.signedCookies;
    var id = cookies._id;

    //kiểm tra id có trong database hay không
    var staff = await Staff.find({staff_id: id}, {_id: 0});
    if(staff.length !== 0){
        res.locals.staff = staff[0];
        res.locals.isLogin = true;
    } else {
        res.locals.isLogin = false;
    }
    next();
}