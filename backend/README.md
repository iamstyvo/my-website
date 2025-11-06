# Lost and Found System - Backend

This is the backend API for the Lost and Found System.

## Features

- User authentication (registration, login)
- Document reporting for different types:
  - Passports
  - National IDs
  - Vehicle Permits
  - Land Documents
- Document search and retrieval
- Status tracking (found, claimed, reconciled)
- Reconciliation center with matching algorithms

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up MongoDB:
   - Option 1: Install MongoDB locally (https://docs.mongodb.com/manual/installation/)
   - Option 2: Use MongoDB Atlas (cloud service) - Update the MONGODB_URI in `.env`

3. Set up environment variables:
   Create a `.env` file based on `.env.example`

4. Run the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user

### Documents
- POST `/api/documents` - Create a new document report
- GET `/api/documents` - Get all documents
- GET `/api/documents/type/:type` - Get documents by type
- GET `/api/documents/:id` - Get document by ID
- PUT `/api/documents/:id/status` - Update document status
- GET `/api/documents/search` - Search documents

### Reconciliation
- GET `/api/reconciliation/documents` - Get all documents for reconciliation
- GET `/api/reconciliation/documents/user` - Get documents reported by current user
- GET `/api/reconciliation/documents/:documentId/matches` - Find matches for a specific document
- GET `/api/reconciliation/stats` - Get reconciliation statistics
- POST `/api/reconciliation/reconcile` - Reconcile two documents
- GET `/api/reconciliation/matches` - Find all matching documents

## Project Structure

```
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── config/
├── utils/
├── server.js
└── package.json
```

## Database Schema

### User
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (user | admin)
- createdAt: Date

### Document
- type: String (passport | nationalID | vehiclePermit | landDocuments)
- documentNumber: String
- fullName: String
- dateFound: Date
- locationFound: String
- additionalDetails: String
- status: String (found | claimed | reconciled)
- foundBy: ObjectId (references User)
- claimedBy: ObjectId (references User)
- reconciledWith: ObjectId (references Document)
- createdAt: Date
- updatedAt: Date

## MySQL Support

This project includes support for MySQL as an alternative to MongoDB.

### Setting up MySQL Database

1. Make sure you have MySQL installed on your system
2. Create a MySQL user (default: root) with appropriate permissions
3. Run the MySQL setup script to create the database and tables:

```
node setup-mysql.js
```

4. Update the `.env` file with your MySQL credentials if different from defaults

### Switching to MySQL

To switch from MongoDB to MySQL:

1. Update the controllers to use MySQL models instead of MongoDB models
2. Update the services to use MySQL services
3. Set environment variables to configure MySQL connection
