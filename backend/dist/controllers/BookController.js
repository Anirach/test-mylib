"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const BookService_1 = require("../services/BookService");
const errorHandler_1 = require("../middleware/errorHandler");
const bookService = new BookService_1.BookService();
exports.BookController = {
    getAllBooks: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const params = {
            query: req.query.query,
            status: req.query.status,
            genre: req.query.genre,
            categoryId: req.query.categoryId,
            author: req.query.author,
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
            sortBy: req.query.sortBy || 'dateAdded',
            sortOrder: req.query.sortOrder || 'desc'
        };
        const result = await bookService.getAllBooks(params);
        res.status(200).json({
            success: true,
            data: result.data,
            message: `Found ${result.data.length} books`,
            pagination: result.pagination
        });
    }),
    getBookById: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const book = await bookService.getBookById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: book,
            message: 'Book retrieved successfully'
        });
    }),
    createBook: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const bookData = req.body;
        if (!bookData.title || !bookData.author) {
            return res.status(400).json({
                success: false,
                error: 'Title and author are required'
            });
        }
        const book = await bookService.createBook(bookData);
        return res.status(201).json({
            success: true,
            data: book,
            message: 'Book created successfully'
        });
    }),
    updateBook: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;
        const book = await bookService.updateBook(id, updateData);
        return res.status(200).json({
            success: true,
            data: book,
            message: 'Book updated successfully'
        });
    }),
    deleteBook: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await bookService.deleteBook(id);
        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    }),
    searchBooks: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { q: searchTerm, limit } = req.query;
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                error: 'Search term is required'
            });
        }
        const books = await bookService.searchBooks(searchTerm, limit ? parseInt(limit) : 10);
        return res.status(200).json({
            success: true,
            data: books,
            message: `Found ${books.length} books matching "${searchTerm}"`
        });
    }),
    getBooksByStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.params;
        if (!['OWNED', 'LENT', 'WISHLIST', 'LOST'].includes(status.toUpperCase())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be one of: OWNED, LENT, WISHLIST, LOST'
            });
        }
        const books = await bookService.getBooksByStatus(status.toUpperCase());
        return res.status(200).json({
            success: true,
            data: books,
            message: `Found ${books.length} books with status "${status}"`
        });
    }),
    getBooksByCategory: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { categoryId } = req.params;
        const books = await bookService.getBooksByCategory(categoryId);
        return res.status(200).json({
            success: true,
            data: books,
            message: `Found ${books.length} books in category`
        });
    }),
    getBookStats: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const stats = await bookService.getBookStats();
        return res.status(200).json({
            success: true,
            data: stats,
            message: 'Book statistics retrieved successfully'
        });
    })
};
//# sourceMappingURL=BookController.js.map