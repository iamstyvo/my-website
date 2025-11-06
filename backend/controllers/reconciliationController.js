const Document = require('../models/Document');
const ReconciliationService = require('../services/reconciliationService');

// Get all documents for reconciliation
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await ReconciliationService.getDocuments();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get documents by user (for personal reconciliation view)
exports.getUserDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const documents = await ReconciliationService.getUserDocuments(userId);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Find matching documents based on document type and identifiers
exports.findMatches = async (req, res) => {
  try {
    const { documentId } = req.params;
    
    // Get the reference document
    const referenceDoc = await Document.findById(documentId);
    if (!referenceDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Find potential matches based on document type
    let matchQuery = {
      _id: { $ne: documentId }, // Exclude the reference document itself
      type: referenceDoc.type,
      status: { $ne: 'reconciled' } // Exclude already reconciled documents
    };
    
    // Add specific matching criteria based on document type
    if (referenceDoc.type === 'nationalID') {
      matchQuery.documentNumber = referenceDoc.documentNumber;
    } else if (referenceDoc.type === 'passport') {
      matchQuery.documentNumber = referenceDoc.documentNumber;
    } else if (referenceDoc.type === 'vehiclePermit') {
      matchQuery.documentNumber = referenceDoc.documentNumber;
    } else if (referenceDoc.type === 'landDocuments') {
      // For land documents, we might match on document number or other identifiers
      matchQuery.documentNumber = referenceDoc.documentNumber;
    }
    
    const matches = await Document.find(matchQuery)
      .populate('foundBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      referenceDocument: referenceDoc,
      matches: matches
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get statistics for the reconciliation dashboard
exports.getReconciliationStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await ReconciliationService.getUserStats(userId);
    
    // Get all matches for the user
    const allMatches = await ReconciliationService.findAllMatches();
    
    res.json({
      ...stats,
      matchingPairs: allMatches.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reconcile two documents
exports.reconcileDocuments = async (req, res) => {
  try {
    const { foundDocumentId, claimedDocumentId } = req.body;
    
    // Update the found document
    const foundDoc = await Document.findByIdAndUpdate(
      foundDocumentId,
      {
        status: 'reconciled',
        claimedBy: claimedDocumentId,
        reconciledWith: claimedDocumentId,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!foundDoc) {
      return res.status(404).json({ message: 'Found document not found' });
    }
    
    // Update the claimed document
    const claimedDoc = await Document.findByIdAndUpdate(
      claimedDocumentId,
      {
        status: 'reconciled',
        reconciledWith: foundDocumentId,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!claimedDoc) {
      return res.status(404).json({ message: 'Claimed document not found' });
    }
    
    res.json({
      message: 'Documents reconciled successfully',
      foundDocument: foundDoc,
      claimedDocument: claimedDoc
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Find all matches for reconciliation center
exports.findAllMatches = async (req, res) => {
  try {
    const matches = await ReconciliationService.findAllMatches();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};