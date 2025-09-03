"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const upload_1 = require("../middleware/upload");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.UploadController = {
    uploadCover: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No cover image file provided'
            });
        }
        const fileInfo = (0, upload_1.getFileInfo)(req.file);
        return res.status(201).json({
            success: true,
            data: {
                type: 'cover',
                file: fileInfo
            },
            message: 'Cover image uploaded successfully'
        });
    }),
    uploadPdf: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No PDF file provided'
            });
        }
        const fileInfo = (0, upload_1.getFileInfo)(req.file);
        return res.status(201).json({
            success: true,
            data: {
                type: 'pdf',
                file: fileInfo
            },
            message: 'PDF file uploaded successfully'
        });
    }),
    deleteFile: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { filename } = req.params;
        const { type } = req.query;
        if (!filename) {
            return res.status(400).json({
                success: false,
                error: 'Filename is required'
            });
        }
        if (!type || (type !== 'cover' && type !== 'pdf')) {
            return res.status(400).json({
                success: false,
                error: 'File type must be specified as "cover" or "pdf"'
            });
        }
        try {
            const uploadDir = path_1.default.join(__dirname, '../../uploads');
            const fileDir = type === 'cover' ? 'covers' : 'pdfs';
            const filePath = path_1.default.join(uploadDir, fileDir, filename);
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
            }
            await (0, upload_1.deleteFile)(filePath);
            return res.status(200).json({
                success: true,
                message: `${type === 'cover' ? 'Cover image' : 'PDF file'} deleted successfully`
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to delete file'
            });
        }
    }),
    getFileInfo: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { filename } = req.params;
        const { type } = req.query;
        if (!filename) {
            return res.status(400).json({
                success: false,
                error: 'Filename is required'
            });
        }
        if (!type || (type !== 'cover' && type !== 'pdf')) {
            return res.status(400).json({
                success: false,
                error: 'File type must be specified as "cover" or "pdf"'
            });
        }
        try {
            const uploadDir = path_1.default.join(__dirname, '../../uploads');
            const fileDir = type === 'cover' ? 'covers' : 'pdfs';
            const filePath = path_1.default.join(uploadDir, fileDir, filename);
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
            }
            const stats = fs_1.default.statSync(filePath);
            const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
            return res.status(200).json({
                success: true,
                data: {
                    filename: filename,
                    size: stats.size,
                    type: type,
                    url: `${baseUrl}/uploads/${fileDir}/${filename}`,
                    uploadedAt: stats.birthtime,
                    lastModified: stats.mtime
                },
                message: 'File information retrieved successfully'
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to get file information'
            });
        }
    }),
    listFiles: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { type } = req.params;
        if (type !== 'cover' && type !== 'pdf') {
            return res.status(400).json({
                success: false,
                error: 'File type must be "cover" or "pdf"'
            });
        }
        try {
            const uploadDir = path_1.default.join(__dirname, '../../uploads');
            const fileDir = type === 'cover' ? 'covers' : 'pdfs';
            const dirPath = path_1.default.join(uploadDir, fileDir);
            if (!fs_1.default.existsSync(dirPath)) {
                return res.status(200).json({
                    success: true,
                    data: {
                        files: [],
                        count: 0
                    },
                    message: 'No files found'
                });
            }
            const files = fs_1.default.readdirSync(dirPath);
            const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
            const fileList = files.map(filename => {
                const filePath = path_1.default.join(dirPath, filename);
                const stats = fs_1.default.statSync(filePath);
                return {
                    filename: filename,
                    size: stats.size,
                    url: `${baseUrl}/uploads/${fileDir}/${filename}`,
                    uploadedAt: stats.birthtime,
                    lastModified: stats.mtime
                };
            });
            return res.status(200).json({
                success: true,
                data: {
                    files: fileList,
                    count: fileList.length,
                    type: type
                },
                message: `Found ${fileList.length} ${type} files`
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to list files'
            });
        }
    })
};
//# sourceMappingURL=UploadController.js.map