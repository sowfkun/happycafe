//danh mục và topping

$("#topping-container").hide();

$(".nav-tabs #menu").on("click", function () {
    $(this).addClass("active");
    $(".nav-tabs #topping").removeClass("active");
    $("#menu-container").show();
    $("#topping-container").hide();
});
$(".nav-tabs #topping").on("click", function () {
    $(this).addClass("active");
    $(".nav-tabs #menu").removeClass("active");
    $("#topping-container").show();
    $("#menu-container").hide();
});



//click để hiện thức uống theo danh mục
//

//lấy danh mục đang active
var active = $(".menu .active")[0].id;
//danh sách của active hiện, còn lại ẩn
$(".listGroupByCategory").hide();
$("#list_" + active).show();
//khi click vào danh mục
$(".menu .cate_name").on("click", function () {
    //các danh mục khác bỏ class active
    $(".cate_name").removeClass("active");
    // li được click thêm class active
    $(this).addClass("active");
    //ẩn list đang hiện
    $(".listGroupByCategory").hide();
    //lấy id để trỏ đến list cần hiện
    var id = $(".menu .active")[0].id;
    //hiển thị list
    $("#list_" + id).show();
});


//
//kiểm tra update form có hợp lệ không
//
function checkform(id) {
    var form = "#update_form_" + id;
    var value = $(form).serializeArray();

    console.log(value);
    var size_m = value[1].value !== "" && (parseInt(value[1].value) >= 30000) ? parseInt(value[1].value) : 0;
    var size_l = value[2].value !== "" && (parseInt(value[2].value) >= 30000) ? parseInt(value[2].value) : 30000;

    if (size_m >= size_l) {
        size_m = 0;
    }

    $("#size_m_" + id).val(size_m);
    $("#size_l_" + id).val(size_l);

    $("#btn_" + id).attr("disabled", false);
}

//
//Hàm cập nhật drink
//
// function updateDrink(id){
//     var form = document.getElementById('update_form_'+ id);
//     var formData = new FormData(form);

//     $.ajax({
//         type: "POST",
//         url: "drink/update",
//         data: formData,
//         contentType: false, 
//         processData: false
//     });
// }

//
//Hủy cập nhật
//
function cancekUpdate(id) {
    //hủy dữ liệu đã nhập nếu nhấn nút hủy
    var reload_id = "#update_form_" + id;
    $(reload_id).load(location.href + " #update_form_" + id + ">*", "");
};


//
//kiểm tra form create
//
function check_new_drink_form() {
    var form = "#create_form";
    var value = $(form).serializeArray();

    var name = value[1].value.trim();
    $("#enter_name").val(name);

    console.log(value);
    //size_l là phần tử 2
    var size_l = value[2].value !== "" && (parseInt(value[2].value) >= 30000) ? parseInt(value[2].value) : 30000;
    //size_m là phần tử thứ 3
    var size_m = value[3].value !== "" && (parseInt(value[3].value) >= 30000) ? (parseInt(value[3].value)) : 0;

    //nếu size m > size l thì gán size m = 0
    if (size_m >= size_l) {
        size_m = 0;
    }

    //cập nhật lại giá
    $("#size_m").val(size_m);
    $("#size_l").val(size_l);

    //hiện tips nếu nhập sai giá
    $(".create_price_tips").css("display", "none");
    //size l phải lớn hơn hoặc = 30000
    if (parseInt(value[2].value) < 30000) {
        $(".create_price_tips").css("display", "block");
    } else if (value[3].value !== "0" && parseInt(value[3].value) < 30000) { //size m có thể =0, và phải lớn hơn = 30000
        $(".create_price_tips").css("display", "block");
    } else if (parseInt(value[2].value) <= parseInt(value[3].value)) { //size m phải nhở hơn size l
        $(".create_price_tips").css("display", "block");
    }

    //enable nút tạo
    var img = $("#drinkImg").val();
    if (value[1].value !== "" && img !== "") {
        $("#btn_create").attr("disabled", false);
    }
}

//
//hướng dẫn nhập giá
//
$(".price_tips").siblings(".create_price_tips").hide();
$(".price_tips").hover(function () {
    $(this).siblings(".create_price_tips").fadeIn();
    $(this).css("cursor", "pointer");
}, function () {
    $(this).siblings(".create_price_tips").fadeOut();
});

