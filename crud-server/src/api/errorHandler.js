const apiErrorHandler = (err, req, res, next) => {
  let customError = err;
  console.log("ERROR HANDLER => Error Name: ", err.name);

  if (err.name === "SequelizeUniqueConstraintError") {
    customError.message = "Bu kodda bir kayıt var. İsmi değiştiriniz.";
  }

  console.log("Custom error handle: ", customError.message, customError.status);

  res.status(customError.status || 500).send(customError.message);
};

export default apiErrorHandler;
