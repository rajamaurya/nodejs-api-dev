const fs = require("fs/promises");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/async");
const { stringify } = require("../utils/helper");

// get users list

exports.getUsers = asyncHandler(async (req, res, next) => {
  const dataRead = await fs.readFile("post.json");
  let content = JSON.parse(dataRead);

  if (content) {
    return res.status(200).send(content);
  }
  next(new ErrorResponse("Bad request. Please try again..", 400));
});
// get single user
exports.getUser = async (req, res, next) => {
  try {
    const dataRead = await fs.readFile("post.json", "utf-8");
    let record = JSON.parse(dataRead);

    record = record.find((obj) => obj["id"] == req.params.id);

    if (record) {
      return res.status(200).json({ success: true, data: record });
    } else {
      next(new ErrorResponse("No record found.."), 200);
    }
  } catch (err) {
    res.status(400).json({ success: false, data: [] });
    next(err);
  }
};

// create a user
exports.addUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};
// update a user
exports.updateUser = async (req, res, next) => {
  try {
    const dataRead = await fs.readFile("post.json", "utf-8");
    let records = JSON.parse(dataRead);

    records.forEach((record) => {
      if (record.id == req.params.id) {
        const { name } = req.body;
        record.name = name;
      }
    });
    if (records) {
      await fs.writeFile("post.json", JSON.stringify(records), "utf-8");
      return res.status(200).json({ success: true, data: records });
    }
  } catch (err) {
    res.status(400).json({ success: false, data: [] });
    next(err);
  }
};

// delete a user
exports.deleteUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(400).json({ success: false, data: [] });
    next(err);
  }
};
