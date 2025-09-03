import multer from 'multer'
import path from 'path'
import { Request } from 'express'
import fs from 'fs'

// Ensure upload directories exist
const uploadDir: string = path.join(__dirname, '../../uploads')
const coverImagesDir: string = path.join(uploadDir, 'covers')
const pdfFilesDir: string = path.join(uploadDir, 'pdfs')

// Create directories if they don't exist
const directories = [uploadDir, coverImagesDir, pdfFilesDir]
directories.forEach((dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Get the upload type from the route
  const uploadType = req.params.type || req.body.type

  if (uploadType === 'cover') {
    // Allow only image files for cover uploads
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed for book covers'))
    }
  } else if (uploadType === 'pdf') {
    // Allow only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  } else {
    cb(new Error('Invalid upload type specified'))
  }
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadType = req.params.type || req.body.type
    
    if (uploadType === 'cover') {
      cb(null, coverImagesDir)
    } else if (uploadType === 'pdf') {
      cb(null, pdfFilesDir)
    } else {
      cb(new Error('Invalid upload type'), '')
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_') // Sanitize filename
    const extension = path.extname(originalName)
    const baseName = path.basename(originalName, extension)
    
    cb(null, `${baseName}-${uniqueSuffix}${extension}`)
  }
})

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1 // Only allow single file upload
  }
})

// Middleware functions for different upload types
export const uploadBookCover = upload.single('coverImage')
export const uploadBookPdf = upload.single('pdfFile')

// Generic upload middleware
export const uploadFile = upload.single('file')

// Multiple files upload (if needed in the future)
export const uploadMultipleFiles = upload.array('files', 5)

// File validation helpers
export const validateImageFile = (file: Express.Multer.File): boolean => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB for images
  
  return allowedMimeTypes.includes(file.mimetype) && file.size <= maxSize
}

export const validatePdfFile = (file: Express.Multer.File): boolean => {
  const maxSize = 50 * 1024 * 1024 // 50MB for PDFs
  
  return file.mimetype === 'application/pdf' && file.size <= maxSize
}

// File cleanup helper
export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        // Don't reject if file doesn't exist
        if (err.code === 'ENOENT') {
          resolve()
        } else {
          reject(err)
        }
      } else {
        resolve()
      }
    })
  })
}

// Get file URL helper
export const getFileUrl = (filename: string, type: 'cover' | 'pdf'): string => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001'
  return `${baseUrl}/uploads/${type === 'cover' ? 'covers' : 'pdfs'}/${filename}`
}

// File info helper
export const getFileInfo = (file: Express.Multer.File) => {
  return {
    originalName: file.originalname,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    path: file.path,
    url: getFileUrl(file.filename, file.mimetype.startsWith('image/') ? 'cover' : 'pdf')
  }
}
