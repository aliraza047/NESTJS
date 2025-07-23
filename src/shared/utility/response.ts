export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export class ResponseUtil {
  // Success response
  static success<T>(
    message: string = 'Request was successful',
    data: T | undefined = undefined,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  // Generic error response
  static error<T>(
    message: string = 'Something went wrong',
    error: any = null,
  ): ApiResponse<T> {
    return {
      success: false,
      message,
      error,
    };
  }

  // Not found error response
  static notFound<T>(message: string = 'Resource not found'): ApiResponse<T> {
    return {
      success: false,
      message,
      error: 'Not Found',
    };
  }

  // Unauthorized access error response
  static unauthorized<T>(
    message: string = 'Unauthorized access',
  ): ApiResponse<T> {
    return {
      success: false,
      message,
      error: 'Unauthorized',
    };
  }

  // Forbidden access error response
  static forbidden<T>(message: string = 'Access forbidden'): ApiResponse<T> {
    return {
      success: false,
      message,
      error: 'Forbidden',
    };
  }

  // Exception error handler with detailed error message
  static exceptionError<T>(
    error: any,
    message: string = 'An unexpected error occurred',
  ): ApiResponse<T> {
    return {
      success: false,
      message,
      error: error.message || 'Internal Server Error',
    };
  }
}
