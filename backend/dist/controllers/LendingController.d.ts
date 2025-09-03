import { Request, Response } from 'express';
export declare const LendingController: {
    lendBook: (req: Request, res: Response, next: import("express").NextFunction) => void;
    returnBook: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getLendingHistory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getOverdueBooks: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCurrentlyLentBooks: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateLending: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getLendingStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    extendLending: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=LendingController.d.ts.map