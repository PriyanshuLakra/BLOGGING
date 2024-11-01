
import { Request, Response, NextFunction } from 'express';


export class ErrorHandler extends Error {
    public statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
  
      // Capture stack trace and exclude constructor call from it.
      Error.captureStackTrace(this, this.constructor);
    }
  }


export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};



   
