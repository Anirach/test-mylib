import { z } from 'zod'

// Lending creation validation schema
export const createLendingSchema = z.object({
  bookId: z.string()
    .uuid('Invalid book ID format'),
  
  borrowerName: z.string()
    .min(1, 'Borrower name is required')
    .max(255, 'Borrower name must be less than 255 characters'),
  
  borrowerContact: z.string()
    .min(1, 'Borrower contact is required')
    .max(255, 'Borrower contact must be less than 255 characters'),
  
  expectedReturn: z.string()
    .datetime('Invalid date format')
    .transform((val) => new Date(val))
    .refine((date) => date > new Date(), {
      message: 'Expected return date must be in the future'
    }),
  
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
})

// Lending update validation schema
export const updateLendingSchema = z.object({
  borrowerName: z.string()
    .min(1, 'Borrower name cannot be empty')
    .max(255, 'Borrower name must be less than 255 characters')
    .optional(),
  
  borrowerContact: z.string()
    .min(1, 'Borrower contact cannot be empty')
    .max(255, 'Borrower contact must be less than 255 characters')
    .optional(),
  
  expectedReturn: z.string()
    .datetime('Invalid date format')
    .transform((val) => new Date(val))
    .optional(),
  
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
})

// Extend lending period validation schema
export const extendLendingSchema = z.object({
  newExpectedReturn: z.string()
    .datetime('Invalid date format')
    .transform((val) => new Date(val))
    .refine((date) => date > new Date(), {
      message: 'New expected return date must be in the future'
    })
})

// Lending history query parameters validation
export const getLendingHistoryQuerySchema = z.object({
  page: z.string()
    .optional()
    .transform((val) => val ? parseInt(val) : 1)
    .refine((val) => val > 0, 'Page must be a positive number'),
  
  limit: z.string()
    .optional()
    .transform((val) => val ? parseInt(val) : 10)
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
  
  sortBy: z.enum(['dateLent', 'expectedReturn', 'actualReturn', 'borrowerName'])
    .optional()
    .default('dateLent'),
  
  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  
  isReturned: z.string()
    .optional()
    .transform((val) => val === 'true' ? true : val === 'false' ? false : undefined),
  
  overdue: z.string()
    .optional()
    .transform((val) => val === 'true' ? true : val === 'false' ? false : undefined),
  
  borrowerName: z.string()
    .max(255, 'Borrower name filter must be less than 255 characters')
    .optional(),
  
  startDate: z.string()
    .datetime('Invalid start date format')
    .optional()
    .transform((val) => val ? new Date(val) : undefined),
  
  endDate: z.string()
    .datetime('Invalid end date format')
    .optional()
    .transform((val) => val ? new Date(val) : undefined)
})

// Lending ID parameter validation
export const lendingIdParamSchema = z.object({
  id: z.string()
    .uuid('Invalid lending ID format')
})

// Book ID parameter validation for lending routes
export const bookIdParamSchema = z.object({
  id: z.string()
    .uuid('Invalid book ID format')
})

// Return book validation schema (for request body if needed)
export const returnBookSchema = z.object({
  notes: z.string()
    .max(1000, 'Return notes must be less than 1000 characters')
    .optional(),
  
  actualReturn: z.string()
    .datetime('Invalid date format')
    .optional()
    .transform((val) => val ? new Date(val) : new Date())
})

// Type exports for TypeScript
export type CreateLendingInput = z.infer<typeof createLendingSchema>
export type UpdateLendingInput = z.infer<typeof updateLendingSchema>
export type ExtendLendingInput = z.infer<typeof extendLendingSchema>
export type GetLendingHistoryQuery = z.infer<typeof getLendingHistoryQuerySchema>
export type LendingIdParam = z.infer<typeof lendingIdParamSchema>
export type BookIdParam = z.infer<typeof bookIdParamSchema>
export type ReturnBookInput = z.infer<typeof returnBookSchema>
