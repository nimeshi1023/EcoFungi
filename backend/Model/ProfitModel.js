const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProfitLossSchema = new mongoose.Schema({
  month: { type: Number, required: true }, // 1 = Jan, 2 = Feb
  year: { type: Number, required: true },

  revenue: {
    sales: { type: Number, default: 0 },         
    otherIncome: { type: Number, default: 0 },   
    totalRevenue: { type: Number, default: 0 },  
  },

  expenses: {
    expenses: { type: Number, default: 0 },    
    salaries: { type: Number, default: 0 },      
  },

  netProfit: { type: Number, default: 0 },        // revenue - expenses

  createdAt: { type: Date, default: Date.now },
});

ProfitLossSchema.plugin(AutoIncrement, { inc_field: "profit_id" });

module.exports = mongoose.model("ProfitLoss", ProfitLossSchema);
