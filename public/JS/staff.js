
//
//mặc định
//
getStaff("working");

//
//chọn status
//
$("#select_status").on("change", function(){
    var status = $(this).val();
    getStaff(status);
});

//
//function get staff
//
function getStaff(status){

    $.ajax({
        type: "POST",
        url: "/staff/getstaff",
        dataType: "json",
        data: {status: status},
        cache: false
    }).done(function (data) {
        var staffs = data.data;
        $("#table_body table").text("");    
        $(".modal_zone").text("");              
        staffs.forEach((staff, index) => {
            renderUser(staff, index);
        });
        $(".staff_admin").text("");
        $(".staff_admin").append('<option value="admin">Admin</option>')
    }).fail(function () {
        alertFail("abc", "Yêu cầu không thể thực hiện");
    });
}

//
//function render new user
//
function renderUser(data, index){
    //
    //Giới tính
    //
    if(data.sex == "male"){
        sex = "Nam"
    } else {
        sex = "Nữ"
    }
    //
    //Vị trí
    //
    if(data.position == "bartender"){
        position = "Pha chế"
    } else if(data.position == "manager"){
        position = "Quản lí"
    } else if(data.position == "cashier"){
        position = "Thu ngân"
    } else if(data.position == "security"){
        position = "Bảo vệ"
    } else if(data.position == "waiter"){
        position = "Phục vụ"
    } else if(data.position == "admin"){
        position = "admin"
    }
    
    //
    //Đổi màu background xen kẽ
    //
    
    if(index % 2 !== 0){
        var color = `
            <tr style="background-color: #ffeadb" class="row_queue info_${data.staff_id}" id="row_${index}" onclick="showEdit('${data.staff_id}')">
        `
    } else {
        var color = `
            <tr class="row_queue info_${data.staff_id}" id="row_${index}" onclick="showEdit('${data.staff_id}')">
        `
    }
    //
    //Thông tin 
    //
    var info = `
            <td style="width: 10%">${data.staff_id}</td>
            <td style="width: 18%">${data.name}</td>
            <td style="width: 7%">${sex}</td>
            <td id="phone_display" style="width: 15%">0${data.phone}</td>
            <td id="email_display" style="width: 20%">${data.email}</td>
            <td id="period_display" style="width: 10%">${data.period}</td>
            <td id="position_display" style="width: 10%">${position}</td>
            <td id="salary_display" style="width: 20%">${data.salary.toLocaleString()} VND</td>
        </tr>
    `
    //
    //Nút hiển thị modal
    //
    var btn = `
        <!-- Button trigger modal -->
        <button style="display: none;" type="button" id="btn_${data.staff_id}" class="btn btn-primary" data-toggle="modal" data-target="#staffModal_${data.staff_id}">
            Launch demo modal
        </button>
    `

    //
    //modal update 
    //
    var modal = `
    <div class="modal fade" id="staffModal_${data.staff_id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document" style="max-width:700px">
        <form id="update_form_${data.staff_id}" class="update_form" onsubmit="return false;" enctype="multipart/form-data">
            <input type="hidden" name="staff_id" value="${data.staff_id}">
            <div class="modal-content" >
                <!--Header của form-->
                <div class="modal-header">
                    <h4 class="modal-title">Chỉnh sửa thông tin</h4>
                </div>

                <!---->
                <!--Body-->
                <!---->
                <div class="modal-body" style="display:flex; flex-direction: row; justify-content: center;">
                    <!---->
                    <!--Hình ảnh-->
                    <!---->
                    <div id="img_layout">
                        <img id="new_img_${data.staff_id}" src="upload/staff/${data.img}" width="150px" height="150px" style="border: solid 0.5px #ed9652;" >
                        <input type="file" class="img_input" id="img_input_${data.staff_id}" name="new_img" style="display: none;"
                            onchange="loadImg_${data.staff_id}(event), enableBtn('${data.staff_id}')" />
                        <input type="button" style="margin-top: 20px;" class="alter_input" value="Upload" onclick="$(this).siblings('.img_input').click()" />
                    </div>
                    <script>
                        //Function load ảnh mới
                        function loadImg_${data.staff_id}(event) {
                            var reader = new FileReader();
                            reader.onload = function () {
                                var id = "new_img_" + "${data.staff_id}";
                                var img = document.getElementById(id);
                                img.src = reader.result;
                            };
                            reader.readAsDataURL(event.target.files[0]);
                        };
                    </script>
                    
                    <div id="info_layout">
                        <!---->
                        <!--Họ và tên-->
                        <!---->
                        <div id="info_edit">
                            <div class="input_row">
                                <div class="input_label">
                                    <label for="edit_menu">Họ và tên</label>
                                </div>
                                <div class="input">
                                    <input type="text" readonly value="${data.name}">
                                </div>
                            </div>
                        </div>
                        <!---->
                        <!--Giới tính-->
                        <!---->
                        <div class="input_row">    
                            <div class="input_label">
                                <label for="sex">Giới tính</label>
                            </div>
                            <div class="input">
                                <input type="text" readonly value="${sex}">
                            </div>
                        </div>
                        
                        <!---->
                        <!--Số điện thoại-->
                        <!---->
                        <div id="info_edit">
                            <div class="input_row">
                                <div class="input_label">
                                    <label for="edit_menu">Số điện thoại</label>
                                </div>
                                <div class="input">
                                    <input type="text" id="phone" name="phone" value= 0${data.phone} onchange="enableBtn('${data.staff_id}')">
                                    <label id="phone_err_${data.staff_id}" class="error" style="display: none;"></label>
                                </div>
                            </div>
                        </div>
                        <!---->
                        <!--Email-->
                        <!---->
                        <div id="info_edit">
                            <div class="input_row">
                                <div class="input_label">
                                    <label for="edit_menu">Email</label>
                                </div>
                                <div class="input">
                                    <input type="text" id="email" name="email" value="${data.email}" onchange="enableBtn('${data.staff_id}')">
                                    <label id="email_err_${data.staff_id}" class="error" style="display: none;"></label>
                                </div>
                            </div>
                        </div>
                        <!---->
                        <!--Ca làm-->
                        <!---->
                        <div class="input_row" style=" margin: 0; margin-bottom: 15px;">
                            <div class="input_label">
                                <label for="period">Ca làm</label>
                            </div>
                            <div class="input">
                                <select style="width:100%" id="period_${data.staff_id}" name="period" onchange="enableBtn('${data.staff_id}')">
                                    <option value="Sáng">Ca sáng</option>
                                    <option value="Chiều">Ca chiều</option>
                                    <option value="Tối">Ca tối</option>
                                </select>
                                <label id="period_err_${data.staff_id}" class="error" style="display: none;"></label>

                                <script>
                                    $("#period_${data.staff_id}").val('${data.period}');
                                </script>
                            </div>
                        </div>
                        <!---->
                        <!--Vị trí-->
                        <!---->
                        <div class="input_row" style="margin: 0;margin-bottom: 15px;">
                            <div class="input_label">
                                <label for="position">Vị trí</label>
                            </div>
                            <div class="input">
                                <select style="width:100%" class="staff_${data.position}" id="position_${data.staff_id}" value="${data.position}" name="position" onchange="enableBtn('${data.staff_id}')">
                                    <option value="bartender">Pha chế</option>
                                    <option value="cashier">Thu ngân</option>
                                    <option value="manager">Quản lý</option>
                                    <option value="waiter">Phục vụ</option>
                                    <option value="security">Bảo vệ</option>
                                </select>
                                <label id="position_err_${data.staff_id}" class="error" style="display: none;"></label>
                                <script>
                                    $("#position_${data.staff_id}").val('${data.position}');
                                   
                                </script>
                            </div>
                        </div>
                        <!---->
                        <!--Mức lương-->
                        <!---->
                        <div class="input_row" style="margin: 0;margin-bottom: 15px;">
                            <div class="input_label">
                                <label for="salary">Mức Lương</label>
                            </div>
                            <div class="input">
                                <input id="salary" value="${data.salary}" style="width:100%" type="number" name="salary" onchange="enableBtn('${data.staff_id}')">
                                <label id="salary_err_${data.staff_id}" class="error" style="display: none;"></label>
                            </div>
                        </div>
                        <!---->
                        <!--Địa chỉ-->
                        <!---->
                        <div class="input_row"style="margin: 0;margin-bottom: 15px;">
                            <div class="input_label">
                                <label for="salary">Địa chỉ</label>
                            </div>
                            <div class="input">
                                <textarea id="address" style="width:100%; font-size: 16px; border: solid 2px #ed9652;" type="text" name="address" onchange="enableBtn('${data.staff_id}')">${data.address}</textarea>
                                <label id="address_err_${data.staff_id}" class="error" style="display: none;"></label>
                            </div>
                        </div>
                        <!---->
                        <!--Tình trạng làm việc-->
                        <!---->
                        <div class="input_row" style="margin: 0;margin-bottom: 15px;">
                            <div class="input_label">
                                <label for="position">Tình trạng</label>
                            </div>
                            <div class="input">
                                <select style="width: 100%" id="status_${data.staff_id}" name="status" onchange="enableBtn('${data.staff_id}')">
                                    <option value="resign">Đã nghỉ</option>
                                    <option value="working">Đang làm việc</option>
                                </select>
                                <script>
                                    $("#status_${data.staff_id}").val('${data.status}');
                                </script>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <!--button submit edit-->
                <div class="modal-footer">
                    <button type="button" id= "btn_${data.staff_id}"  class="btn btn_modal btn-default btn-cancel" data-dismiss="modal"
                        onclick="cancelUpdate('${data.staff_id}')" style="background-color: red;">Hủy</button>
                    <button id="btn_update_${data.staff_id}" class="btn btn-default btn_modal btn_update" disabled type=""
                        onclick="updateStaff('${data.staff_id}')">Cập nhật</button>
                </div>
            </div>
        </form>
    </div>
    `
    var element = color + info;
    $("#table_body table").append(element);

    var modal_element = btn + modal;
    $(".modal_zone").append(modal_element);

}
 
