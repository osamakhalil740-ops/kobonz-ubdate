#!/bin/bash

# Phase 9: Post-deployment Script
# Runs after deployment to verify and warm up the application

set -e

DEPLOYMENT_URL=${1:-https://kobonz.com}

echo "🚀 Post-deployment tasks for: $DEPLOYMENT_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Health check
echo "1️⃣  Running health check..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/health")

if [ "$HEALTH_RESPONSE" -eq 200 ]; then
  echo -e "${GREEN}✓${NC} Health check passed (HTTP 200)"
else
  echo -e "${RED}✗${NC} Health check failed (HTTP $HEALTH_RESPONSE)"
  exit 1
fi
echo ""

# 2. Check sitemap
echo "2️⃣  Checking sitemap..."
SITEMAP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/sitemap.xml")

if [ "$SITEMAP_RESPONSE" -eq 200 ]; then
  echo -e "${GREEN}✓${NC} Sitemap accessible"
else
  echo -e "${YELLOW}⚠${NC}  Sitemap returned HTTP $SITEMAP_RESPONSE"
fi
echo ""

# 3. Check robots.txt
echo "3️⃣  Checking robots.txt..."
ROBOTS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/robots.txt")

if [ "$ROBOTS_RESPONSE" -eq 200 ]; then
  echo -e "${GREEN}✓${NC} Robots.txt accessible"
else
  echo -e "${YELLOW}⚠${NC}  Robots.txt returned HTTP $ROBOTS_RESPONSE"
fi
echo ""

# 4. Warm cache (optional)
echo "4️⃣  Warming cache..."
curl -s "$DEPLOYMENT_URL/" > /dev/null || true
curl -s "$DEPLOYMENT_URL/marketplace" > /dev/null || true
curl -s "$DEPLOYMENT_URL/coupons" > /dev/null || true
echo -e "${GREEN}✓${NC} Cache warming initiated"
echo ""

# 5. Check critical pages
echo "5️⃣  Checking critical pages..."

PAGES=("/" "/marketplace" "/coupons" "/stores")
for PAGE in "${PAGES[@]}"; do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL$PAGE")
  if [ "$RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✓${NC} $PAGE (HTTP 200)"
  else
    echo -e "${RED}✗${NC} $PAGE (HTTP $RESPONSE)"
  fi
done
echo ""

# 6. Check API endpoints
echo "6️⃣  Checking API endpoints..."

API_ENDPOINTS=("/api/health" "/api/public/categories" "/api/public/stores")
for ENDPOINT in "${API_ENDPOINTS[@]}"; do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL$ENDPOINT")
  if [ "$RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✓${NC} $ENDPOINT (HTTP 200)"
  else
    echo -e "${YELLOW}⚠${NC}  $ENDPOINT (HTTP $RESPONSE)"
  fi
done
echo ""

# Final result
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Post-deployment checks completed!${NC}"
echo ""
echo "🌐 Deployment URL: $DEPLOYMENT_URL"
echo "📊 Monitor: https://sentry.io"
echo "📈 Analytics: https://vercel.com/dashboard"
