# MindCheck - Student Mental Health Assessment Platform

A comprehensive web application for mental health assessments with cross-device synchronization and secure admin management.

## 🚀 Features

- **BFI-10 Personality Assessment**: Complete Big Five personality trait assessment
- **Cross-Device Synchronization**: Backend-powered data persistence across all devices
- **Admin Dashboard**: Secure admin interface for managing submissions
- **Anonymous & Identified Submissions**: Flexible privacy options
- **Real-time Statistics**: Live dashboard with submission analytics
- **Export Functionality**: CSV export for research and administrative purposes
- **Security First**: JWT authentication, rate limiting, input validation

## 🏗️ Architecture

### Frontend (React + Vite)
- Modern React application with Tailwind CSS
- Responsive design for all devices
- Real-time form validation
- Loading states and error handling

### Backend (Node.js + Express)
- RESTful API with PostgreSQL database
- JWT-based authentication
- Rate limiting and CORS protection
- Input validation and sanitization

### Database (PostgreSQL)
- Structured schema for assessment data
- Optimized queries with proper indexing
- JSON storage for flexible data structures

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone and Install Frontend Dependencies

```bash
git clone <repository-url>
cd mindcheck
npm install
```

### 2. Setup Backend

#### Option A: Automated Setup (Recommended)
```bash
./setup-backend.sh
```

#### Option B: Manual Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create PostgreSQL database
createdb mindcheck_db

# Configure environment variables
cp .env .env.local
# Edit .env.local with your database credentials
```

### 3. Database Configuration

Update `backend/.env` with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mindcheck_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
DEFAULT_ADMIN_PASSWORD=your-admin-password
```

### 4. Start the Application

#### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```
Server will run on: http://localhost:3001

#### Terminal 2: Frontend Development Server
```bash
npm run dev
```
Frontend will run on: http://localhost:5173

## 🔐 Admin Access

- **URL**: `/bfi10-admin`
- **Default Password**: `MUdaanM` (configurable in `.env`)
- **Features**:
  - View all submissions
  - Search and filter submissions
  - Export data to CSV
  - Delete submissions
  - Real-time statistics

## 📊 Data Flow

1. **User Assessment**:
   - User completes BFI-10 assessment
   - Data sent to backend API
   - Stored in PostgreSQL database
   - Results displayed to user

2. **Admin Management**:
   - Admin authenticates via JWT
   - Fetches submissions from API
   - Can search, filter, and export data
   - All changes synchronized across devices

## 🔒 Security Features

- **Authentication**: JWT tokens with expiration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configured for frontend origin
- **SQL Injection Prevention**: Parameterized queries
- **Password Hashing**: bcrypt for admin passwords

## 🗄️ Database Schema

### bfi10_submissions
```sql
- id: SERIAL PRIMARY KEY
- user_id: VARCHAR(255) NOT NULL
- timestamp: TIMESTAMP WITH TIME ZONE
- anonymous: BOOLEAN DEFAULT FALSE
- user_info: JSONB (nullable)
- consent_given: BOOLEAN DEFAULT FALSE
- responses: INTEGER[] (10 elements)
- ocean_scores: JSONB
- interpretation: JSONB
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
```

### admin_users
```sql
- id: SERIAL PRIMARY KEY
- username: VARCHAR(255) UNIQUE
- password_hash: VARCHAR(255)
- role: VARCHAR(50) DEFAULT 'admin'
- created_at: TIMESTAMP WITH TIME ZONE
- last_login: TIMESTAMP WITH TIME ZONE
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
npm run build
# Serve dist/ directory with any static server
```

### Environment Variables for Production
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your-production-jwt-secret
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
```

## 🧪 Testing

```bash
cd backend
npm test
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### BFI-10 Endpoints
- `POST /api/bfi10/submissions` - Save submission
- `GET /api/bfi10/submissions` - Get submissions (admin)
- `GET /api/bfi10/submissions/:id` - Get single submission (admin)
- `DELETE /api/bfi10/submissions/:id` - Delete submission (admin)
- `GET /api/bfi10/submissions/stats` - Get statistics (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `createdb mindcheck_db`

### Port Conflicts
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically find an available port

### CORS Issues
- Update `FRONTEND_URL` in `backend/.env` to match your frontend URL

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the backend logs
3. Ensure all prerequisites are installed
4. Check network connectivity for API calls

## Usage

1. Navigate through the different pages using the header navigation
2. Access various mental health assessments from the assessments section
3. After completing an assessment, view your results and optionally:
   - Email a summary of your results to yourself (client-side processing only)
   - Contact us with questions about your results through the integrated Google Form

## Privacy & Data Protection

MindCheck prioritizes user privacy and data protection:

- **No Server Storage**: All assessment data is processed client-side in the browser
- **No Personal Data Collection**: Raw scores and personal information are never stored
- **Client-Side Email Generation**: Results emails are generated and sent directly from your device
- **Optional Feedback**: Google Forms integration allows anonymous feedback collection
- **Third-Party Compliance**: Google Forms has separate privacy policies for form submissions

## Assessment Results

Results include:
- Assessment interpretation and description
- Support resource recommendations
- Important disclaimers about professional consultation
- Options for sharing results privately
3. Complete assessments to receive personalized results and insights
4. View results and recommendations on the results page

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

Please ensure all contributions maintain the platform's focus on student mental health and adhere to ethical guidelines for mental health assessments.

## License

This project is private and proprietary.
