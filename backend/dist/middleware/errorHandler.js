"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    if (err.message.includes('Unique constraint failed')) {
        error = new AppError('Resource already exists', 409);
    }
    if (err.message.includes('Record to update not found')) {
        error = new AppError('Resource not found', 404);
    }
    if (err.message.includes('Foreign key constraint failed')) {
        error = new AppError('Related resource not found', 400);
    }
    if (err.name === 'ValidationError') {
        error = new AppError('Validation failed', 400);
    }
    const statusCode = error.statusCode || 500;
    const message = error.isOperational ? error.message : 'Something went wrong';
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    const message = `Route ${req.originalUrl} not found`;
    res.status(404).json({
        success: false,
        error: message
    });
};
exports.notFoundHandler = notFoundHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map