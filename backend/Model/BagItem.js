const mongoose = require("mongoose");

const bagItemSchema = new mongoose.Schema({
inventoryId: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
},

  
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const bagSchema = new mongoose.Schema({
  bagName: {
    type: String,
    required: true,
  },
  items: [bagItemSchema], // an array of items
});

// ✅ Export correctly for require()
module.exports = mongoose.model("Bag", bagSchema);
