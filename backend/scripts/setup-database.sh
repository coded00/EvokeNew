#!/bin/bash

# EVOKE Database Setup Script
# This script sets up the PostgreSQL database for the EVOKE platform

set -e

echo "🚀 Setting up EVOKE Database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp env.example .env
    print_status "Please update the .env file with your database credentials"
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    print_error "PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Check if Prisma CLI is installed
if ! command -v npx prisma &> /dev/null; then
    print_error "Prisma CLI not found. Installing dependencies..."
    npm install
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Push database schema
print_status "Pushing database schema..."
npx prisma db push

# Run migrations (if any)
print_status "Running database migrations..."
npx prisma migrate dev --name init

# Seed database (if seed file exists)
if [ -f "prisma/seed.ts" ]; then
    print_status "Seeding database..."
    npm run db:seed
fi

print_status "Database setup completed successfully! 🎉"
print_status "You can now start the development server with: npm run dev"
print_status "To view your database with Prisma Studio, run: npm run db:studio" 