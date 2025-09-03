import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../types'

// Simple in-memory rate limiter
interface RateLimitData {
  count: number
  resetTime: number
}

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean // Skip successful requests from counting
  skipFailedRequests?: boolean // Skip failed requests from counting
}

class RateLimiter {
  private requests: Map<string, RateLimitData> = new Map()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Too many requests, please try again later',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config
    }
  }

  // Middleware function
  middleware = (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const clientId = this.getClientId(req)
    const now = Date.now()
    
    // Clean up expired entries
    this.cleanup(now)

    // Get or create client data
    let clientData = this.requests.get(clientId)
    if (!clientData) {
      clientData = {
        count: 0,
        resetTime: now + this.config.windowMs
      }
      this.requests.set(clientId, clientData)
    }

    // Check if window has expired
    if (now > clientData.resetTime) {
      clientData.count = 0
      clientData.resetTime = now + this.config.windowMs
    }

    // Check rate limit
    if (clientData.count >= this.config.maxRequests) {
      const remainingTime = Math.ceil((clientData.resetTime - now) / 1000)
      
      res.status(429).json({
        success: false,
        error: this.config.message!,
        message: `Rate limit exceeded. Try again in ${remainingTime} seconds`
      })
      return
    }

    // Increment counter
    clientData.count++

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', this.config.maxRequests)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, this.config.maxRequests - clientData.count))
    res.setHeader('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000))

    next()
  }

  private getClientId(req: Request): string {
    // Use IP address as client identifier
    // In production, you might want to use user ID for authenticated requests
    return req.ip || req.connection.remoteAddress || 'unknown'
  }

  private cleanup(now: number): void {
    // Remove expired entries to prevent memory leaks
    for (const [clientId, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(clientId)
      }
    }
  }

  // Get current stats
  getStats(): { totalClients: number; activeClients: number } {
    const now = Date.now()
    let activeClients = 0

    for (const [, data] of this.requests.entries()) {
      if (now <= data.resetTime && data.count > 0) {
        activeClients++
      }
    }

    return {
      totalClients: this.requests.size,
      activeClients
    }
  }

  // Reset all rate limits
  reset(): void {
    this.requests.clear()
  }
}

// Pre-configured rate limiters for different use cases

// General API rate limiter (100 requests per 15 minutes)
export const generalRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many API requests from this IP, please try again later'
})

// Strict rate limiter for sensitive operations (10 requests per 15 minutes)
export const strictRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  message: 'Too many requests for this operation, please try again later'
})

// Upload rate limiter (5 uploads per 10 minutes)
export const uploadRateLimit = new RateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 5,
  message: 'Too many file uploads, please try again later'
})

// Search rate limiter (30 searches per 5 minutes)
export const searchRateLimit = new RateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 30,
  message: 'Too many search requests, please try again later'
})

// Authentication rate limiter (5 attempts per 15 minutes)
export const authRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many authentication attempts, please try again later'
})

// Custom rate limiter factory
export const createRateLimit = (config: RateLimitConfig) => {
  return new RateLimiter(config)
}

// Export the RateLimiter class for custom implementations
export { RateLimiter, RateLimitConfig }
