import { z } from 'zod';
export declare const createLendingSchema: z.ZodObject<{
    bookId: z.ZodString;
    borrowerName: z.ZodString;
    borrowerContact: z.ZodString;
    expectedReturn: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateLendingSchema: z.ZodObject<{
    borrowerName: z.ZodOptional<z.ZodString>;
    borrowerContact: z.ZodOptional<z.ZodString>;
    expectedReturn: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const extendLendingSchema: z.ZodObject<{
    newExpectedReturn: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
}, z.core.$strip>;
export declare const getLendingHistoryQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        borrowerName: "borrowerName";
        dateLent: "dateLent";
        expectedReturn: "expectedReturn";
        actualReturn: "actualReturn";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    isReturned: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<boolean | undefined, string | undefined>>;
    overdue: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<boolean | undefined, string | undefined>>;
    borrowerName: z.ZodOptional<z.ZodString>;
    startDate: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date | undefined, string | undefined>>;
    endDate: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date | undefined, string | undefined>>;
}, z.core.$strip>;
export declare const lendingIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const bookIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const returnBookSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodString>;
    actualReturn: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date, string | undefined>>;
}, z.core.$strip>;
export type CreateLendingInput = z.infer<typeof createLendingSchema>;
export type UpdateLendingInput = z.infer<typeof updateLendingSchema>;
export type ExtendLendingInput = z.infer<typeof extendLendingSchema>;
export type GetLendingHistoryQuery = z.infer<typeof getLendingHistoryQuerySchema>;
export type LendingIdParam = z.infer<typeof lendingIdParamSchema>;
export type BookIdParam = z.infer<typeof bookIdParamSchema>;
export type ReturnBookInput = z.infer<typeof returnBookSchema>;
//# sourceMappingURL=lendingValidators.d.ts.map