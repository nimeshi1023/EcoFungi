const User = require("../Model/UserModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users (keep similar)
const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "Users not found" });
  }
  return res.status(200).json({ users });
};

// Register (modified addUsers: hash password, default role)
const register = async (req, res, next) => {
  const { name, email, age, address, password } = req.body;
  let user;
  try {
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, age, address, password: hashedPassword, role: 'pending' });
    await user.save();
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(400).json({ message: "Unable to register user" });
  }
  return res.status(201).json({ user });
};

// Login
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Token expires in 1 hour
    );
    return res.status(200).json({ token, role: user.role,user: { name: user.name } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Assign Role (Admin only)
const assignRole = async (req, res, next) => {
  const { userId, newRole } = req.body;
  // Check if caller is admin (we'll add middleware later)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: "Cannot change admin role" });
    }
    user.role = newRole;
    await user.save();
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(400).json({ message: "Unable to assign role" });
  }
  return res.status(200).json({ user });
};

// Get by ID (keep similar, fixed typos)
const getById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "User not available" });
  }
  return res.status(200).json({ user });
};

// Update User (keep similar, fixed typos)
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, age, address } = req.body;
  let user;
  try {
    user = await User.findByIdAndUpdate(id, { name, email, age, address });
    user = await user.save();
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "Unable to update data" });
  }
  return res.status(200).json({ user });
};

// Delete User (keep similar, fixed typos)
const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "Unable to delete data" });
  }
  return res.status(200).json({ user });
};

exports.getAllUsers = getAllUsers;
exports.register = register;
exports.login = login;
exports.assignRole = assignRole;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;