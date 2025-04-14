#!/bin/bash

# Deployment script for Glossify Store

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create one from .env.production.template"
  exit 1
fi

# Pull latest changes from repository
echo "Pulling latest changes..."
git pull

# Build and start the containers in detached mode
echo "Building and starting Docker containers..."
docker-compose up --build -d

# Display container status
echo "Container status:"
docker-compose ps

echo "Deployment completed successfully!"
echo "Your application is running at http://localhost:3000"