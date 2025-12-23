const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;


const productSchema = new Schema({
   
    ProductName :{
        type:String,//datatype
        required:true,//validate
    },
    MushroomType :{
        type:String,//datatype
        required:true,//validate
    },
   
    UnitPrice :{
        type:Number,//datatype
        required:true,//validate
          get: v => v.toFixed(2),
        min: 0,
    },

     Status:{
        type:String,//datatype
        required:true,//validate
    },
    
     
});
// Auto-increment field 'id'
productSchema.plugin(AutoIncrement, { inc_field: "ProductId" });
productSchema.set("toJSON", { getters: true });
module.exports = mongoose.model("ProductModel",productSchema);