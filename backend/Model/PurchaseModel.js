const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const purchaseSchema = new Schema(
  {
    Supplier_id: {
      type: String,
      required: [true, "Supplier ID is required"],
      
    },

    Item_name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [2, "Item name must be at least 2 characters long"],
      maxlength: [100, "Item name can't exceed 100 characters"]
    },

    Purchase_date: {
      type: Date,
      required: [true, "Purchase date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Purchase date cannot be in the future"
      }
    },

    Price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: function (v) {
          return Number.isFinite(v);
        },
        message: "Price must be a valid number"
      }
    }
  },
  {
    timestamps: true 
  }
);


purchaseSchema.plugin(AutoIncrement, { inc_field: "Purchase_id" });

module.exports = mongoose.model("PurchaseModel", purchaseSchema);
