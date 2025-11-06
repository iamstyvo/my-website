const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MySQL database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Database and table creation queries
const CREATE_DATABASE_QUERY = 'CREATE DATABASE IF NOT EXISTS lostandfound';
const USE_DATABASE_QUERY = 'USE lostandfound';

const CREATE_USERS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

const CREATE_DOCUMENTS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('passport', 'nationalID', 'vehiclePermit', 'landDocuments') NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_found DATE NOT NULL,
    location_found VARCHAR(255) NOT NULL,
    additional_details TEXT,
    status ENUM('found', 'claimed', 'reconciled') DEFAULT 'found',
    found_by INT NOT NULL,
    claimed_by INT,
    reconciled_with INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (found_by) REFERENCES users(id),
    FOREIGN KEY (claimed_by) REFERENCES users(id),
    FOREIGN KEY (reconciled_with) REFERENCES documents(id),
    INDEX idx_document_number_type (document_number, type),
    INDEX idx_status (status),
    INDEX idx_found_by (found_by),
    INDEX idx_full_name (full_name)
  )
`;

async function setupDatabase() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to MySQL server');
    
    // Create database
    await connection.execute(CREATE_DATABASE_QUERY);
    console.log('Database "lostandfound" created or already exists');
    
    // Use database
    await connection.execute(USE_DATABASE_QUERY);
    console.log('Using database "lostandfound"');
    
    // Create users table
    await connection.execute(CREATE_USERS_TABLE_QUERY);
    console.log('Users table created or already exists');
    
    // Create documents table
    await connection.execute(CREATE_DOCUMENTS_TABLE_QUERY);
    console.log('Documents table created or already exists');
    
    console.log('MySQL database setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up MySQL database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };