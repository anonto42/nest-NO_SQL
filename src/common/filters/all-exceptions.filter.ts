import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    const errorResponse: any = {
      statusCode: status,
      message: exception.message || 'Internal Server Error', 
      error: exception.name || 'Error',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'object' && responseBody !== null) {
        errorResponse.message = responseBody['message'] || exception.message;
        errorResponse.error = responseBody['error'] || exception.name;
      }
    }

    if (exception.name === 'ValidationError') {
      errorResponse.message = 'Validation failed';
      errorResponse.error = 'Bad Request';
      errorResponse.details = exception.errors || []; 
    }

    if (exception instanceof HttpException) {
      switch (status) {
        case 400:
          errorResponse.message = 'Bad Request: The data you provided is invalid.';
          break;
        case 401:
          errorResponse.message = 'Unauthorized: You need to log in to access this resource.';
          break;
        case 403:
          errorResponse.message = 'Forbidden: You do not have permission to access this resource.';
          break;
        case 404:
          errorResponse.message = 'Not Found: The requested resource could not be found.';
          break;
        case 500:
        default:
          errorResponse.message = 'Internal Server Error: Something went wrong on the server.';
          break;
      }
    }

    console.error('Error:', exception);

    response.status(status).json(errorResponse);
  }
}
