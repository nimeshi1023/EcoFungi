const Sale = require("../Model/SalesModel");
const Order = require("../Model/OrderModel");
const Product = require("../Model/ProductModel");


const getAllSales = async (req, res, next) => {
  let Sales;

  try {
    Sales = await Sale.find();
  } catch (err) {
    console.log(err);
  }

  if (!Sales || Sales.length === 0) {
    return res.status(404).json({ message: "Sales not found" });
  }

  return res.status(200).json({ Sales });
};

//insert
const addSales = async (req, res, next) => {
  try {
    const { ShopName, ProductId, Date, NumberOfPackets, NumberOfReturns } = req.body;

    if (!ShopName || !ProductId || !Date || NumberOfPackets == null || NumberOfReturns == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Find product
    const product = await Product.findOne({ ProductId: ProductId });
    if (!product) {
      return res.status(404).json({ message: "Product not found for given ProductId" });
    }

    const unitPrice = product.UnitPrice;
    const TotalPrice = (NumberOfPackets - NumberOfReturns) * unitPrice;

    //  Create sale
    const newSale = new Sale({
      ShopName,
      ProductId,
      Date,
      NumberOfPackets,
      NumberOfReturns,
      TotalPrice,
    });

    const savedSale = await newSale.save();

    //  Update order status automatically
    await Order.findOneAndUpdate(
      { ShopName, ProductId, Status: "Pending" }, // match the pending order
      {
        Status: "Delivered",
        DeliveredDate: Date,
        SalesId: savedSale.SalesId,
      }
    );

    return res.status(201).json({ message: "Sale added successfully", sale: savedSale });
  } catch (err) {
    console.error("Error adding sale:", err);
    return res.status(500).json({ message: "Server error while adding sale" });
  }
};


// Get sale by ID
const getById = async (req, res, next) => {
  const saleId = parseInt(req.params.id);
  let sale;

  try {
    sale = await Sale.findOne({ SalesId: saleId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!sale) {
    return res.status(404).json({ message: "Sale not found" });
  }

  return res.status(200).json({ sale });
};

//update
const updatesale = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { ShopName, ProductId, Date, NumberOfPackets, NumberOfReturns } = req.body;

    
    const product = await Product.findOne({ ProductId: ProductId });
    if (!product) {
      return res.status(404).json({ message: "Product not found for given ProductId" });
    }

    const unitPrice = product.UnitPrice;
    const TotalPrice = (NumberOfPackets - NumberOfReturns) * unitPrice;


    const updatedSale = await Sale.findOneAndUpdate(
      { SalesId: id },
      { ShopName, ProductId, Date, NumberOfPackets, NumberOfReturns, TotalPrice },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    return res.status(200).json({ message: "Sale updated successfully", sale: updatedSale });
  } catch (err) {
    console.error("Error updating sale:", err);
    return res.status(500).json({ message: "Server error while updating sale" });
  }
};



const deletesale = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const sale = await Sale.findOneAndDelete({ SalesId: id });

    if (!sale) {
      return res.status(404).json({ message: "Unable to delete sale details" });
    }

    //  Revert order if linked
    await Order.findOneAndUpdate(
      { SalesId: sale.SalesId },
      { Status: "Pending", DeliveredDate: null, SalesId: null }
    );

    return res.status(200).json({ message: "Sale deleted and order reverted", sale });
  } catch (err) {
    console.error("Error deleting sale:", err);
    return res.status(500).json({ message: "Server error while deleting sale" });
  }
};


// Exports
exports.getAllSales = getAllSales;
exports.addSales = addSales;
exports.getById = getById;
exports.updatesale = updatesale;
exports.deletesale = deletesale;
