#!/bin/bash

# UberEats Database Setup Script

echo "🍽️ Setting up UberEats PostgreSQL Database..."

# Install PostgreSQL if not already installed
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    apt-get update
    apt-get install -y postgresql postgresql-contrib
fi

# Start PostgreSQL service
service postgresql start

# Create database and user
sudo -u postgres psql << EOF
-- Create database
DROP DATABASE IF EXISTS ubereats_db;
CREATE DATABASE ubereats_db;

-- Create user (if not exists)
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
      CREATE USER postgres WITH PASSWORD 'postgres';
   END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ubereats_db TO postgres;
ALTER USER postgres CREATEDB;

\q
EOF

# Initialize database with schema
echo "🗄️ Initializing database schema..."
PGPASSWORD=postgres psql -h localhost -U postgres -d ubereats_db -f /app/database_schema.sql

echo "✅ Database setup complete!"
echo "Database: ubereats_db"
echo "Host: localhost"
echo "Port: 5432"
echo "User: postgres"
echo "Password: postgres"