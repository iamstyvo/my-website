const Document = require('../models/Document');

// Create a new document report
exports.createDocument = async (req, res) => {
  try {
    const { type, documentNumber, fullName, dateFound, locationFound, additionalDetails } = req.body;
    
    const document = new Document({
      type,
      documentNumber,
      fullName,
      dateFound,
      locationFound,
      additionalDetails,
      foundBy: req.user.userId
    });
    
    await document.save();
    
    res.status(201).json({
      message: 'Document reported successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('foundBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get documents by type
exports.getDocumentsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const documents = await Document.find({ type })
      .populate('foundBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id)
      .populate('foundBy', 'name email')
      .populate('claimedBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update document status
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, claimedBy } = req.body;
    
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Update status
    document.status = status;
    if (claimedBy) {
      document.claimedBy = claimedBy;
    }
    document.updatedAt = Date.now();
    
    await document.save();
    
    res.json({
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search documents
exports.searchDocuments = async (req, res) => {
  try {
    const { query } = req.query;
    
    const documents = await Document.find({
      $or: [
        { documentNumber: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } },
        { locationFound: { $regex: query, $options: 'i' } },
        { additionalDetails: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('foundBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};