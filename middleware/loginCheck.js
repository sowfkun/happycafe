var Staff = require("../models/staff_model");

module.exports.managerOnly = async (req, res, next) => {
    //get cookies từ req
    var cookies = req.signedCookies;
    var id = cookies._id;

    console.log(id);
    //nếu không có id (chưa đăng nhập) thì quay về trang đăng nhập
    if(typeof(id) == "undefined"){
        res.redirect('/login');
        return
    } 

    //nếu có, kiểm tra id có trong database hay không (tránh trường hợp thay đổi bừa cookies)
    //kiểm tra có phải manager hay không
    var staff = await Staff.find({staff_id: id}, {_id: 0});
    
    if(staff.length == 0 || staff[0].position !== "manager") {
        res.redirect('back');
        return;
    }

    //đăng nhập hợp lệ
    res.locals.staff = staff[0];
    next();
}

module.exports.allowAll = async (req, res, next) => {
    //get cookies từ req
    var cookies = req.signedCookies;
    var id = cookies._id;

    //nếu không có id (chưa đăng nhập) thì quay về trang đăng nhập
    if(typeof(id) == "undefined"){
        res.redirect('/login');
        return
    } 

    //nếu có, kiểm tra id có trong database hay không (tránh trường hợp thay đổi bừa cookies)
    //Trang này tất cả được truy cập
    var staff = await Staff.find({staff_id: id}, {_id: 0});
    
    if(staff.length == 0) {
        res.redirect('/login');
        return;
    }

    //đăng nhập hợp lệ
    res.locals.staff = staff[0];
    next();
}