const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AutoIncrement = require("mongoose-sequence")(mongoose);

const employeeSchema = new Schema({
    
    name:{
        type:String,
        required: true, 
    },

    designation:{
        type:String,
    },

    email:{
        type:String,
        required: true, 
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },

    phone_number:{
        type:String,
        required: true,
        match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number']
    },

    date_of_joining:{
        type:Date,
        required: true,
    },

    working_days:{
        type:Number,
    },

    no_pay_days:{
        type:Number,    
    },

    status:{
        type:String,
        enum: ["Active", "On Leave", "Resigned"],
        required: true,
    }
});

employeeSchema.plugin(AutoIncrement, { inc_field: "employee_id" });

module.exports = mongoose.model(
    "EmployeeModel",
    employeeSchema
)