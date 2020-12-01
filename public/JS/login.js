//
//Hiệu ứng các input khi load page
//
function loadFunction(){
    $("#image").css("opacity", 100);
}
//
//Hiệu ứng các input khi load page
//
$(".input input").on("focusin", function(){
    $(this).siblings(".fas").css("margin-left", "-7px");
});
$(".input input").on("focusout", function(){
    $(this).siblings(".fas").css("margin-left", "4px");
});

//
//chuyển đổi trang đăng nhập và trang quên mật khẩu
//
$("#switch_to_forget_pass").on("click", function(){
    console.log("click")
    $("#login_form").hide();
    $("#forget_pass").show();
});
$("#switch_to_login").on("click", function(){
    $("#login_form").show();
    $("#forget_pass").hide();
});

//
//Đăng nhập
//
$("#btn_login").on('click', function(){
    //lấy giá trị số điện thoại và mật khẩu
    var phone = $("#login_form #phone").val().trim();
    var password = $("#login_form #password").val().trim();
    
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    //validate giá trị
    if(phone == ""){
        var msg1 = "Vui lòng nhập số điện thoại";
        alertFail("phone", msg1);
        return;
    } else if(phone_regex.test(phone) == false){
        var msg1 = "Số điện thoại không hợp lệ";
        alertFail("phone", msg1);
        return;
    }
    //kiểm tra password
    if(password == "") {
        var msg2 = "Vui lòng nhập password";
        alertFail("password", msg2);
        return;
    } else if(password.length < 5) {
        var msg2 = "Password tối thiểu phải có 5 kí tự";
        alertFail("password", msg2);
        return;
    }
    
    //các giá trị đều hợp lệ
    $.ajax({
        type: "POST",
        url: "/login",
        dataType: "json",
        data: {phone: phone, password: password},
        cache: false
    }).done (function (data) {
        console.log(data)
        if(data.msg == "success"){
            //hiển thị thông báo
            var msg = "Đăng nhập thành công";
            alertSuccess(data.id, msg)
        } else {
            var msg = "Số điện thoại hoặc mật khẩu không đúng"
            alertFail(data.id, msg);
        }
    }).fail(function() {
        var msg = "Đăng nhập không thành công"
        alertFail("abc", msg);
    });
    
});


//
//function hiển thị thông báo thành công
function alertSuccess(id, msg){
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${id}_${random}" class="alert alert-success" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    setTimeout(function(){
        $("#alert_" + id + "_" + random).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 2000);
}
//
//function hiển thị thông báo không thành công
//
function alertFail(id, msg){
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${id}_${random}" class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    
    setTimeout(function(){
        $("#alert_" + id + "_" + random).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 2000);
}