//
//Chuyển sang trang xác nhận đổi mật khẩu
//
$("#btn_change_pass").on("click", function () {
    $(".layout").hide();
    $(".changepassAlert").show()
});

//
//chuyển sang trang đổi mật khẩu
//
$("#btn_yes").on("click", function () {

    $.ajax({
        type: "POST",
        url: "/login/changepass/getotp",
        dataType: "json",
        data: {},
        cache: false
    }).done(function(data){
        console.log(data);
        if(data.msg == "code-sent"){
            alertSuccess("success","Mã xác nhận đã được gửi cho bạn");
            $(".layout").hide();
            $("#otpConfirm").show();
            $("#btn_change_pass").attr("disabled", "true");
        } else {
            alertFail("fail", "Có lỗi khi gửi mã otp")
        }
    }).fail(function(){
        alertFail("fail", "Yêu cầu không thể thực hiện")
    });
    
});

//
//hủy, không đổi mật khẩu
//
$(".btn_no").on("click", function () {
    $(".layout").hide();
    $(".info").show();
    document.getElementById("otpConfirm").reset();
    $("#btn_change_pass").attr("disabled", false);
});

//
//xác nhận đổi mật khẩu
//
$("#otpConfirm").submit(function() {
    $("#confirm_new_pass").click()
    return false;
})
$("#confirm_new_pass").on("click", function () {
    var flag = 0; //không có lỗi
    var newpass = $("#newpass").val();
    var confirm = $("#confirm_pass").val();
    var otp = $("#otp").val();

    if(otp.length < 6) {
        alertFail("fail", "Mã xác nhận không hợp lệ");
        flag = 1;
    }

    if(newpass.length == 0) {
        alertFail("fail", "password không được để trống");
        flag = 1;
    } else if(newpass.length < 5){
        alertFail("fail", "password phải tối thiểu 5 kí tự");
        flag = 1;
    } else {
        if(newpass !== confirm){
            alertFail("fail", "Mật khẩu nhập lại không trùng khớp");
            flag = 1;
        }
    }
    if(flag == 0){
        $.ajax({
            type: "POST",
            url: "/login/changepass/confirmotp",
            dataType: "json",
            data: {otp: otp, newpass: newpass, confirm: confirm},
            cache: false
        }).done(function(data){
            console.log(data);
           if(data.msg == "code-resent"){
               alertFail("fail", "Có lỗi khi đổi mật khẩu, thử lại với mã số mới")
           } else if(data.msg == "success") {
               alertSuccess("success", "Đổi mật khẩu thành công");
               //reset form
                document.getElementById("otpConfirm").reset();
                $(".btn_no").click();
                $("#btn_change_pass").attr("disabled", false);

           } else {
            alertFail("not-match", "Mã xác nhận không đúng");
           }
        }).fail(function(){
            alertFail("fail", "Yêu cầu không thể thực hiện")
        });
    }
    
    return false;
});


//
//Gửi lại mã 
//
$(".resendOTP").on("click", function(){
    console.log("click")
    $.ajax({
        type: "POST",
        url: "/login/changepass/resendotp",
        dataType: "json",
        data: {},
        cache: false
    }).done(function(data){
        console.log(data)
        if(data.msg == "not-exist"){
            alertFail("fail", "Số điện thoại chưa được đăng kí")
        } else {
            alertSuccess("resend", "Mã xác nhận mới đã được gửi")
            $("#otp").val("");
        }
    }).fail(function(){
        alertFail("fail", "Yêu cầu không thể thực hiện")
    });
});


//
//đóng thông tin
//
$("#close_btn").on("click", function () {
    $(".layout").hide();
    $(".info").show();
    document.getElementById("otpConfirm").reset();
    $("#btn_change_pass").attr("disabled", false);
});


//
//Đăng xuất
//
$("#btn_logout").on("click", function () {
    $.ajax({
        type: "POST",
        url: "/login/logout",
        dataType: "json",
        data: {},
        cache: false
    }).done(function(data){
        console.log(data.msg)
        if(data.msg == "logout"){
            window.location.href = "/login";
        }
    }).fail(function(){
        alertFail("fail", "Yêu cầu không thể thực hiện")
    });
});
//
//Hiệu ứng các input 
//
$("#otpConfirm .input input").on("focusin", function(){
    $(this).siblings(".fas").css({"margin-left": "-7px", "z-index": "10000"});
    $(this).siblings("#otp_label").css("margin-left", "-2px");
    
});
$("#otpConfirm .input input").on("focusout", function(){
    $(this).siblings(".fas").css({"margin-left": "4px", "z-index": "10000"});
});

//
//function hiển thị thông báo thành công
//
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