#!/bin/bash

################################################################################
# Phase 7 Safe Git Automation Script
# 
# This script safely commits and pushes Phase 7 files to the repository
# with comprehensive safety checks and validations.
#
# Repository: https://github.com/osamakhalil740-ops/kobonz-ubdate.git
# Branch: feature/phase-7-seo-performance-security
#
# Usage: bash scripts/push-phase-7.sh
################################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/osamakhalil740-ops/kobonz-ubdate.git"
BRANCH_NAME="feature/phase-7-seo-performance-security"
COMMIT_MESSAGE="feat(phase-7): add SEO, performance, and security optimizations (non-breaking)"

# Track if any errors occurred
ERRORS=0

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    ERRORS=$((ERRORS + 1))
}

print_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

confirm() {
    read -p "$(echo -e ${YELLOW}$1${NC}) [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Aborted by user${NC}"
        exit 1
    fi
}

################################################################################
# Main Execution
################################################################################

main() {
    clear
    echo -e "${BLUE}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   Phase 7: SEO, Performance & Security                           ║
║   Safe Git Automation Script                                     ║
║                                                                   ║
║   Repository: osamakhalil740-ops/kobonz-ubdate                   ║
║   Branch: feature/phase-7-seo-performance-security               ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    print_header "Pre-flight Checks"
    
    # Check if in correct directory
    if [ ! -f "package.json" ]; then
        print_error "Not in next-app directory"
        exit 1
    fi
    print_success "Running from correct directory"

    # Verify Phase 7 files exist
    print_header "Verifying Phase 7 Files"
    
    files=(
        "app/sitemap.ts"
        "app/robots.ts"
        "lib/seo.ts"
        "lib/cache.ts"
        "lib/rate-limit.ts"
        "lib/validation.ts"
        "lib/security.ts"
        "lib/monitoring.ts"
        "components/seo/structured-data.tsx"
        "components/gdpr/cookie-consent.tsx"
        "components/gdpr/data-deletion.tsx"
        "components/ui/optimized-image.tsx"
        "app/api/user/export-data/route.ts"
        "app/api/user/delete-account/route.ts"
        "app/api/health/route.ts"
        "app/privacy/page.tsx"
        "app/cookies/page.tsx"
        "middleware/rate-limit.ts"
        "PHASE_7_COMPLETE.md"
        "INSTALLATION_PHASE_7.md"
        "README_PHASE_7.md"
        "PHASE_7_SUMMARY.md"
    )

    local missing=0
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file"
        else
            print_error "Missing: $file"
            missing=$((missing + 1))
        fi
    done

    if [ $missing -gt 0 ]; then
        print_error "$missing files missing"
        exit 1
    fi

    # Build verification
    print_header "Build Verification"
    print_info "Running build..."
    if SKIP_ENV_VALIDATION=1 npm run build > /dev/null 2>&1; then
        print_success "Build successful"
    else
        print_error "Build failed"
        exit 1
    fi

    # Git operations
    print_header "Git Operations"
    
    git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"
    print_success "Branch: $BRANCH_NAME"

    # Stage files
    print_info "Staging Phase 7 files..."
    git add app/sitemap.ts app/robots.ts
    git add lib/seo.ts lib/cache.ts lib/rate-limit.ts lib/validation.ts lib/security.ts lib/monitoring.ts
    git add components/seo/ components/gdpr/ components/ui/optimized-image.tsx
    git add app/api/user/ app/api/health/
    git add app/privacy/ app/cookies/
    git add middleware/rate-limit.ts
    git add next.config.js middleware.ts
    git add PHASE_7_COMPLETE.md INSTALLATION_PHASE_7.md README_PHASE_7.md PHASE_7_SUMMARY.md

    git status --short
    confirm "Proceed with commit?"

    # Commit
    git commit -m "$COMMIT_MESSAGE" -m "
- Add dynamic sitemap and robots.txt
- Add SEO utilities and structured data
- Add Redis caching layer
- Add rate limiting system
- Add comprehensive input validation
- Add security utilities
- Add performance monitoring
- Add GDPR compliance (cookie consent, data export/delete)
- Add optimized image component
- Add security headers

All features are isolated and additive. Zero impact on existing code.
"
    print_success "Committed"

    # Push
    confirm "Push to remote?"
    git push -u origin "$BRANCH_NAME"
    print_success "Pushed successfully"

    print_header "Pull Request Instructions"
    echo "Create PR at: https://github.com/osamakhalil740-ops/kobonz-ubdate/pulls"
    echo "Title: Phase 7: SEO, Performance & Security (Non-Breaking)"
}

main
