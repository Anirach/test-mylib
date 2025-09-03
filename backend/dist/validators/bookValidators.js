"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdParamSchema = exports.statusParamSchema = exports.bookIdParamSchema = exports.searchBooksQuerySchema = exports.getBooksQuerySchema = exports.updateBookSchema = exports.createBookSchema = exports.BookStatus = void 0;
const zod_1 = require("zod");
exports.BookStatus = zod_1.z.enum(['OWNED', 'LENT', 'WISHLIST', 'LOST']);
exports.createBookSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters'),
    author: zod_1.z.string()
        .min(1, 'Author is required')
        .max(255, 'Author must be less than 255 characters'),
    isbn: zod_1.z.string()
        .optional()
        .refine((val) => !val || /^(?:\d{10}|\d{13})$/.test(val.replace(/-/g, '')), {
        message: 'Invalid ISBN format. Must be 10 or 13 digits'
    }),
    genre: zod_1.z.string()
        .max(100, 'Genre must be less than 100 characters')
        .optional(),
    description: zod_1.z.string()
        .max(2000, 'Description must be less than 2000 characters')
        .optional(),
    coverImageUrl: zod_1.z.string()
        .url('Invalid URL format')
        .optional()
        .or(zod_1.z.literal('')),
    pdfFileUrl: zod_1.z.string()
        .url('Invalid URL format')
        .optional()
        .or(zod_1.z.literal('')),
    status: exports.BookStatus.default('OWNED'),
    categoryId: zod_1.z.string()
        .uuid('Invalid category ID format')
        .optional(),
    dateAdded: zod_1.z.string()
        .datetime('Invalid date format')
        .optional()
        .transform((val) => val ? new Date(val) : new Date())
});
exports.updateBookSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(1, 'Title cannot be empty')
        .max(255, 'Title must be less than 255 characters')
        .optional(),
    author: zod_1.z.string()
        .min(1, 'Author cannot be empty')
        .max(255, 'Author must be less than 255 characters')
        .optional(),
    isbn: zod_1.z.string()
        .optional()
        .refine((val) => !val || /^(?:\d{10}|\d{13})$/.test(val.replace(/-/g, '')), {
        message: 'Invalid ISBN format. Must be 10 or 13 digits'
    }),
    genre: zod_1.z.string()
        .max(100, 'Genre must be less than 100 characters')
        .optional(),
    description: zod_1.z.string()
        .max(2000, 'Description must be less than 2000 characters')
        .optional(),
    coverImageUrl: zod_1.z.string()
        .url('Invalid URL format')
        .optional()
        .or(zod_1.z.literal('')),
    pdfFileUrl: zod_1.z.string()
        .url('Invalid URL format')
        .optional()
        .or(zod_1.z.literal('')),
    status: exports.BookStatus.optional(),
    categoryId: zod_1.z.string()
        .uuid('Invalid category ID format')
        .optional()
        .nullable()
});
exports.getBooksQuerySchema = zod_1.z.object({
    page: zod_1.z.string()
        .optional()
        .transform((val) => val ? parseInt(val) : 1)
        .refine((val) => val > 0, 'Page must be a positive number'),
    limit: zod_1.z.string()
        .optional()
        .transform((val) => val ? parseInt(val) : 10)
        .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
    sortBy: zod_1.z.enum(['title', 'author', 'dateAdded', 'createdAt'])
        .optional()
        .default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc'])
        .optional()
        .default('desc'),
    status: exports.BookStatus.optional(),
    genre: zod_1.z.string()
        .max(100, 'Genre filter must be less than 100 characters')
        .optional(),
    search: zod_1.z.string()
        .max(255, 'Search query must be less than 255 characters')
        .optional(),
    categoryId: zod_1.z.string()
        .uuid('Invalid category ID format')
        .optional()
});
exports.searchBooksQuerySchema = zod_1.z.object({
    q: zod_1.z.string()
        .min(1, 'Search query is required')
        .max(255, 'Search query must be less than 255 characters'),
    limit: zod_1.z.string()
        .optional()
        .transform((val) => val ? parseInt(val) : 10)
        .refine((val) => val > 0 && val <= 50, 'Limit must be between 1 and 50')
});
exports.bookIdParamSchema = zod_1.z.object({
    id: zod_1.z.string()
        .uuid('Invalid book ID format')
});
exports.statusParamSchema = zod_1.z.object({
    status: exports.BookStatus
});
exports.categoryIdParamSchema = zod_1.z.object({
    categoryId: zod_1.z.string()
        .uuid('Invalid category ID format')
});
//# sourceMappingURL=bookValidators.js.map