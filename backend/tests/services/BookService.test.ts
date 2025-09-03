/// <reference types="jest" />

import { BookService } from '../../src/services/BookService'
import prisma from '../../src/utils/database'
import { BookCreateInput, BookUpdateInput, BookStatus } from '../../src/types'

// Mock Prisma
jest.mock('../../src/utils/database', () => ({
  __esModule: true,
  default: {
    book: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    lendingInfo: {
      findMany: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('BookService', () => {
  let bookService: BookService

  beforeEach(() => {
    bookService = new BookService()
    jest.clearAllMocks()
  })

  describe('createBook', () => {
    it('should create a new book successfully', async () => {
      const bookData: BookCreateInput = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        genre: 'Fiction',
        description: 'A test book',
        status: BookStatus.OWNED,
      }

      const expectedBook = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...bookData,
        coverImageUrl: null,
        pdfFileUrl: null,
        categoryId: null,
        dateAdded: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.book.create.mockResolvedValue(expectedBook)

      const result = await bookService.createBook(bookData)

      expect(mockPrisma.book.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn,
          genre: bookData.genre,
          description: bookData.description,
          status: bookData.status,
        }),
      })
      expect(result).toEqual(expectedBook)
    })

    it('should create a book with minimal required data', async () => {
      const bookData: BookCreateInput = {
        title: 'Minimal Book',
        author: 'Author Name',
      }

      const expectedBook = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Minimal Book',
        author: 'Author Name',
        isbn: null,
        genre: null,
        description: null,
        coverImageUrl: null,
        pdfFileUrl: null,
        status: BookStatus.OWNED,
        categoryId: null,
        dateAdded: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.book.create.mockResolvedValue(expectedBook)

      const result = await bookService.createBook(bookData)

      expect(mockPrisma.book.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: bookData.title,
          author: bookData.author,
          status: BookStatus.OWNED,
        }),
      })
      expect(result).toEqual(expectedBook)
    })
  })

  describe('getAllBooks', () => {
    it('should return paginated books with default parameters', async () => {
      const mockBooks = [
        {
          id: '1',
          title: 'Book 1',
          author: 'Author 1',
          status: BookStatus.OWNED,
          createdAt: new Date(),
        },
        {
          id: '2',
          title: 'Book 2',
          author: 'Author 2',
          status: BookStatus.LENT,
          createdAt: new Date(),
        },
      ]

      mockPrisma.book.findMany.mockResolvedValue(mockBooks)
      mockPrisma.book.count.mockResolvedValue(2)

      const result = await bookService.getAllBooks()

      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          lendingInfo: {
            where: { actualReturn: null },
            orderBy: { dateLent: 'desc' },
            take: 1,
          },
        },
      })

      expect(result).toEqual({
        data: mockBooks,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      })
    })

    it('should apply filters correctly', async () => {
      const params = {
        status: BookStatus.LENT,
        genre: 'Fiction',
        search: 'test',
        page: 2,
        limit: 5,
      }

      mockPrisma.book.findMany.mockResolvedValue([])
      mockPrisma.book.count.mockResolvedValue(0)

      await bookService.getAllBooks(params)

      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        where: {
          status: BookStatus.LENT,
          genre: 'Fiction',
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { author: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          lendingInfo: {
            where: { actualReturn: null },
            orderBy: { dateLent: 'desc' },
            take: 1,
          },
        },
      })
    })
  })

  describe('getBookById', () => {
    it('should return a book when found', async () => {
      const bookId = '123e4567-e89b-12d3-a456-426614174000'
      const mockBook = {
        id: bookId,
        title: 'Test Book',
        author: 'Test Author',
        status: BookStatus.OWNED,
      }

      mockPrisma.book.findUnique.mockResolvedValue(mockBook)

      const result = await bookService.getBookById(bookId)

      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: bookId },
        include: {
          category: true,
          lendingInfo: {
            orderBy: { dateLent: 'desc' },
          },
        },
      })
      expect(result).toEqual(mockBook)
    })

    it('should return null when book not found', async () => {
      const bookId = 'non-existent-id'

      mockPrisma.book.findUnique.mockResolvedValue(null)

      const result = await bookService.getBookById(bookId)

      expect(result).toBeNull()
    })
  })

  describe('updateBook', () => {
    it('should update a book successfully', async () => {
      const bookId = '123e4567-e89b-12d3-a456-426614174000'
      const updateData: BookUpdateInput = {
        title: 'Updated Title',
        genre: 'Updated Genre',
      }

      const updatedBook = {
        id: bookId,
        title: 'Updated Title',
        author: 'Original Author',
        genre: 'Updated Genre',
        status: BookStatus.OWNED,
        updatedAt: new Date(),
      }

      mockPrisma.book.update.mockResolvedValue(updatedBook)

      const result = await bookService.updateBook(bookId, updateData)

      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: bookId },
        data: updateData,
        include: {
          category: true,
          lendingInfo: {
            orderBy: { dateLent: 'desc' },
          },
        },
      })
      expect(result).toEqual(updatedBook)
    })
  })

  describe('deleteBook', () => {
    it('should delete a book successfully', async () => {
      const bookId = '123e4567-e89b-12d3-a456-426614174000'

      const deletedBook = {
        id: bookId,
        title: 'Deleted Book',
        author: 'Author',
      }

      mockPrisma.book.delete.mockResolvedValue(deletedBook)

      const result = await bookService.deleteBook(bookId)

      expect(mockPrisma.book.delete).toHaveBeenCalledWith({
        where: { id: bookId },
      })
      expect(result).toEqual(deletedBook)
    })
  })

  describe('searchBooks', () => {
    it('should search books by query', async () => {
      const query = 'test query'
      const limit = 5

      const mockBooks = [
        { id: '1', title: 'Test Book', author: 'Author' },
        { id: '2', title: 'Another Book', author: 'Test Author' },
      ]

      mockPrisma.book.findMany.mockResolvedValue(mockBooks)

      const result = await bookService.searchBooks(query, limit)

      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          lendingInfo: {
            where: { actualReturn: null },
            orderBy: { dateLent: 'desc' },
            take: 1,
          },
        },
      })
      expect(result).toEqual(mockBooks)
    })
  })

  describe('getBooksByStatus', () => {
    it('should return books filtered by status', async () => {
      const status = BookStatus.LENT
      const mockBooks = [
        { id: '1', title: 'Lent Book 1', status: BookStatus.LENT },
        { id: '2', title: 'Lent Book 2', status: BookStatus.LENT },
      ]

      mockPrisma.book.findMany.mockResolvedValue(mockBooks)

      const result = await bookService.getBooksByStatus(status)

      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        where: { status },
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          lendingInfo: {
            where: { actualReturn: null },
            orderBy: { dateLent: 'desc' },
            take: 1,
          },
        },
      })
      expect(result).toEqual(mockBooks)
    })
  })
})
