import { LendingCreateInput, LendingUpdateInput, LendingSearchParams } from '../types';
export declare class LendingService {
    lendBook(data: LendingCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        borrowerName: string;
        borrowerContact: string;
        dateLent: Date;
        expectedReturn: Date;
        actualReturn: Date | null;
        isReturned: boolean;
    }>;
    returnBook(lendingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        borrowerName: string;
        borrowerContact: string;
        dateLent: Date;
        expectedReturn: Date;
        actualReturn: Date | null;
        isReturned: boolean;
    }>;
    getLendingHistory(params?: LendingSearchParams): Promise<{
        data: ({
            book: {
                category: {
                    name: string;
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
            } & {
                id: string;
                title: string;
                author: string;
                isbn: string | null;
                genre: string | null;
                description: string | null;
                coverImageUrl: string | null;
                pdfFileUrl: string | null;
                status: import(".prisma/client").$Enums.BookStatus;
                dateAdded: Date;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookId: string;
            borrowerName: string;
            borrowerContact: string;
            dateLent: Date;
            expectedReturn: Date;
            actualReturn: Date | null;
            isReturned: boolean;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOverdueBooks(): Promise<({
        book: {
            category: {
                name: string;
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            title: string;
            author: string;
            isbn: string | null;
            genre: string | null;
            description: string | null;
            coverImageUrl: string | null;
            pdfFileUrl: string | null;
            status: import(".prisma/client").$Enums.BookStatus;
            dateAdded: Date;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        borrowerName: string;
        borrowerContact: string;
        dateLent: Date;
        expectedReturn: Date;
        actualReturn: Date | null;
        isReturned: boolean;
    })[]>;
    getCurrentlyLentBooks(): Promise<({
        book: {
            category: {
                name: string;
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            title: string;
            author: string;
            isbn: string | null;
            genre: string | null;
            description: string | null;
            coverImageUrl: string | null;
            pdfFileUrl: string | null;
            status: import(".prisma/client").$Enums.BookStatus;
            dateAdded: Date;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        borrowerName: string;
        borrowerContact: string;
        dateLent: Date;
        expectedReturn: Date;
        actualReturn: Date | null;
        isReturned: boolean;
    })[]>;
    updateLending(id: string, data: LendingUpdateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        borrowerName: string;
        borrowerContact: string;
        dateLent: Date;
        expectedReturn: Date;
        actualReturn: Date | null;
        isReturned: boolean;
    }>;
    getLendingStats(): Promise<{
        totalLendings: number;
        activeLendings: number;
        overdueBooks: number;
        returnedBooks: number;
        averageLendingDays: number;
    }>;
    extendLending(lendingId: string, newExpectedReturn: Date): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        borrowerName: string;
        borrowerContact: string;
        dateLent: Date;
        expectedReturn: Date;
        actualReturn: Date | null;
        isReturned: boolean;
    }>;
}
//# sourceMappingURL=LendingService.d.ts.map