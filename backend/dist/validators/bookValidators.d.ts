import { z } from 'zod';
export declare const BookStatus: z.ZodEnum<{
    OWNED: "OWNED";
    LENT: "LENT";
    WISHLIST: "WISHLIST";
    LOST: "LOST";
}>;
export declare const createBookSchema: z.ZodObject<{
    title: z.ZodString;
    author: z.ZodString;
    isbn: z.ZodOptional<z.ZodString>;
    genre: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    coverImageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    pdfFileUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    status: z.ZodDefault<z.ZodEnum<{
        OWNED: "OWNED";
        LENT: "LENT";
        WISHLIST: "WISHLIST";
        LOST: "LOST";
    }>>;
    categoryId: z.ZodOptional<z.ZodString>;
    dateAdded: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date, string | undefined>>;
}, z.core.$strip>;
export declare const updateBookSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    isbn: z.ZodOptional<z.ZodString>;
    genre: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    coverImageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    pdfFileUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    status: z.ZodOptional<z.ZodEnum<{
        OWNED: "OWNED";
        LENT: "LENT";
        WISHLIST: "WISHLIST";
        LOST: "LOST";
    }>>;
    categoryId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const getBooksQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        title: "title";
        author: "author";
        dateAdded: "dateAdded";
        createdAt: "createdAt";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    status: z.ZodOptional<z.ZodEnum<{
        OWNED: "OWNED";
        LENT: "LENT";
        WISHLIST: "WISHLIST";
        LOST: "LOST";
    }>>;
    genre: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const searchBooksQuerySchema: z.ZodObject<{
    q: z.ZodString;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
}, z.core.$strip>;
export declare const bookIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const statusParamSchema: z.ZodObject<{
    status: z.ZodEnum<{
        OWNED: "OWNED";
        LENT: "LENT";
        WISHLIST: "WISHLIST";
        LOST: "LOST";
    }>;
}, z.core.$strip>;
export declare const categoryIdParamSchema: z.ZodObject<{
    categoryId: z.ZodString;
}, z.core.$strip>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type GetBooksQuery = z.infer<typeof getBooksQuerySchema>;
export type SearchBooksQuery = z.infer<typeof searchBooksQuerySchema>;
export type BookIdParam = z.infer<typeof bookIdParamSchema>;
export type StatusParam = z.infer<typeof statusParamSchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;
//# sourceMappingURL=bookValidators.d.ts.map