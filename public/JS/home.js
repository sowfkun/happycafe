//
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
    $("#list_" + id).show();
});

//
//checkbox giá tiền thức uống. chỉ được chọn 1 trong 2
//
function priceChecked(id, num) {
    $('.sizeSelect_' + id).prop('checked', false);
    $('#sizeSelect_' + id + "_" + num).prop('checked', true);
};

//
//chọn topping
//
$(".topping_show").on("click", function () {
    console.log("click");
    $(this).css("color", "#ed9652")
    $(this).siblings(".topping_list").slideDown();
});

$(".topping_close").on("click", function () {
    $(this).css("color", "#eeceb7")
    $(this).parents(".topping_list").slideUp();
});

function toppingSelect(drink_id, topping_id, toppingName) {
    $("#topping_input_" + drink_id).val(topping_id);
    $("#topping_show_" + drink_id).val(toppingName);
    $("#topping_" + drink_id).hide();
}

//
// chọn thức uống
//
var items = [];

function choseDrink(id) {
    var form = "#drinkForm_" + id;
    //lấy các input từ form dạng array
    var drink = $(form).serializeArray();
    console.log(drink);
    //phần tử 0 là id
    var drink_id = drink[0].name == "drink_id" ? drink[0].value : false;
    var drink_name = drink[1].name == "drink_name" ? drink[1].value : false;
    //phần tử thứ 1 là size m hoặc size l
    //nếu phần tử thứ 1 là topping thì return vì giá chưa được chọn
    if (typeof (drink[2]) == "undefined" || drink[2].name == "topping") {
        var msg = "Chưa chọn giá";
        alertFail(drink_id, msg);
        return;
    } else if (drink[2].name == "size_m") {
        size_m = parseInt(drink[2].value);
        size_l = 0;
    } else if (drink[2].name == "size_l") {
        size_m = 0;
        size_l = parseInt(drink[2].value);
    }

    var topping = typeof (drink[3]) !== 'undefined' && drink[3].value !== "false" ? drink[3].value : false;
    var toppingName = typeof (drink[4]) !== 'undefined' && drink[4].value !== "" ? drink[4].value : false;

    var newItem = {
        drink_id: drink_id,
        drink_name: drink_name,
        size_m: size_m,
        size_l: size_l,
        topping: topping,
        toppingName: toppingName,
        qty: 1
    }

    //nếu là item đầu tiên thì push luôn
    if (items.length == 0) {
        items.push(newItem);
    } else {
        //nếu là item thứ 2 trở đi thì kiểm tra xem có tồn tại chưa
        var flag = 0;
        items.forEach((item) => {
            if (item.drink_id == newItem.drink_id && (item.size_m == newItem.size_m || item.size_l == newItem.size_l) && item.topping == newItem.topping) {
                console.log("Thức uống đã tồn tại");
                //số lượng +1
                item.qty += 1;
                flag = 1;
                return;
            }
        });

        if (flag == 0) { //flag vẫn giữ giá trị 0 tức là không phát hiện item trùng
            items.push(newItem);
        }
    }

    //reset form sau khi chọn
    $('.sizeSelect_' + id).prop('checked', false);
    $("#topping_input_" + drink_id).val("false");
    $("#topping_show_" + drink_id).val("");
    console.log(items);

    //load các item lên bill
    loadItem();
    totalMoney(items);
}

//
//function render items lên bill
//
function loadItem() {
    var list = '';
    items.forEach((item, index) => {

        if (index % 2 == 1) {
            var background = `<li id ="item_${index}" style="background: seashell">`
        } else {
            var background = `<li id ="item_${index}">`
        }
        //element số lượng
        var qty = `
                <div class="qty" id="qty_${index}">
                    <i class="arrow left"></i>
                    <input class="qty_input" id="qty_input_${index}" type="number" min="1" value="${item.qty}" onchange="updateQty(${index})">
                    <i class="arrow right"></i>
                </div>
            `
        //element tên, size và topping, giá
        if (item.size_m !== 0) { //item này là size vừa

            //element tên, size
            var info = `
                <div id="drink">
                    <div id="chosen_drink_name">
                        <div style = "width:60%; color: black;"><span>${item.drink_name}</span></div>
                        <div><span style="color: #ed9652;">&emsp;(M)</span></div>
                    </div>`;

            if (item.topping !== false) { //có topping
                info += `
                    <div class="billTopping">
                        <p style="color: black">${item.toppingName} &ensp; <span style="color: #ed9652;">+10,000 đ</span></p>
                    </div>`
            } 

            info += `
                </div>
                <div id="chosen_drink_price">
                    <p>${item.size_m.toLocaleString().replace(".",",")} đ</p>
                </div>
                `
        } else { //item này là size lớn      
            //element tên, size
            var info = `
            <div id="drink">
                <div id="chosen_drink_name">
                    <div style = "width:60%; color: black;"><span>${item.drink_name}</span></div>
                    <div><span style="color: #ed9652;">&emsp;(L)</span></div>
                </div>`;

            if (item.topping !== false) { //có topping
                info += `
                    <div class="billTopping">
                        <p style="color: black">${item.toppingName} &ensp; <span style="color: #ed9652;">+10,000 đ</span></p>
                    </div>`
            } 

            info += `
                </div>
                <div id="chosen_drink_price">
                    <p>${item.size_l.toLocaleString().replace(".",",")} đ</p>
                </div>
                `
        }
        var dropdrink = `
                <div id="drop_drink">
                    <img class="drop_drink" onclick="confirmDelete(${index})" src="Resources/icon/close.png" height="20px">
                </div>
            </li>
            <div id="confirm_${index}" class="confirm_delete">
                <p>Bạn có chắc muốn xóa?</p>
                <button type="button" style="background-color: blue;" onclick="deleteItem(${index})">Xóa</button>
                <button type="button" style="background-color: red;" onclick="cancelDelete(${index})">Thoát</button>
            </div>

        `

        var newElement = background + qty + info + dropdrink;
        list += newElement;
    });
    //xóa list cũ
    var node = document.getElementById('list_drink');
    node.innerHTML = "";
    //append list mới
    $("#list_drink").append(list);

    //
    //thay đổi số lượng bằng dấu mũi tên                      
    //
    $(".arrow").on("click", function () {

        //lấy index của item cần cập nhật
        var id = $(this).siblings("input.qty_input").attr('id');
        var index = id.replace("qty_input_", "");

        //lấy số lượng hiện tại
        var qty = $(this).siblings("input.qty_input").val();
        if ($(this).hasClass("right")) {
            qty++;

            //giới hạn số lượng tối đa là 10
            if (qty > 10) {
                qty = 10;
                $(this).siblings("input.qty_input").val(10);
            } else {
                $(this).siblings("input.qty_input").val(qty);
            }
            //cập nhật số lượng trong biến items
        } else {
            qty--;
            if (qty >= 1) {
                $(this).siblings("input.qty_input").val(qty);
            } else { //< 0 gọi hàm xóa
                qty = 1;
                confirmDelete(index);
            }
        }
        //cập nhật lại số lượng
        items[index].qty = qty;
        console.log(items);
        //tính lại tổng tiền
        totalMoney(items);
    });
}

