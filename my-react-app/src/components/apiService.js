// API Service for Lost and Found System

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // User authentication
  static async register(userData) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    return response.json();
  }
  
  static async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    return response.json();
  }
  
  // Document operations
  static async createDocument(documentData, token) {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(documentData)
    });
    
    return response.json();
  }
  
  static async getDocuments(token) {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.json();
  }
  
  static async searchDocuments(query, token) {
    const response = await fetch(`${API_BASE_URL}/documents/search?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.json();
  }
  
  // Reconciliation operations
  static async getReconciliationData(token) {
    const response = await fetch(`${API_BASE_URL}/reconciliation/documents/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.json();
  }
  
  static async getAllMatches(token) {
    const response = await fetch(`${API_BASE_URL}/reconciliation/matches`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.json();
  }
}

export default ApiService;