const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const customerSchema = new Schema({
 
    ShopName:{
        type:String,//datatype
        required:true,//validate
    },
    OwnerName:{
        type:String,//datatype
        required:true,//validate
    },
    Email:{
        type:String,//datatype
        required:true,//validate
    },
   
    PhoneNo :{
        type:String,//datatype
        required:true,//validate
    },
     City:{
        type:String,//datatype
        required:true,//validate
    },
     Status:{
        type:String,//datatype
        required:true,//validate
    },
});
customerSchema.plugin(AutoIncrement, { inc_field: "CustomerId" });

module.exports = mongoose.model("CustomerModel",customerSchema);