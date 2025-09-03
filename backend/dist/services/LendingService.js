"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LendingService = void 0;
const database_1 = __importDefault(require("../utils/database"));
class LendingService {
    async lendBook(data) {
        const book = await database_1.default.book.findUnique({
            where: { id: data.bookId },
            include: {
                lendingInfo: {
                    where: { isReturned: false }
                }
            }
        });
        if (!book) {
            throw new Error('Book not found');
        }
        if (book.status !== 'OWNED') {
            throw new Error('Book is not available for lending');
        }
        if (book.lendingInfo.length > 0) {
            throw new Error('Book is already lent out');
        }
        const lendingInfo = await database_1.default.lendingInfo.create({
            data: {
                ...data,
                dateLent: new Date()
            }
        });
        await database_1.default.book.update({
            where: { id: data.bookId },
            data: { status: 'LENT' }
        });
        return lendingInfo;
    }
    async returnBook(lendingId) {
        const lendingInfo = await database_1.default.lendingInfo.findUnique({
            where: { id: lendingId },
            include: { book: true }
        });
        if (!lendingInfo) {
            throw new Error('Lending record not found');
        }
        if (lendingInfo.isReturned) {
            throw new Error('Book has already been returned');
        }
        const updatedLending = await database_1.default.lendingInfo.update({
            where: { id: lendingId },
            data: {
                isReturned: true,
                actualReturn: new Date()
            }
        });
        await database_1.default.book.update({
            where: { id: lendingInfo.bookId },
            data: { status: 'OWNED' }
        });
        return updatedLending;
    }
    async getLendingHistory(params = {}) {
        const { isReturned, overdue, page = 1, limit = 10, sortBy = 'dateLent', sortOrder = 'desc' } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (isReturned !== undefined) {
            where.isReturned = isReturned;
        }
        if (overdue === true) {
            where.AND = [
                { isReturned: false },
                { expectedReturn: { lt: new Date() } }
            ];
        }
        const total = await database_1.default.lendingInfo.count({ where });
        const lendingHistory = await database_1.default.lendingInfo.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                book: {
                    include: {
                        category: true
                    }
                }
            }
        });
        return {
            data: lendingHistory,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getOverdueBooks() {
        return await database_1.default.lendingInfo.findMany({
            where: {
                isReturned: false,
                expectedReturn: {
                    lt: new Date()
                }
            },
            include: {
                book: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                expectedReturn: 'asc'
            }
        });
    }
    async getCurrentlyLentBooks() {
        return await database_1.default.lendingInfo.findMany({
            where: {
                isReturned: false
            },
            include: {
                book: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                dateLent: 'desc'
            }
        });
    }
    async updateLending(id, data) {
        const existingLending = await database_1.default.lendingInfo.findUnique({
            where: { id }
        });
        if (!existingLending) {
            throw new Error('Lending record not found');
        }
        return await database_1.default.lendingInfo.update({
            where: { id },
            data
        });
    }
    async getLendingStats() {
        const totalLendings = await database_1.default.lendingInfo.count();
        const activeLendings = await database_1.default.lendingInfo.count({
            where: { isReturned: false }
        });
        const overdueBooks = await database_1.default.lendingInfo.count({
            where: {
                isReturned: false,
                expectedReturn: { lt: new Date() }
            }
        });
        const returnedBooks = await database_1.default.lendingInfo.count({
            where: { isReturned: true }
        });
        const returnedLendings = await database_1.default.lendingInfo.findMany({
            where: {
                isReturned: true,
                actualReturn: { not: null }
            },
            select: {
                dateLent: true,
                actualReturn: true
            }
        });
        let averageLendingDays = 0;
        if (returnedLendings.length > 0) {
            const totalDays = returnedLendings.reduce((sum, lending) => {
                if (lending.actualReturn) {
                    const days = Math.ceil((lending.actualReturn.getTime() - lending.dateLent.getTime()) / (1000 * 60 * 60 * 24));
                    return sum + days;
                }
                return sum;
            }, 0);
            averageLendingDays = Math.round(totalDays / returnedLendings.length);
        }
        return {
            totalLendings,
            activeLendings,
            overdueBooks,
            returnedBooks,
            averageLendingDays
        };
    }
    async extendLending(lendingId, newExpectedReturn) {
        const lending = await database_1.default.lendingInfo.findUnique({
            where: { id: lendingId }
        });
        if (!lending) {
            throw new Error('Lending record not found');
        }
        if (lending.isReturned) {
            throw new Error('Cannot extend lending for a returned book');
        }
        if (newExpectedReturn <= new Date()) {
            throw new Error('New expected return date must be in the future');
        }
        return await database_1.default.lendingInfo.update({
            where: { id: lendingId },
            data: { expectedReturn: newExpectedReturn }
        });
    }
}
exports.LendingService = LendingService;
//# sourceMappingURL=LendingService.js.map