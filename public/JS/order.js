//
//curent date
//
document.getElementById('select_date').valueAsDate = new Date();

//
//mặc định
//
getData($("#select_date").val(), "waiting");

//
//Chọn ngày
//
function selectDate() {
    var input = $("#select_date").val();
    var selectDate = new Date(input).setHours(0, 0, 0, 0);
    var current = new Date().setHours(0, 0, 0, 0);

    $("#select_status").text("");
    //hôm nay, có thể tùy chọn giữa đang chờ và đã hoàn tất
    if (selectDate == current) {
        $("#select_status").val("complete");
        var select = `
            <select id="select_status" style="margin-left: 50px; " onchange="selectStatus()">
                <option id="option_waiting" value="waiting">Đang chờ</option>
                <option id="option_complete" value="complete">Hoàn tất</option>
            </select>
            `
        $("#header").append(select);
        getData(input, "waiting")
    } else if (selectDate < current) { //quá khứ, các order đều hoàn tất
        $("#select_status").remove()
        getData(input, "complete")
    } else { //tương lai
        $("#select_status").remove();
        render([]);
    }
}
function selectStatus(){
    var date = $("#select_date").val();
    var status = $("#select_status").val();
    getData(date, status);
}


//
//get data
//
function getData(date, status) {

    $.ajax({
        type: "POST",
        url: "order/selectOrder",
        dataType: "json",
        data: {
            date: new Date(date),
            status: status
        },
        cache: false
    }).done(function (data) {
        //render data
        render(data.data);
    }).fail(function () {
        var msg = "Yêu cầu không thành công"
        alertFail("abc", msg);
    });
}
//
//Render data
//
function render(data) {
    $("#table_body table tr").remove();
    if (data.length == 0) {
        $("#table_body table").append(`<tr class="no-data"><td>Không có dữ liệu</td></tr>`);
        return;
    }

    data.forEach(function(data, index) {
        //lấy thời gian
        var convertedTimebegin = convertTZ(data.time_begin, "Asia/Ho_Chi_Minh");
        var convertedTimeend = convertTZ(data.time_end, "Asia/Ho_Chi_Minh");

        //thời gian bắt đầu
        var begin_hour = convertedTimebegin.getHours();
        if(begin_hour < 10){
            begin_hour = "0" + begin_hour;
        }

        var begin_minute = convertedTimebegin.getMinutes();
        if(begin_minute < 10){
            begin_minute = "0" + begin_minute;
        }
        //thời gian kết thúc
        var end_hour = convertedTimeend.getHours();
        if(end_hour < 10){
            end_hour = "0" + end_hour;
        }

        var end_minute = convertedTimeend.getMinutes();
        if(end_minute < 10){
            end_minute = "0" + end_minute;
        }
        //order có đang waiting thì ko có thời gian kết thúc
        if (data.status == "waiting") {
            
            var time = end_hour + ":" + end_minute;
            //lấy đơn đầu tiên làm đang pha chế
            if(index == 0){
                status = "đang pha chế";

                //màu sắc của đơn đang pha chế
                var part0 = `<tr style="background-color: #aedeec" class="row_queue" id="row_${index}">`
            } else {
                //các đơn tiếp theo vẫn giữ đang chờ
                status = "đang chờ"

                //thay đổi màu sắc xen kẽ
                if(index % 2 ==0){
                    var part0 = `<tr style="background-color: #ffeadb" class="row_queue" id="row_${index}">`
                } else {
                    var part0 = `<tr style="class="row_queue" id="row_${index}">`
                }
            }

        //các đơn đã hoàn tâts
        } else {
            var time = begin_hour + ":" + begin_minute + " - " + end_hour + ":" + end_minute;

            //trang thái 
            status = "hoàn tất"

            //màu sắc background
            if(index % 2 ==0){
                var part0 = `<tr style="background-color: #ffeadb" class="row_queue" id="row_${index}">`
            } else {
                var part0 = `<tr style="class="row_queue" id="row_${index}">`
            }
        }

        //số thứ tự, tên khách, thời gian, td danh sách drink
        var part1 = `
            
                <td style="width: 5%">${index}</td>
                <td style="width: 10%">${data.customer_name}</td>
                <td id="order_time_${index}" style="width: 15%">${time}</td>
                <td class="list_drink" id="drink_${index} style="width: 45%;">
        `

        //list các drink bên trong tđ
        var part2 = "";
        data.drink.forEach(function(drink, index){
            if(drink.price.size_m !== 0){
                price = drink.price.size_m;
                size = "M";
            } else {
                price = drink.price.size_l;
                size = "L";
            }

            if(drink.topping.topping_name !== "false"){  
                var topping = `<span style="color: black; font-weight: 100;">&ensp; + ${drink.topping.topping_name}</span>`
            } else {topping = ""}

            part2 += `
                <p>
                    <span class="drink_name" style=" color: black; font-weight: 100; display: inline-block; width: 120px;">
                    ${drink.drink_name}</span>
                    <span>${drink.qty}x &ensp;</span>
                    <span></span>${price.toLocaleString()} đ &ensp;</span>
                    <span style="display: inline-block; width: 35px;">${size}</span>
                    ${topping}
                </p>
            `
        });

        //Giảm giá, tổng tiền, trạng thái
        var part3 = `
                </td>
                <td style="width: 7%">${data.discount.toLocaleString()} đ</td>
                <td style="width: 8%">${data.total.toLocaleString()} đ</td>
                <td id="status_${index}" style="width: 10%">${status}</td>
            </tr>
        `

        var element = part0 + part1 + part2 + part3;
        $("#table_body table").append(element);

    });
    
    //reder order đang pha chế
    if(data[0].status == "waiting"){
        isMaking(data[0]);
    }
}

