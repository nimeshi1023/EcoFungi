const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  ShopName: { 
    type: String, required: true 
    },
  ProductId: {
     type: Number, required: true 
    },
  OrderDate: {
     type: Date, required: true 
    },
  Quantity: {
     type: Number, required: true 
    },
  Status: {
     type: String, default: "Pending" 
    }, 
  DeliveredDate: { 
    type: Date, default: null 
    },
  SalesId: {
     type: Number, default: null 
    }
});

orderSchema.plugin(AutoIncrement, { inc_field: "OrderId" });

module.exports = mongoose.model("OrderModel", orderSchema);
