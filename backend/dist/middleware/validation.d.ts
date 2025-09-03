import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiResponse } from '../types';
export declare const validate: (schema: {
    body?: z.ZodSchema;
    params?: z.ZodSchema;
    query?: z.ZodSchema;
}) => (req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateUUIDParam: (paramName?: string) => (req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validatePagination: (req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateSearchQuery: (req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const formatValidationError: (error: ZodError) => {
    message: string;
    errors: {
        field: string;
        message: string;
        code: "custom" | "unrecognized_keys" | "invalid_type" | "too_big" | "too_small" | "invalid_format" | "not_multiple_of" | "invalid_union" | "invalid_key" | "invalid_element" | "invalid_value";
    }[];
    count: number;
};
export declare const createRateLimit: (windowMs: number, maxRequests: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=validation.d.ts.map