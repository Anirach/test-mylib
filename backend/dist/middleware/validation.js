"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimit = exports.formatValidationError = exports.validateSearchQuery = exports.validatePagination = exports.validateUUIDParam = exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            if (schema.body) {
                req.body = schema.body.parse(req.body);
            }
            if (schema.params) {
                const parsedParams = schema.params.parse(req.params);
                req.params = parsedParams;
            }
            if (schema.query) {
                const parsedQuery = schema.query.parse(req.query);
                req.query = parsedQuery;
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    message: `Validation errors: ${errors.map((e) => e.message).join(', ')}`
                });
                return;
            }
            res.status(400).json({
                success: false,
                error: 'Invalid request format'
            });
        }
    };
};
exports.validate = validate;
const validateUUIDParam = (paramName = 'id') => {
    const schema = zod_1.z.object({
        [paramName]: zod_1.z.string().uuid(`Invalid ${paramName} format`)
    });
    return (0, exports.validate)({ params: schema });
};
exports.validateUUIDParam = validateUUIDParam;
exports.validatePagination = (0, exports.validate)({
    query: zod_1.z.object({
        page: zod_1.z.string()
            .optional()
            .transform((val) => val ? parseInt(val) : 1)
            .refine((val) => val > 0, 'Page must be a positive number'),
        limit: zod_1.z.string()
            .optional()
            .transform((val) => val ? parseInt(val) : 10)
            .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    }).partial()
});
exports.validateSearchQuery = (0, exports.validate)({
    query: zod_1.z.object({
        q: zod_1.z.string()
            .min(1, 'Search query is required')
            .max(255, 'Search query must be less than 255 characters'),
        limit: zod_1.z.string()
            .optional()
            .transform((val) => val ? parseInt(val) : 10)
            .refine((val) => val > 0 && val <= 50, 'Limit must be between 1 and 50')
    })
});
const formatValidationError = (error) => {
    const formattedErrors = error.issues.map((err) => {
        const field = err.path.join('.');
        const message = err.message;
        return {
            field,
            message,
            code: err.code
        };
    });
    return {
        message: 'Validation failed',
        errors: formattedErrors,
        count: formattedErrors.length
    };
};
exports.formatValidationError = formatValidationError;
const createRateLimit = (windowMs, maxRequests) => {
    const requests = new Map();
    return (req, res, next) => {
        const clientId = req.ip || 'unknown';
        const now = Date.now();
        const windowStart = now - windowMs;
        for (const [key, value] of requests.entries()) {
            if (value.resetTime < windowStart) {
                requests.delete(key);
            }
        }
        const clientData = requests.get(clientId);
        if (!clientData) {
            requests.set(clientId, { count: 1, resetTime: now });
            return next();
        }
        if (clientData.count >= maxRequests) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests',
                details: {
                    message: `Rate limit exceeded. Try again in ${Math.ceil((windowMs - (now - clientData.resetTime)) / 1000)} seconds`,
                    retryAfter: Math.ceil((windowMs - (now - clientData.resetTime)) / 1000)
                }
            });
        }
        clientData.count += 1;
        next();
    };
};
exports.createRateLimit = createRateLimit;
//# sourceMappingURL=validation.js.map