import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    console.log('Exception caught in filter:', exception);


    let status = exception.getStatus();
    let message = exception.getResponse();

    if (exception instanceof HttpException) {
      res.status(status).json({
        code: status,
        message: message,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(status).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
        timestamp: new Date().toISOString()
      });
    }

  }
}
