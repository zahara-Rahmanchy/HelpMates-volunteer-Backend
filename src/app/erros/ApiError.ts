class ApiError extends Error {
  //   statusCode: number;
  error: string;
  statusCode: number;
  constructor(
    statusCode: number,
    message: string | undefined,
    stack = "",
    error: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
      console.log(
        " Error.captureStackTrace(this,this.constructor): ",
        Error.captureStackTrace(this, this.constructor)
      );
    }
  }
}

export default ApiError;
