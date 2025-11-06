const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const documentRoutes = require('./routes/documents');
const userRoutes = require('./routes/users');
const reconciliationRoutes = require('./routes/reconciliation');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection status
let mysqlConnected = false;

// Test MySQL connection
async function testMySQLConnection() {
  try {
    const pool = require('./config/mysqlConfig');
    const connection = await pool.getConnection();
    console.log('MySQL connected successfully');
    mysqlConnected = true;
    connection.release();
  } catch (error) {
    console.error('MySQL connection error:', error.message);
    mysqlConnected = false;
  }
}

testMySQLConnection();

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reconciliation', reconciliationRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Lost and Found Backend API', 
    databaseConnected: mysqlConnected ? 'Yes' : 'No'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the API`);
});

module.exports = app;