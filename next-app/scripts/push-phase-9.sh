#!/bin/bash

################################################################################
# Phase 9 Safe Git Automation Script
# 
# This script safely commits and pushes Phase 9 files to the repository
# with comprehensive safety checks and validations.
#
# Repository: https://github.com/osamakhalil740-ops/kobonz-ubdate.git
# Branch: feature/phase-9-deployment-cicd
#
# Usage: bash scripts/push-phase-9.sh
################################################################################

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
REPO_URL="https://github.com/osamakhalil740-ops/kobonz-ubdate.git"
BRANCH_NAME="feature/phase-9-deployment-cicd"
COMMIT_MESSAGE="feat(phase-9): add CI/CD, deployment automation, and monitoring (non-breaking)"

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
║   Phase 9: Deployment & CI/CD                                    ║
║   Safe Git Automation Script                                     ║
║                                                                   ║
║   Repository: osamakhalil740-ops/kobonz-ubdate                   ║
║   Branch: feature/phase-9-deployment-cicd                        ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    print_header "Pre-flight Checks"
    
    if [ ! -f "package.json" ]; then
        print_error "Not in next-app directory"
        exit 1
    fi
    print_success "Running from correct directory"

    # Verify Phase 9 files
    print_header "Verifying Phase 9 Files"
    
    files=(
        "vercel.json"
        ".env.production.example"
        ".env.staging.example"
        ".env.preview.example"
        ".github/workflows/ci.yml"
        ".github/workflows/test.yml"
        ".github/workflows/e2e.yml"
        ".github/workflows/deploy-production.yml"
        ".github/workflows/deploy-staging.yml"
        ".github/workflows/promote-staging-to-production.yml"
        ".github/workflows/rollback-production.yml"
        ".github/workflows/neon-preview-branch.yml"
        ".neon/database.yml"
        "scripts/neon-branch-create.sh"
        "scripts/neon-branch-delete.sh"
        "scripts/deploy-check.sh"
        "scripts/post-deploy.sh"
        "scripts/backup-database.sh"
        "sentry.client.config.ts"
        "sentry.server.config.ts"
        "sentry.edge.config.ts"
        ".sentryclirc"
        "PHASE_9_COMPLETE.md"
        "DEPLOYMENT_GUIDE.md"
        "INSTALLATION_PHASE_9.md"
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

    # Security check - ensure no secrets
    print_header "Security Checks"
    if git diff --cached | grep -iE 'VERCEL_TOKEN|NEON_API_KEY|SENTRY.*TOKEN' | grep -v 'your-'; then
        print_error "Potential secrets detected!"
        exit 1
    fi
    print_success "No secrets detected"

    # Git operations
    print_header "Git Operations"
    
    git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"
    print_success "Branch: $BRANCH_NAME"

    # Stage files
    print_info "Staging Phase 9 files..."
    git add vercel.json .env.*.example
    git add .github/workflows/
    git add .neon/
    git add scripts/neon-branch-*.sh scripts/deploy-check.sh scripts/post-deploy.sh scripts/backup-database.sh
    git add sentry.*.config.ts .sentryclirc
    git add package.json
    git add PHASE_9_COMPLETE.md DEPLOYMENT_GUIDE.md INSTALLATION_PHASE_9.md

    git status --short
    confirm "Proceed with commit?"

    # Commit
    git commit -m "$COMMIT_MESSAGE" -m "
- Add Vercel deployment configuration
- Add 8 GitHub Actions workflows (CI, test, E2E, deploy, promote, rollback)
- Add Neon database branching strategy
- Add deployment automation scripts
- Add Sentry error monitoring integration
- Add comprehensive deployment documentation

All features are configuration-only. Zero impact on existing code.
"
    print_success "Committed"

    # Push
    confirm "Push to remote?"
    git push -u origin "$BRANCH_NAME"
    print_success "Pushed successfully"

    print_header "Pull Request Instructions"
    echo "Create PR at: https://github.com/osamakhalil740-ops/kobonz-ubdate/pulls"
    echo "Title: Phase 9: Deployment & CI/CD Automation (Non-Breaking)"
}

main
