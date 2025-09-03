import { Request, Response } from 'express';
export declare const BookController: {
    getAllBooks: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getBookById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createBook: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateBook: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteBook: (req: Request, res: Response, next: import("express").NextFunction) => void;
    searchBooks: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getBooksByStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getBooksByCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getBookStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=BookController.d.ts.map