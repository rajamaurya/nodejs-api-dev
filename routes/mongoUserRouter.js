const express = require("express");
const mongoUserRouter = express.Router();

const {
  getMongoUser,
  getMongoUsers,
  addMongoUser,
  updateMongoUser,
  deleteMongoUser,
} = require("../controllers/mongoUserController");

mongoUserRouter.route("/").get(getMongoUsers);
mongoUserRouter.route("/addUser").post(addMongoUser);
mongoUserRouter
  .route("/:id")
  .get(getMongoUser)
  .put(updateMongoUser)
  .delete(deleteMongoUser);

module.exports = mongoUserRouter;
