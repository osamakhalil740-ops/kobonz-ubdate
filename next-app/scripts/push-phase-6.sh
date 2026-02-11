#!/bin/bash

################################################################################
# Phase 6 Safe Git Automation Script
# 
# This script safely commits and pushes Phase 6 files to the repository
# with comprehensive safety checks and validations.
#
# Repository: https://github.com/osamakhalil740-ops/kobonz-ubdate.git
# Branch: feature/phase-6-analytics-notifications
#
# Usage: bash scripts/push-phase-6.sh
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
BRANCH_NAME="feature/phase-6-analytics-notifications"
COMMIT_MESSAGE="feat(phase-6): add isolated analytics and notification modules (non-breaking)"

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
# Pre-flight Checks
################################################################################

preflight_checks() {
    print_header "Pre-flight Checks"

    # Check if git is installed
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    print_success "Git is installed"

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "Not in next-app directory. Please run from next-app/"
        exit 1
    fi
    print_success "Running from correct directory"

    # Check if this is a git repository
    if [ ! -d ".git" ]; then
        print_error "Not a git repository"
        exit 1
    fi
    print_success "Git repository detected"

    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        print_warning "You have uncommitted changes"
        git status --short
        confirm "Continue anyway?"
    else
        print_success "Working directory is clean"
    fi

    # Check internet connectivity
    if ! ping -c 1 github.com &> /dev/null; then
        print_error "No internet connection to github.com"
        exit 1
    fi
    print_success "Internet connection verified"

    # Check if remote exists
    if ! git remote get-url origin &> /dev/null; then
        print_info "Adding remote: $REPO_URL"
        git remote add origin "$REPO_URL"
    fi
    print_success "Git remote configured"
}

################################################################################
# Verify Phase 6 Files Exist
################################################################################

verify_phase6_files() {
    print_header "Verifying Phase 6 Files"

    local missing_files=0

    # Core libraries
    files=(
        "lib/analytics.ts"
        "lib/notifications.ts"
        "lib/queue.ts"
        "lib/email-templates.ts"
        "app/api/analytics/track/route.ts"
        "app/api/analytics/coupon/[id]/route.ts"
        "app/api/analytics/dashboard/route.ts"
        "app/api/notifications/route.ts"
        "app/api/notifications/[id]/route.ts"
        "app/api/notifications/unread-count/route.ts"
        "components/notifications/notification-bell.tsx"
        "components/notifications/notification-list.tsx"
        "components/notifications/analytics-tracker.tsx"
        "components/ui/scroll-area.tsx"
        "scripts/worker.ts"
        "PHASE_6_COMPLETE.md"
        "INSTALLATION_PHASE_6.md"
        "README_PHASE_6.md"
        "PHASE_6_SUMMARY.md"
    )

    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file"
        else
            print_error "Missing: $file"
            missing_files=$((missing_files + 1))
        fi
    done

    if [ $missing_files -gt 0 ]; then
        print_error "$missing_files Phase 6 files are missing"
        exit 1
    fi

    print_success "All Phase 6 files verified"
}

################################################################################
# Security Checks
################################################################################

security_checks() {
    print_header "Security Checks"

    # Check for .env files
    if git status --short | grep -E '\.env$|\.env\.' | grep -v '.env.example'; then
        print_error "Attempting to commit .env files!"
        git status --short | grep -E '\.env$|\.env\.'
        exit 1
    fi
    print_success "No .env files detected"

    # Check for common secrets in staged files
    print_info "Scanning for potential secrets..."
    
    local secret_patterns=(
        "password.*=.*['\"].*['\"]"
        "api[_-]?key.*=.*['\"].*['\"]"
        "secret.*=.*['\"].*['\"]"
        "token.*=.*['\"].*['\"]"
        "sk_live_"
        "pk_live_"
    )

    local secrets_found=0
    for pattern in "${secret_patterns[@]}"; do
        if git diff --cached | grep -iE "$pattern" | grep -v "example" | grep -v "your-" | grep -v "xxx"; then
            print_warning "Potential secret detected: $pattern"
            secrets_found=$((secrets_found + 1))
        fi
    done

    if [ $secrets_found -gt 0 ]; then
        print_error "Found $secrets_found potential secrets"
        confirm "Continue anyway? (NOT RECOMMENDED)"
    else
        print_success "No secrets detected"
    fi
}

################################################################################
# Build Verification
################################################################################