//
//function show form edit
//
function showEdit(id){
    var id = "#btn_" + id;
    $(id).click();
}

//
//Tạo user mới
//
$("#btn_create").on("click", function (){
    
    //kiểm tra form valid
    var valid = $("#create_form").valid();
    if(valid == false){
        return;
    }
    //kiểm tra xem có ảnh chưa
    var img = $("#staffImg").val();
    if(img == ""){
        alertFail("img","Bạn chưa chọn ảnh");
        return;
    }

    var phone = $("#create_phone").val();
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (phone_regex.test(phone) == false) {
        alertFail("img","Số điện thoại không hợp lệ");
        return;
    }   

    var email = $("#create_email").val();
    var mail_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(mail_regex.test(email) == false){
        alertFail("img","email không hợp lệ");
        return;
    }
    //lấy dữ liệu từ form
    var formData = new FormData($("#create_form")[0]);

    $.ajax({
        type: "POST",
        url: "staff/create",
        data: formData,
        dataType: 'json',
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        cache: false,
    }).done (function (data) {
        if(data.msg1 == "phone-exist"){
            alertFail("fail", "số điện thoại đã tồn tại");
        } 
        if(data.msg2 == "email-exist"){
            alertFail("fail", "Email đã tồn tại");
        }

        if(data.msg == "success"){
            alertSuccess("success","Tạo user thành công")
            var index = $("#table_body .row_queue").length;
            renderUser(data.data, index);
            document.getElementById("create_form").reset();
        }
    }).fail(function() {
        alertFail("fail", "Yêu cầu không thể thực hiện")
    });
});

