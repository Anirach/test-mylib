"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookController_1 = require("../controllers/BookController");
const LendingController_1 = require("../controllers/LendingController");
const router = (0, express_1.Router)();
router.get('/search', BookController_1.BookController.searchBooks);
router.get('/stats', BookController_1.BookController.getBookStats);
router.get('/status/:status', BookController_1.BookController.getBooksByStatus);
router.get('/category/:categoryId', BookController_1.BookController.getBooksByCategory);
router.get('/', BookController_1.BookController.getAllBooks);
router.get('/:id', BookController_1.BookController.getBookById);
router.post('/', BookController_1.BookController.createBook);
router.post('/:id/lend', LendingController_1.LendingController.lendBook);
router.put('/:id/return', LendingController_1.LendingController.returnBook);
router.put('/:id', BookController_1.BookController.updateBook);
router.delete('/:id', BookController_1.BookController.deleteBook);
exports.default = router;
//# sourceMappingURL=books.js.map