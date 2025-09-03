import { Router } from 'express'
import { UploadController } from '../controllers/UploadController'
import { uploadBookCover, uploadBookPdf } from '../middleware/upload'
import { validate } from '../middleware/validation'
import { uploadRateLimit, generalRateLimit } from '../middleware/rateLimit'
import { z } from 'zod'

const router = Router()

// Apply general rate limiting to all routes
router.use(generalRateLimit.middleware)

// Validation schemas for upload routes
const uploadParamsSchema = z.object({
  type: z.enum(['cover', 'pdf'])
})

const deleteFileQuerySchema = z.object({
  type: z.enum(['cover', 'pdf'])
})

const filenameParamSchema = z.object({
  filename: z.string().min(1, 'Filename is required')
})

// POST /api/upload/cover - Upload book cover image
router.post('/cover', uploadRateLimit.middleware, uploadBookCover, UploadController.uploadCover)

// POST /api/upload/pdf - Upload PDF file
router.post('/pdf', uploadRateLimit.middleware, uploadBookPdf, UploadController.uploadPdf)

// DELETE /api/upload/:filename - Delete uploaded file
router.delete(
  '/:filename',
  validate({ 
    params: filenameParamSchema,
    query: deleteFileQuerySchema 
  }),
  UploadController.deleteFile
)

// GET /api/upload/info/:filename - Get file information
router.get(
  '/info/:filename',
  validate({ 
    params: filenameParamSchema,
    query: deleteFileQuerySchema 
  }),
  UploadController.getFileInfo
)

// GET /api/upload/list/:type - List uploaded files by type
router.get(
  '/list/:type',
  validate({ params: uploadParamsSchema }),
  UploadController.listFiles
)

export default router
