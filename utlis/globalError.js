class ApiError extends Error {
  constructor() {
    super();
  }
  create(message, statusCode, text) {
    this.message = message;
    this.statusCode = statusCode;
    this.text = text;
    return this;
  }
}

module.exports = new ApiError();
