import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import path from 'path'

// Import routes
import booksRouter from './routes/books'
import lendingRouter from './routes/lending'
import uploadRouter from './routes/upload'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { setupSwagger } from './swagger/swagger'

// Load environment variables
config()

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Logging middleware
app.use(morgan('combined'))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Book Management API',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      lending: '/api/lending',
      upload: '/api/upload'
    }
  })
})

// Setup API documentation
setupSwagger(app)

// API routes
app.use('/api/books', booksRouter)
app.use('/api/lending', lendingRouter)
app.use('/api/upload', uploadRouter)

// 404 handler - catch all unmatched routes
app.use((req, res, next) => {
  const message = `Route ${req.originalUrl} not found`
  res.status(404).json({
    success: false,
    error: message
  })
})

// Global error handler
app.use(errorHandler)

export default app
