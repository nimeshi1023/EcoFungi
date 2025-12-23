const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AutoIncrement = require("mongoose-sequence")(mongoose);

const expenseSchema = new Schema({
    date: {
        type: Date,
        required: [true, "Date is required"],
        validate: {
            validator: function (value) {
                return value <= new Date(); // Prevent future dates
            },
            message: "Date cannot be in the future"
        }
    },

    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values: ["Utilities", "Maintenance & Repairs", "Transportation", "Inventory", "Other"],
            message: "Invalid category. Must be one of: Utilities, Maintenance & Repairs, Transportation, Inventory, Other"
        },
        trim: true
    },

    description: {
        type: String,
        maxlength: [200, "Description cannot exceed 200 characters"],
        trim: true
    },

    paymentMethod: {
  type: String,
  enum: ["Cash", "Credit Card", "Debit Card", "Online", "Other"],
  trim: true,
  required: function() {
    return this.category !== "Inventory"; // required only if NOT Inventory
  }
},


    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount must be at least 1"],
        max: [1000000, "Amount cannot exceed 1,000,000"]
    }
});

// Auto-increment expenseId
expenseSchema.plugin(AutoIncrement, { inc_field: "expenseId" });

module.exports = mongoose.model("ExpenseModel", expenseSchema);
