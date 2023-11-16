const express = require("express");
const userRouter = express.Router();

const {
  getUser,
  addUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

userRouter.route("/").get(getUsers);
userRouter.route("/addUser").post(addUser);
userRouter.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = userRouter;
