import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
const PrismaErrors = {
  P2002: 'Unique constraint failed',
  P2003: 'Foreign key constraint failed',
  P2025: 'Record to delete does not exist',
};
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status;
    let message;
    let stack;
    let error;
    let fields;

    if (exception instanceof HttpException) {
      const exceptionDetails: any = exception.getResponse().valueOf();
      if (exceptionDetails?.response?.statusCode) {
        status = exceptionDetails.response.statusCode;
      } else {
        status = exception.getStatus();
      }
      if (exceptionDetails?.response?.message) {
        message = exceptionDetails.response.message;
      } else {
        message = exceptionDetails.message;
      }
      if (Array.isArray(message)) {
        message = message.length
          ? message[0]
          : HttpStatus.INTERNAL_SERVER_ERROR;
      }
      if (exceptionDetails?.response?.error) {
        error = exceptionDetails.response.error;
      } else {
        error = exceptionDetails.error;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = PrismaErrors[exception.code];
      if (prismaError) {
        message = prismaError;
        status = HttpStatus.BAD_REQUEST;
        if (exception.meta && exception.meta['target']) {
          fields = exception.meta['target'];
          message += ` on field(s): ${Array.isArray(fields) ? fields.join(', ') : fields}`;
        }
      } else {
        message = 'An unexpected database error occurred';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      error = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      const exceptionDetails: any = exception;
      message = exceptionDetails.message;
      stack = exceptionDetails.stack;
      error = 'Unhandled Rejection';
      const customErrorStatusCode =
        this.checkForCustomErrorCode(exceptionDetails);
      if (customErrorStatusCode) {
        status = customErrorStatusCode;
      }
    }
    response.status(status).json({
      status: false,
      statusCode: status,
      message,
      error,
      fields,
      data: null,
      stack: process.env.NODE_ENV === 'production' ? undefined : stack,
    });
  }
  checkForCustomErrorCode(exception: any) {
    return PrismaErrors[exception.code];
  }
}
