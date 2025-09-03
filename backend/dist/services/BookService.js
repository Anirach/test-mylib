"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const database_1 = __importDefault(require("../utils/database"));
class BookService {
    async getAllBooks(params = {}) {
        const { query, status, genre, categoryId, author, page = 1, limit = 10, sortBy = 'dateAdded', sortOrder = 'desc' } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (query) {
            where.OR = [
                { title: { contains: query } },
                { author: { contains: query } },
                { description: { contains: query } }
            ];
        }
        if (status) {
            where.status = status;
        }
        if (genre) {
            where.genre = genre;
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (author) {
            where.author = { contains: author };
        }
        const total = await database_1.default.book.count({ where });
        const books = await database_1.default.book.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                category: true,
                lendingInfo: {
                    where: { isReturned: false },
                    orderBy: { dateLent: 'desc' }
                }
            }
        });
        return {
            data: books,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getBookById(id) {
        return await database_1.default.book.findUnique({
            where: { id },
            include: {
                category: true,
                lendingInfo: {
                    orderBy: { dateLent: 'desc' }
                }
            }
        });
    }
    async getBookByIsbn(isbn) {
        return await database_1.default.book.findUnique({
            where: { isbn }
        });
    }
    async createBook(data) {
        if (data.isbn) {
            const existingBook = await this.getBookByIsbn(data.isbn);
            if (existingBook) {
                throw new Error(`Book with ISBN ${data.isbn} already exists`);
            }
        }
        return await database_1.default.book.create({
            data: {
                ...data,
                status: data.status || 'OWNED'
            }
        });
    }
    async updateBook(id, data) {
        const existingBook = await this.getBookById(id);
        if (!existingBook) {
            throw new Error(`Book with ID ${id} not found`);
        }
        if (data.isbn && data.isbn !== existingBook.isbn) {
            const bookWithIsbn = await this.getBookByIsbn(data.isbn);
            if (bookWithIsbn && bookWithIsbn.id !== id) {
                throw new Error(`Book with ISBN ${data.isbn} already exists`);
            }
        }
        return await database_1.default.book.update({
            where: { id },
            data
        });
    }
    async deleteBook(id) {
        const existingBook = await this.getBookById(id);
        if (!existingBook) {
            throw new Error(`Book with ID ${id} not found`);
        }
        const activeLending = await database_1.default.lendingInfo.findFirst({
            where: {
                bookId: id,
                isReturned: false
            }
        });
        if (activeLending) {
            throw new Error('Cannot delete a book that is currently lent out');
        }
        await database_1.default.book.delete({
            where: { id }
        });
    }
    async searchBooks(searchTerm, limit = 10) {
        return await database_1.default.book.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm } },
                    { author: { contains: searchTerm } },
                    { description: { contains: searchTerm } },
                    { genre: { contains: searchTerm } }
                ]
            },
            take: limit,
            include: {
                category: true
            }
        });
    }
    async getBooksByStatus(status) {
        return await database_1.default.book.findMany({
            where: { status: status },
            include: {
                category: true,
                lendingInfo: {
                    where: { isReturned: false },
                    orderBy: { dateLent: 'desc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async getBooksByCategory(categoryId) {
        return await database_1.default.book.findMany({
            where: { categoryId },
            include: {
                category: true,
                lendingInfo: {
                    where: { isReturned: false }
                }
            },
            orderBy: { title: 'asc' }
        });
    }
    async getBookStats() {
        const totalBooks = await database_1.default.book.count();
        const ownedBooks = await database_1.default.book.count({ where: { status: 'OWNED' } });
        const lentBooks = await database_1.default.book.count({ where: { status: 'LENT' } });
        const wishlistBooks = await database_1.default.book.count({ where: { status: 'WISHLIST' } });
        const categoriesWithCounts = await database_1.default.category.findMany({
            include: {
                _count: {
                    select: { books: true }
                }
            }
        });
        return {
            totalBooks,
            ownedBooks,
            lentBooks,
            wishlistBooks,
            categoriesWithCounts
        };
    }
}
exports.BookService = BookService;
//# sourceMappingURL=BookService.js.map