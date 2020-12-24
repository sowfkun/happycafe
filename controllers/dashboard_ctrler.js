var Order = require("../models/order_model");
var Drink = require("../models/drink_model");
module.exports.dashboard = async function (req, res) {

    var staff = res.locals.staff;

    var today = new Date();
    var thisMonth = today.getMonth() + 1;
    var thisYear = today.getFullYear();
   
    //
    //Tính tổng lượt truy cập và tổng doanh thu của tháng hiện tại
    //
    var total = await Order.aggregate([
        {
            $project: {
                _id: 0,
                total: 1,
                month: {$month: "$time_begin"},
                year: {$year: "$time_begin"},
                status: 1,
                qty: "$drink.qty"
            }
        },
        { 
            $match: { 
                 status : "complete",
                 year: thisYear,
                 month: thisMonth
            }
        },
        {
            $unset: ["status", "year", "month"]
        }
    ]).then((result) => {
        console.log(result);
        var total_money = 0;
        var total_visit = 0;
        result.forEach(element => {
            total_money += element.total;

            element.qty.forEach(qty => {
                total_visit += qty;
            });
        });
        return {total_money, total_visit};
    });

    //
    //Tím món được yêu thích nhất tháng
    //

    var drinks = await Order.aggregate([
        {
            $project: {
                _id: 0,
                month: {$month: "$time_begin"},
                year: {$year: "$time_begin"},
                status: 1,
                drink_id:  "$drink.drink_id",
                drink_qty: "$drink.qty" 
            }
        },
        { 
            $match: { 
                 status : "complete",
                 month: thisMonth,
                 year: thisYear
            }
        },
        {
            $unset: ["status", "month", "year"]
        }
    ]).then( async results => {
        var item = {};
        results.forEach(result=>{
            result.drink_id.forEach((drink_id, index) => {
                if(typeof(item[drink_id]) == "undefined"){
                    item[drink_id] = result.drink_qty[index];
                } else {
                    item[drink_id] = item[drink_id] + result.drink_qty[index];
                }
            });
        });
        let Sorted = Object.entries(item).sort((prev, next) => prev[1] - next[1]);
        console.log(Sorted);
        var first = Sorted[Sorted.length - 1];
        var second = Sorted[Sorted.length - 2];
        var third = Sorted[Sorted.length - 3];

        var drinkTMP = await Drink.aggregate([
            {
                $project: {
                    _id: 0,
                    drink_id: "$drink_id",
                    drink_name: "$name",
                    img: 1
                }
            },
            { 
                $match: {$or: [{drink_id : first[0]}, {drink_id : second[0]}, {drink_id : third[0]}]}
            }
        ]).then(results => {
            var arr = [];
            results.forEach(result => {
                if(result.drink_id == first[0]){
                    arr[0] = result;
                    arr[0].qty = first[1];
                } else if(result.drink_id == second[0]) {
                    arr[1] = result;
                    arr[1].qty = second[1];
                } else {
                    arr[2] = result;
                    arr[2].qty = third[1];
                }
            });
            return arr;
        });
        return drinkTMP;

    })

    res.render("dashboard", {
        staff: staff,
        totalIncome: total.total_money,
        total_visit: total.total_visit,
        topDrinks: drinks
    });
}

///
//Lấy doanh thu
///
module.exports.getIncome = async function (req, res) {

    var date = req.body.date;
    var sort = req.body.sort;
    var year = parseInt(req.body.year);

    if (sort !== "day" && sort !== "week" && sort !== "month") {
        console.log("err");
        return;
    }
    var finalData = [];

    //
    //lấy 3 ngày trước và 3 ngày sau của ngày yêu cầu
    //
    if (sort == "day") { 
        date = new Date(date);
        var threeNextDay = new Date(date);
        threeNextDay.setDate(date.getDate() + 3);

        var threePreviousDay = new Date(date);
        threePreviousDay.setDate(date.getDate() - 3);

        //tìm order từ 3 ngày trước đến 3 ngày sau
        await Order.find({
            time_begin: {
                $gte: new Date(threePreviousDay),
                $lte: new Date(threeNextDay)
            },
            status: "complete"
        }, {
            _id: 0,
            time_begin: 1,
            total: 1
        }).then((result) => {
            for (let i = -3; i <= 3; i++) {
                //Bắt đầu từ ngày đầu tiên
                var dateTMP = new Date(date);
                dateTMP.setDate(date.getDate() + i);

                var nextDateTMP = new Date(date);
                nextDateTMP.setDate(date.getDate() + i + 1);

                //tìm order trùng với ngày đầu tiên và tính tổng tiền của ngày đó
                var total = 0;
                result.forEach(element => {
                    if (element.time_begin >= dateTMP && element.time_begin < nextDateTMP) {
                        total += element.total;
                    }
                });

                //lấy ngày và tổng tiền push vào data gửi đi
                var finaldate = new Date(dateTMP);
                finaldate = finaldate.getDate() + "/" + (finaldate.getMonth() + 1);
                finalData.push([finaldate, total]);
            }
        });

    }

    //
    // lấy 3 tuần trước và 3 tuần sau tuần được yêu cầu
    //
    if (sort == "week") { 
        
        var week = parseInt(date);

        var threePreviousWeek = week - 4;  //Phải trừ 4 vì mongodb week bắt đầu từ 0
        var threeNextWeek = week + 2
        await Order.aggregate([
            {
                $project: {
                    _id: 0,
                    total: 1,
                    week: {$week: "$time_begin"},
                    year: {$year: "$time_begin"},
                    status: 1
                }
            },
            { 
                $match: { 
                     status : "complete",
                     week: {
                        $gte: threePreviousWeek,
                        $lte: threeNextWeek
                     },
                     year: year
                }
            },
            {
                $unset: ["status", "year"]
            }
         ]).then((result) =>{
             console.log(result);
            for (let i = -3; i <= 3; i++) {
                //Bắt đầu từ ngày đầu tiên
                var weekTMP = week + i;
                if(weekTMP > 0 && weekTMP <= 53){
                   //tìm order  và tính tổng tiền của tuần
                    var total = 0;
                    result.forEach(element => {
                        if ((element.week + 1 ) == weekTMP) {
                            total += element.total;
                        }
                    });

                    //lấy week và tổng tiền push vào data gửi đi
                    finalData.push([weekTMP, total])
                } 
            }
         });
    }

    //
    // lấy 12 tháng
    //
    if (sort == "month") { 
        
        await Order.aggregate([
            {
                $project: {
                    _id: 0,
                    total: 1,
                    month: {$month: "$time_begin"},
                    year: {$year: "$time_begin"},
                    status: 1
                }
            },
            { 
                $match: { 
                     status : "complete",
                     year: year
                }
            },
            {
                $unset: ["status", "year"]
            }
         ]).then((result) =>{
             console.log(result);
            for (let i = 1; i <= 12; i++) {
               
                //tìm order và tính tổng tiền của tháng
                var total = 0;
                result.forEach(element => {
                    if (element.month == i) {
                        total += element.total;
                    }
                });

                finalData.push([i, total])
            }
         });
    }
    console.log(finalData);
    res.writeHead(200, { 'Content-Type': 'application/json' }); 
    res.end(JSON.stringify({finalData}));
}

