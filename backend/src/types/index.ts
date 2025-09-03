import { Book, LendingInfo, Category, User, BookStatus, UserRole } from '@prisma/client'

// Re-export Prisma types
export { Book, LendingInfo, Category, User, BookStatus, UserRole }

// Extended types for API responses
export interface BookWithLending extends Book {
  lendingInfo: LendingInfo[]
  category: Category | null
}

export interface BookCreateInput {
  title: string
  author: string
  isbn?: string
  genre?: string
  description?: string
  coverImageUrl?: string
  pdfFileUrl?: string
  status?: BookStatus
  categoryId?: string
}

export interface BookUpdateInput {
  title?: string
  author?: string
  isbn?: string
  genre?: string
  description?: string
  coverImageUrl?: string
  pdfFileUrl?: string
  status?: BookStatus
  categoryId?: string
}

export interface LendingCreateInput {
  bookId: string
  borrowerName: string
  borrowerContact: string
  expectedReturn: Date
}

export interface LendingUpdateInput {
  borrowerName?: string
  borrowerContact?: string
  expectedReturn?: Date
  actualReturn?: Date
  isReturned?: boolean
}

export interface CategoryCreateInput {
  name: string
  description?: string
}

export interface CategoryUpdateInput {
  name?: string
  description?: string
}

export interface UserCreateInput {
  email: string
  name?: string
  password: string
  role?: UserRole
}

export interface UserUpdateInput {
  email?: string
  name?: string
  password?: string
  role?: UserRole
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Search and filter types
export interface BookSearchParams {
  query?: string
  status?: BookStatus
  genre?: string
  categoryId?: string
  author?: string
  page?: number
  limit?: number
  sortBy?: 'title' | 'author' | 'dateAdded' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface LendingSearchParams {
  isReturned?: boolean
  overdue?: boolean
  page?: number
  limit?: number
  sortBy?: 'dateLent' | 'expectedReturn' | 'actualReturn'
  sortOrder?: 'asc' | 'desc'
}

// File upload types
export interface UploadedFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  filename: string
  path: string
  url: string
}
