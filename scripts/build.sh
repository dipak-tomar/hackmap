#!/bin/bash

# Build script for Vercel deployment
# Ensures Prisma client is generated before Next.js build

echo "🔧 Starting build process..."

# Check if Prisma CLI is available
if command -v prisma &> /dev/null; then
    echo "✅ Prisma CLI found"
    prisma generate
elif command -v npx &> /dev/null; then
    echo "✅ Using npx to run Prisma"
    npx prisma generate
else
    echo "❌ Neither Prisma CLI nor npx found"
    exit 1
fi

echo "✅ Prisma client generated successfully"

# Build Next.js application
echo "🚀 Building Next.js application..."
npx next build

echo "✅ Build completed successfully" 