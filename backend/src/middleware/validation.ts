import { Request, Response, NextFunction } from 'express'
import { z, ZodError, ZodIssue } from 'zod'
import { ApiResponse } from '../types'

// Generic validation middleware factory
export const validate = (schema: {
  body?: z.ZodSchema
  params?: z.ZodSchema
  query?: z.ZodSchema
}) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      // Validate request body
      if (schema.body) {
        req.body = schema.body.parse(req.body)
      }

      // Validate request parameters
      if (schema.params) {
        const parsedParams = schema.params.parse(req.params)
        req.params = parsedParams as Request['params']
      }

      // Validate query parameters
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query)
        req.query = parsedQuery as Request['query']
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }))

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: `Validation errors: ${errors.map((e: { message: string }) => e.message).join(', ')}`
        })
        return
      }

      // Handle other validation errors
      res.status(400).json({
        success: false,
        error: 'Invalid request format'
      })
    }
  }
}

// Specific validation middleware for common use cases

// Validate UUID parameters (for :id routes)
export const validateUUIDParam = (paramName: string = 'id') => {
  const schema = z.object({
    [paramName]: z.string().uuid(`Invalid ${paramName} format`)
  })
  
  return validate({ params: schema })
}

// Validate pagination query parameters
export const validatePagination = validate({
  query: z.object({
    page: z.string()
      .optional()
      .transform((val) => val ? parseInt(val) : 1)
      .refine((val) => val > 0, 'Page must be a positive number'),
    
    limit: z.string()
      .optional()
      .transform((val) => val ? parseInt(val) : 10)
      .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
  }).partial()
})

// Validate search query parameters
export const validateSearchQuery = validate({
  query: z.object({
    q: z.string()
      .min(1, 'Search query is required')
      .max(255, 'Search query must be less than 255 characters'),
    
    limit: z.string()
      .optional()
      .transform((val) => val ? parseInt(val) : 10)
      .refine((val) => val > 0 && val <= 50, 'Limit must be between 1 and 50')
  })
})

// Custom error formatter for validation errors
export const formatValidationError = (error: ZodError) => {
  const formattedErrors = error.issues.map((err: ZodIssue) => {
    const field = err.path.join('.')
    const message = err.message

    return {
      field,
      message,
      code: err.code
    }
  })

  return {
    message: 'Validation failed',
    errors: formattedErrors,
    count: formattedErrors.length
  }
}

// Rate limiting helper (basic implementation)
export const createRateLimit = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key)
      }
    }

    const clientData = requests.get(clientId)
    
    if (!clientData) {
      requests.set(clientId, { count: 1, resetTime: now })
      return next()
    }

    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        details: {
          message: `Rate limit exceeded. Try again in ${Math.ceil((windowMs - (now - clientData.resetTime)) / 1000)} seconds`,
          retryAfter: Math.ceil((windowMs - (now - clientData.resetTime)) / 1000)
        }
      })
    }

    clientData.count += 1
    next()
  }
}