//
//Tạo danh mục mới
//
function cateCreate(){
    var id = $("#new_menu_id").val().trim();
    var name = $("#new_menu_name").val().trim();

    $.ajax({
        type: "POST",
        url: "drink/categoryCreate",
        dataType: "json",
        data: {category_id: id, name: name},
        cache: false
    }).done (function (data) {
        console.log(data)
        if(data.msg == "success"){
            //hiển thị thông báo
            var msg = "Tạo danh mục thành công";
            alertSuccess(data.id, msg)

            //thêm danh mục mới vào list danh mục
            $(".menu").append(`
            <li  style="display: flex; flex-direction:row;">
            <div style="width: 80%">
                <span class="cate_name" id="${data.id}">${data.name}</span>
            </div>
            <form id="update_cate_${data.id}">
                <label class="switch">
                    <input id="input_${data.id}" type="checkbox" onchange="update_category('${data.id}')">
                    <span class="slider round"></span>
                </label> 
            </form>
            </li>
            `);

            //thêm danh mục mới vào chọn danh mục ở phần tạo thức uống mới
            $("#select_category").append(`
            <option value="${data.id}">${data.name}</option>
            `)
        } else if(data.msg == "exist") {
            var msg = "Danh mục đã tồn tại"
            alertFail(data.id, msg);
        } else {
            var msg = "Tạo danh mục không thành công"
            alertFail(data.id, msg);
        }
    }).fail(function() {
        var msg = "Tạo danh mục không thành công"
        alertFail(id, msg);
    });
}

//
//active or inactive một danh mục
//
function update_category(id) {
    var status = $("#input_" + id).prop("checked");
    console.log(status);

    $.ajax({
        type: "POST",
        url: "drink/categoryUpdate",
        dataType: "json",
        data: {category_id: id, status: status},
        cache: false
    }).done (function (data) {
        console.log(data)
        if(data.msg == "success"){
            var msg = "Cập nhật " + data.id + " thành công"
            alertSuccess(data.id, msg)
        } else {
            var msg = "Cập nhật " + data.id + " không thành công"
            alertFail(data.id, msg);
            var check = $("#input_" + id).prop("checked");
            if (check == true){
                $("#input_" + data.id).prop("checked",false)
            } else {
                $("#input_" + data.id).prop("checked",true)
            }
        }
    }).fail(function() {
        var msg = "Cập nhật " + id + " không thành công"
        alertFail(id, msg);
        var check = $("#input_" + id).prop("checked");
        if (check == true){
            $("#input_" + id).prop("checked",false)
        } else {
            $("#input_" + id).prop("checked",true)
        }
    });
}

//
//Tạo topping mới
//
function toppingCreate(){
    var id = $("#new_topping_id").val().trim();
    var name = $("#new_topping_name").val().trim();

    $.ajax({
        type: "POST",
        url: "drink/toppingCreate",
        dataType: "json",
        data: {topping_id: id, name: name},
        cache: false
    }).done (function (data) {
        console.log(data)
        if(data.msg == "success"){
            //hiển thị thông báo
            var msg = "Tạo topping thành công";
            alertSuccess(data.id, msg)

            //thêm danh mục mới vào list danh mục
            $(".topping").append(`
            <li id="${data.id}" style="display: flex; flex-direction:row">
                <div style="width:80%;">
                    <span>${data.name}</span>
                </div>
                <form id="update_topping_${data.id}">
                    <label class="switch">
                    <input id="input_${data.id}" type="checkbox" onchange="update_topping('${data.id}')">
                    <span class="slider round"></span>
                    </label> 
                </form>
            </li>
            `)
        } else if(data.msg == "exist") {
            var msg = "Topping đã tồn tại"
            alertFail(data.id, msg);
        } else {
            var msg = "Tạo topping không thành công"
            alertFail(data.id, msg);
        }
    }).fail(function() {
        var msg = "Tạo topping không thành công"
        alertFail(id, msg);
    });
}

//
//active or inactive topping
//
function update_topping(id){
    var status = $("#input_" + id).prop("checked");
    console.log(status);

    $.ajax({
        type: "POST",
        url: "drink/toppingUpdate",
        dataType: "json",
        data: {topping_id: id, status: status},
        cache: false
    }).done (function (data) {
        console.log(data)
        if(data.msg == "success"){
            var msg = "Cập nhật " + data.id + " thành công"
            alertSuccess(data.id, msg)
        } else {
            var msg = "Cập nhật " + data.id + " không thành công"
            alertFail(data.id);
            var check = $("#input_" + id).prop("checked");
            if (check == true){
                $("#input_" + data.id).prop("checked",false)
            } else {
                $("#input_" + data.id).prop("checked",true)
            }
        }
    }).fail(function() {
        var msg = "Cập nhật " + id + " không thành công"
        alertFail(id, msg);
        var check = $("#input_" + id).prop("checked");
        if (check == true){
            $("#input_" + id).prop("checked",false)
        } else {
            $("#input_" + id).prop("checked",true)
        }
    });
}
//
//function hiển thị thông báo thành công khi update
//
function alertSuccess(id, msg){
    $(".alert_box").append(`
    <div id="alert_${id}" class="alert alert-success" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    setTimeout(function(){
        $("#alert_" + id).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 2000);
}
//
//function hiển thị thông báo không thành công khi update
//
function alertFail(id, msg){
    $(".alert_box").append(`
    <div id="alert_${id}" class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    
    setTimeout(function(){
        $("#alert_" + id).fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 2000);
}

