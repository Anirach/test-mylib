"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UploadController_1 = require("../controllers/UploadController");
const upload_1 = require("../middleware/upload");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const uploadParamsSchema = zod_1.z.object({
    type: zod_1.z.enum(['cover', 'pdf'])
});
const deleteFileQuerySchema = zod_1.z.object({
    type: zod_1.z.enum(['cover', 'pdf'])
});
const filenameParamSchema = zod_1.z.object({
    filename: zod_1.z.string().min(1, 'Filename is required')
});
router.post('/cover', upload_1.uploadBookCover, UploadController_1.UploadController.uploadCover);
router.post('/pdf', upload_1.uploadBookPdf, UploadController_1.UploadController.uploadPdf);
router.delete('/:filename', (0, validation_1.validate)({
    params: filenameParamSchema,
    query: deleteFileQuerySchema
}), UploadController_1.UploadController.deleteFile);
router.get('/info/:filename', (0, validation_1.validate)({
    params: filenameParamSchema,
    query: deleteFileQuerySchema
}), UploadController_1.UploadController.getFileInfo);
router.get('/list/:type', (0, validation_1.validate)({ params: uploadParamsSchema }), UploadController_1.UploadController.listFiles);
exports.default = router;
//# sourceMappingURL=upload.js.map