# Book Management App - Complete Implementation Tasks

## Project Overview
Transform the current frontend-only React TypeScript book management app into a full-stack application with a Node.js/Express backend using SQLite3 database and Prisma ORM.

## Phase 1: Backend Foundation Setup

### Task 1.1: Backend Project Structure
- [x] Create `backend/` directory in project root
- [x] Initialize Node.js project with TypeScript
- [x] Install core dependencies:
  ```bash
  cd backend
  npm init -y
  npm install express cors helmet morgan dotenv
  npm install prisma @prisma/client sqlite3
  npm install -D typescript @types/node @types/express @types/cors nodemon ts-node
  npm install -D jest @types/jest ts-jest supertest @types/supertest
  ```
- [x] Setup TypeScript configuration (`tsconfig.json`)
- [x] Create basic Express server structure
- [x] Setup environment variables configuration

**Files to create:**
- [x] `backend/package.json`
- [x] `backend/tsconfig.json`
- [x] `backend/.env`
- [x] `backend/src/app.ts`
- [x] `backend/src/server.ts`

### Task 1.2: Database Schema Design with Prisma
- [x] Initialize Prisma in backend
- [x] Design database schema for books management:
  - Books table (id, title, author, isbn, genre, description, coverImageUrl, pdfFileUrl, status, dateAdded, createdAt, updatedAt)
  - LendingInfo table (id, bookId, borrowerName, borrowerContact, dateLent, expectedReturn, actualReturn)
  - Categories table (id, name, description)
  - Users table (optional for future expansion)
- [x] Create Prisma schema file
- [x] Generate and run initial migration
- [x] Seed database with sample data

**Files to create:**
- [x] `backend/prisma/schema.prisma`
- [x] `backend/prisma/migrations/`
- [x] `backend/prisma/seed.ts`

### Task 1.3: Database Models and Services
- [x] Create TypeScript interfaces matching Prisma models
- [x] Implement BookService class with CRUD operations
- [x] Implement LendingService for lending/borrowing operations
- [x] Create database connection utilities
- [x] Implement error handling for database operations

**Files to create:**
- [x] `backend/src/types/index.ts`
- [x] `backend/src/services/BookService.ts`
- [x] `backend/src/services/LendingService.ts`
- [x] `backend/src/utils/database.ts`
- [x] `backend/src/middleware/errorHandler.ts`

## Phase 2: Backend API Development

### Task 2.1: Books API Endpoints
- [x] **GET /api/books** - Get all books with filtering and pagination
- [x] **GET /api/books/:id** - Get single book by ID
- [x] **POST /api/books** - Create new book
- [x] **PUT /api/books/:id** - Update existing book
- [x] **DELETE /api/books/:id** - Delete book
- [x] **GET /api/books/search** - Search books by title/author
- [x] **GET /api/books/status/:status** - Filter books by status

**Files to create:**
- [x] `backend/src/routes/books.ts`
- [x] `backend/src/controllers/BookController.ts`
- [x] `backend/src/validators/bookValidators.ts`

### Task 2.2: Lending API Endpoints
- [x] **POST /api/books/:id/lend** - Lend a book
- [x] **PUT /api/books/:id/return** - Return a lent book
- [x] **GET /api/lending/history** - Get lending history
- [ ] **GET /api/lending/overdue** - Get overdue books

**Files to create:**
- [x] `backend/src/routes/lending.ts`
- [x] `backend/src/controllers/LendingController.ts`
- [x] `backend/src/validators/lendingValidators.ts`

### Task 2.3: File Upload and Management
- [x] **POST /api/upload/cover** - Upload book cover images
- [x] **POST /api/upload/pdf** - Upload PDF files
- [x] **DELETE /api/upload/:filename** - Delete uploaded files
- [x] Setup multer for file handling
- [x] Implement file validation and security

**Files to create:**
- [x] `backend/src/routes/upload.ts`
- [x] `backend/src/controllers/UploadController.ts`
- [x] `backend/src/middleware/upload.ts`
- [x] `backend/uploads/` directory structure

### Task 2.4: API Documentation and Validation
- [x] Install and setup Swagger for API documentation
- [x] Add input validation using Joi or Zod
- [x] Implement request/response schemas
- [x] Add API rate limiting
- [x] Setup CORS properly for frontend integration

