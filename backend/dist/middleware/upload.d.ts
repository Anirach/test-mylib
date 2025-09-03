export declare const uploadBookCover: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadBookPdf: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadFile: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadMultipleFiles: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const validateImageFile: (file: Express.Multer.File) => boolean;
export declare const validatePdfFile: (file: Express.Multer.File) => boolean;
export declare const deleteFile: (filePath: string) => Promise<void>;
export declare const getFileUrl: (filename: string, type: "cover" | "pdf") => string;
export declare const getFileInfo: (file: Express.Multer.File) => {
    originalName: string;
    filename: string;
    size: number;
    mimetype: string;
    path: string;
    url: string;
};
//# sourceMappingURL=upload.d.ts.map