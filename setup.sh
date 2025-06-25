#!/bin/bash

echo "🚀 Setting up LLMQA - AI Text Summarizer"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Create models directory
mkdir -p models

# Create uploads directory
mkdir -p uploads

# Copy environment example
if [ ! -f .env ]; then
    cp env.example .env
    echo "📝 Created .env file. Please configure your environment variables."
else
    echo "📝 .env file already exists."
fi

cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your Supabase project at https://supabase.com"
echo "2. Enable the pgvector extension in your database"
echo "3. Run the SQL setup script from server/supabase-setup.sql"
echo "4. Configure your .env file in the server directory"
echo "5. (Optional) Download a Llama model to server/models/"
echo "6. Start the application with: npm run dev"
echo ""
echo "🎉 Happy coding!" 