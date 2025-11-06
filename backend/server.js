const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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

// Connect to MongoDB with error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lostandfound', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Please ensure MongoDB is installed and running, or update the MONGODB_URI in .env for MongoDB Atlas');
    // Continue running the server even without database connection
    // This allows the API to work with in-memory data for development
  }
};

connectDB();

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reconciliation', reconciliationRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Lost and Found Backend API', 
    databaseConnected: mongoose.connection.readyState === 1 ? 'Yes' : 'No'
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