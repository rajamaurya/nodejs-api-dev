const ErrorHandler = (err, req, res, next) => {
  console.log("ERROR__STACK", err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    msg: err.message || "Internal Server error",
    data: [],
  });
  next();
};

module.exports = ErrorHandler;
