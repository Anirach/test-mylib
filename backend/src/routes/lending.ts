import { Router } from 'express'
import { LendingController } from '../controllers/LendingController'

const router = Router()

// GET /api/lending/history - Get lending history
router.get('/history', LendingController.getLendingHistory)

// GET /api/lending/overdue - Get overdue books
router.get('/overdue', LendingController.getOverdueBooks)

// GET /api/lending/current - Get currently lent books
router.get('/current', LendingController.getCurrentlyLentBooks)

// GET /api/lending/stats - Get lending statistics
router.get('/stats', LendingController.getLendingStats)

// PUT /api/lending/:id - Update lending information
router.put('/:id', LendingController.updateLending)

// PUT /api/lending/:id/extend - Extend lending period
router.put('/:id/extend', LendingController.extendLending)

export default router
