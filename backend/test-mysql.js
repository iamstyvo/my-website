#!/usr/bin/env node

/**
 * Test script to verify MySQL database connection
 * 
 * To run this script:
 * node test-mysql.js
 */

const pool = require('./config/mysqlConfig');

async function testConnection() {
  console.log('Testing MySQL database connection...');
  
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to MySQL database');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as connected');
    console.log('✅ Query test successful:', rows[0]);
    
    // Release the connection back to the pool
    connection.release();
    
    // Test if the database exists
    try {
      await pool.execute('USE lostandfound');
      console.log('✅ Database "lostandfound" exists and is accessible');
    } catch (error) {
      console.log('⚠️  Database "lostandfound" does not exist yet');
    }
    
    console.log('\n✅ All tests passed! MySQL is ready to use.');
    process.exit(0);
  } catch (error) {
    console.error('❌ MySQL connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();