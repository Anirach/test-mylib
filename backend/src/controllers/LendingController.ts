import { Request, Response } from 'express'
import { LendingService } from '../services/LendingService'
import { ApiResponse, LendingCreateInput, LendingUpdateInput, LendingSearchParams } from '../types'
import { asyncHandler } from '../middleware/errorHandler'

const lendingService = new LendingService()

export const LendingController = {
  // POST /api/books/:id/lend - Lend a book
  lendBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id: bookId } = req.params
    const { borrowerName, borrowerContact, expectedReturn } = req.body

    // Basic validation
    if (!borrowerName || !borrowerContact || !expectedReturn) {
      return res.status(400).json({
        success: false,
        error: 'Borrower name, contact, and expected return date are required'
      })
    }

    const lendingData: LendingCreateInput = {
      bookId,
      borrowerName,
      borrowerContact,
      expectedReturn: new Date(expectedReturn)
    }

    const lending = await lendingService.lendBook(lendingData)

    return res.status(201).json({
      success: true,
      data: lending,
      message: 'Book lent successfully'
    })
  }),

  // PUT /api/books/:id/return - Return a lent book
  returnBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id: bookId } = req.params

    // Find active lending for this book
    const activeLending = await lendingService.getCurrentlyLentBooks()
    const lending = activeLending.find(l => l.bookId === bookId)

    if (!lending) {
      return res.status(404).json({
        success: false,
        error: 'No active lending found for this book'
      })
    }

    const returnedLending = await lendingService.returnBook(lending.id)

    return res.status(200).json({
      success: true,
      data: returnedLending,
      message: 'Book returned successfully'
    })
  }),

  // GET /api/lending/history - Get lending history
  getLendingHistory: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const params: LendingSearchParams = {
      isReturned: req.query.isReturned ? req.query.isReturned === 'true' : undefined,
      overdue: req.query.overdue ? req.query.overdue === 'true' : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: req.query.sortBy as any || 'dateLent',
      sortOrder: req.query.sortOrder as any || 'desc'
    }

    const result = await lendingService.getLendingHistory(params)

    return res.status(200).json({
      success: true,
      data: result.data,
      message: `Found ${result.data.length} lending records`,
      pagination: result.pagination
    })
  }),

  // GET /api/lending/overdue - Get overdue books
  getOverdueBooks: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const overdueBooks = await lendingService.getOverdueBooks()

    return res.status(200).json({
      success: true,
      data: overdueBooks,
      message: `Found ${overdueBooks.length} overdue books`
    })
  }),

  // GET /api/lending/current - Get currently lent books
  getCurrentlyLentBooks: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const currentBooks = await lendingService.getCurrentlyLentBooks()

    return res.status(200).json({
      success: true,
      data: currentBooks,
      message: `Found ${currentBooks.length} currently lent books`
    })
  }),

  // PUT /api/lending/:id - Update lending information
  updateLending: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params
    const updateData: LendingUpdateInput = req.body

    const lending = await lendingService.updateLending(id, updateData)

    return res.status(200).json({
      success: true,
      data: lending,
      message: 'Lending information updated successfully'
    })
  }),

  // GET /api/lending/stats - Get lending statistics
  getLendingStats: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const stats = await lendingService.getLendingStats()

    return res.status(200).json({
      success: true,
      data: stats,
      message: 'Lending statistics retrieved successfully'
    })
  }),

  // PUT /api/lending/:id/extend - Extend lending period
  extendLending: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params
    const { newExpectedReturn } = req.body

    if (!newExpectedReturn) {
      return res.status(400).json({
        success: false,
        error: 'New expected return date is required'
      })
    }

    const lending = await lendingService.extendLending(id, new Date(newExpectedReturn))

    return res.status(200).json({
      success: true,
      data: lending,
      message: 'Lending period extended successfully'
    })
  })
}
