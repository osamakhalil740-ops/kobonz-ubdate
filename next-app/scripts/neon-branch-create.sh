#!/bin/bash

# Phase 9: Create Neon Database Branch
# Usage: ./scripts/neon-branch-create.sh <branch-name> <parent-branch>

set -e

BRANCH_NAME=$1
PARENT_BRANCH=${2:-main}

if [ -z "$BRANCH_NAME" ]; then
  echo "❌ Error: Branch name is required"
  echo "Usage: ./scripts/neon-branch-create.sh <branch-name> [parent-branch]"
  exit 1
fi

if [ -z "$NEON_API_KEY" ]; then
  echo "❌ Error: NEON_API_KEY environment variable is not set"
  echo "Get your API key from: https://console.neon.tech/app/settings/api-keys"
  exit 1
fi

if [ -z "$NEON_PROJECT_ID" ]; then
  echo "❌ Error: NEON_PROJECT_ID environment variable is not set"
  exit 1
fi

echo "🌿 Creating Neon database branch..."
echo "Branch: $BRANCH_NAME"
echo "Parent: $PARENT_BRANCH"

# Get parent branch ID
PARENT_BRANCH_ID=$(curl -s \
  "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  | jq -r ".branches[] | select(.name == \"$PARENT_BRANCH\") | .id")

if [ -z "$PARENT_BRANCH_ID" ] || [ "$PARENT_BRANCH_ID" == "null" ]; then
  echo "❌ Error: Parent branch '$PARENT_BRANCH' not found"
  exit 1
fi

# Create new branch
RESPONSE=$(curl -s -X POST \
  "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"branch\": {
      \"name\": \"$BRANCH_NAME\",
      \"parent_id\": \"$PARENT_BRANCH_ID\"
    }
  }")

BRANCH_ID=$(echo $RESPONSE | jq -r '.branch.id')

if [ -z "$BRANCH_ID" ] || [ "$BRANCH_ID" == "null" ]; then
  echo "❌ Error: Failed to create branch"
  echo "$RESPONSE" | jq '.'
  exit 1
fi

echo "✅ Branch created successfully!"
echo "Branch ID: $BRANCH_ID"

# Get connection string
CONNECTION_INFO=$(curl -s \
  "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches/$BRANCH_ID" \
  -H "Authorization: Bearer $NEON_API_KEY")

CONNECTION_STRING=$(echo $CONNECTION_INFO | jq -r '.branch.connection_uris[0].connection_uri')

echo ""
echo "📝 Connection String:"
echo "$CONNECTION_STRING"
echo ""
echo "💡 Add to your .env file:"
echo "DATABASE_URL=\"$CONNECTION_STRING\""
