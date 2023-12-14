const mongoose = require("mongoose");
const { url } = require("./config");
const connectDb = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connection established..".bgGreen);
  } catch (err) {
    console.log("err".bgRed, err);
  }
};

module.exports = connectDb;
