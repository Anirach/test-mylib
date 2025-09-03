import { Request, Response } from 'express'
import { ApiResponse } from '../types'
import { asyncHandler } from '../middleware/errorHandler'
import { deleteFile, getFileInfo } from '../middleware/upload'
import path from 'path'
import fs from 'fs'

export const UploadController = {
  // POST /api/upload/cover - Upload book cover image
  uploadCover: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No cover image file provided'
      })
    }

    const fileInfo = getFileInfo(req.file)

    return res.status(201).json({
      success: true,
      data: {
        type: 'cover',
        file: fileInfo
      },
      message: 'Cover image uploaded successfully'
    })
  }),

  // POST /api/upload/pdf - Upload PDF file
  uploadPdf: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file provided'
      })
    }

    const fileInfo = getFileInfo(req.file)

    return res.status(201).json({
      success: true,
      data: {
        type: 'pdf',
        file: fileInfo
      },
      message: 'PDF file uploaded successfully'
    })
  }),

  // DELETE /api/upload/:filename - Delete uploaded file
  deleteFile: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { filename } = req.params
    const { type } = req.query

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Filename is required'
      })
    }

    if (!type || (type !== 'cover' && type !== 'pdf')) {
      return res.status(400).json({
        success: false,
        error: 'File type must be specified as "cover" or "pdf"'
      })
    }

    try {
      const uploadDir = path.join(__dirname, '../../uploads')
      const fileDir = type === 'cover' ? 'covers' : 'pdfs'
      const filePath = path.join(uploadDir, fileDir, filename)

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        })
      }

      // Delete the file
      await deleteFile(filePath)

      return res.status(200).json({
        success: true,
        message: `${type === 'cover' ? 'Cover image' : 'PDF file'} deleted successfully`
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete file'
      })
    }
  }),

  // GET /api/upload/info/:filename - Get file information
  getFileInfo: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { filename } = req.params
    const { type } = req.query

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Filename is required'
      })
    }

    if (!type || (type !== 'cover' && type !== 'pdf')) {
      return res.status(400).json({
        success: false,
        error: 'File type must be specified as "cover" or "pdf"'
      })
    }

    try {
      const uploadDir = path.join(__dirname, '../../uploads')
      const fileDir = type === 'cover' ? 'covers' : 'pdfs'
      const filePath = path.join(uploadDir, fileDir, filename)

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        })
      }

      // Get file stats
      const stats = fs.statSync(filePath)
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001'
      
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
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to get file information'
      })
    }
  }),

  // GET /api/upload/list/:type - List uploaded files
  listFiles: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { type } = req.params

    if (type !== 'cover' && type !== 'pdf') {
      return res.status(400).json({
        success: false,
        error: 'File type must be "cover" or "pdf"'
      })
    }

    try {
      const uploadDir = path.join(__dirname, '../../uploads')
      const fileDir = type === 'cover' ? 'covers' : 'pdfs'
      const dirPath = path.join(uploadDir, fileDir)

      // Check if directory exists
      if (!fs.existsSync(dirPath)) {
        return res.status(200).json({
          success: true,
          data: {
            files: [],
            count: 0
          },
          message: 'No files found'
        })
      }

      const files = fs.readdirSync(dirPath)
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001'

      const fileList = files.map(filename => {
        const filePath = path.join(dirPath, filename)
        const stats = fs.statSync(filePath)
        
        return {
          filename: filename,
          size: stats.size,
          url: `${baseUrl}/uploads/${fileDir}/${filename}`,
          uploadedAt: stats.birthtime,
          lastModified: stats.mtime
        }
      })

      return res.status(200).json({
        success: true,
        data: {
          files: fileList,
          count: fileList.length,
          type: type
        },
        message: `Found ${fileList.length} ${type} files`
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to list files'
      })
    }
  })
}