///
//Lấy lượt khách
///

module.exports.getCustomerVisit = async function (req, res){

    var sort = req.body.sort;
    if (sort !== "day" && sort !== "week" && sort !== "month") {
        console.log("err");
        return;
    }
    var date = req.body.date;
    var year = parseInt(req.body.year);

    var finalData = [];

    //
    //lấy 3 ngày trước và 3 ngày sau của ngày yêu cầu
    //
    if (sort == "day") { 
        date = new Date(date);
        var threeNextDay = new Date(date);
        threeNextDay.setDate(date.getDate() + 3);

        var threePreviousDay = new Date(date);
        threePreviousDay.setDate(date.getDate() - 3);
    
        //tìm order từ 3 ngày trước đến 3 ngày sau
        await Order.aggregate([
            {
                $project: {
                    _id: 0,
                    time_begin: 1,
                    status: 1,
                    qty: "$drink.qty"
                }
            },
            { 
                $match: { 
                     status : "complete",
                     time_begin: {
                        $gte: new Date(threePreviousDay),
                        $lte: new Date(threeNextDay)
                     }
                }
            },
            {
                $unset: ["status"]
            }
        ]).then((result) => {
            for (let i = -3; i <= 3; i++) {
                //Bắt đầu từ ngày đầu tiên
                var dateTMP = new Date(date);
                dateTMP.setDate(date.getDate() + i);

                var nextDateTMP = new Date(date);
                nextDateTMP.setDate(date.getDate() + i + 1);

                //tìm order trùng
                var total = 0;
                result.forEach(element => {
                    if (element.time_begin >= dateTMP && element.time_begin < nextDateTMP) {
                        element.qty.forEach(qty => {
                            total += qty
                        });
                    }
                });

                //lấy ngày và tổng tiền push vào data gửi đi
                var finaldate = new Date(dateTMP);
                finaldate = finaldate.getDate() + "/" + (finaldate.getMonth() + 1);
                finalData.push([finaldate, total])
            }
        });
    }

    if(sort == "week"){

        var week = parseInt(date);

        var threePreviousWeek = week - 4;  //Phải trừ 4 vì mongodb week bắt đầu từ 0
        var threeNextWeek = week + 2

        await Order.aggregate([
            {
                $project: {
                    _id: 0,
                    week: {$week: "$time_begin"},
                    year: {$year: "$time_begin"},
                    status: 1,
                    qty: "$drink.qty"
                }
            },
            { 
                $match: { 
                     status : "complete",
                     week: {
                         $gte: threePreviousWeek,
                         $lte: threeNextWeek
                     },
                     year: year
                }
            },
            {
                $unset: ["status", "year"]
            }
        ]).then((result) =>{
            console.log(result);
           for (let i = -3; i <= 3; i++) {
               //Bắt đầu từ ngày đầu tiên
               var weekTMP = week + i;
               if(weekTMP > 0 && weekTMP <= 53){
                  //tìm order  và tính lượt khách của tuần
                   var total = 0;
                   result.forEach(element => {
                       if ((element.week + 1 ) == weekTMP) {
                           element.qty.forEach(qty => {
                                total += qty;
                           });
                       }
                   });

                   //lấy week và tổng tiền push vào data gửi đi
                   finalData.push([weekTMP, total])
               } 
           }
        });
    }

    if (sort == "month") { 
        
        await Order.aggregate([
            {
                $project: {
                    _id: 0,
                    month: {$month: "$time_begin"},
                    year: {$year: "$time_begin"},
                    status: 1,
                    qty: "$drink.qty"
                }
            },
            { 
                $match: { 
                     status : "complete",
                     year: year
                }
            },
            {
                $unset: ["status", "year"]
            }
         ]).then((result) =>{
             console.log(result);
            for (let i = 1; i <= 12; i++) {
               
                //tìm order và tính tổng lượt khách của tháng
                var total = 0;
                result.forEach(element => {
                    if (element.month == i) {
                        element.qty.forEach(qty => {
                            total += qty;
                        })
                    }
                });

                finalData.push([i, total])
            }
         });
    }
    console.log(finalData);
    res.writeHead(200, { 'Content-Type': 'application/json' }); 
    res.end(JSON.stringify({finalData}));
}