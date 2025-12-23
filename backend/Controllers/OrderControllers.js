const Order = require("../Model/OrderModel");

//  Get all orders
const getAllOrders = async (req, res, next) => {
  let orders;

  try {
    orders = await Order.find();
  } catch (err) {
    console.log(err);
  }

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "No orders found" });
  }

  return res.status(200).json({ orders });
};

// Insert new order
const addOrder = async (req, res, next) => {
  const { ShopName, ProductId, OrderDate, Quantity } = req.body;
  let order;

  try {
    order = new Order({
      ShopName,
      ProductId,
      OrderDate,
      Quantity,
      Status: "Pending",     // default
      DeliveredDate: null,
      SalesId: null
    });
    await order.save();
  } catch (err) {
    console.log(err);
  }

  if (!order) {
    return res.status(400).json({ message: "Unable to add order" });
  }

  return res.status(200).json({ order });
};

//  Get order by ID
const getById = async (req, res, next) => {
  const orderId = parseInt(req.params.id);
  let order;

  try {
    order = await Order.findOne({ OrderId: orderId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json({ order });
};

//  Update order
const updateOrder = async (req, res, next) => {
  const id = req.params.id;
  const { ShopName, ProductId, OrderDate, Quantity, Status, DeliveredDate, SalesId } = req.body;

  let order;

  try {
    order = await Order.findOneAndUpdate(
      { OrderId: parseInt(id) },
      {
        ShopName,
        ProductId,
        OrderDate,
        Quantity,
        Status,
        DeliveredDate,
        SalesId
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }

  if (!order) {
    return res.status(404).json({ message: "Unable to update order details" });
  }

  return res.status(200).json({ order });
};

//  Delete order
const deleteOrder = async (req, res, next) => {
  const id = req.params.id;
  let order;

  try {
    order = await Order.findOneAndDelete({ OrderId: parseInt(id) });
  } catch (err) {
    console.log(err);
  }

  if (!order) {
    return res.status(404).json({ message: "Unable to delete order" });
  }

  return res.status(200).json({ order });
};

exports.getAllOrders = getAllOrders;
exports.addOrder = addOrder;
exports.getById = getById;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
