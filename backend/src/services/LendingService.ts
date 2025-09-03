import prisma from '../utils/database'
import { LendingCreateInput, LendingUpdateInput, LendingSearchParams } from '../types'

export class LendingService {
  // Lend a book
  async lendBook(data: LendingCreateInput) {
    // Check if book exists and is available
    const book = await prisma.book.findUnique({
      where: { id: data.bookId },
      include: {
        lendingInfo: {
          where: { isReturned: false }
        }
      }
    })

    if (!book) {
      throw new Error('Book not found')
    }

    if (book.status !== 'OWNED') {
      throw new Error('Book is not available for lending')
    }

    if (book.lendingInfo.length > 0) {
      throw new Error('Book is already lent out')
    }

    // Create lending record
    const lendingInfo = await prisma.lendingInfo.create({
      data: {
        ...data,
        dateLent: new Date()
      }
    })

    // Update book status to LENT
    await prisma.book.update({
      where: { id: data.bookId },
      data: { status: 'LENT' }
    })

    return lendingInfo
  }

  // Return a book
  async returnBook(lendingId: string) {
    // Find the lending record
    const lendingInfo = await prisma.lendingInfo.findUnique({
      where: { id: lendingId },
      include: { book: true }
    })

    if (!lendingInfo) {
      throw new Error('Lending record not found')
    }

    if (lendingInfo.isReturned) {
      throw new Error('Book has already been returned')
    }

    // Update lending record
    const updatedLending = await prisma.lendingInfo.update({
      where: { id: lendingId },
      data: {
        isReturned: true,
        actualReturn: new Date()
      }
    })

    // Update book status back to OWNED
    await prisma.book.update({
      where: { id: lendingInfo.bookId },
      data: { status: 'OWNED' }
    })

    return updatedLending
  }

  // Get lending history with optional filtering
  async getLendingHistory(params: LendingSearchParams = {}) {
    const {
      isReturned,
      overdue,
      page = 1,
      limit = 10,
      sortBy = 'dateLent',
      sortOrder = 'desc'
    } = params

    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}

    // Build where clause
    if (isReturned !== undefined) {
      where.isReturned = isReturned
    }

    if (overdue === true) {
      where.AND = [
        { isReturned: false },
        { expectedReturn: { lt: new Date() } }
      ]
    }

    // Get total count
    const total = await prisma.lendingInfo.count({ where })

    // Get lending records with book information
    const lendingHistory = await prisma.lendingInfo.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        book: {
          include: {
            category: true
          }
        }
      }
    })

    return {
      data: lendingHistory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  // Get overdue books
  async getOverdueBooks() {
    return await prisma.lendingInfo.findMany({
      where: {
        isReturned: false,
        expectedReturn: {
          lt: new Date()
        }
      },
      include: {
        book: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        expectedReturn: 'asc'
      }
    })
  }

  // Get currently lent books
  async getCurrentlyLentBooks() {
    return await prisma.lendingInfo.findMany({
      where: {
        isReturned: false
      },
      include: {
        book: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        dateLent: 'desc'
      }
    })
  }

  // Update lending information
  async updateLending(id: string, data: LendingUpdateInput) {
    const existingLending = await prisma.lendingInfo.findUnique({
      where: { id }
    })

    if (!existingLending) {
      throw new Error('Lending record not found')
    }

    return await prisma.lendingInfo.update({
      where: { id },
      data
    })
  }

  // Get lending statistics
  async getLendingStats() {
    const totalLendings = await prisma.lendingInfo.count()
    const activeLendings = await prisma.lendingInfo.count({
      where: { isReturned: false }
    })
    const overdueBooks = await prisma.lendingInfo.count({
      where: {
        isReturned: false,
        expectedReturn: { lt: new Date() }
      }
    })
    const returnedBooks = await prisma.lendingInfo.count({
      where: { isReturned: true }
    })

    // Average lending duration for returned books
    const returnedLendings = await prisma.lendingInfo.findMany({
      where: {
        isReturned: true,
        actualReturn: { not: null }
      },
      select: {
        dateLent: true,
        actualReturn: true
      }
    })

    let averageLendingDays = 0
    if (returnedLendings.length > 0) {
      const totalDays = returnedLendings.reduce((sum: number, lending: { actualReturn: Date | null; dateLent: Date }) => {
        if (lending.actualReturn) {
          const days = Math.ceil(
            (lending.actualReturn.getTime() - lending.dateLent.getTime()) / (1000 * 60 * 60 * 24)
          )
          return sum + days
        }
        return sum
      }, 0)
      averageLendingDays = Math.round(totalDays / returnedLendings.length)
    }

    return {
      totalLendings,
      activeLendings,
      overdueBooks,
      returnedBooks,
      averageLendingDays
    }
  }

  // Extend lending period
  async extendLending(lendingId: string, newExpectedReturn: Date) {
    const lending = await prisma.lendingInfo.findUnique({
      where: { id: lendingId }
    })

    if (!lending) {
      throw new Error('Lending record not found')
    }

    if (lending.isReturned) {
      throw new Error('Cannot extend lending for a returned book')
    }

    if (newExpectedReturn <= new Date()) {
      throw new Error('New expected return date must be in the future')
    }

    return await prisma.lendingInfo.update({
      where: { id: lendingId },
      data: { expectedReturn: newExpectedReturn }
    })
  }
}
