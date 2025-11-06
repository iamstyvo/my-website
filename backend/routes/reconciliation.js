const express = require('express');
const router = express.Router();
const reconciliationController = require('../controllers/reconciliationController');
const { authenticateToken } = require('../middleware/auth');

// All routes are protected
router.use(authenticateToken);

// Reconciliation routes
router.get('/documents', reconciliationController.getAllDocuments);
router.get('/documents/user', reconciliationController.getUserDocuments);
router.get('/documents/:documentId/matches', reconciliationController.findMatches);
router.get('/stats', reconciliationController.getReconciliationStats);
router.post('/reconcile', reconciliationController.reconcileDocuments);
router.get('/matches', reconciliationController.findAllMatches);

module.exports = router;