const Batch = require("../Model/BatchModel");

// Get all Batches
const getAllBatches = async (req, res, next) => {
    let Batches;

    try {
        batches = await Batch.find();
    } catch (err) {
        console.log(err);
    }

    //not found

    if (!batches) {
        return res.status(404).json({ message: "No batches found" });
    }
    
    //display all batch
    return res.status(200).json({ batches });
};

// Add new Batch
const addBatch = async (req, res, next) => {
    const { batchId, createDate, status, quantity, removedQuantity, expireDate } = req.body;

    let batchs;
    try {
        batchs = new Batch({
            batchId,
            createDate,
            status,
            quantity,
            removedQuantity,
            expireDate
        });
        await batchs.save();
    } catch (err) {
        console.log(err);
    }

    if (!batchs) {
        return res.status(400).json({ message: "Unable to add batch" });
    }

    return res.status(200).json({ batchs });
};

// Get Batch by ID
const getBatchById = async (req, res, next) => {
    const id = req.params.id;
    let batch;
    try {
        batch = await Batch.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
    }

    return res.status(200).json({ batch });
};

// Update Batch
const updateBatch = async (req, res, next) => {
    const id = req.params.id;
    const { batchId, createDate, status, quantity, removedQuantity, expireDate } = req.body;

    let batchs;
    try {
        batchs = await Batch.findByIdAndUpdate(id, {
            batchId : batchId,
            createDate :  createDate,
            status : status,
            quantity : quantity,
            removedQuantity :  removedQuantity,
            expireDate : expireDate
        });
        batchs = await batchs.save();
    } catch (err) {
        console.log(err);
    }

    if (!batchs) {
        return res.status(404).json({ message: "Unable to update batch" });
    }

    return res.status(200).json({ batchs });
};

// Delete Batch
const deleteBatch = async (req, res, next) => {
    const id = req.params.id;

    let batch;
    try {
        batch = await Batch.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!batch) {
        return res.status(404).json({ message: "Unable to delete batch" });
    }

    return res.status(200).json({ batch });
};

exports.getAllBatches = getAllBatches;
exports.addBatch = addBatch;
exports.getBatchById = getBatchById;
exports.updateBatch = updateBatch;
exports.deleteBatch = deleteBatch;