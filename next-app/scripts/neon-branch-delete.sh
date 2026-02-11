#!/bin/bash

# Phase 9: Delete Neon Database Branch
# Usage: ./scripts/neon-branch-delete.sh <branch-name>

set -e

BRANCH_NAME=$1

if [ -z "$BRANCH_NAME" ]; then
  echo "❌ Error: Branch name is required"
  echo "Usage: ./scripts/neon-branch-delete.sh <branch-name>"
  exit 1
fi

if [ -z "$NEON_API_KEY" ]; then
  echo "❌ Error: NEON_API_KEY environment variable is not set"
  exit 1
fi

if [ -z "$NEON_PROJECT_ID" ]; then
  echo "❌ Error: NEON_PROJECT_ID environment variable is not set"
  exit 1
fi

# Prevent deleting main branches
if [ "$BRANCH_NAME" == "main" ] || [ "$BRANCH_NAME" == "staging" ]; then
  echo "❌ Error: Cannot delete protected branch '$BRANCH_NAME'"
  exit 1
fi

echo "🗑️  Deleting Neon database branch: $BRANCH_NAME"

# Get branch ID
BRANCH_ID=$(curl -s \
  "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  | jq -r ".branches[] | select(.name == \"$BRANCH_NAME\") | .id")

if [ -z "$BRANCH_ID" ] || [ "$BRANCH_ID" == "null" ]; then
  echo "❌ Error: Branch '$BRANCH_NAME' not found"
  exit 1
fi

# Delete branch
curl -s -X DELETE \
  "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches/$BRANCH_ID" \
  -H "Authorization: Bearer $NEON_API_KEY"

echo "✅ Branch deleted successfully!"
