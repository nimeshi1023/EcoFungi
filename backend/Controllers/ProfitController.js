const ProfitLossModel = require("../Model/ProfitModel");
const ExpenseModel = require("../Model/ExpenseModel");
const SalaryModel = require("../Model/SalaryModel");
const SalesModel = require("../Model/SalesModel");

const generateProfitLoss = async (req, res) => {
  const { month, year } = req.body; // month = 1..12, year = YYYY

  try {
    // ✅ Create proper start and end dates for the month
    const startDate = new Date(year, month - 1, 1); // JS months are 0-indexed
    const endDate = new Date(year, month, 1);       // first day of next month

    // 1️⃣ Total Sales
    const salesData = await SalesModel.aggregate([
      { $match: { Date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: "$TotalPrice" } } },
    ]);
    const totalSales = salesData[0]?.total || 0;

    // 2️⃣ Total Expenses (excluding salaries)
    const expensesData = await ExpenseModel.aggregate([
      { $match: { date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpenses = expensesData[0]?.total || 0;

    // 3️⃣ Total Salaries (filter by YYYY-MM format)
    const salaryMonth = `${year}-${month.toString().padStart(2, "0")}`;
    const salariesData = await SalaryModel.aggregate([
      { $match: { month: salaryMonth } },
      { $group: { _id: null, total: { $sum: "$totals.netSalary" } } },
    ]);
    const totalSalaries = salariesData[0]?.total || 0;

    // 4️⃣ Calculate totals
    const totalRevenue = totalSales; // add otherIncome if needed
    const totalExpense = totalExpenses + totalSalaries;
    const netProfit = totalRevenue - totalExpense;

    // 5️⃣ Save to ProfitLoss collection
    const pl = new ProfitLossModel({
      month,
      year,
      revenue: { sales: totalSales, otherIncome: 0, totalRevenue },
      expenses: { expenses: totalExpenses, salaries: totalSalaries },
      netProfit,
    });

    await pl.save();

    res.status(201).json({ message: "Profit & Loss generated", pl });
  } catch (err) {
    console.error("❌ Profit & Loss generation error:", err.message);
    res
      .status(500)
      .json({ message: "Error generating Profit & Loss", error: err.message });
  }
};

module.exports = { generateProfitLoss };
