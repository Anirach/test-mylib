import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBooks } from '../useBooks'

describe('useBooks', () => {
  beforeEach(() => {
    // Reset any state if needed
  })

  it('should initialize with mock books', () => {
    const { result } = renderHook(() => useBooks())
    
    expect(result.current.allBooks).toHaveLength(3)
    expect(result.current.books).toHaveLength(3)
    expect(result.current.searchTerm).toBe('')
    expect(result.current.filterStatus).toBe('all')
    expect(result.current.filterGenre).toBe('all')
  })

  it('should filter books by search term', () => {
    const { result } = renderHook(() => useBooks())
    
    act(() => {
      result.current.setSearchTerm('Typography')
    })
    
    expect(result.current.books).toHaveLength(1)
    expect(result.current.books[0].title).toBe('The Elegance of Typography')
  })

  it('should filter books by status', () => {
    const { result } = renderHook(() => useBooks())
    
    act(() => {
      result.current.setFilterStatus('lent')
    })
    
    expect(result.current.books).toHaveLength(1)
    expect(result.current.books[0].status).toBe('lent')
  })

  it('should add a new book', () => {
    const { result } = renderHook(() => useBooks())
    const initialCount = result.current.allBooks.length
    
    const newBook = {
      title: 'Test Book',
      author: 'Test Author',
      status: 'owned' as const,
      genre: 'fiction'
    }
    
    act(() => {
      result.current.addBook(newBook)
    })
    
    expect(result.current.allBooks).toHaveLength(initialCount + 1)
    expect(result.current.allBooks[initialCount].title).toBe('Test Book')
    expect(result.current.allBooks[initialCount].author).toBe('Test Author')
  })

  it('should update a book', () => {
    const { result } = renderHook(() => useBooks())
    const bookId = result.current.allBooks[0].id
    
    act(() => {
      result.current.updateBook(bookId, { title: 'Updated Title' })
    })
    
    const updatedBook = result.current.allBooks.find(book => book.id === bookId)
    expect(updatedBook?.title).toBe('Updated Title')
  })

  it('should delete a book', () => {
    const { result } = renderHook(() => useBooks())
    const initialCount = result.current.allBooks.length
    const bookId = result.current.allBooks[0].id
    
    act(() => {
      result.current.deleteBook(bookId)
    })
    
    expect(result.current.allBooks).toHaveLength(initialCount - 1)
    expect(result.current.allBooks.find(book => book.id === bookId)).toBeUndefined()
  })

  it('should lend a book', () => {
    const { result } = renderHook(() => useBooks())
    const bookId = result.current.allBooks[0].id
    const lendingInfo = {
      borrowerName: 'John Doe',
      borrowerContact: 'john@example.com',
      dateLent: '2024-01-01',
      expectedReturn: '2024-01-15'
    }
    
    act(() => {
      result.current.lendBook(bookId, lendingInfo)
    })
    
    const lentBook = result.current.allBooks.find(book => book.id === bookId)
    expect(lentBook?.status).toBe('lent')
    expect(lentBook?.lendingInfo).toEqual(lendingInfo)
  })

  it('should return a book', () => {
    const { result } = renderHook(() => useBooks())
    // First find a lent book or lend one
    const lentBookId = result.current.allBooks.find(book => book.status === 'lent')?.id
    
    if (lentBookId) {
      act(() => {
        result.current.returnBook(lentBookId)
      })
      
      const returnedBook = result.current.allBooks.find(book => book.id === lentBookId)
      expect(returnedBook?.status).toBe('owned')
      expect(returnedBook?.lendingInfo).toBeUndefined()
    }
  })

  it('should filter by multiple criteria', () => {
    const { result } = renderHook(() => useBooks())
    
    act(() => {
      result.current.setSearchTerm('Modern')
      result.current.setFilterStatus('lent')
    })
    
    expect(result.current.books).toHaveLength(1)
    expect(result.current.books[0].title).toBe('Modern Architecture')
    expect(result.current.books[0].status).toBe('lent')
  })
})
