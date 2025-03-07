class ApiErrorHandler {
  public code: number;
  public message: string;
  constructor(code: number, message: string) {
    // super(message);
    this.message = message;
    this.code = code;

    Object.setPrototypeOf(this, ApiErrorHandler.prototype);
  }
}

export default ApiErrorHandler;
