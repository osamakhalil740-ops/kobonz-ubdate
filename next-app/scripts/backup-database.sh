#!/bin/bash

# Phase 9: Database Backup Script
# Creates a backup of the database before critical operations

set -e

BACKUP_NAME=${1:-manual-backup-$(date +%Y%m%d-%H%M%S)}

echo "💾 Creating database backup: $BACKUP_NAME"
echo ""

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  exit 1
fi

# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')

echo "Host: $HOST"
echo "Port: $PORT"
echo "Database: $DB"
echo ""

# Create backup directory if it doesn't exist
mkdir -p backups

# For Neon, use their backup API
if [[ $HOST == *"neon.tech"* ]]; then
  echo "🌿 Detected Neon database"
  
  if [ -z "$NEON_API_KEY" ] || [ -z "$NEON_PROJECT_ID" ]; then
    echo "❌ Error: NEON_API_KEY or NEON_PROJECT_ID not set"
    exit 1
  fi
  
  # Create a branch as backup
  curl -X POST \
    "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches" \
    -H "Authorization: Bearer $NEON_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"branch\": {
        \"name\": \"backup-$BACKUP_NAME\"
      }
    }"
  
  echo ""
  echo "✅ Backup branch created: backup-$BACKUP_NAME"
  echo "This branch will be available in your Neon dashboard."
  
else
  # Standard PostgreSQL backup
  echo "🐘 Creating PostgreSQL dump..."
  
  BACKUP_FILE="backups/${BACKUP_NAME}.sql"
  
  pg_dump $DATABASE_URL > $BACKUP_FILE
  
  # Compress backup
  gzip $BACKUP_FILE
  
  echo "✅ Backup created: ${BACKUP_FILE}.gz"
  echo ""
  echo "💡 To restore this backup:"
  echo "   gunzip ${BACKUP_FILE}.gz"
  echo "   psql \$DATABASE_URL < $BACKUP_FILE"
fi