//thay đổi bằng cách nhập trực tiếp
function updateQty(index) {
    var qty = $("#qty_input_" + index).val();
    qty = parseInt(qty);
    if (qty > 10) {
        qty = 10;
        $("#qty_input_" + index).val(10);
    } else if (qty < 1) {
        qty = 1;
        $("#qty_input_" + index).val(1);
        confirmDelete(index);
    }
    //cập nhật lại số lượng
    items[index].qty = qty;
    console.log(items);
    //tính lại tổng tiền
    totalMoney(items);
}

//
//mở hộp thoại xác nhận xóa
//
function confirmDelete(index) {
    $("#confirm_" + index).slideDown('fast');
    $("#confirm_" + index).css("display", "flex");
}

//
//xóa item
//
function deleteItem(index) {
    console.log("xóa item " + items[index].drink_name);
    items.splice(index, 1);
    loadItem();
    totalMoney(items);
}

//
//hủy xóa
//
function cancelDelete(index) {
    $("#confirm_" + index).slideUp('fast');
    console.log("hủy xóa")
}

//
//Chọn ngày cho bill
//
function updateTime(){
    var date = new Date();

    if (date.getDate() < 10) {
        var day = "0" + date.getDate();
    } else {
        var day = date.getDate();
    }
    if (date.getMonth() < 10) {
        var month = "0" + (date.getMonth() + 1) ;
    } else {
        var month = date.getMonth() + 1;
    }

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    date =  day + "/" + month + "/" + date.getFullYear() + "     " + hour + ":" + minute + ":" + second;
    $("#bill_date").val(date);
}
updateTime();
setInterval(updateTime, 1000);
//
//Tính tổng tiền
//
function totalMoney(items) {
    var total = 0;
    items.forEach((item) => {
        //giá size m * số lượng
        if (item.size_m !== 0) {
            total += item.size_m * item.qty;
        } else {
            //Giá size l * số lượng
            total += item.size_l * item.qty;
        }

        //nếu có topping thì cộng thêm 10000 * số lượng
        if (item.topping !== false) {
            total += 10000 * item.qty;
        }
    });
    $("#totalMoney").val(total);
    $("#alt_totalMoney").val(total.toLocaleString().replace(".", ","));

    moneyBalance();
    return total;
}

//
//tính tiền thừa
//
function moneyBalance() {
    var totalMoney = parseInt($("#totalMoney").val());
    var paid = $("#paid").val().replace(",", "");

    if(paid == ""){
        paid = 0;
    } else {
        paid = parseInt(paid);
    }
    var change = paid - totalMoney;

    $("#paid").val(paid.toLocaleString().replace(".", ","))
    $("#changeMoney").text(change.toLocaleString().replace(".", ",") + " đ");
    return change;
}


//
//Xác nhận đặt món
//
function confirmOrder(){
    //check item
    if(items.length == 0){
        alertFail("empty", "Bạn chưa chọn món");
        return;
    }
    //check tên khách
    var customer = $("#customer input").val();
    if(customer == ""){
        alertFail("empty", "Bạn chưa nhập tên khách");
        return;
    }
    var note = $("#note input").val().trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");

    //check balance
    var changeMoney = moneyBalance();
    if(changeMoney < 0){
        alertFail("fail", "Số tiền không hợp lệ");
        return;
    }

    //Staffid
    var staff_id = $("#staff_id").val();
    //các giá trị đều hợp lệ
    $.ajax({
        type: "POST",
        url: "/createOrder",
        dataType: "json",
        data: {
            items: items,
            customer: customer,
            note: note,
            staff_id: staff_id
        },
        cache: false
    }).done(function (data) {
        console.log(data)
        if(data.msg == "fail"){
            alertFail("fail", "Tạo order không thành công");
        } else {
           alertSuccess("success", "Tạo order thành công");
           //reset lại form
           items = [];
           loadItem();
           totalMoney(items);
           $("#paid").val(0)
           $("#changeMoney").text("0 đ");
           $("#customer input").val("");
           $("#note input").val("")
        }
    }).fail(function() {
        var msg = "Tạo order không thành công"
        alertFail("abc", msg);
    });
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