// Database configuration
const dbConfig = {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/lostandfound'
};

// JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'lost-and-found-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

// Server configuration
const serverConfig = {
  port: process.env.PORT || 5000,
  environment: process.env.NODE_ENV || 'development'
};

module.exports = {
  dbConfig,
  jwtConfig,
  serverConfig
};