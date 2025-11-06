import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEntries, findAllMatches, markAsReconciled, deleteEntry } from './ReconcileStore';
import '../App.css';

function TotalReports() {
  const [allDocuments, setAllDocuments] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    try {
      setLoading(true);
      
      // Get all entries from the in-memory store
      const allEntries = getEntries();
      
      // Transform entries to match existing format
      const transformedAllDocuments = allEntries.map(entry => ({
        id: entry.id,
        type: entry.docType,
        documentNumber: entry.nationalId || entry.raw?.passportNumber || entry.raw?.permitNumber || entry.raw?.documentTitle || '',
        fullName: entry.fullName,
        dateFound: entry.raw?.foundDate || entry.raw?.date || '',
        locationFound: entry.raw?.foundLocation || entry.raw?.location || '',
        status: entry.status || 'pending',
        submittedBy: entry.fullName,
        submittedByEmail: entry.raw?.finderContact || entry.raw?.contact || '',
        payerName: entry.raw?.payerName || entry.raw?.finderName || entry.fullName || '',
        createdAt: entry.timestamp,
        userEmail: entry.userEmail || null,
        raw: entry.raw || {},
        reconciledWith: entry.reconciledWith || null,
        notes: entry.notes || ''
      }));
      
      setAllDocuments(transformedAllDocuments);
      
      // Find all matches
      const matches = findAllMatches();
      setAllMatches(matches);
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter all documents by type
  const filteredAllDocuments = filter === 'all' 
    ? allDocuments 
    : allDocuments.filter(doc => doc.type === filter);

  // Mark entries as reconciled
  const handleMarkAsReconciled = (lostEntryId, foundEntryId) => {
    try {
      markAsReconciled(lostEntryId, foundEntryId);
      fetchAllData(); // Refresh the data
    } catch (err) {
      setError('Failed to mark entries as reconciled: ' + err.message);
    }
  };

  // Delete an entry
  const handleDeleteEntry = (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        deleteEntry(id);
        fetchAllData(); // Refresh the data
      }
    } catch (err) {
      setError('Failed to delete entry: ' + err.message);
    }
  };

  // Open document details modal
  const openDocumentDetails = (document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  // Close document details modal
  const closeDocumentDetails = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  // Find matching document for a given document
  const findMatchingDocument = (document) => {
    // Check if this document is part of any match
    for (const matchGroup of allMatches) {
      if (matchGroup.entry.id === document.id) {
        return matchGroup.matches[0]; // Return the first match
      }
      
      // Check if any of the matches is this document
      for (const match of matchGroup.matches) {
        if (match.id === document.id) {
          return matchGroup.entry; // Return the main entry
        }
      }
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="content">
          <h1 className="total-reports-header">Total Reports</h1>
          <p className="total-reports-description">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="content">
          <h1 className="total-reports-header">Total Reports</h1>
          <p className="error">Error: {error}</p>
          <div className="total-reports-navigation">
            <Link to="/reconciliation" className="back-button">Back to Reconciliation Center</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        <h1 className="total-reports-header">All Submitted Reports</h1>
        <p className="total-reports-description">
          View all lost and found document submissions and matching pairs.
        </p>
        
        {/* Filter section */}
        <div className="total-reports-filter">
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Reports</option>
            <option value="passport">Passports</option>
            <option value="national id">National IDs</option>
            <option value="vehicle permit">Vehicle Permits</option>
            <option value="land documents">Land Documents</option>
          </select>
        </div>
        
        {/* Dashboard */}
        <div className="total-reports-dashboard">
          <div className="total-reports-stats-card">
            <h3>Total Reports</h3>
            <p className="stat-number">{allDocuments.length}</p>
          </div>
          
          <div className="total-reports-stats-card">
            <h3>Found Documents</h3>
            <p className="stat-number">
              {allDocuments.filter(d => d.type === 'found' || d.type.includes('found')).length}
            </p>
          </div>
          
          <div className="total-reports-stats-card">
            <h3>Lost Documents</h3>
            <p className="stat-number">
              {allDocuments.filter(d => d.type === 'lost' || d.type.includes('lost')).length}
            </p>
          </div>
          
          <div className="total-reports-stats-card">
            <h3>Matching Pairs</h3>
            <p className="stat-number">{allMatches.length}</p>
          </div>
        </div>
        
        {/* All Reports Section */}
        <div className="total-reports-section">
          <h2>All Submitted Documents</h2>
          {filteredAllDocuments.length === 0 ? (
            <p>No documents found.</p>
          ) : (
            <div className="total-reports-table-container">
              <table className="total-reports-table">
                <thead>
                  <tr>
                    <th>Document Type</th>
                    <th>Document #</th>
                    <th>Submitted By</th>
                    <th>Payer Name</th>
                    <th>Date Found</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Submitted On</th>
                    <th>Match Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllDocuments.map(doc => {
                    const matchingDoc = findMatchingDocument(doc);
                    return (
                      <tr key={doc.id}>
                        <td>
                          {doc.type} 
                          {doc.status === 'reconciled' && <span> ✅</span>}
                        </td>
                        <td>{doc.documentNumber}</td>
                        <td>
                          <div>{doc.submittedBy}</div>
                          <div className="small-text">{doc.submittedByEmail}</div>
                        </td>
                        <td>{doc.payerName || 'N/A'}</td>
                        <td>{new Date(doc.dateFound).toLocaleDateString()}</td>
                        <td>{doc.locationFound}</td>
                        <td>
                          <span className={`status-badge ${doc.status}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                        <td>
                          {matchingDoc ? (
                            <span className="status-badge reconciled" style={{ backgroundColor: '#d1ecf1', color: '#0c5460' }}>
                              Matched
                            </span>
                          ) : (
                            <span className="status-badge pending" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                              No Match
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                              onClick={() => openDocumentDetails(doc)}
                              className="submit-button"
                              style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                            >
                              View Details
                            </button>
                            {matchingDoc && (
                              <button 
                                onClick={() => openDocumentDetails(matchingDoc)}
                                className="submit-button"
                                style={{ padding: '5px 10px', fontSize: '0.9rem', backgroundColor: '#17a2b8' }}
                              >
                                View Match
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteEntry(doc.id)}
                              className="back-button"
                              style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Matches Section */}
        <div className="total-reports-section">
          <h2>Matching Pairs</h2>
          {allMatches.length === 0 ? (
            <p>No matching pairs found.</p>
          ) : (
            <div className="matches-section">
              {allMatches.map((matchGroup, index) => (
                <div key={index} className="total-reports-match-group">
                  <div className="total-reports-match-header">
                    <h3>Match Found: {matchGroup.entry.type}</h3>
                  </div>
                  <div className="total-reports-match-entries">
                    <div className={`total-reports-entry-card ${matchGroup.entry.type}`}>
                      <h4>{matchGroup.entry.type.toUpperCase()} - {matchGroup.entry.fullName}</h4>
                      <p><strong>Name:</strong> {matchGroup.entry.fullName}</p>
                      <p><strong>Document #:</strong> {matchGroup.entry.nationalId || matchGroup.entry.raw?.passportNumber || matchGroup.entry.raw?.permitNumber || matchGroup.entry.raw?.documentTitle || ''}</p>
                      <p><strong>Contact:</strong> {matchGroup.entry.raw?.finderContact || matchGroup.entry.raw?.contact || ''}</p>
                      <p className="timestamp">{new Date(matchGroup.entry.timestamp).toLocaleString()}</p>
                      {matchGroup.entry.status === 'reconciled' && (
                        <p className="reconciled-status">✅ Reconciled</p>
                      )}
                      <button 
                        onClick={() => openDocumentDetails(matchGroup.entry)}
                        className="submit-button"
                        style={{ marginTop: '10px', padding: '5px 10px', fontSize: '0.9rem' }}
                      >
                        View Details
                      </button>
                    </div>
                    
                    {matchGroup.matches.map((match, matchIndex) => (
                      <div key={matchIndex} className={`total-reports-entry-card ${match.type} match-entry`}>
                        <h4>{match.type.toUpperCase()} - {match.fullName}</h4>
                        <p><strong>Name:</strong> {match.fullName}</p>
                        <p><strong>Document #:</strong> {match.nationalId || match.raw?.passportNumber || match.raw?.permitNumber || match.raw?.documentTitle || ''}</p>
                        <p><strong>Contact:</strong> {match.raw?.finderContact || match.raw?.contact || ''}</p>
                        <p className="timestamp">{new Date(match.timestamp).toLocaleString()}</p>
                        {match.status === 'reconciled' && (
                          <p className="reconciled-status">✅ Reconciled</p>
                        )}
                        {matchGroup.entry.type !== match.type && (
                          <button 
                            onClick={() => handleMarkAsReconciled(
                              matchGroup.entry.type === 'lost' ? matchGroup.entry.id : match.id,
                              matchGroup.entry.type === 'found' ? matchGroup.entry.id : match.id
                            )}
                            className="submit-button"
                            style={{ marginTop: '10px', padding: '5px 10px', fontSize: '0.9rem', marginRight: '5px' }}
                          >
                            Mark as Reconciled
                          </button>
                        )}
                        <button 
                          onClick={() => openDocumentDetails(match)}
                          className="submit-button"
                          style={{ marginTop: '10px', padding: '5px 10px', fontSize: '0.9rem' }}
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="total-reports-navigation">
          <Link to="/reconciliation" className="back-button">Back to Reconciliation Center</Link>
        </div>
      </div>
      
      {/* Document Details Modal */}
      {isModalOpen && selectedDocument && (
        <div className="modal-overlay" onClick={closeDocumentDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Document Details</h2>
              <button className="modal-close" onClick={closeDocumentDetails}>×</button>
            </div>
            <div className="modal-body">
              <div className="document-detail">
                <h3>Basic Information</h3>
                <p><strong>Type:</strong> {selectedDocument.type}</p>
                <p><strong>Document Number:</strong> {selectedDocument.documentNumber || 'N/A'}</p>
                <p><strong>Submitted By:</strong> {selectedDocument.submittedBy}</p>
                <p><strong>Contact:</strong> {selectedDocument.submittedByEmail || 'N/A'}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${selectedDocument.status}`}>
                    {selectedDocument.status}
                  </span>
                  {selectedDocument.status === 'reconciled' && <span> ✅</span>}
                </p>
                {selectedDocument.payerName && (
                  <p><strong>Payer Name:</strong> {selectedDocument.payerName}</p>
                )}
              </div>
              
              <div className="document-detail">
                <h3>Submission Details</h3>
                <p><strong>Date Found/Lost:</strong> {selectedDocument.dateFound ? new Date(selectedDocument.dateFound).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Location:</strong> {selectedDocument.locationFound || 'N/A'}</p>
                <p><strong>Submitted On:</strong> {new Date(selectedDocument.createdAt).toLocaleString()}</p>
              </div>
              
              {/* Photo Display Section */}
              {selectedDocument.raw && selectedDocument.raw.photo && (
                <div className="document-detail">
                  <h3>Document Photo</h3>
                  <div className="photo-container">
                    <img 
                      src={selectedDocument.raw.photo} 
                      alt="Document" 
                      style={{ maxWidth: '100%', maxHeight: '400px', marginTop: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
                    />
                  </div>
                </div>
              )}
              
              {selectedDocument.notes && (
                <div className="document-detail">
                  <h3>Notes</h3>
                  <p>{selectedDocument.notes}</p>
                </div>
              )}
              
              {/* Matching Information */}
              {findMatchingDocument(selectedDocument) && (
                <div className="document-detail">
                  <h3>Matching Document</h3>
                  <div className="match-info">
                    {(() => {
                      const matchingDoc = findMatchingDocument(selectedDocument);
                      return (
                        <div>
                          <p><strong>Match Type:</strong> {matchingDoc.type}</p>
                          <p><strong>Submitted By:</strong> {matchingDoc.fullName}</p>
                          <p><strong>Document Number:</strong> {matchingDoc.nationalId || matchingDoc.raw?.passportNumber || matchingDoc.raw?.permitNumber || matchingDoc.raw?.documentTitle || 'N/A'}</p>
                          <p><strong>Status:</strong> 
                            <span className={`status-badge ${matchingDoc.status}`}>
                              {matchingDoc.status}
                            </span>
                          </p>
                          <button 
                            onClick={() => openDocumentDetails(matchingDoc)}
                            className="submit-button"
                            style={{ marginTop: '10px' }}
                          >
                            View Matching Document
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
              
              {selectedDocument.raw && Object.keys(selectedDocument.raw).length > 0 && (
                <div className="document-detail">
                  <h3>Raw Data</h3>
                  <div className="raw-data-container">
                    {Object.entries(selectedDocument.raw)
                      .filter(([key]) => key !== 'photo') // Exclude photo from raw data display
                      .map(([key, value]) => (
                        <p key={key}><strong>{key}:</strong> {String(value)}</p>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="back-button" onClick={closeDocumentDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TotalReports;