import prisma from '../utils/database'
import { BookCreateInput, BookUpdateInput, BookSearchParams, BookWithLending } from '../types'

export class BookService {
  // Get all books with optional filtering and pagination
  async getAllBooks(params: BookSearchParams = {}) {
    const {
      query,
      status,
      genre,
      categoryId,
      author,
      page = 1,
      limit = 10,
      sortBy = 'dateAdded',
      sortOrder = 'desc'
    } = params

    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}

    // Build where clause
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { author: { contains: query } },
        { description: { contains: query } }
      ]
    }

    if (status) {
      where.status = status
    }

    if (genre) {
      where.genre = genre
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (author) {
      where.author = { contains: author }
    }

    // Get total count for pagination
    const total = await prisma.book.count({ where })

    // Get books with relations
    const books = await prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
        lendingInfo: {
          where: { isReturned: false },
          orderBy: { dateLent: 'desc' }
        }
      }
    })

    return {
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  // Get a single book by ID
  async getBookById(id: string): Promise<BookWithLending | null> {
    return await prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        lendingInfo: {
          orderBy: { dateLent: 'desc' }
        }
      }
    })
  }

  // Get a book by ISBN
  async getBookByIsbn(isbn: string) {
    return await prisma.book.findUnique({
      where: { isbn }
    })
  }

  // Create a new book
  async createBook(data: BookCreateInput) {
    // Check if ISBN already exists
    if (data.isbn) {
      const existingBook = await this.getBookByIsbn(data.isbn)
      if (existingBook) {
        throw new Error(`Book with ISBN ${data.isbn} already exists`)
      }
    }

    return await prisma.book.create({
      data: {
        ...data,
        status: data.status || 'OWNED'
      }
    })
  }

  // Update a book
  async updateBook(id: string, data: BookUpdateInput) {
    // Check if book exists
    const existingBook = await this.getBookById(id)
    if (!existingBook) {
      throw new Error(`Book with ID ${id} not found`)
    }

    // Check if new ISBN conflicts with another book
    if (data.isbn && data.isbn !== existingBook.isbn) {
      const bookWithIsbn = await this.getBookByIsbn(data.isbn)
      if (bookWithIsbn && bookWithIsbn.id !== id) {
        throw new Error(`Book with ISBN ${data.isbn} already exists`)
      }
    }

    return await prisma.book.update({
      where: { id },
      data
    })
  }

  // Delete a book
  async deleteBook(id: string): Promise<void> {
    // Check if book exists
    const existingBook = await this.getBookById(id)
    if (!existingBook) {
      throw new Error(`Book with ID ${id} not found`)
    }

    // Check if book is currently lent
    const activeLending = await prisma.lendingInfo.findFirst({
      where: {
        bookId: id,
        isReturned: false
      }
    })

    if (activeLending) {
      throw new Error('Cannot delete a book that is currently lent out')
    }

    await prisma.book.delete({
      where: { id }
    })
  }

  // Search books
  async searchBooks(searchTerm: string, limit = 10) {
    return await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { author: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { genre: { contains: searchTerm } }
        ]
      },
      take: limit,
      include: {
        category: true
      }
    })
  }

  // Get books by status
  async getBooksByStatus(status: string) {
    return await prisma.book.findMany({
      where: { status: status as 'OWNED' | 'LENT' | 'WISHLIST' | 'LOST' },
      include: {
        category: true,
        lendingInfo: {
          where: { isReturned: false },
          orderBy: { dateLent: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })
  }

  // Get books by category
  async getBooksByCategory(categoryId: string) {
    return await prisma.book.findMany({
      where: { categoryId },
      include: {
        category: true,
        lendingInfo: {
          where: { isReturned: false }
        }
      },
      orderBy: { title: 'asc' }
    })
  }

  // Get book statistics
  async getBookStats() {
    const totalBooks = await prisma.book.count()
    const ownedBooks = await prisma.book.count({ where: { status: 'OWNED' } })
    const lentBooks = await prisma.book.count({ where: { status: 'LENT' } })
    const wishlistBooks = await prisma.book.count({ where: { status: 'WISHLIST' } })
    
    const categoriesWithCounts = await prisma.category.findMany({
      include: {
        _count: {
          select: { books: true }
        }
      }
    })

    return {
      totalBooks,
      ownedBooks,
      lentBooks,
      wishlistBooks,
      categoriesWithCounts
    }
  }
}
