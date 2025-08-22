import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge classes correctly', () => {
      const result = cn('px-2', 'py-1', 'bg-red-500')
      expect(result).toBe('px-2 py-1 bg-red-500')
    })

    it('should handle conflicting classes', () => {
      const result = cn('px-2', 'px-4')
      expect(result).toBe('px-4')
    })

    it('should handle conditional classes', () => {
      const isActive = false
      const result = cn('px-2', isActive && 'py-4', 'bg-blue-500')
      expect(result).toBe('px-2 bg-blue-500')
    })

    it('should handle undefined and null values', () => {
      const result = cn('px-2', undefined, null, 'py-1')
      expect(result).toBe('px-2 py-1')
    })
  })
})
