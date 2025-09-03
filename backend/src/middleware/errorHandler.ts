import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../types'

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  let error = { ...err } as AppError
  error.message = err.message

  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  })

  // Prisma errors
  if (err.message.includes('Unique constraint failed')) {
    error = new AppError('Resource already exists', 409)
  }

  if (err.message.includes('Record to update not found')) {
    error = new AppError('Resource not found', 404)
  }

  if (err.message.includes('Foreign key constraint failed')) {
    error = new AppError('Related resource not found', 400)
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = new AppError('Validation failed', 400)
  }

  // Default error
  const statusCode = error.statusCode || 500
  const message = error.isOperational ? error.message : 'Something went wrong'

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export const notFoundHandler = (req: Request, res: Response<ApiResponse>) => {
  const message = `Route ${req.originalUrl} not found`
  res.status(404).json({
    success: false,
    error: message
  })
}

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
