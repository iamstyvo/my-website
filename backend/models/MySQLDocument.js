const pool = require('../config/mysqlConfig');

class MySQLDocument {
  // Create a new document
  static async create(documentData) {
    const query = `
      INSERT INTO documents (
        type, document_number, full_name, date_found, location_found, 
        additional_details, found_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      documentData.type,
      documentData.documentNumber,
      documentData.fullName,
      documentData.dateFound,
      documentData.locationFound,
      documentData.additionalDetails,
      documentData.foundBy
    ];
    
    try {
      const [result] = await pool.execute(query, values);
      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }
  
  // Find document by ID
  static async findById(id) {
    const query = `
      SELECT d.*, 
             u1.name as found_by_name, u1.email as found_by_email,
             u2.name as claimed_by_name, u2.email as claimed_by_email
      FROM documents d
      LEFT JOIN users u1 ON d.found_by = u1.id
      LEFT JOIN users u2 ON d.claimed_by = u2.id
      WHERE d.id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding document by ID: ${error.message}`);
    }
  }
  
  // Find all documents with optional filter
  static async find(filter = {}) {
    let query = `
      SELECT d.*, 
             u1.name as found_by_name, u1.email as found_by_email,
             u2.name as claimed_by_name, u2.email as claimed_by_email
      FROM documents d
      LEFT JOIN users u1 ON d.found_by = u1.id
      LEFT JOIN users u2 ON d.claimed_by = u2.id
    `;
    
    const conditions = [];
    const values = [];
    
    // Add filter conditions
    if (filter.status) {
      conditions.push('d.status = ?');
      values.push(filter.status);
    }
    
    if (filter.foundBy) {
      conditions.push('d.found_by = ?');
      values.push(filter.foundBy);
    }
    
    if (filter.type) {
      conditions.push('d.type = ?');
      values.push(filter.type);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY d.created_at DESC';
    
    try {
      const [rows] = await pool.execute(query, values);
      return rows;
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }
  
  // Find all documents with status not equal to reconciled
  static async findNotReconciled() {
    const query = `
      SELECT d.*, 
             u1.name as found_by_name, u1.email as found_by_email,
             u2.name as claimed_by_name, u2.email as claimed_by_email
      FROM documents d
      LEFT JOIN users u1 ON d.found_by = u1.id
      LEFT JOIN users u2 ON d.claimed_by = u2.id
      WHERE d.status != 'reconciled'
      ORDER BY d.created_at DESC
    `;
    
    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw new Error(`Error finding not reconciled documents: ${error.message}`);
    }
  }
  
  // Update document status
  static async updateStatus(id, status) {
    const query = 'UPDATE documents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const values = [status, id];
    
    try {
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating document status: ${error.message}`);
    }
  }
  
  // Update document reconciliation
  static async updateReconciliation(id, reconciledWithId, status = 'reconciled') {
    const query = `
      UPDATE documents 
      SET reconciled_with = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    const values = [reconciledWithId, status, id];
    
    try {
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating document reconciliation: ${error.message}`);
    }
  }
  
  // Count documents with filter
  static async count(filter = {}) {
    let query = 'SELECT COUNT(*) as count FROM documents';
    const conditions = [];
    const values = [];
    
    // Add filter conditions
    if (filter.status) {
      conditions.push('status = ?');
      values.push(filter.status);
    }
    
    if (filter.foundBy) {
      conditions.push('found_by = ?');
      values.push(filter.foundBy);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    try {
      const [rows] = await pool.execute(query, values);
      return rows[0].count;
    } catch (error) {
      throw new Error(`Error counting documents: ${error.message}`);
    }
  }
}

module.exports = MySQLDocument;