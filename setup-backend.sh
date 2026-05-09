#!/bin/bash

# MindCheck Backend Setup Script
echo "🚀 Setting up MindCheck Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create database
echo "🗄️  Setting up database..."
createdb mindcheck_db 2>/dev/null || echo "Database 'mindcheck_db' already exists or creation failed. Please create it manually if needed."

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env .env.local 2>/dev/null || echo "Please configure your .env file manually"
fi

echo "✅ Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your .env file with database credentials"
echo "2. Start the backend server: cd backend && npm run dev"
echo "3. Start the frontend: npm run dev (from root directory)"
echo ""
echo "🔗 API will be available at: http://localhost:3001"
echo "🌐 Frontend will be available at: http://localhost:5173"