var mongoose = require("mongoose");


var staffSchema = new mongoose.Schema({

  staff_id: {
    type: String,
    required: [true, 'staff_id is required']
  },
  name: {
    type: String,
    required: [true, 'name is required']
  },
  sex: {
    type: String,
    enum: ["male", "female"],
    required: [true, 'sex is required']
    
  },
  position: {
    type: String,
    enum: ["manager", "bartender", "cashier","waiter","security"],
    required: [true, 'position is required']
  },
  salary: {
    type: Number,
    required: [true, 'salary is required']
  },
  phone: {
    type: Number,
    required: [true, 'phone is required']
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  email: {
    type: String,
    required: [true, 'email is required']
  },
  address: {
    type: String,
    required: [true, 'address is required']
  },
  status: {
    type: String,
    enum: ["working", "resign"],
    required: [true, 'status is required']
  },

  period: {
    type: String,
    enum: ["Sáng", "Chiều","Tối"],
    required: [true, 'status is required']
  },
  img: {
    type: String,
    require:  [true, 'img is required']
  }
});
var Staff = mongoose.model("Staff", staffSchema, "staff");

module.exports = Staff;