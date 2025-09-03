import { BookCreateInput, BookUpdateInput, BookSearchParams, BookWithLending } from '../types';
export declare class BookService {
    getAllBooks(params?: BookSearchParams): Promise<{
        data: ({
            lendingInfo: {
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
            }[];
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getBookById(id: string): Promise<BookWithLending | null>;
    getBookByIsbn(isbn: string): Promise<{
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
    } | null>;
    createBook(data: BookCreateInput): Promise<{
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
    }>;
    updateBook(id: string, data: BookUpdateInput): Promise<{
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
    }>;
    deleteBook(id: string): Promise<void>;
    searchBooks(searchTerm: string, limit?: number): Promise<({
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
    })[]>;
    getBooksByStatus(status: string): Promise<({
        lendingInfo: {
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
        }[];
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
    })[]>;
    getBooksByCategory(categoryId: string): Promise<({
        lendingInfo: {
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
        }[];
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
    })[]>;
    getBookStats(): Promise<{
        totalBooks: number;
        ownedBooks: number;
        lentBooks: number;
        wishlistBooks: number;
        categoriesWithCounts: ({
            _count: {
                books: number;
            };
        } & {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
}
//# sourceMappingURL=BookService.d.ts.map