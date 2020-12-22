var mongoose = require("mongoose");


var orderSchema = new mongoose.Schema({

    order_id: {
        type: String,
        required: [true, "order_id is required"]
    },
    staff_id: {
        type: String,
        required: [true, "staff_id is required"]
    },
    customer_name: {
        type: String,
        required: [true, "customer_name is required"]
    },
    drink: [{
        drink_id: {
            type: String,
            required: [true, "drink_id is required"]
        },
        drink_name: {
            type: String,
            required: [true, "drink_name is required"]
        },
        price: {
            size_m: {
                type: Number,
                required: [true, "size_m is required"]
            },
            size_l: {
                type: Number,
                required: [true, "size_l is required"]
            }
        },
        topping: {
            topping_id: {
                type: String,
                required: [true, "topping_id is required"]
            },
            topping_name: {
                type: String,
                required: [true, "toppng_name is required"]
            }
        },
        qty: {
            type: Number,
            require: [true, "qty is required"]
        }
    }],
    time_begin: {
        type: Date,
        required: [true, "time_begin is required"]
    },
    time_end: {
        type: Date,
        required: [true, "time_end is required"]
    },
    discount: {
        type: Number,
        required: [true, "discount is required"]
    },
    note:{
        type: String
    },
    total: {
        type: Number,
        required: [true, "total is required"],
    },
    status: {
        type: String,
        enum: ["waiting", "complete"],
        required: [true, 'status is required']
    }

});
var Order = mongoose.model("Order", orderSchema, "order");

module.exports = Order;
