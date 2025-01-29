import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            message = typeof errorResponse === 'string' ? errorResponse : (errorResponse as any).message;
        }

        res.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString()
        });
    }
}