**Files to create:**
- [x] `backend/src/swagger/swagger.ts`
- [ ] `backend/src/swagger/definitions.yaml`
- [x] `backend/src/middleware/validation.ts`
- [x] `backend/src/middleware/rateLimit.ts`

## Phase 3: Backend Testing

### Task 3.1: Unit Tests for Services
- [ ] Setup Jest testing environment
- [ ] Mock Prisma client for testing
- [ ] Write unit tests for BookService:
  - `createBook()`
  - `getAllBooks()`
  - `getBookById()`
  - `updateBook()`
  - `deleteBook()`
  - `searchBooks()`
- [ ] Write unit tests for LendingService:
  - `lendBook()`
  - `returnBook()`
  - `getLendingHistory()`

**Files to create:**
- `backend/src/__tests__/services/BookService.test.ts`
- `backend/src/__tests__/services/LendingService.test.ts`
- `backend/src/__tests__/utils/testHelpers.ts`
- `backend/jest.config.js`

### Task 3.2: Integration Tests for API Endpoints
- [ ] Setup test database
- [ ] Write integration tests for Books API:
  - GET /api/books
  - POST /api/books
  - PUT /api/books/:id
  - DELETE /api/books/:id
- [ ] Write integration tests for Lending API:
  - POST /api/books/:id/lend
  - PUT /api/books/:id/return
- [ ] Test error handling and edge cases
- [ ] Test file upload functionality

**Files to create:**
- `backend/src/__tests__/integration/books.test.ts`
- `backend/src/__tests__/integration/lending.test.ts`
- `backend/src/__tests__/integration/upload.test.ts`
- `backend/src/__tests__/setup.ts`

### Task 3.3: E2E Testing Setup
- [ ] Install and configure testing tools (Supertest)
- [ ] Create test data fixtures
- [ ] Implement database cleanup utilities
- [ ] Add test coverage reporting

**Files to create:**
- `backend/src/__tests__/fixtures/bookData.ts`
- `backend/src/__tests__/utils/dbCleanup.ts`
- `backend/package.json` (updated with test scripts)

## Phase 4: Frontend Integration

### Task 4.1: API Client Setup
- [ ] Create API client using Axios
- [ ] Setup base URL and interceptors
- [ ] Implement error handling for API calls
- [ ] Add loading states management
- [ ] Configure environment variables for API URLs

**Files to create:**
- `src/lib/api.ts`
- `src/lib/apiClient.ts`
- `src/types/api.ts`
- `.env.local`

### Task 4.2: Update React Query Hooks
- [ ] Replace mock data in `useBooks.ts` with real API calls
- [ ] Create `useBooksQuery` for fetching books
- [ ] Create `useBookMutation` for CRUD operations
- [ ] Create `useLendingMutation` for lending operations
- [ ] Implement optimistic updates
- [ ] Add proper error handling and retry logic

**Files to update/create:**
- `src/hooks/useBooks.ts` (update)
- `src/hooks/useBookMutations.ts` (new)
- `src/hooks/useLending.ts` (new)
- `src/hooks/useUpload.ts` (new)

### Task 4.3: Update Components for API Integration
- [ ] Update `AddBookModal` to call create book API
- [ ] Update `BookDetailModal` to handle real book data
- [ ] Update `LendBookModal` to call lending API
- [ ] Add image upload functionality to book forms
- [ ] Implement PDF file upload and preview
- [ ] Add proper loading and error states to all components

**Files to update:**
- `src/components/AddBookModal.tsx`
- `src/components/BookDetailModal.tsx`
- `src/components/LendBookModal.tsx`
- `src/components/BookCard.tsx`
- `src/pages/Index.tsx`

### Task 4.4: Enhanced Features
- [ ] Add advanced search functionality
- [ ] Implement book categories/genres filtering
- [ ] Add book cover image display and upload
- [ ] Create lending history view
- [ ] Add overdue books notifications
- [ ] Implement bulk operations (delete multiple books)

**Files to create:**
- `src/components/AdvancedSearch.tsx`
- `src/components/CategoryFilter.tsx`
- `src/components/LendingHistory.tsx`
- `src/components/ImageUpload.tsx`
- `src/pages/LendingHistory.tsx`

## Phase 5: Frontend Testing

