#!/bin/bash

# Phase 9: Pre-deployment Checklist Script
# Runs before deploying to ensure everything is ready

set -e

echo "🔍 Running pre-deployment checks..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# Function to check command
check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $1"
  else
    echo -e "${RED}✗${NC} $1"
    FAILED=1
  fi
}

# 1. Check Node version
echo "1️⃣  Checking Node.js version..."
node -v | grep -q "v20" || node -v | grep -q "v18"
check "Node.js version (18 or 20 required)"
echo ""

# 2. Install dependencies
echo "2️⃣  Installing dependencies..."
npm ci > /dev/null 2>&1
check "Dependencies installed"
echo ""

# 3. Environment variables
echo "3️⃣  Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
  echo -e "${YELLOW}⚠${NC}  DATABASE_URL not set"
else
  echo -e "${GREEN}✓${NC} DATABASE_URL set"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo -e "${YELLOW}⚠${NC}  NEXTAUTH_SECRET not set"
else
  echo -e "${GREEN}✓${NC} NEXTAUTH_SECRET set"
fi

if [ -z "$UPSTASH_REDIS_REST_URL" ]; then
  echo -e "${YELLOW}⚠${NC}  UPSTASH_REDIS_REST_URL not set"
else
  echo -e "${GREEN}✓${NC} UPSTASH_REDIS_REST_URL set"
fi
echo ""

# 4. TypeScript check
echo "4️⃣  Type checking..."
npx tsc --noEmit > /dev/null 2>&1
check "TypeScript compilation"
echo ""

# 5. Linting
echo "5️⃣  Running linter..."
npm run lint > /dev/null 2>&1
check "ESLint passed"
echo ""

# 6. Prisma check
echo "6️⃣  Validating Prisma schema..."
npx prisma validate > /dev/null 2>&1
check "Prisma schema valid"
echo ""

# 7. Build check
echo "7️⃣  Building application..."
SKIP_ENV_VALIDATION=1 npm run build > /dev/null 2>&1
check "Build successful"
echo ""

# 8. Security audit
echo "8️⃣  Running security audit..."
npm audit --audit-level=high > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} No high/critical vulnerabilities"
else
  echo -e "${YELLOW}⚠${NC}  Vulnerabilities found (check with 'npm audit')"
fi
echo ""

# Final result
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Please fix before deploying.${NC}"
  exit 1
fi
