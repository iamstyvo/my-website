/*
 * MongoDB Setup Script for Lost and Found System
 * 
 * This script provides instructions for setting up MongoDB locally
 * or configuring MongoDB Atlas for the Lost and Found system.
 */

console.log(`
==========================================
Lost and Found System - MongoDB Setup
==========================================

Options for MongoDB Setup:

1. Local MongoDB Installation (Recommended for development)
   - Download MongoDB Community Server: https://www.mongodb.com/try/download/community
   - Install MongoDB following the official documentation for your OS
   - Start MongoDB service:
     * Windows: net start MongoDB
     * macOS: brew services start mongodb-community
     * Linux: sudo systemctl start mongod
   - Update your .env file:
     MONGODB_URI=mongodb://localhost:27017/lostandfound

2. MongoDB Atlas (Cloud - Recommended for production)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free tier cluster
   - Whitelist your IP address (or 0.0.0.0/0 for development)
   - Create a database user
   - Get your connection string:
     mongodb+srv://<username>:<password>@<cluster-url>/lostandfound?retryWrites=true&w=majority
   - Update your .env file with this connection string

3. Docker (Alternative for local development)
   - Install Docker Desktop
   - Run: docker run --name lostandfound-mongo -p 27017:27017 -d mongo
   - Update your .env file:
     MONGODB_URI=mongodb://localhost:27017/lostandfound

After setting up MongoDB:
1. Make sure the MongoDB service is running
2. Update your .env file with the correct MONGODB_URI
3. Restart the backend server: npm run dev
4. The system will automatically create the necessary collections when you start using it

For any issues:
- Check MongoDB logs for errors
- Verify the connection string in .env
- Ensure firewall settings allow connections to MongoDB
`);

process.exit(0);