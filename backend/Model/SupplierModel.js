const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const supplierSchema = new Schema(
  {
    Supplier_name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      minlength: [3, "Supplier name must be at least 3 characters long"],
      maxlength: [50, "Supplier name must be at most 50 characters long"],
    },
   Phone_number: {
  type: String,
  required: [true, "Phone number is required"],
  validate: {
    validator: function (value) {
      // Must be exactly 10 digits and start with 0
      return /^0[0-9]{9}$/.test(value);
    },
    message: "Phone number must start with 0 and be exactly 10 digits",
  },
},


    Email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    Address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters long"],
      maxlength: [100, "Address must be at most 100 characters long"],
    },
  },
  { timestamps: true } // optional: adds createdAt and updatedAt fields
);

supplierSchema.plugin(AutoIncrement, { inc_field: "Supplier_id" });

module.exports = mongoose.model("SupplierModel", supplierSchema);
