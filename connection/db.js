const { bgRed } = require("colors");
const mongoose = require("mongoose");
const config = require("dotenv").config();
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connection established..".bgGreen);
  } catch (err) {
    console.log("err".bgRed, err);
  }
};

module.exports = connectDb;
