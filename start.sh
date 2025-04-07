#!/bin/bash

# Set error handling
set -e

echo "Starting Typing Racer setup..."

# Navigate to the project directory
cd "$(dirname "$0")"
echo "Current directory: $(pwd)"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js version 14 or higher"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)
if [ "$NODE_MAJOR_VERSION" -lt 14 ]; then
    echo "Error: Node.js version 14 or higher is required"
    echo "Current version: $NODE_VERSION"
    echo "Please update your Node.js installation"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install || { echo "Error: Failed to install dependencies"; exit 1; }

# Start the development server
echo "Starting development server..."
echo "The application will open in your browser at http://localhost:3000"
npm start || { echo "Error: Failed to start the development server"; exit 1; } 