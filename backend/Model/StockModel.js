const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;


const stockSchema = new Schema({
   
    ManufactureDate :{
        type:Date,//datatype
        required:true,//validate
    },
    MushroomType :{
        type:String,//datatype
        required:true,//validate
    },
   
    ExpireDate :{
        type: Date,//datatype
        required:true,//validate
          
    },

     Unit:{
        type:Number,//datatype
        required:true,//validate
    },
    
     
});
// Auto-increment field 'id'
stockSchema.plugin(AutoIncrement, { inc_field: "StockId" });
stockSchema.set("toJSON", { getters: true });
module.exports = mongoose.model("StockModel",stockSchema);