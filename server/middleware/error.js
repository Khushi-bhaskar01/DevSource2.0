import CustomError from "../utils/CustomError.js";

const errorMiddleware = (err, req, res, next) => {
  console.log(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  //Check for custom error
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  //Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered for ${
      Object.keys(err.keyValue)[0]
    }`;
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorMiddleware;
