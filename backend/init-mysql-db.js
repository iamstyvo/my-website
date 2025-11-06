#!/usr/bin/env node

/**
 * Script to initialize MySQL database for Lost and Found system
 * 
 * To run this script:
 * 1. Make sure MySQL is installed and running on your system
 * 2. Update the .env file with your MySQL credentials
 * 3. Run: node init-mysql-db.js
 */

const { setupDatabase } = require('./setup-mysql');

console.log('Initializing MySQL database for Lost and Found system...');
console.log('Make sure MySQL is running and your credentials are set in .env file\n');

setupDatabase()
  .then(() => {
    console.log('\n✅ Database initialization completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. The application will now be able to use MySQL for data storage');
  })
  .catch((error) => {
    console.error('\n❌ Database initialization failed:', error.message);
    process.exit(1);
  });