"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnBookSchema = exports.bookIdParamSchema = exports.lendingIdParamSchema = exports.getLendingHistoryQuerySchema = exports.extendLendingSchema = exports.updateLendingSchema = exports.createLendingSchema = void 0;
const zod_1 = require("zod");
exports.createLendingSchema = zod_1.z.object({
    bookId: zod_1.z.string()
        .uuid('Invalid book ID format'),
    borrowerName: zod_1.z.string()
        .min(1, 'Borrower name is required')
        .max(255, 'Borrower name must be less than 255 characters'),
    borrowerContact: zod_1.z.string()
        .min(1, 'Borrower contact is required')
        .max(255, 'Borrower contact must be less than 255 characters'),
    expectedReturn: zod_1.z.string()
        .datetime('Invalid date format')
        .transform((val) => new Date(val))
        .refine((date) => date > new Date(), {
        message: 'Expected return date must be in the future'
    }),
    notes: zod_1.z.string()
        .max(1000, 'Notes must be less than 1000 characters')
        .optional()
});
exports.updateLendingSchema = zod_1.z.object({
    borrowerName: zod_1.z.string()
        .min(1, 'Borrower name cannot be empty')
        .max(255, 'Borrower name must be less than 255 characters')
        .optional(),
    borrowerContact: zod_1.z.string()
        .min(1, 'Borrower contact cannot be empty')
        .max(255, 'Borrower contact must be less than 255 characters')
        .optional(),
    expectedReturn: zod_1.z.string()
        .datetime('Invalid date format')
        .transform((val) => new Date(val))
        .optional(),
    notes: zod_1.z.string()
        .max(1000, 'Notes must be less than 1000 characters')
        .optional()
});
exports.extendLendingSchema = zod_1.z.object({
    newExpectedReturn: zod_1.z.string()
        .datetime('Invalid date format')
        .transform((val) => new Date(val))
        .refine((date) => date > new Date(), {
        message: 'New expected return date must be in the future'
    })
});
exports.getLendingHistoryQuerySchema = zod_1.z.object({
    page: zod_1.z.string()
        .optional()
        .transform((val) => val ? parseInt(val) : 1)
        .refine((val) => val > 0, 'Page must be a positive number'),
    limit: zod_1.z.string()
        .optional()
        .transform((val) => val ? parseInt(val) : 10)
        .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
    sortBy: zod_1.z.enum(['dateLent', 'expectedReturn', 'actualReturn', 'borrowerName'])
        .optional()
        .default('dateLent'),
    sortOrder: zod_1.z.enum(['asc', 'desc'])
        .optional()
        .default('desc'),
    isReturned: zod_1.z.string()
        .optional()
        .transform((val) => val === 'true' ? true : val === 'false' ? false : undefined),
    overdue: zod_1.z.string()
        .optional()
        .transform((val) => val === 'true' ? true : val === 'false' ? false : undefined),
    borrowerName: zod_1.z.string()
        .max(255, 'Borrower name filter must be less than 255 characters')
        .optional(),
    startDate: zod_1.z.string()
        .datetime('Invalid start date format')
        .optional()
        .transform((val) => val ? new Date(val) : undefined),
    endDate: zod_1.z.string()
        .datetime('Invalid end date format')
        .optional()
        .transform((val) => val ? new Date(val) : undefined)
});
exports.lendingIdParamSchema = zod_1.z.object({
    id: zod_1.z.string()
        .uuid('Invalid lending ID format')
});
exports.bookIdParamSchema = zod_1.z.object({
    id: zod_1.z.string()
        .uuid('Invalid book ID format')
});
exports.returnBookSchema = zod_1.z.object({
    notes: zod_1.z.string()
        .max(1000, 'Return notes must be less than 1000 characters')
        .optional(),
    actualReturn: zod_1.z.string()
        .datetime('Invalid date format')
        .optional()
        .transform((val) => val ? new Date(val) : new Date())
});
//# sourceMappingURL=lendingValidators.js.map