const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const constant = require("./constants");
const app = express();
const Users = require("./routes/userRouter");
const MongoUsers = require("./routes/mongoUserRouter");
const ErrorHandler = require("./utils/errorHandler");
const connectDb = require("./connection/db");

const storeLogtoFile = fs.createWriteStream(path.join(__dirname, "appLogs"), {
  flags: "a",
});

if (process.env.NODE_ENV == "DEV") {
  app.use(morgan("combined", { stream: storeLogtoFile }));
}

app.locals.baseUrl = constant.BASE_URL;

app.use(bodyParser.json());
// connect to database
connectDb();

app.get("/", (req, res) => {
  res.json({ mssg: "logged home page" });
});

app.use(`${constant.BASE_URL}/users`, Users);
app.use(`${constant.BASE_URL}/mongo-users`, MongoUsers);
app.use(ErrorHandler);

app.listen(4000, () => {
  console.log("server is up at port 4000");
});

module.exports = app;
