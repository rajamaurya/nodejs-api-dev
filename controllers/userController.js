const fs = require("fs/promises");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/async");
const { stringify } = require("../utils/helper");

// get users list

exports.getUsers = asyncHandler(async (req, res, next) => {
  const dataRead = await fs.readFile("post.json");
  let content = JSON.parse(dataRead);

  if (content) {
    // check if sort is required
    if (req.query.sort) {
      let sortBy = req.query.sort;
      content = content.sort((user1, user2) =>
        user1[sortBy] > user2[sortBy] ? 1 : -1
      );
    }
    // check if selection is there
    if (req.query.select) {
      let selectedItems = req.query.select.split(",");
      content = content.map((user) => {
        let temp = {};
        selectedItems.forEach((selection) => {
          temp[selection] = user[selection];
        });
        user = temp;
        return user;
      });
    }
    return res.status(200).json({
      success: true,
      count: content.length,
      data: content,
      msg: `users fetched`,
    });
  }
  next(new ErrorResponse("Bad request. Please try again..", 400));
});
// get single user
exports.getUser = asyncHandler(async (req, res, next) => {
  const dataRead = await fs.readFile("post.json", "utf-8");
  let record = JSON.parse(dataRead);

  record = record.find((obj) => obj["id"] == req.params.id);

  if (record) {
    return res.status(200).json({
      success: true,
      data: record,
    });
  } else {
    next(new ErrorResponse("No record found.."), 200);
  }

  next(new ErrorResponse("Internal server error. Please try again..", 500));
});

// create a user
exports.addUser = asyncHandler(async (req, res, next) => {
  let content = null;
  let rawData = await fs.readFile("post.json", "utf-8");
  rawData = rawData != "" ? JSON.parse(rawData) : null;
  if (rawData && Array.isArray(rawData)) {
    rawData.push(req.body);
    content = stringify(rawData);
  } else {
    content = stringify([req.body]);
  }

  await fs.writeFile("post.json", content, "utf-8");
  res.status(200).json({
    success: true,
    count: JSON.parse(content).length,
    data: JSON.parse(content),
    msg: `new user has been added successfully`,
  });
  next(new ErrorResponse("Couldn't create new user. Please try again..", 500));
});
// update a user
exports.updateUser = asyncHandler(async (req, res, next) => {
  const dataRead = await fs.readFile("post.json", "utf-8");
  let records = JSON.parse(dataRead);

  records.forEach((record, index, arr) => {
    if (record.id == req.params.id) {
      // const { name, roel } = req.body;
      record = { ...record, ...req.body };
      arr[index] = record; // it will actually include the other fields in record object
    }
  });
  if (records) {
    await fs.writeFile("post.json", JSON.stringify(records), "utf-8");
    return res.status(200).json({ success: true, data: records });
  }

  next(new ErrorResponse("Please try again..", 500));
});

// delete a user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const dataRead = await fs.readFile("post.json", "utf-8");
  let record = JSON.parse(dataRead);

  let index = record.findIndex((obj) => obj["id"] == req.params.id);
  record.splice(index, 1);

  if (record) {
    await fs.writeFile("post.json", JSON.stringify(record), "utf-8");
    return res
      .status(200)
      .json({ success: true, count: record.length, data: record });
  }
  next(new ErrorResponse("having problem in delete.. try again later", 500));
});
