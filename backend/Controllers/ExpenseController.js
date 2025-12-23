const expense = require("../Model/ExpenseModel");

//data display
const getAllExpense = async (req, res, next) => {

    let expenses;

    //get all expense
    try{
        expenses = await expense.find();
    }catch(err) {
        console.log(err);
    }

    //not found
    if(!expenses){
        return res.status(404).json({message :"Expense not found"});
    }

    //dispaly all users
    return res.status(200).json({expenses});
};

//data insert
const addExpense = async (req, res, next) => {

    const {date, category, description, paymentMethod, amount} = req.body;

    let expenses;
    try{
        expenses = new expense({date, category, description, paymentMethod, amount});
        await expenses.save();
    }catch(err){
        console.log(err);
    }

    //not insert
    if(!expenses){
        return res.status(404).send({message: "Unable to add expense"});
    }
    return res.status(200).json({expenses});
};

//get by id
const getById = async(req, res, next) => {

    const id = req.params.id;

    let expenses;
    
    try{
        expenses = await expense.findById(id);
    }catch (err){
        console.log(err);
    }

    //not insert
    if(!expenses){
        return res.status(404).send({message: "Expense not found"});
    }
    return res.status(200).json({expenses});
};

//update data
const updateExpense = async(req, res, next) => {

    const id = req.params.id;

    const {date,category, description, paymentMethod, amount} = req.body;

    let expenses;

    try{
        expenses = await expense.findByIdAndUpdate(id,
            {date: date, category: category, description: description, paymentMethod: paymentMethod, amount: amount}
        );
        expenses = await expenses.save();
    }catch(err) {
        console.log(err);
    }

    //if not
    if(!expenses){
        return res.status(404).send({message: "Unable to update"});
    }
    return res.status(200).json({expenses});
};

//delete
const deleteExpense = async(req, res, next) => {

    const id = req.params.id;

    let expenses;

    try{
        expenses = await expense.findByIdAndDelete(id);
    }catch (err){
        console.log(err);
    }

    //if not
    if(!expenses){
        return res.status(404).send({message: "Unable to delete"});
    }
    return res.status(200).json({expenses});
};

exports.getAllExpense = getAllExpense;
exports.addExpense = addExpense;
exports.getById = getById;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;

