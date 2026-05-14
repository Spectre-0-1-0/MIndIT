# MindCheck Backend API

Backend API server for the MindCheck BFI-10 Assessment Platform.

## Features

- **BFI-10 Assessment Management**: Store and retrieve BFI-10 assessment submissions
- **Admin Authentication**: JWT-based authentication for admin access
- **PostgreSQL Database**: Persistent data storage with proper schema
- **Security**: Rate limiting, CORS, input validation, and sanitization
- **RESTful API**: Complete CRUD operations for submissions

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE mindcheck_db;
```

The application will automatically create the required tables when it starts.

### 3. Environment Configuration

Copy the `.env` file and update the values as needed:

```bash
cp .env .env.local
```

Key environment variables:
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: Database name (default: mindcheck_db)
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `DEFAULT_ADMIN_PASSWORD`: Default admin password

### 4. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### BFI-10 Submissions
- `POST /api/bfi10/submissions` - Save new submission
- `GET /api/bfi10/submissions` - Get all submissions (admin only)
- `GET /api/bfi10/submissions/:id` - Get individual submission (admin only)
- `DELETE /api/bfi10/submissions/:id` - Delete submission (admin only)
- `GET /api/bfi10/submissions/stats` - Get submission statistics (admin only)

### Health Check
- `GET /api/health` - Server health check

## Database Schema

### bfi10_submissions
```sql
CREATE TABLE bfi10_submissions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  anonymous BOOLEAN DEFAULT FALSE,
  user_info JSONB,
  consent_given BOOLEAN DEFAULT FALSE,
  responses INTEGER[] NOT NULL,
  ocean_scores JSONB NOT NULL,
  interpretation JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### admin_users
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);
```

## Security Features

- JWT authentication for admin routes
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation and sanitization
- CORS protection
- Helmet security headers
- SQL injection prevention via parameterized queries

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── config/
│   └── database.js          # Database connection and schema setup
├── routes/
│   ├── auth.js             # Authentication routes
│   └── bfi10.js            # BFI-10 submission routes
├── server.js               # Main Express server
├── package.json
├── .env                    # Environment variables
└── README.md
```