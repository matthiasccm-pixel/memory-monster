#!/bin/bash
# Development rebuild script for Memory Monster

echo "🔄 Rebuilding Memory Monster for development..."

# Build React app
echo "📦 Building React app..."
npm run build

# Kill existing Electron app if running
echo "⚡ Stopping existing app..."
pkill -f "Memory Monster" || true
pkill -f "Electron" || true

# Wait a moment
sleep 1

# Start the app
echo "🚀 Starting app..."
npm start

echo "✅ Development rebuild complete!"