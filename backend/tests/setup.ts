/// <reference types="jest" />

import { config } from 'dotenv'

// Load test environment variables
config({ path: '.env.test' })

// Set test environment
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'file:./test.db'

// Global test timeout
jest.setTimeout(30000)

// Setup global test utilities
global.console = {
  ...console,
  // Suppress console.log in tests unless explicitly needed
  log: process.env.VERBOSE_TESTS === 'true' ? console.log : jest.fn(),
  debug: process.env.VERBOSE_TESTS === 'true' ? console.debug : jest.fn(),
  info: process.env.VERBOSE_TESTS === 'true' ? console.info : jest.fn(),
  warn: console.warn,
  error: console.error,
}

// Mock external dependencies that we don't want to test
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
  }))
}))

// Global setup for all tests
beforeAll(async () => {
  // Any global setup needed
})

// Global cleanup for all tests
afterAll(async () => {
  // Any global cleanup needed
})

// Reset state between tests
beforeEach(() => {
  // Reset any global state
})

afterEach(() => {
  // Clean up after each test
})
