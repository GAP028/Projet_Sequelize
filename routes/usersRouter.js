const express = require("express");
const {
  register,
  signin,
  getAllUsers,
  getOneUserById,
  updateOneUserById,
  deleteOneUserById
} = require("../controllers/userController");

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/signin", signin);

usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getOneUserById);
usersRouter.patch("/:id", updateOneUserById);
usersRouter.delete("/:id", deleteOneUserById);

module.exports = usersRouter;