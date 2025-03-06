class ApiErrorHandler extends Error {
  public code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "ApiErrorHandler";

    Object.setPrototypeOf(this, ApiErrorHandler.prototype);
  }
}

export default ApiErrorHandler;
