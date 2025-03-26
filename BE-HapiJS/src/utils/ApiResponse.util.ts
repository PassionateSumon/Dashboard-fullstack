class ApiResponse<T> {
  public code: number;
  public message: string;
  public data: T | null;
  constructor(code: number, message: string, data: T | null = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
