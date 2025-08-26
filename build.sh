#!/bin/bash
# Netlify build script
echo "Starting build process..."

# Clear any existing cache
rm -rf node_modules/.cache
rm -rf .nuxt

# Install dependencies
echo "Installing dependencies..."
npm ci

# Generate static site
echo "Generating static site..."
npm run generate

echo "Build completed successfully!"
