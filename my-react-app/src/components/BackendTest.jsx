import { useState, useEffect } from 'react';
import '../App.css';
import ApiService from './apiService';

function BackendTest() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const addResult = (description, data) => {
    setTestResults(prev => [...prev, { description, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testApiConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test basic API connection
      const response = await fetch('http://localhost:5000');
      const data = await response.json();
      addResult('API Connection Test', data);
      
      // Test user registration (if no token)
      if (!token) {
        const registerData = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        };
        
        try {
          const registerResult = await ApiService.register(registerData);
          addResult('User Registration Test', registerResult);
          
          if (registerResult.token) {
            setToken(registerResult.token);
            localStorage.setItem('token', registerResult.token);
          }
        } catch (error) {
          addResult('User Registration Test', { error: error.message });
        }
      }
      
      // Test document creation (if we have a token)
      if (token) {
        const documentData = {
          type: 'passport',
          documentNumber: 'P12345678',
          fullName: 'Test User',
          dateFound: new Date().toISOString(),
          locationFound: 'Test Location',
          additionalDetails: 'Test document for integration'
        };
        
        try {
          const documentResult = await ApiService.createDocument(documentData, token);
          addResult('Document Creation Test', documentResult);
        } catch (error) {
          addResult('Document Creation Test', { error: error.message });
        }
        
        // Test document retrieval
        try {
          const documentsResult = await ApiService.getDocuments(token);
          addResult('Document Retrieval Test', documentsResult);
        } catch (error) {
          addResult('Document Retrieval Test', { error: error.message });
        }
      }
      
    } catch (error) {
      addResult('API Connection Test', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container">
      <div className="content">
        <h1>Backend Integration Test</h1>
        <p className="page-description">
          This page tests the integration between the frontend and backend systems.
        </p>
        
        <div className="test-controls">
          <button onClick={testApiConnection} disabled={loading} className="submit-button">
            {loading ? 'Testing...' : 'Run Integration Tests'}
          </button>
          <button onClick={clearResults} className="back-button">
            Clear Results
          </button>
        </div>
        
        {token && (
          <div className="token-info">
            <p><strong>Current Token:</strong> {token.substring(0, 20)}...</p>
          </div>
        )}
        
        <div className="test-results">
          <h2>Test Results</h2>
          {testResults.length === 0 ? (
            <p>No tests run yet. Click "Run Integration Tests" to begin.</p>
          ) : (
            <div className="results-list">
              {testResults.map((result, index) => (
                <div key={index} className="result-item">
                  <h3>{result.description} <span className="timestamp">[{result.timestamp}]</span></h3>
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BackendTest;