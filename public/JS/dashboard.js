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
currentDate = date.getFullYear() + "-" + month + "-" + day;
$(".select_date").val(currentDate);

var curentWeek = getWeek(date);
var currentMonth = date.getMonth() + 1;

var currentYear = date.getFullYear();
$(".income_select_year").val(currentYear);

function getWeek(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

//
//chọn xem doanh thu theo ngày/ tháng/ năm
//
$("#income_sort").on("change", function () {
    $(".income_date_zone").hide();
    var sort = $(this).val();
    if (sort == "day") {
        $("#income_select_date").show();
        $("#income_select_year").hide();
        $(".income_select_date").val(currentDate);
        getIncome("day", currentDate, currentYear)
    }
    else if (sort == "week"){
        $("#income_select_week").show();
        $("#income_select_year").show();
        $(".income_select_week").val(curentWeek);
        $(".income_select_year").val(currentYear);
        getIncome("week", curentWeek, currentYear);
    } else{
        $("#income_select_year").show();
        getIncome("month", "null", currentYear);
    }
});

//
//Chọn ngày xem doanh thu
//
$(".income_date_zone .input").on("change", function () {
    var date = $(this).val();
    var sort = $("#income_sort").val();
    var year = $(".income_select_year").val();
    getIncome(sort, date, year);
});

//
//Chọn năm xem doanh thu
//
$(".income_select_year").on("change", function () {
    var year = $(this).val();
    var sort = $("#income_sort").val();
    var week = $(".income_select_week").val();
    getIncome(sort, week, year);
});


//
//mặc định
//
getIncome('day', currentDate, currentYear);
//
//function lấy doanh thu
//
function getIncome(sort, date, year) {
    $.ajax({
        type: "POST",
        url: "/dashboard/getincome",
        dataType: "json",
        data: {
            sort: sort,
            date: date,
            year: year
        },
        cache: false
    }).done(function (data) {
        loadChart(sort, data.finalData, "income_chart")
    }).fail(function () {
        alertFail("fail", "Có lỗi xảy ra khi gửi yêu cầu")
    });
}


//
//chọn xem lượt khách theo ngày/ tháng/ nắm
//
$("#customer_visit_sort").on("change", function () {
    $(".customer_visit_zone").hide();
    var sort = $(this).val();
    if (sort == "day") {
        $("#customer_visit_select_date").show();
        $("#customer_visit_select_year").hide();
        $(".customer_visit_select_date input").val(currentDate);
        getCustomerVisit("day", currentDate, "null");

    }
    else if (sort == "week"){
        $("#customer_visit_select_week").show();
        $("#customer_visit_select_year").show();
        $(".customer_visit_select_week").val(curentWeek);
        $(".customer_visit_select_year").val(currentYear);
        getCustomerVisit("week", curentWeek, currentYear);
    } else{
        $("#customer_visit_select_year").show();
        $(".customer_visit_select_year").val(currentYear);
        getCustomerVisit("month", "null", currentYear);
    }
    
});

//
//Chọn ngày xem lượt khách
//
$(".customer_visit_zone .input").on("change", function () {
    var sort = $("#customer_visit_sort").val();
    var date = $(this).val();
    var year = $(".customer_visit_select_year").val();
    getCustomerVisit(sort, date, year);
});

//
//Chọn ngày xem lượt khách
//
$(".customer_visit_select_year").on("change", function () {
    var sort = $("#customer_visit_sort").val();
    var week = $(".customer_visit_select_week").val();
    var year = $(".customer_visit_select_year").val();
    getCustomerVisit(sort, week, year);
});

///
//Mặc định
///
getCustomerVisit("day", currentDate, "null")

//
//Hàm get lượt visit
//
function getCustomerVisit(sort, date, year) {
    
    $.ajax({
        type: "POST",
        url: "/dashboard/getcustomervisit",
        dataType: "json",
        data: {
            sort: sort,
            date: date,
            year: year
        },
        cache: false
    }).done(function (data) {
        loadChart(sort, data.finalData, "customer_visit_chart");
    }).fail(function () {
        alertFail("fail", "Có lỗi xảy ra khi gửi yêu cầu")
    });
}


//
//function load chart
function loadChart(sort, customData, chart_id) {
    google.charts.load('current', {
        'packages': ['line']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();

        if (sort == "day") {
            var date = "ngày";
            data.addColumn('string', 'ngày');
        } else if (sort == "week") {
            var date = "tuần";
            data.addColumn('number', 'tuần');
        } else {
            var date = "tháng";
            data.addColumn('number', 'tháng');
        }
        
        if(chart_id == "customer_visit_chart"){
            data.addColumn('number', 'Lượt khách');
            var chart = new google.charts.Line(document.getElementById('customer_visit_chart'));
            var title = "lượt khách";
            var unit = "Lượt";
        } else {
            data.addColumn('number', 'Doanh thu');
            var chart = new google.charts.Line(document.getElementById('income_chart'));
            var title = "doanh thu";
            var unit = "VND"
        }
        var options = {
            chart: {
                title: `Biểu đồ ${title} theo ` + date,
                subtitle: `(${unit})`,
                chartArea:{width:"70%",height:"100%"}
            }
        };
        data.addRows(customData);

        chart.draw(data, google.charts.Line.convertOptions(options));
    }
}
