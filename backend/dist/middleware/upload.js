"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileInfo = exports.getFileUrl = exports.deleteFile = exports.validatePdfFile = exports.validateImageFile = exports.uploadMultipleFiles = exports.uploadFile = exports.uploadBookPdf = exports.uploadBookCover = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.join(__dirname, '../../uploads');
const coverImagesDir = path_1.default.join(uploadDir, 'covers');
const pdfFilesDir = path_1.default.join(uploadDir, 'pdfs');
const directories = [uploadDir, coverImagesDir, pdfFilesDir];
directories.forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
const fileFilter = (req, file, cb) => {
    const uploadType = req.params.type || req.body.type;
    if (uploadType === 'cover') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed for book covers'));
        }
    }
    else if (uploadType === 'pdf') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
    else {
        cb(new Error('Invalid upload type specified'));
    }
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadType = req.params.type || req.body.type;
        if (uploadType === 'cover') {
            cb(null, coverImagesDir);
        }
        else if (uploadType === 'pdf') {
            cb(null, pdfFilesDir);
        }
        else {
            cb(new Error('Invalid upload type'), '');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const extension = path_1.default.extname(originalName);
        const baseName = path_1.default.basename(originalName, extension);
        cb(null, `${baseName}-${uniqueSuffix}${extension}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024,
        files: 1
    }
});
exports.uploadBookCover = upload.single('coverImage');
exports.uploadBookPdf = upload.single('pdfFile');
exports.uploadFile = upload.single('file');
exports.uploadMultipleFiles = upload.array('files', 5);
const validateImageFile = (file) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;
    return allowedMimeTypes.includes(file.mimetype) && file.size <= maxSize;
};
exports.validateImageFile = validateImageFile;
const validatePdfFile = (file) => {
    const maxSize = 50 * 1024 * 1024;
    return file.mimetype === 'application/pdf' && file.size <= maxSize;
};
exports.validatePdfFile = validatePdfFile;
const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    resolve();
                }
                else {
                    reject(err);
                }
            }
            else {
                resolve();
            }
        });
    });
};
exports.deleteFile = deleteFile;
const getFileUrl = (filename, type) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/uploads/${type === 'cover' ? 'covers' : 'pdfs'}/${filename}`;
};
exports.getFileUrl = getFileUrl;
const getFileInfo = (file) => {
    return {
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path,
        url: (0, exports.getFileUrl)(file.filename, file.mimetype.startsWith('image/') ? 'cover' : 'pdf')
    };
};
exports.getFileInfo = getFileInfo;
//# sourceMappingURL=upload.js.map