const apiErrorHandler = (err, req, res) => {
  let customError = err;
  console.log("ERROR HANDLER => Error Name: ", err.name);

  if (err.name === "SequelizeUniqueConstraintError") {
    customError.message = "Bu kodda bir kayıt var. İsmi değiştiriniz.";
  }

  console.log("Custom error handle: ", customError.message, customError.status);

  res.status(customError.status || 500).json({
    success: false,
    message: customError.message || "Internal server error",
  });
};

export default apiErrorHandler;
