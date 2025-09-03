import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response<ApiResponse>) => void;
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map