const express = require("express");
const {
  createUser,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const route = express.Router();
route.post("/signup", createUser);
route.post("/signin", login);
route.get("/users", getAllUsers);
route.get("/users/:id", getUserById);
route.patch("/users/:id", updateUser);
route.delete("/users/:id", deleteUser);

module.exports = route;