//
//Bật nút update khi có thay đổi thông tin
//
function enableBtn(id){
    var id = "#btn_update_" + id;
    $(id).attr("disabled", false);
}

//
//Cập nhật nhân viên
//
function updateStaff(id){
    
    var valid = validate(id);
    if(valid == false){
        return;
    }
    var formData = new FormData($("#update_form_" + id)[0]);

    $.ajax({
        type: "POST",
        url: "staff/update",
        data: formData,
        dataType: 'json',
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        cache: false,
    }).done (function (data) {
        if(data.msg1 == "phone-exist"){
            alertFail("fail", "số điện thoại đã tồn tại");
        } 
        if(data.msg2 == "email-exist"){
            alertFail("fail", "Email đã tồn tại");
        }

        if(data.msg == "success"){
            alertSuccess("success", "Update thành công")
            $('#btn_' + data.id).click();
            getStaff("working");

        }
    }).fail(function() {
        alertFail("fail", "Yêu cầu không thể thực hiện")
    });
    return false
}

//
//Validate form update
//
function validate(id){
    var data = $("#update_form_" + id).serializeArray();
    //biến cờ bật 1 nếu lối
    var flag = true;
    //Tắt các thông báo lỗi
    $(".error").hide();
    //kiểm tra số điện thoại
    var phone = data[1].value;
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (phone_regex.test(phone) == false) {
        flag = false;
        $("#phone_err_" + id).text("Số điện thoại không hợp lệ");
        $("#phone_err_" + id).show();
    }
    //kiểm tra email
    var email = data[2].value;
    var mail_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(mail_regex.test(email) == false){
        flag = false;
        $("#email_err_" + id).text("Email không hợp lệ");
        $("#email_err_" + id).show();
    }
    //Kiểm tra mức lương
    var salary = data[5].value;
    if(parseInt(salary) < 3000000){
        flag = false;
        $("#salary_err_" + id).text("Mức lương phải lớn hơn 3 Triệu");
        $("#salary_err_" + id).show();
    }
    //Kiểm tra địa chỉ
    var address = data[6].value.replace(/[\r\n]+/g," ").replace( /  +/g, ' ' ).trim();
    if(address == ""){
        flag = false;
        $("#address_err_" + id).text("Địa chỉ không được để trống");
        $("#address_err_" + id).show();
    }

    return flag;
}
//
//Hủy cập nhật
//
function cancelUpdate(id) {
    var id = "update_form_" + id;
    //Tắt các thông báo lỗi
    $("lable.error").hide();
    document.getElementById(id).reset();
}
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

