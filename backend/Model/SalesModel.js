const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const salesSchema = new Schema({
  ShopName: {
    type: String,
    required: true,
  },
  ProductId: {
    type: Number,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  NumberOfPackets: {
    type: Number,
    required: true,
  },
  NumberOfReturns: {
    type: Number,
    required: true,
  },
  TotalPrice: {
    type: Number,
    required: true,
  },
});

// Auto-increment
salesSchema.plugin(AutoIncrement, { inc_field: "SalesId" });

module.exports = mongoose.model("SalesModel", salesSchema);
