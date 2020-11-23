//click để hiện thức uống theo danh mục
//

//lấy danh mục đang active
var active = $(".menu .active")[0].id;
//danh sách của active hiện, còn lại ẩn
$(".listGroupByCategory").hide();
$("#list_" + active).show();

//khi click vào danh mục
$(".menu li").on("click", function () {
    //các danh mục khác bỏ class active
    $(this).siblings("li").removeClass("active");
    // li được click thêm class active
    $(this).addClass("active");
    //ẩn list đang hiện
    $(".listGroupByCategory").hide();
    //lấy id để trỏ đến list cần hiện
    var id = $(".active")[0].id;
    //hiển thị list
    $("#list_" + id).slideDown("slow");
});


//
//kiểm tra update form có hợp lệ không
//
function checkform(id){
    var form = "#update_form_" + id;
    var value = $(form).serializeArray();

    console.log(value);
    var size_m = value[1].value !== "" && (parseInt(value[1].value) >= 30000) ?  parseInt(value[1].value) : 0;
    var size_l = value[2].value !== "" && (parseInt(value[2].value) >= 30000) ?  parseInt(value[2].value) : 30000;

    if(size_m >= size_l){
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
function cancekUpdate(id){
    //hủy dữ liệu đã nhập nếu nhấn nút hủy
    var reload_id = "#update_form_" + id;
    $(reload_id).load(location.href + " #update_form_" + id + ">*","");
};

//////
////
/////
////
function check_new_drink_form() {
    var valid = $("#create_form").valid();
    if (valid == true) {
        $("#btn_create").attr("disabled", false);
    } else {
        $("#btn_create").attr("disabled", true);
    }
}