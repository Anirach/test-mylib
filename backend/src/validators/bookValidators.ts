import { z } from 'zod'

// Enums for validation
export const BookStatus = z.enum(['OWNED', 'LENT', 'WISHLIST', 'LOST'])

// Book creation validation schema
export const createBookSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  
  author: z.string()
    .min(1, 'Author is required')
    .max(255, 'Author must be less than 255 characters'),
  
  isbn: z.string()
    .optional()
    .refine((val) => !val || /^(?:\d{10}|\d{13})$/.test(val.replace(/-/g, '')), {
      message: 'Invalid ISBN format. Must be 10 or 13 digits'
    }),
  
  genre: z.string()
    .max(100, 'Genre must be less than 100 characters')
    .optional(),
  
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  
  coverImageUrl: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  
  pdfFileUrl: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  
  status: BookStatus.default('OWNED'),
  
  categoryId: z.string()
    .uuid('Invalid category ID format')
    .optional(),
  
  dateAdded: z.string()
    .datetime('Invalid date format')
    .optional()
    .transform((val) => val ? new Date(val) : new Date())
})

// Book update validation schema (all fields optional)
export const updateBookSchema = z.object({
  title: z.string()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  
  author: z.string()
    .min(1, 'Author cannot be empty')
    .max(255, 'Author must be less than 255 characters')
    .optional(),
  
  isbn: z.string()
    .optional()
    .refine((val) => !val || /^(?:\d{10}|\d{13})$/.test(val.replace(/-/g, '')), {
      message: 'Invalid ISBN format. Must be 10 or 13 digits'
    }),
  
  genre: z.string()
    .max(100, 'Genre must be less than 100 characters')
    .optional(),
  
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  
  coverImageUrl: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  
  pdfFileUrl: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  
  status: BookStatus.optional(),
  
  categoryId: z.string()
    .uuid('Invalid category ID format')
    .optional()
    .nullable()
})

// Query parameters validation for GET /api/books
export const getBooksQuerySchema = z.object({
  page: z.string()
    .optional()
    .transform((val) => val ? parseInt(val) : 1)
    .refine((val) => val > 0, 'Page must be a positive number'),
  
  limit: z.string()
    .optional()
    .transform((val) => val ? parseInt(val) : 10)
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
  
  sortBy: z.enum(['title', 'author', 'dateAdded', 'createdAt'])
    .optional()
    .default('createdAt'),
  
  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  
  status: BookStatus.optional(),
  
  genre: z.string()
    .max(100, 'Genre filter must be less than 100 characters')
    .optional(),
  
  search: z.string()
    .max(255, 'Search query must be less than 255 characters')
    .optional(),
  
  categoryId: z.string()
    .uuid('Invalid category ID format')
    .optional()
})

// Search query validation
export const searchBooksQuerySchema = z.object({
  q: z.string()
    .min(1, 'Search query is required')
    .max(255, 'Search query must be less than 255 characters'),
  
  limit: z.string()
    .optional()
    .transform((val) => val ? parseInt(val) : 10)
    .refine((val) => val > 0 && val <= 50, 'Limit must be between 1 and 50')
})

// Book ID parameter validation
export const bookIdParamSchema = z.object({
  id: z.string()
    .uuid('Invalid book ID format')
})

// Status parameter validation
export const statusParamSchema = z.object({
  status: BookStatus
})

// Category ID parameter validation
export const categoryIdParamSchema = z.object({
  categoryId: z.string()
    .uuid('Invalid category ID format')
})

// Type exports for TypeScript
export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
export type GetBooksQuery = z.infer<typeof getBooksQuerySchema>
export type SearchBooksQuery = z.infer<typeof searchBooksQuerySchema>
export type BookIdParam = z.infer<typeof bookIdParamSchema>
export type StatusParam = z.infer<typeof statusParamSchema>
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>
