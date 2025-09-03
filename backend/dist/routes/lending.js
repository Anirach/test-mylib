"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LendingController_1 = require("../controllers/LendingController");
const router = (0, express_1.Router)();
router.get('/history', LendingController_1.LendingController.getLendingHistory);
router.get('/overdue', LendingController_1.LendingController.getOverdueBooks);
router.get('/current', LendingController_1.LendingController.getCurrentlyLentBooks);
router.get('/stats', LendingController_1.LendingController.getLendingStats);
router.put('/:id', LendingController_1.LendingController.updateLending);
router.put('/:id/extend', LendingController_1.LendingController.extendLending);
exports.default = router;
//# sourceMappingURL=lending.js.map