const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const spraySchema = new Schema({
   
    batchid: {
        type: Number,      // since batch.id is Number
        ref: "batchModel", 
        required: true
    },
   
    day: {
        type: String,
        required: true,
    },
    stime: {
        type: String,
        required: true,
    },
    endtime: {
        type: String,
        required: true,
    }
});
// Auto-increment field 'id'
spraySchema.plugin(AutoIncrement, { inc_field: "id" });
module.exports = mongoose.model("sprayModel", spraySchema);
