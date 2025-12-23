const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    Category: {
      type: String,
      required: [true, "Category is required."],
      enum: ["Raw Material", "Spores/Spawn", "Packaging", "Others"], // restrict to valid categories
    },

    Item_name: {
      type: String,
      required: [true, "Item name is required."],
      minlength: [2, "Item name must be at least 2 characters."],
      trim: true,
    },

    Quantity: {
      type: Number,
      required: [true, "Quantity is required."],
      min: [0, "Quantity cannot be negative."],
    },

    Unit: {
      type: String,
      required: [true, "Unit is required."],
      trim: true,
    },

    Received_date: {
      type: Date,
      required: [true, "Received date is required."],
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: "Received date cannot be in the future.",
      },
    },

   Expired_date: {
  type: Date,
  validate: {
    validator: function (v) {
      // Only validate if a date is provided
      return !v || (this.Received_date ? v >= this.Received_date : true);
    },
    message: "Expired date cannot be before received date.",
  },
},


    Reorder_level: {
      type: Number,
      required: [true, "Reorder level is required."],
      min: [0, "Reorder level cannot be negative."],
    },

    Description: {
      type: String,
      
      trim: true,
    },

    Purchase_id: {
      type: String, // store your own purchase/supplier ID like "PUR001"
      required: [true, "Purchase ID is required."],
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-increment field 'Item_code'
inventorySchema.plugin(AutoIncrement, { inc_field: "Item_code" });

module.exports = mongoose.model("InventoryModel", inventorySchema);
