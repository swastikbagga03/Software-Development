#!/bin/bash

# Start Docker containers
echo "Starting Docker containers..."
docker-compose up -d

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to start..."
sleep 10

# Initialize the database
echo "Initializing database..."
node init-mongo.js

# Start the application
echo "Starting the application..."
npm run dev