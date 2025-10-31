#!/bin/bash

# Database Setup Script for Smart Academic Organizer
# This script creates the database and loads sample data

echo "================================================"
echo "Smart Academic Organizer - Database Setup"
echo "================================================"
echo ""

# Database credentials
DB_HOST="localhost"
DB_USER="root"
DB_PASS="Ramji@2311"
DB_NAME="smartacademicorganizer"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ Error: MySQL is not installed or not in PATH"
    exit 1
fi

echo "✓ MySQL found"
echo ""

# Test MySQL connection
echo "Testing MySQL connection..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1;" &> /dev/null

if [ $? -ne 0 ]; then
    echo "❌ Error: Cannot connect to MySQL"
    echo "   Please check your credentials:"
    echo "   - Host: $DB_HOST"
    echo "   - User: $DB_USER"
    echo "   - Password: $DB_PASS"
    exit 1
fi

echo "✓ MySQL connection successful"
echo ""

# Create database
echo "Creating database '$DB_NAME'..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

if [ $? -eq 0 ]; then
    echo "✓ Database created successfully"
else
    echo "❌ Error creating database"
    exit 1
fi
echo ""

# Run schema
echo "Creating tables..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < backend-php/database/schema.sql

if [ $? -eq 0 ]; then
    echo "✓ Tables created successfully"
else
    echo "❌ Error creating tables"
    exit 1
fi
echo ""

# Load sample data
echo "Loading sample data..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < backend-php/database/seed.sql

if [ $? -eq 0 ]; then
    echo "✓ Sample data loaded successfully"
else
    echo "⚠️  Warning: Some sample data may not have loaded (might be duplicates)"
fi
echo ""

# Verify setup
echo "Verifying setup..."
TABLE_COUNT=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES;" | wc -l)
TABLE_COUNT=$((TABLE_COUNT - 1)) # Remove header row

echo "✓ Found $TABLE_COUNT tables in database"
echo ""

# Show summary
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "Database: $DB_NAME"
echo "Tables created: $TABLE_COUNT"
echo ""
echo "Next steps:"
echo "1. Start PHP server: php -S localhost:8000"
echo "2. Test API: http://localhost:8000/backend-php/"
echo "3. Update frontend to use API endpoints"
echo ""
echo "API Base URL: http://localhost:8000/backend-php/api/"
echo "================================================"