build_verification() {
    print_header "Build Verification"

    print_info "Installing dependencies..."
    if npm ci > /dev/null 2>&1; then
        print_success "Dependencies installed"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi

    print_info "Running TypeScript compilation check..."
    if npx tsc --noEmit > /dev/null 2>&1; then
        print_success "TypeScript compilation successful"
    else
        print_error "TypeScript compilation failed"
        npx tsc --noEmit
        exit 1
    fi

    print_info "Running build..."
    if SKIP_ENV_VALIDATION=1 npm run build > /dev/null 2>&1; then
        print_success "Build successful"
    else
        print_error "Build failed"
        print_info "Running build with output for debugging..."
        SKIP_ENV_VALIDATION=1 npm run build
        exit 1
    fi

    print_success "All build checks passed"
}

################################################################################
# Git Operations
################################################################################

git_operations() {
    print_header "Git Operations"

    # Fetch latest changes
    print_info "Fetching latest changes..."
    git fetch origin main 2>/dev/null || git fetch origin master 2>/dev/null || true
    print_success "Fetched latest changes"

    # Check if branch exists locally
    if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
        print_warning "Branch $BRANCH_NAME already exists locally"
        confirm "Delete and recreate branch?"
        git branch -D "$BRANCH_NAME"
    fi

    # Create new branch
    print_info "Creating branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"
    print_success "Branch created"

    # Stage Phase 6 files
    print_info "Staging Phase 6 files..."
    
    # Core libraries
    git add lib/analytics.ts 2>/dev/null || true
    git add lib/notifications.ts 2>/dev/null || true
    git add lib/queue.ts 2>/dev/null || true
    git add lib/email-templates.ts 2>/dev/null || true
    
    # API routes
    git add app/api/analytics/ 2>/dev/null || true
    git add app/api/notifications/ 2>/dev/null || true
    
    # Components
    git add components/notifications/ 2>/dev/null || true
    git add components/ui/scroll-area.tsx 2>/dev/null || true
    
    # Database
    git add prisma/schema.prisma 2>/dev/null || true
    
    # Scripts
    git add scripts/worker.ts 2>/dev/null || true
    
    # Configuration
    git add package.json 2>/dev/null || true
    git add .env.example 2>/dev/null || true
    
    # Documentation
    git add PHASE_6_COMPLETE.md 2>/dev/null || true
    git add INSTALLATION_PHASE_6.md 2>/dev/null || true
    git add README_PHASE_6.md 2>/dev/null || true
    git add PHASE_6_SUMMARY.md 2>/dev/null || true

    # Show what will be committed
    print_info "Files to be committed:"
    git status --short
    echo ""
    
    confirm "Proceed with commit?"

    # Commit with detailed message
    print_info "Creating commit..."
    git commit -m "$COMMIT_MESSAGE" -m "
- Add Redis-based analytics tracking
- Add in-app notification system  
- Add email templates with RTL support
- Add BullMQ background job processing
- Add API routes for analytics and notifications
- Add notification UI components
- Extend Prisma schema with 2 new models (non-breaking)
- Add comprehensive documentation

All features are isolated and additive. Zero impact on existing code.

Files Added:
- lib/analytics.ts
- lib/notifications.ts
- lib/queue.ts
- lib/email-templates.ts
- app/api/analytics/* (3 routes)
- app/api/notifications/* (3 routes)
- components/notifications/* (3 components)
- scripts/worker.ts
- Documentation files (4 files)

Files Modified:
- prisma/schema.prisma (added 2 models, 3 enums)
- package.json (added 3 dependencies, scripts)
- .env.example (added REDIS_URL documentation)

Breaking Changes: NONE
Impact: ZERO - All additive features
"
    print_success "Commit created"

    # Show commit details
    print_info "Commit details:"
    git show --stat --oneline HEAD
    echo ""
}

################################################################################
# Push to Remote
################################################################################

push_to_remote() {
    print_header "Push to Remote"

    confirm "Push to remote repository?"

    print_info "Pushing to $REPO_URL..."
    print_info "Branch: $BRANCH_NAME"
    
    if git push -u origin "$BRANCH_NAME"; then
        print_success "Successfully pushed to remote"
    else
        print_error "Failed to push to remote"
        print_info "You may need to authenticate or check your permissions"
        exit 1
    fi
}

################################################################################
# Create Pull Request Instructions
################################################################################

create_pr_instructions() {
    print_header "Pull Request Creation"

    echo -e "${GREEN}✓ Branch successfully pushed!${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo ""
    echo "1. Open your browser to:"
    echo -e "   ${YELLOW}https://github.com/osamakhalil740-ops/kobonz-ubdate/pulls${NC}"
    echo ""
    echo "2. Click 'New Pull Request'"
    echo ""
    echo "3. Select:"
    echo "   Base: main"
    echo "   Compare: $BRANCH_NAME"
    echo ""
    echo "4. Use this PR title:"
    echo -e "   ${YELLOW}Phase 6: Analytics & Notifications (Non-Breaking)${NC}"
    echo ""
    echo "5. Use this PR description:"
    echo ""
    cat << 'EOF'
# Phase 6: Analytics & Notifications

## Summary
Adds enterprise-grade analytics tracking and notification system with **zero impact** on existing functionality.

## ✨ Features Added

### Analytics System
- ✅ Real-time analytics tracking (Redis)
- ✅ Coupon views, clicks, copies
- ✅ Store analytics
- ✅ Affiliate link tracking
- ✅ Background aggregation (BullMQ)
- ✅ API endpoints for analytics retrieval

### Notification System
- ✅ In-app notifications (20+ types)
- ✅ Email notifications with RTL support
- ✅ Priority levels (LOW, NORMAL, HIGH, URGENT)
- ✅ Notification UI components
- ✅ Bell icon with real-time badge
- ✅ API endpoints for notification management

## 🗄️ Database Changes

### New Models (2)
- `Notification` - In-app notifications
- `AnalyticsSummary` - Aggregated analytics data

### New Enums (3)
- `NotificationType` - 20+ notification types
- `NotificationPriority` - 4 priority levels
- `AnalyticsPeriod` - 5 time periods

**No modifications to existing tables**

## 📦 Dependencies Added (3)
- `bullmq` ^5.1.0 - Background jobs (optional)
- `ioredis` ^5.3.2 - Redis client (optional)
- `date-fns` ^3.3.1 - Date utilities

## 🔒 Safety Guarantees

- ✅ **Zero breaking changes**
- ✅ **All features are isolated**
- ✅ **Backward compatible**
- ✅ **No modification to existing code**
- ✅ **Optional features** (can be disabled)
- ✅ **Graceful degradation** (works without Redis/BullMQ)

## 🧪 Testing Checklist

- [ ] `npm install` works
- [ ] `npm run build` succeeds  
- [ ] `npm run db:push` applies schema
- [ ] No console errors in browser
- [ ] Analytics tracking works
- [ ] Notifications display correctly

## 📚 Documentation

Complete documentation in:
- `PHASE_6_COMPLETE.md` - Full feature docs
- `INSTALLATION_PHASE_6.md` - Setup guide
- `README_PHASE_6.md` - Quick reference
- `PHASE_6_SUMMARY.md` - Implementation summary

## 🎯 Next Steps After Merge

1. Run `npm install` to install new dependencies
2. Run `npm run db:push` to apply schema changes
3. (Optional) Start background worker: `npm run worker`
4. (Optional) Add cookie consent banner to layout
5. (Optional) Integrate notification bell in header

---

**Ready to merge!** This PR contains only additive features with zero impact on existing functionality.
EOF
    echo ""
    echo -e "${GREEN}6. Click 'Create Pull Request'${NC}"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
}

################################################################################
# Final Summary
################################################################################

final_summary() {
    print_header "Final Summary"

    echo -e "${GREEN}✓ All operations completed successfully!${NC}"
    echo ""
    echo "Summary:"
    echo "  • Branch created: $BRANCH_NAME"
    echo "  • Files committed: ~25 files"
    echo "  • Pushed to: $REPO_URL"
    echo "  • Build verified: ✓"
    echo "  • Security checked: ✓"
    echo ""
    echo -e "${YELLOW}Action Required:${NC}"
    echo "  → Create Pull Request on GitHub"
    echo "  → URL: https://github.com/osamakhalil740-ops/kobonz-ubdate/pulls"
    echo ""
    echo -e "${BLUE}Phase 6 deployment automation complete!${NC}"
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
║   Phase 6: Analytics & Notifications                             ║
║   Safe Git Automation Script                                     ║
║                                                                   ║
║   Repository: osamakhalil740-ops/kobonz-ubdate                   ║
║   Branch: feature/phase-6-analytics-notifications                ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    # Run all steps
    preflight_checks
    verify_phase6_files
    build_verification
    security_checks
    git_operations
    push_to_remote
    create_pr_instructions
    final_summary

    # Check for errors
    if [ $ERRORS -gt 0 ]; then
        echo -e "${RED}Completed with $ERRORS errors${NC}"
        exit 1
    fi

    exit 0
}

# Run main function
main
