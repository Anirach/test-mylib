"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LendingController = void 0;
const LendingService_1 = require("../services/LendingService");
const errorHandler_1 = require("../middleware/errorHandler");
const lendingService = new LendingService_1.LendingService();
exports.LendingController = {
    lendBook: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id: bookId } = req.params;
        const { borrowerName, borrowerContact, expectedReturn } = req.body;
        if (!borrowerName || !borrowerContact || !expectedReturn) {
            return res.status(400).json({
                success: false,
                error: 'Borrower name, contact, and expected return date are required'
            });
        }
        const lendingData = {
            bookId,
            borrowerName,
            borrowerContact,
            expectedReturn: new Date(expectedReturn)
        };
        const lending = await lendingService.lendBook(lendingData);
        return res.status(201).json({
            success: true,
            data: lending,
            message: 'Book lent successfully'
        });
    }),
    returnBook: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id: bookId } = req.params;
        const activeLending = await lendingService.getCurrentlyLentBooks();
        const lending = activeLending.find(l => l.bookId === bookId);
        if (!lending) {
            return res.status(404).json({
                success: false,
                error: 'No active lending found for this book'
            });
        }
        const returnedLending = await lendingService.returnBook(lending.id);
        return res.status(200).json({
            success: true,
            data: returnedLending,
            message: 'Book returned successfully'
        });
    }),
    getLendingHistory: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const params = {
            isReturned: req.query.isReturned ? req.query.isReturned === 'true' : undefined,
            overdue: req.query.overdue ? req.query.overdue === 'true' : undefined,
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
            sortBy: req.query.sortBy || 'dateLent',
            sortOrder: req.query.sortOrder || 'desc'
        };
        const result = await lendingService.getLendingHistory(params);
        return res.status(200).json({
            success: true,
            data: result.data,
            message: `Found ${result.data.length} lending records`,
            pagination: result.pagination
        });
    }),
    getOverdueBooks: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const overdueBooks = await lendingService.getOverdueBooks();
        return res.status(200).json({
            success: true,
            data: overdueBooks,
            message: `Found ${overdueBooks.length} overdue books`
        });
    }),
    getCurrentlyLentBooks: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const currentBooks = await lendingService.getCurrentlyLentBooks();
        return res.status(200).json({
            success: true,
            data: currentBooks,
            message: `Found ${currentBooks.length} currently lent books`
        });
    }),
    updateLending: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;
        const lending = await lendingService.updateLending(id, updateData);
        return res.status(200).json({
            success: true,
            data: lending,
            message: 'Lending information updated successfully'
        });
    }),
    getLendingStats: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const stats = await lendingService.getLendingStats();
        return res.status(200).json({
            success: true,
            data: stats,
            message: 'Lending statistics retrieved successfully'
        });
    }),
    extendLending: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { newExpectedReturn } = req.body;
        if (!newExpectedReturn) {
            return res.status(400).json({
                success: false,
                error: 'New expected return date is required'
            });
        }
        const lending = await lendingService.extendLending(id, new Date(newExpectedReturn));
        return res.status(200).json({
            success: true,
            data: lending,
            message: 'Lending period extended successfully'
        });
    })
};
//# sourceMappingURL=LendingController.js.map