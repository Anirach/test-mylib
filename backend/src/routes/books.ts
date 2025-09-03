import { Router } from 'express'
import { BookController } from '../controllers/BookController'
import { LendingController } from '../controllers/LendingController'
import { generalRateLimit, searchRateLimit } from '../middleware/rateLimit'

const router = Router()

// Apply general rate limiting to all routes
router.use(generalRateLimit.middleware)

// GET /api/books/search - Search books (must come before /:id route)
router.get('/search', searchRateLimit.middleware, BookController.searchBooks)

// GET /api/books/stats - Get book statistics
router.get('/stats', BookController.getBookStats)

// GET /api/books/status/:status - Filter books by status
router.get('/status/:status', BookController.getBooksByStatus)

// GET /api/books/category/:categoryId - Get books by category
router.get('/category/:categoryId', BookController.getBooksByCategory)

// GET /api/books - Get all books with filtering and pagination
router.get('/', BookController.getAllBooks)

// GET /api/books/:id - Get single book by ID
router.get('/:id', BookController.getBookById)

// POST /api/books - Create new book
router.post('/', BookController.createBook)

// POST /api/books/:id/lend - Lend a book
router.post('/:id/lend', LendingController.lendBook)

// PUT /api/books/:id/return - Return a lent book
router.put('/:id/return', LendingController.returnBook)

// PUT /api/books/:id - Update existing book
router.put('/:id', BookController.updateBook)

// DELETE /api/books/:id - Delete book
router.delete('/:id', BookController.deleteBook)

export default router
