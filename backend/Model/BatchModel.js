const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const batchSchema = new Schema({
     createDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    removedQuantity: {
        type: Number,
        required: true,
    },
    expireDate: {
        type: Date,
        required: true,
    }
});

// Auto-increment field 'id'
batchSchema.plugin(AutoIncrement, { inc_field: "batchid" });

module.exports = mongoose.model("batchModel", batchSchema);
