import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEntries, findAllMatches } from './ReconcileStore';
import '../App.css';

function ReconciliationCenter() {
  const [entries, setEntries] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]); // New state for all documents
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('reports'); // New state for tabs
  const [showAllReports, setShowAllReports] = useState(false); // New state for showing all reports

  useEffect(() => {
    fetchReconciliationData();
  }, []);

  const fetchReconciliationData = () => {
    try {
      setLoading(true);
      
      // Get all entries from the in-memory store
      const allEntries = getEntries();
      
      // Transform entries to match existing format
      const transformedEntries = allEntries.map(entry => ({
        id: entry.id,
        type: entry.type || 'unknown',
        docType: entry.docType,
        fullName: entry.fullName,
        documentNumber: entry.nationalId || entry.raw?.passportNumber || entry.raw?.permitNumber || entry.raw?.documentTitle || '',
        locationFound: entry.raw?.foundLocation || entry.raw?.location || '',
        dateFound: entry.raw?.foundDate || entry.raw?.date || '',
        contact: entry.raw?.finderContact || entry.raw?.contact || '',
        notes: entry.notes || '',
        timestamp: entry.timestamp,
        status: entry.status || 'pending',
        userEmail: entry.userEmail || null // Add user email if available
      }));
      
      // For the summary tab, we'll use the same data
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
        createdAt: entry.timestamp,
        userEmail: entry.userEmail || null // Add user email if available
      }));
      
      setEntries(transformedEntries);
      setAllDocuments(transformedAllDocuments);
      
      // Find all matches
      const matches = findAllMatches();
      setAllMatches(matches);
      
      // Check if user is logged in
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
        setCurrentUser(loggedInUser);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(entry => entry.docType === filter);

  // Filter entries by current user if logged in
  const userEntries = currentUser 
    ? filteredEntries.filter(entry => 
        entry.fullName === currentUser || 
        entry.userEmail === currentUser ||
        (entry.raw && entry.raw.finderName === currentUser) ||
        (entry.raw && entry.raw.fullName === currentUser)
      )
    : filteredEntries;

  // Filter all documents by type
  const filteredAllDocuments = filter === 'all' 
    ? allDocuments 
    : allDocuments.filter(doc => doc.type === filter);

  // Filter documents by current user
  const userDocuments = currentUser
    ? filteredAllDocuments.filter(doc => 
        doc.fullName === currentUser || 
        doc.userEmail === currentUser ||
        (doc.submittedBy === currentUser) ||
        (doc.raw && doc.raw.finderName === currentUser) ||
        (doc.raw && doc.raw.fullName === currentUser)
      )
    : filteredAllDocuments;

  // Handle click on Total Reports button
  const handleTotalReportsClick = () => {
    setShowAllReports(true);
    setActiveTab('reports');
  };

  // Reset to normal view
  const resetView = () => {
    setShowAllReports(false);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="content">
          <h1>Reconciliation Center</h1>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="content">
          <h1>Reconciliation Center</h1>
          <p className="error">Error: {error}</p>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        <h1>Reconciliation Center</h1>
        {currentUser ? (
          <p className="page-description">
            Welcome, {currentUser}! Viewing your submitted reports and matches.
          </p>
        ) : (
          <p className="page-description">
            View and manage document matching between lost and found reports.
          </p>
        )}
        
        {/* Tab navigation */}
        <div className="tab-navigation">
          <button 
            className={activeTab === 'reports' ? 'tab-button active' : 'tab-button'}
            onClick={() => { setActiveTab('reports'); resetView(); }}
          >
            My Reports
          </button>
          <button 
            className={activeTab === 'summary' ? 'tab-button active' : 'tab-button'}
            onClick={() => { setActiveTab('summary'); resetView(); }}
          >
            Application Summary
          </button>
          <button 
            className={activeTab === 'matches' ? 'tab-button active' : 'tab-button'}
            onClick={() => { setActiveTab('matches'); resetView(); }}
          >
            Matches
          </button>
        </div>
        
        {/* Filter section - visible for all tabs */}
        <div className="filter-section">
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Reports</option>
            <option value="passport">Passports</option>
            <option value="national id">National IDs</option>
            <option value="vehicle permit">Vehicle Permits</option>
            <option value="land documents">Land Documents</option>
          </select>
        </div>
        
        {/* Dashboard - visible for all tabs */}
        <div className="reconciliation-dashboard">
          <button className="stats-card-button" onClick={handleTotalReportsClick}>
            <h3>Total Reports</h3>
            <p className="stat-number">{currentUser ? userDocuments.length : allDocuments.length}</p>
          </button>
          
          <div className="stats-card">
            <h3>Found Documents</h3>
            <p className="stat-number">
              {currentUser 
                ? userDocuments.filter(d => d.type === 'found' || d.type.includes('found')).length 
                : allDocuments.filter(d => d.type === 'found' || d.type.includes('found')).length}
            </p>
          </div>
          
          <div className="stats-card">
            <h3>Lost Documents</h3>
            <p className="stat-number">
              {currentUser 
                ? userDocuments.filter(d => d.type === 'lost' || d.type.includes('lost')).length 
                : allDocuments.filter(d => d.type === 'lost' || d.type.includes('lost')).length}
            </p>
          </div>
          
          <div className="stats-card">
            <h3>Matching Pairs</h3>
            <p className="stat-number">{allMatches.length}</p>
          </div>
        </div>
        
        {/* My Reports Tab */}
        {activeTab === 'reports' && (
          <div className="entries-list">
            <h2>
              {showAllReports 
                ? 'All Submitted Reports' 
                : currentUser 
                  ? `${currentUser}'s Reports` 
                  : filter === 'all' 
                    ? 'All Reports' 
                    : `${filter} Documents`}
            </h2>
            {(showAllReports ? allDocuments : currentUser ? userEntries : entries).length === 0 ? (
              <p>No reports found.</p>
            ) : (
              <div className="entries-grid">
                {(showAllReports ? allDocuments : currentUser ? userEntries : entries).map(entry => (
                  <div key={entry.id} className={`entry-card ${entry.type}`}>
                    <h3>{entry.docType} - {entry.type.toUpperCase()}</h3>
                    <p><strong>Name:</strong> {entry.fullName}</p>
                    {entry.documentNumber && <p><strong>Document #:</strong> {entry.documentNumber}</p>}
                    <p><strong>Contact:</strong> {entry.contact}</p>
                    <p className="timestamp">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Application Summary Tab */}
        {activeTab === 'summary' && (
          <div className="entries-list">
            <h2>Application Summary</h2>
            {(currentUser ? userDocuments : filteredAllDocuments).length === 0 ? (
              <p>No documents found.</p>
            ) : (
              <div className="summary-table">
                <table>
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Document #</th>
                      <th>Submitted By</th>
                      <th>Date Found</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Submitted On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentUser ? userDocuments : filteredAllDocuments).map(doc => (
                      <tr key={doc.id}>
                        <td>{doc.type}</td>
                        <td>{doc.documentNumber}</td>
                        <td>
                          <div>{doc.submittedBy}</div>
                          <div className="small-text">{doc.submittedByEmail}</div>
                        </td>
                        <td>{new Date(doc.dateFound).toLocaleDateString()}</td>
                        <td>{doc.locationFound}</td>
                        <td>
                          <span className={`status-badge ${doc.status}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Matches Tab */}
        {activeTab === 'matches' && allMatches.length > 0 && (
          <div className="matches-section">
            <h2>Matching Items Between Users</h2>
            <div className="entries-grid">
              {allMatches.map((matchGroup, index) => (
                <div key={index} className="match-group">
                  <div className="match-header">
                    <h3>Match Found: {matchGroup.entry.docType}</h3>
                  </div>
                  <div className="match-entries">
                    <div className={`entry-card ${matchGroup.entry.type}`}>
                      <h4>{matchGroup.entry.type.toUpperCase()} - {matchGroup.entry.fullName}</h4>
                      <p><strong>Name:</strong> {matchGroup.entry.fullName}</p>
                      <p><strong>Document #:</strong> {matchGroup.entry.nationalId || matchGroup.entry.raw?.passportNumber || matchGroup.entry.raw?.permitNumber || matchGroup.entry.raw?.documentTitle || ''}</p>
                      <p><strong>Contact:</strong> {matchGroup.entry.raw?.finderContact || matchGroup.entry.raw?.contact || ''}</p>
                      <p className="timestamp">{new Date(matchGroup.entry.timestamp).toLocaleString()}</p>
                    </div>
                    
                    {matchGroup.matches.map((match, matchIndex) => (
                      <div key={matchIndex} className={`entry-card ${match.type} match-entry`}>
                        <h4>{match.type.toUpperCase()} - {match.fullName}</h4>
                        <p><strong>Name:</strong> {match.fullName}</p>
                        <p><strong>Document #:</strong> {match.nationalId || match.raw?.passportNumber || match.raw?.permitNumber || match.raw?.documentTitle || ''}</p>
                        <p><strong>Contact:</strong> {match.raw?.finderContact || match.raw?.contact || ''}</p>
                        <p className="timestamp">{new Date(match.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'matches' && allMatches.length === 0 && (
          <div className="entries-list">
            <h2>Matching Items Between Users</h2>
            <p>No matches found.</p>
          </div>
        )}
        
        <div className="navigation-buttons">
          <Link to="/" className="back-button">Back to Home</Link>
          <Link to="/total-reports" className="continue-button" style={{marginLeft: '10px'}}>View All Reports</Link>
        </div>
      </div>
    </div>
  );
}

export default ReconciliationCenter;