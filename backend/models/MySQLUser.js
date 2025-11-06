const pool = require('../config/mysqlConfig');
const bcrypt = require('bcryptjs');

class MySQLUser {
  // Create a new user
  static async create(userData) {
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const values = [userData.name, userData.email, hashedPassword, userData.role || 'user'];
    
    try {
      const [result] = await pool.execute(query, values);
      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }
  
  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?';
    
    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }
  
  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    try {
      const [rows] = await pool.execute(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }
  
  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  // Get all users
  static async findAll() {
    const query = 'SELECT id, name, email, role, created_at, updated_at FROM users';
    
    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw new Error(`Error finding all users: ${error.message}`);
    }
  }
}

module.exports = MySQLUser;