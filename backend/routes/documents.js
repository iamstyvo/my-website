const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticateToken } = require('../middleware/auth');

// All routes are protected
router.use(authenticateToken);

// Document routes
router.post('/', documentController.createDocument);
router.get('/', documentController.getAllDocuments);
router.get('/type/:type', documentController.getDocumentsByType);
router.get('/:id', documentController.getDocumentById);
router.put('/:id/status', documentController.updateDocumentStatus);
router.get('/search', documentController.searchDocuments);

module.exports = router;