var mongoose = require("mongoose");


var toppingSchema = new mongoose.Schema({
    
    topping_id: {
      type: String,
      required: [true, 'topping_id is required']
    },
    name: { 
        type: String, 
        required: [true, 'name is required']
    },
    status: { 
        type: String,
        enum: [ "active", "inactive" ]
    }
  });
var Topping = mongoose.model("Topping", toppingSchema, "topping");

module.exports = Topping;