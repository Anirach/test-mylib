import { Request, Response } from 'express'
import { BookService } from '../services/BookService'
import { ApiResponse, BookCreateInput, BookUpdateInput, BookSearchParams } from '../types'
import { asyncHandler } from '../middleware/errorHandler'

const bookService = new BookService()

export const BookController = {
  // GET /api/books - Get all books with filtering and pagination
  getAllBooks: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const params: BookSearchParams = {
      query: req.query.query as string,
      status: req.query.status as any,
      genre: req.query.genre as string,
      categoryId: req.query.categoryId as string,
      author: req.query.author as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: req.query.sortBy as any || 'dateAdded',
      sortOrder: req.query.sortOrder as any || 'desc'
    }

    const result = await bookService.getAllBooks(params)

    res.status(200).json({
      success: true,
      data: result.data,
      message: `Found ${result.data.length} books`,
      pagination: result.pagination
    })
  }),

  // GET /api/books/:id - Get single book by ID
  getBookById: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params
    const book = await bookService.getBookById(id)

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: book,
      message: 'Book retrieved successfully'
    })
  }),

  // POST /api/books - Create new book
  createBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const bookData: BookCreateInput = req.body

    // Basic validation
    if (!bookData.title || !bookData.author) {
      return res.status(400).json({
        success: false,
        error: 'Title and author are required'
      })
    }

    const book = await bookService.createBook(bookData)

    return res.status(201).json({
      success: true,
      data: book,
      message: 'Book created successfully'
    })
  }),

  // PUT /api/books/:id - Update existing book
  updateBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params
    const updateData: BookUpdateInput = req.body

    const book = await bookService.updateBook(id, updateData)

    return res.status(200).json({
      success: true,
      data: book,
      message: 'Book updated successfully'
    })
  }),

  // DELETE /api/books/:id - Delete book
  deleteBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params

    await bookService.deleteBook(id)

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    })
  }),

  // GET /api/books/search - Search books by title/author
  searchBooks: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { q: searchTerm, limit } = req.query

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        error: 'Search term is required'
      })
    }

    const books = await bookService.searchBooks(
      searchTerm as string,
      limit ? parseInt(limit as string) : 10
    )

    return res.status(200).json({
      success: true,
      data: books,
      message: `Found ${books.length} books matching "${searchTerm}"`
    })
  }),

  // GET /api/books/status/:status - Filter books by status
  getBooksByStatus: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { status } = req.params

    if (!['OWNED', 'LENT', 'WISHLIST', 'LOST'].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: OWNED, LENT, WISHLIST, LOST'
      })
    }

    const books = await bookService.getBooksByStatus(status.toUpperCase())

    return res.status(200).json({
      success: true,
      data: books,
      message: `Found ${books.length} books with status "${status}"`
    })
  }),

  // GET /api/books/category/:categoryId - Get books by category
  getBooksByCategory: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { categoryId } = req.params

    const books = await bookService.getBooksByCategory(categoryId)

    return res.status(200).json({
      success: true,
      data: books,
      message: `Found ${books.length} books in category`
    })
  }),

  // GET /api/books/stats - Get book statistics
  getBookStats: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const stats = await bookService.getBookStats()

    return res.status(200).json({
      success: true,
      data: stats,
      message: 'Book statistics retrieved successfully'
    })
  })
}
