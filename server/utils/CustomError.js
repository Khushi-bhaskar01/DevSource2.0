class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;
