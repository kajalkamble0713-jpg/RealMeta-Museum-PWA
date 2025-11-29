#!/bin/bash

# RealMeta Museum PWA - Development Startup Script

echo "🚀 Starting RealMeta Museum PWA Development Environment"
echo ""

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env not found, creating from example..."
    cp .env.example .env
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env not found, creating from example..."
    cp backend/.env.example backend/.env
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not installed. Starting with Docker..."
    docker run -d -p 27017:27017 --name realmeta-mongo mongo:7.0
else
    echo "✅ MongoDB ready"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Start frontend
echo "🎨 Starting frontend development server..."
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
