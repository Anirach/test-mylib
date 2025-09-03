import app from './app'

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📖 API documentation: http://localhost:${PORT}/api`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
    process.exit(0)
  })
})