### Task 5.1: Component Unit Tests
- [ ] Setup React Testing Library
- [ ] Write tests for BookCard component
- [ ] Write tests for AddBookModal component
- [ ] Write tests for SearchBar component
- [ ] Write tests for custom hooks
- [ ] Mock API calls in component tests

**Files to create:**
- `src/components/__tests__/BookCard.test.tsx`
- `src/components/__tests__/AddBookModal.test.tsx`
- `src/components/__tests__/SearchBar.test.tsx`
- `src/hooks/__tests__/useBooks.test.ts`
- `src/setupTests.ts`

### Task 5.2: Integration Tests
- [ ] Setup MSW (Mock Service Worker) for API mocking
- [ ] Write integration tests for book management flow
- [ ] Write integration tests for lending flow
- [ ] Test form submissions and validations
- [ ] Test error scenarios and edge cases

**Files to create:**
- `src/__tests__/integration/BookManagement.test.tsx`
- `src/__tests__/integration/LendingFlow.test.tsx`
- `src/__tests__/mocks/handlers.ts`
- `src/__tests__/mocks/server.ts`

### Task 5.3: E2E Testing with Playwright
- [ ] Install and configure Playwright
- [ ] Write E2E tests for complete user journeys
- [ ] Test book creation, editing, and deletion
- [ ] Test lending and returning books
- [ ] Test file upload functionality

**Files to create:**
- `e2e/book-management.spec.ts`
- `e2e/lending-flow.spec.ts`
- `playwright.config.ts`

## Phase 6: Production Setup

### Task 6.1: Build and Deployment
- [ ] Setup build scripts for both frontend and backend
- [ ] Configure production database
- [ ] Setup environment variables for production
- [ ] Create Docker configuration files
- [ ] Setup CI/CD pipeline

**Files to create:**
- `Dockerfile` (for backend)
- `docker-compose.yml`
- `.github/workflows/ci.yml`
- `scripts/build.sh`
- `scripts/deploy.sh`

### Task 6.2: Performance Optimization
- [ ] Implement database query optimization
- [ ] Add database indexing
- [ ] Setup caching strategy
- [ ] Optimize API response sizes
- [ ] Implement pagination for large datasets

### Task 6.3: Security and Monitoring
- [ ] Add authentication middleware (optional)
- [ ] Implement proper error logging
- [ ] Add API monitoring
- [ ] Setup health check endpoints
- [ ] Implement backup strategy for database

**Files to create:**
- `backend/src/middleware/auth.ts`
- `backend/src/utils/logger.ts`
- `backend/src/routes/health.ts`

## Testing Strategy Summary

### Backend Testing Coverage
- **Unit Tests**: 80%+ coverage for services and utilities
- **Integration Tests**: All API endpoints tested
- **E2E Tests**: Critical user journeys covered

### Frontend Testing Coverage
- **Unit Tests**: 70%+ coverage for components and hooks
- **Integration Tests**: Key user interactions tested
- **E2E Tests**: Complete user workflows validated

## Success Criteria

### Functional Requirements
- [ ] Complete CRUD operations for books
- [ ] Lending and returning functionality
- [ ] File upload (covers and PDFs)
- [ ] Search and filtering
- [ ] Responsive design

### Technical Requirements
- [ ] All tests passing (unit, integration, E2E)
- [ ] API documentation complete
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Security best practices followed

### Quality Gates
- [ ] Code coverage > 75%
- [ ] No critical security vulnerabilities
- [ ] API response time < 200ms
- [ ] Frontend load time < 3 seconds
- [ ] All accessibility standards met

## Implementation Timeline

**Week 1-2**: Backend Foundation (Tasks 1.1-1.3)
**Week 3-4**: Backend API Development (Tasks 2.1-2.4)
**Week 5**: Backend Testing (Tasks 3.1-3.3)
**Week 6-7**: Frontend Integration (Tasks 4.1-4.4)
**Week 8**: Frontend Testing (Tasks 5.1-5.3)
**Week 9**: Production Setup and Optimization (Tasks 6.1-6.3)
**Week 10**: Final testing, documentation, and deployment

## Notes
- Use TypeScript throughout for type safety
- Follow the existing code style and patterns
- Implement proper error handling at all levels
- Ensure all features are properly tested
- Document API endpoints and components
- Consider accessibility in all UI implementations
