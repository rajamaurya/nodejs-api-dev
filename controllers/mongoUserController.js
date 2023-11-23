const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/async");
const { stringify } = require("../utils/helper");
const colors = require("colors");
const User = require("../models/User");

// get users list

exports.getMongoUsers = asyncHandler(async (req, res, next) => {
  let query = User.find({}); // warn: do not use await here.
  if (!query) {
    next(new ErrorResponse("No users record found.", 400));
  }

  if (query) {
    // check if sort is required
    if (req.query.sort) {
      let sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy); // check warn: it will not work otherwise
    }
    // check if selection is there
    if (req.query.select) {
      let selectedItems = req.query.select.split(",").join(" ");
      query = query.select(selectedItems); // check warn: it will not work otherwise
    }
    // pagination handling..
    let page = parseInt(req.query.page) || 1;

    let total = Math.ceil(await User.countDocuments(query));
    let limit = parseInt(req.query.limit) || 5;

    let skip = (page - 1) * limit;
    let endIndex = page * limit;
    let startIndex = 1;

    let pagination = {
      prev: null,
      next: null,
      offset: null,
    };
    pagination.offset = (endIndex - startIndex) * skip;
    if (endIndex > total) {
      page = page - 1;
      pagination.prev = page;
    }
    if (startIndex >= 0) {
      page = page + 1;
      pagination.next = page;
    }

    query = await query.skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      count: query.length,
      data: query,
      msg: `users fetched`,
      pagination,
    });
  }
  next(new ErrorResponse("Bad request. Please try again..", 400));
});
// get single user
exports.getMongoUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(new ErrorResponse("No user found..", 400));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// create a user
exports.addMongoUser = asyncHandler(async (req, res, next) => {
  // check if user already exist..
  const isUserExist = await User.findOne({ email: req.body.email }).exec();
  if (!isUserExist) {
    //create a new one
    const user = await User.create(req.body);
    return res.status(200).json({
      success: true,
      msg: "User has been created successfully..",
      data: user,
    });
  }
  next(new ErrorResponse("There is some problem in creating a new user", 400));
});
// update a user
exports.updateMongoUser = asyncHandler(async (req, res, next) => {
  const UpdatedUser = await User.findByIdAndUpdate(req.params.id, req.body);
  if (UpdatedUser) {
    return res.status(200).json({ success: true, data: UpdatedUser });
  }

  next(new ErrorResponse("Please try again..", 500));
});

// delete a user
exports.deleteMongoUser = asyncHandler(async (req, res, next) => {
  try {
    const findUserAndDelete = await User.findByIdAndDelete(req.params.id);
    console.log(
      `delete usr with id : ${req.params.id}`.bgWhite,
      findUserAndDelete
    );
    return res.status(200).json({
      success: true,
      data: findUserAndDelete,
      msg: "user has been deleted successfully",
    });
  } catch (err) {
    console.log("err message::".bgRed, err.message);
  }

  next(new ErrorResponse("having problem in delete.. try again later", 500));
});
