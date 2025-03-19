class ApiErrorHandler {
  public code: number;
  public message: string;
  constructor(code: number, message: string) {
    // super(message);
    this.code = code;
    this.message = message;

    Object.setPrototypeOf(this, ApiErrorHandler.prototype);
  }
}

export default ApiErrorHandler;
