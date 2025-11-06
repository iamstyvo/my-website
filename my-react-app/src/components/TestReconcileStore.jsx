import { useState, useEffect } from 'react';
import { getEntries, addEntry, clearEntries } from './ReconcileStore';
import '../App.css';

function TestReconcileStore() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    type: 'found',
    docType: 'national id',
    fullName: '',
    nationalId: '',
    notes: ''
  });

  useEffect(() => {
    refreshEntries();
  }, []);

  const refreshEntries = () => {
    const allEntries = getEntries();
    setEntries(allEntries);
  };

  const handleAddEntry = () => {
    if (newEntry.fullName && newEntry.nationalId) {
      addEntry({
        ...newEntry,
        raw: newEntry,
        timestamp: new Date().toISOString()
      });
      setNewEntry({
        type: 'found',
        docType: 'national id',
        fullName: '',
        nationalId: '',
        notes: ''
      });
      refreshEntries();
    }
  };

  const handleClearEntries = () => {
    clearEntries();
    refreshEntries();
  };

  return (
    <div className="container">
      <div className="content">
        <h1>Test Reconcile Store</h1>
        <p>Use this page to test the ReconcileStore functionality.</p>
        
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={newEntry.fullName}
            onChange={(e) => setNewEntry({...newEntry, fullName: e.target.value})}
            placeholder="Enter full name"
          />
        </div>
        
        <div className="form-group">
          <label>National ID:</label>
          <input
            type="text"
            value={newEntry.nationalId}
            onChange={(e) => setNewEntry({...newEntry, nationalId: e.target.value})}
            placeholder="Enter national ID"
          />
        </div>
        
        <div className="form-group">
          <label>Notes:</label>
          <input
            type="text"
            value={newEntry.notes}
            onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
            placeholder="Enter notes"
          />
        </div>
        
        <button onClick={handleAddEntry} className="submit-button">
          Add Test Entry
        </button>
        
        <button onClick={handleClearEntries} className="back-button" style={{marginLeft: '10px'}}>
          Clear All Entries
        </button>
        
        <h2>Current Entries ({entries.length})</h2>
        {entries.length === 0 ? (
          <p>No entries found in the store.</p>
        ) : (
          <div className="entries-grid">
            {entries.map(entry => (
              <div key={entry.id} className="entry-card">
                <h3>{entry.docType} - {entry.type}</h3>
                <p><strong>Name:</strong> {entry.fullName}</p>
                <p><strong>ID:</strong> {entry.nationalId}</p>
                <p><strong>Notes:</strong> {entry.notes}</p>
                <p className="timestamp">{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestReconcileStore;