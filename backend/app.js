const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');


// Routers
const userRouter = require('./Routes/UserRoutes');
const sprayrouter = require("./Routes/sprayRoutes");
const iotRouter = require("./Routes/IoTRoutes");
const temperatureSettingRouter = require("./Routes/TemperatureSettingRoutes");
const router = require("./Routes/ExpenseRouter");
const exprouter = require("./Routes/EmployeeRouter");
const sryrouter = require("./Routes/SalaryRouter");
const ProfitRouter=require("./Routes/ProfitRouter");
const inventoryrouter=require("./Routes/InventoryRoute");
const supplierRouter=require("./Routes/SupplierRoute");
const PurchaseRouter=require("./Routes/PurchaseRoute");

const batchrouter=require("./Routes/BatchRoutes");
const BagRouter=require("./Routes/bagRoutes");

const Crouter = require("./Routes/CustomerRoutes");
const Prouter = require("./Routes/ProductRoutes");
const Srouter = require("./Routes/SalesRoutes");
const Hrouter = require("./Routes/StockRoutes");
const Orouter = require("./Routes/OrderRoutes");


dotenv.config();

const app = express();

// ✅ Enable CORS for frontend FIRST
app.use(cors({
  origin: "http://localhost:3000",   // your React frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // include token header
  credentials: true
}));

// ✅ Parse JSON before routes
app.use(express.json());

// ===============================
// 🔐 JWT Middleware
// ===============================
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user; // attach decoded user info
    next();
  });
}

// ===============================
// Routes
// ===============================

// Public (no token needed)
app.use('/users', userRouter);

// Protected (token required)
app.use("/sprays", authMiddleware, sprayrouter);
app.use("/iot", authMiddleware, iotRouter);

// Optional: protect temp settings too
app.use("/api/temperatureSetting", authMiddleware, temperatureSettingRouter);
app.use("/expenses", router);
app.use("/employees", exprouter);
app.use("/salaries", sryrouter);
app.use("/items",inventoryrouter);
app.use("/suppliers",supplierRouter);
app.use("/purchases",PurchaseRouter);
app.use("/bags",BagRouter);
app.use("/batches",batchrouter);
app.use("/profits",ProfitRouter);

app.use("/Customer",Crouter);
app.use("/Product",Prouter);
app.use("/Stock",Hrouter);
app.use("/Sale",Srouter);
app.use("/Order",Orouter);
app.use("/api/customers",require("./Routes/CustomerRoutes"));
app.use("/api/products",require("./Routes/ProductRoutes"));
app.use("/api/stock",require("./Routes/StockRoutes"));
app.use("/api/sale",require("./Routes/SalesRoutes"));
app.use("/api/orders",require("./Routes/OrderRoutes"));


// ===============================
// MongoDB connection
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===============================
// Start server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
