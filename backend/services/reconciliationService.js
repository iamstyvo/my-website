const Document = require('../models/Document');

class ReconciliationService {
  // Find all matches for reconciliation
  static async findAllMatches() {
    try {
      // Get all documents
      const documents = await Document.find({ status: { $ne: 'reconciled' } })
        .populate('foundBy', 'name email')
        .populate('claimedBy', 'name email')
        .sort({ createdAt: -1 });
      
      const matches = [];
      
      // Compare each document with others to find matches
      for (let i = 0; i < documents.length; i++) {
        const doc1 = documents[i];
        const docMatches = [];
        
        for (let j = i + 1; j < documents.length; j++) {
          const doc2 = documents[j];
          
          // Check if they are potential matches
          if (this.areDocumentsMatching(doc1, doc2)) {
            docMatches.push(doc2);
          }
        }
        
        if (docMatches.length > 0) {
          matches.push({
            referenceDocument: doc1,
            matches: docMatches
          });
        }
      }
      
      return matches;
    } catch (error) {
      throw new Error(`Error finding matches: ${error.message}`);
    }
  }
  
  // Check if two documents match based on their type and identifiers
  static areDocumentsMatching(doc1, doc2) {
    // Must be different documents
    if (doc1._id.toString() === doc2._id.toString()) {
      return false;
    }
    
    // Must be opposite types (one found, one claimed/lost)
    // For this system, we'll consider documents with different users as potential matches
    if (doc1.foundBy.toString() === doc2.foundBy.toString()) {
      return false;
    }
    
    // Must be the same document type
    if (doc1.type !== doc2.type) {
      return false;
    }
    
    // Must have the same document number
    if (doc1.documentNumber !== doc2.documentNumber) {
      return false;
    }
    
    return true;
  }
  
  // Get user-specific statistics
  static async getUserStats(userId) {
    try {
      // Total documents reported by user
      const totalReports = await Document.countDocuments({ foundBy: userId });
      
      // Total found documents by user
      const foundDocuments = await Document.countDocuments({ 
        foundBy: userId, 
        status: 'found' 
      });
      
      // Total reconciled documents involving user
      const reconciledDocuments = await Document.countDocuments({ 
        $or: [
          { foundBy: userId, status: 'reconciled' },
          { claimedBy: userId, status: 'reconciled' }
        ]
      });
      
      return {
        totalReports,
        foundDocuments,
        reconciledDocuments
      };
    } catch (error) {
      throw new Error(`Error getting user stats: ${error.message}`);
    }
  }
  
  // Get all documents with optional filtering
  static async getDocuments(filter = {}) {
    try {
      const documents = await Document.find(filter)
        .populate('foundBy', 'name email')
        .populate('claimedBy', 'name email')
        .sort({ createdAt: -1 });
      
      return documents;
    } catch (error) {
      throw new Error(`Error getting documents: ${error.message}`);
    }
  }
  
  // Get documents reported by a specific user
  static async getUserDocuments(userId) {
    try {
      const documents = await Document.find({ foundBy: userId })
        .populate('foundBy', 'name email')
        .populate('claimedBy', 'name email')
        .sort({ createdAt: -1 });
      
      return documents;
    } catch (error) {
      throw new Error(`Error getting user documents: ${error.message}`);
    }
  }
}

module.exports = ReconciliationService;