//
//convert time sang giờ việt nam
//
function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
        timeZone: tzString
    }));
}
//
//Đơn đang pha chế
//
function isMaking(order){

    $("#drinks ul").text("");

    $("#is_making_zone #customer_name").text(order.customer_name);
    $("#is_making_zone #note").text(order.note);

    var li = "";
    order.drink.forEach(function(drink){

        if(drink.price.size_m !== 0){
            size = "M";
        } else {
            size = "L"
        }

        if(drink.topping.topping_name !== "false"){
            topping = `<span style="font-weight: 100; padding-left: 25px">+ ${drink.topping.topping_name}</span>`
        } else {
            topping = ""
        }

        li += `
            <li>
                <div class="drink">
                    <div class="name" style="width: 70%">
                        <span>${drink.qty}x &nbsp;</span> ${drink.drink_name} <br>
                        ${topping}
                    </div>
                    <div class="size" style="width:30%; text-align:right" >Size <span>&nbsp; ${size}</span></div>
                </div>
                <div class = "check">
                    <input type="checkbox" style="float: right;" onchange="checkdone()">
                </div>
            </li>
        `
    });

    $("#drinks ul").append(li);
    $("#orderDone").val(order.order_id);
}

//
//Xác nhận đơn hoàn tất
//
function confirmDone(){
    var order_id = $("#orderDone").val();

    $.ajax({
        type: "POST",
        url: "order/confirmOrder",
        dataType: "json",
        data: {
            order_id: order_id
        },
        cache: false
    }).done(function (data) {
        if(data.msg == "fail"){
            var msg = "Xác nhận thất bại";
            alertFail(data.id, msg);
        } else {
            var msg = "Đã xác nhận";
            alertSuccess(data.id, msg);
            getData($("#select_date").val(), "waiting");
            cancelConfirm()
        }
    }).fail(function () {
        var msg = "Xác nhận không thành công"
        alertFail("abc", msg);
    });
}

//
//hiển thị confirm 
//
function confirmOrder() {
    $(".confirm_done").slideDown('slow');
    $(".confirm_done").css("display", "flex");
}

//
//Hủy xác nhận
//
function cancelConfirm(){
    $(".confirm_done").slideUp('fast');
}


//hiển thị order realtime
socket.emit("connection");

//
//nhận sự kiện neworder mới
//
socket.on("neworder", (data)=>{
    console.log(data);
    if(data == "success"){
        getData($("#select_date").val(), "waiting");
    }
});


//
//function hiển thị thông báo thành công
//
function alertSuccess(id, msg) {
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${id}_${random}" class="alert alert-success" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);
    setTimeout(function () {
        $("#alert_" + id + "_" + random).fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 2000);
}
//
//function hiển thị thông báo không thành công
//
function alertFail(id, msg) {
    var random = Math.floor(Math.random() * 100) + 1;
    $(".alert_box").append(`
    <div id="alert_${id}_${random}" class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span id="msg">${msg}</span>
    </div>`);

    setTimeout(function () {
        $("#alert_" + id + "_" + random).fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 2000);
}