const express = require("express");
const router = express.Router();

// Insert Batch Model
const Bag = require("../Model/BagItem");      // Bag model
const Inventory = require("../Model/InventoryModel"); // Inventory model
const Batch = require("../Model/BatchModel");      // Batch model

// Insert Batch Controller
const BatchController = require("../Controllers/BatchControllers");

// Routes
router.get("/", BatchController.getAllBatches);

router.get("/:id", BatchController.getBatchById);
router.put("/:id", BatchController.updateBatch);
router.delete("/:id", BatchController.deleteBatch);



router.post("/", async (req, res) => {
  try {
    const { createDate, status, quantity, removedQuantity, expireDate } = req.body;

    const bag = await Bag.findOne().populate("items.inventoryId");
    if (!bag) return res.status(404).json({ message: "No bag found" });

    // Deduct inventory
    for (const item of bag.items) {
      const inventoryDoc = await Inventory.findById(item.inventoryId._id);
      if (!inventoryDoc) continue;

      const deductQty = item.quantity * quantity;
      inventoryDoc.Quantity -= deductQty;
      if (inventoryDoc.Quantity < 0) inventoryDoc.Quantity = 0;

      await inventoryDoc.save();
    }

    // Save batch
    const newBatch = new Batch({
      createDate,
      status,
      quantity,
      removedQuantity,
      expireDate,
      bagItems: bag.items.map((item) => ({
        inventoryId: item.inventoryId._id,
        bagQuantity: item.quantity
      }))
    });

    await newBatch.save();

    res.status(201).json({ message: "Batch created and inventory updated", newBatch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Export
module.exports = router;
