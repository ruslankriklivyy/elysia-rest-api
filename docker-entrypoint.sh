#!/bin/bash

# Function to wait for the database to be ready
wait_for_database() {
    until nc -z -v -w30 db 5432
    do
        echo "Waiting for database connection..."
        sleep 5
    done
    echo "Database connection established!"
}

# Wait for the database to be ready
wait_for_database

# Set the DATABASE_URL environment variable
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"

# Run Prisma migrations
npx prisma migrate deploy
npx prisma generate

# Start your application
exec "$@"