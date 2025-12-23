const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {  // Renamed from "gmail" for clarity
    type: String,
    required: true,
    unique: true,  // Ensure unique emails
  },
  address: {
    type: String,
    required: true,
  },
  password: {  // New field for login
    type: String,
    required: true,
  },
  role: {  // New field for roles
    type: String,
    enum: ['pending', 'environment_manager', 'batch_manager', 'sales_manager', 'inventory_manager', 'finance_manager', 'admin'],
    default: 'pending',
  }
});

module.exports = mongoose.model("UserModel", userSchema);