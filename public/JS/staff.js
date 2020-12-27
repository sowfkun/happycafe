
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
        staffs.forEach((staff) => {
            renderUser(staff);
        });
    }).fail(function () {
        alertFail("abc", "Yêu cầu không thể thực hiện");
    });
}

//
//function render new user
//
function renderUser(data){
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
    }
    
    //
    //Đổi màu background xen kẽ
    //
    var index = data.staff_id.match(/[\p{L}-]+[a-zA-Z]+|[0-9]+/ug);
    var index = parseInt(index[1].slice(4));
    if(index % 2 !== 0){
        var color = `
            <tr style="background-color: #ffeadb" class="row_queue" id="row_${index}" onclick="showEdit('${data.staff_id}')">
        `
    } else {
        var color = `
            <tr class="row_queue" id="row_${index}" onclick="showEdit('${data.staff_id}')">
        `
    }
    //
    //Thông tin 
    //
    var info = `
            <td style="width: 10%">${data.staff_id}</td>
            <td style="width: 18%">${data.name}</td>
            <td style="width: 7%">${sex}</td>
            <td style="width: 15%">0${data.phone}</td>
            <td style="width: 20%">${data.email}</td>
            <td style="width: 10%">${data.period}</td>
            <td style="width: 10%">${position}</td>
            <td style="width: 20%">${data.salary.toLocaleString()} VND</td>
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
        <form action="staff/update" method="POST" id="update_form_${data.staff_id}" class="update_form" enctype="multipart/form-data">
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
                                <select style="width:100%" id="position_${data.staff_id}" value="${data.position}" name="position" onchange="enableBtn('${data.staff_id}')">
                                    <option value="bartender">Pha chế</option>
                                    <option value="cashier">Thu ngân</option>
                                    <option value="manager">Quản lý</option>
                                    <option value="waiter">Phục vụ</option>
                                    <option value="security">Bảo vệ</option>
                                </select>
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
                                <label class="error" style="display: none;"></label>
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
                                <label class="error" style="display: none;"></label>
                            </div>
                        </div>
                    </div>
                </div>
                <!--button submit edit-->
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-cancel" data-dismiss="modal"
                        onclick="cancelUpdate('${data.staff_id}')" style="background-color: red;">Hủy</button>
                    <button id="btn_update_${data.staff_id}" class="btn btn-default btn_update" disabled type="button"
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
        alertFail("img","Bạn chưa chọn ảnh")
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
            renderUser(data.data);
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
    
    var valid = $("#update_form_" + id).valid();
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
            console.log(data.data.$set);
            alertSuccess("success","Update thành công");

        }
    }).fail(function() {
        alertFail("fail", "Yêu cầu không thể thực hiện")
    });
}

//
//Hủy cập nhật
//
function cancelUpdate(id) {
    var id = "update_form_" + id;
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

