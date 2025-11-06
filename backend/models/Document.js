const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  // Document type (passport, national ID, vehicle permit, land documents)
  type: {
    type: String,
    required: true,
    enum: ['passport', 'nationalID', 'vehiclePermit', 'landDocuments']
  },
  
  // Document details
  documentNumber: {
    type: String,
    required: true
  },
  
  fullName: {
    type: String,
    required: true
  },
  
  dateFound: {
    type: Date,
    required: true
  },
  
  locationFound: {
    type: String,
    required: true
  },
  
  // Additional details for better matching
  additionalDetails: {
    type: String
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['found', 'claimed', 'reconciled'],
    default: 'found'
  },
  
  // References
  foundBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  reconciledWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
documentSchema.index({ documentNumber: 1, type: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ foundBy: 1 });
documentSchema.index({ fullName: 1 });

module.exports = mongoose.model('Document', documentSchema);