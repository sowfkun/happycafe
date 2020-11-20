var mongoose = require("mongoose");


var categorySchema = new mongoose.Schema({
    
    category_id: {
      type: String,
      required: [true, 'category_id is required']
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
var Category = mongoose.model("Category", categorySchema, "category");

module.exports = Category;