const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserControllers");
const authMiddleware = require('../middleware/auth');  // New middleware

// Public routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Protected routes (require JWT)
router.get("/", authMiddleware, UserController.getAllUsers);  // Only logged-in can get all
router.get("/:id", authMiddleware, UserController.getById);
router.put("/:id", authMiddleware, UserController.updateUser);
router.delete("/:id", authMiddleware, UserController.deleteUser);

// Admin-only route
router.post("/assign-role", authMiddleware, UserController.assignRole);

module.exports = router;