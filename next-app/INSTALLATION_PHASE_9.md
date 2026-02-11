# 🚀 Phase 9 Installation Guide

**Quick setup for CI/CD and deployment automation**

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd next-app
npm install
```

**New dependencies:**
- `@sentry/nextjs` - Error monitoring
- `@sentry/cli` - Sentry CLI tools

### Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

```bash
# Vercel
VERCEL_TOKEN              # Get from vercel.com/account/tokens
VERCEL_ORG_ID            # Run: vercel link (shows org ID)
VERCEL_PROJECT_ID        # Run: vercel link (shows project ID)

# Neon Database
NEON_API_KEY             # Get from console.neon.tech/app/settings/api-keys
NEON_PROJECT_ID          # From Neon project settings

# Sentry (Optional)
SENTRY_AUTH_TOKEN        # Get from sentry.io/settings/account/api/auth-tokens/
SENTRY_ORG               # Your org slug (e.g., "my-company")
SENTRY_PROJECT           # Your project slug (e.g., "kobonz-next")
```

### Step 3: Configure Vercel Environment Variables

Add environment variables in Vercel Dashboard for each environment:

**Production, Staging, and Preview:**

```bash
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SENTRY_DSN  # Optional
```

---

## ✅ What Works Immediately

After setup, you get:

### Automatic CI/CD
- ✅ Lint and type check on every push
- ✅ Build verification
- ✅ Security audits
- ✅ Automated deployments

### Preview Deployments
- ✅ Every PR gets a preview URL
- ✅ Preview database auto-created
- ✅ Auto-cleanup when PR closes

### Multi-Environment
- ✅ Production (main branch)
- ✅ Staging (staging branch)
- ✅ Preview (feature branches)

### Error Monitoring
- ✅ Real-time error tracking
- ✅ Performance monitoring
- ✅ Session replay on errors

---

## 🛠️ Manual Setup Commands

### Link Vercel Project

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
cd next-app
vercel link

# Note the org ID and project ID shown
```

### Setup Neon Branches

```bash
# Set credentials
export NEON_API_KEY="your-neon-api-key"
export NEON_PROJECT_ID="your-neon-project-id"

# Create staging branch
npm run neon:branch:create staging main

# Create development branch  
npm run neon:branch:create develop main
```

### Configure Sentry

```bash
# Edit .sentryclirc
nano .sentryclirc

# Update with your values:
[defaults]
org=your-sentry-org
project=kobonz-next

[auth]
token=your-sentry-auth-token
```

---

## 🧪 Test the Setup

### Test CI Pipeline

```bash
# Create test branch
git checkout -b test/ci-pipeline

# Make a change
echo "# Test" >> README.md
git add README.md
git commit -m "test: CI pipeline"

# Push to GitHub
git push origin test/ci-pipeline

# Create PR on GitHub
# → CI should run automatically
# → Check Actions tab for results
```

### Test Preview Deployment

```bash
# Push your branch
git push origin your-branch-name

# Create PR to main or staging
# → Vercel creates preview deployment
# → Neon creates preview database
# → Check PR for preview URL
```

### Test Staging Deployment

```bash
# Push to staging branch
git checkout staging
git merge your-feature
git push origin staging

# → Automatic deployment to staging
# → Check staging.kobonz.com
```

---

## 📋 GitHub Actions Workflows

### Enabled Automatically

1. **CI** - Runs on every push/PR
   - Lint & type check
   - Build verification
   - Security audit

2. **Test** - Runs on every push/PR
   - Unit tests
   - Integration tests with PostgreSQL & Redis

3. **E2E** - Runs on main/staging push
   - Playwright end-to-end tests
   - Screenshots on failure

4. **Deploy Production** - Runs on main push
   - Pre-deployment checks
   - Deploy to Vercel
   - Post-deployment verification

5. **Deploy Staging** - Runs on staging push
   - Deploy to staging environment
   - Smoke tests

6. **Neon Preview Branch** - Runs on PR open/close
   - Create preview database
   - Auto-delete on PR close

### Manual Workflows

7. **Promote Staging to Production**
   - Manual trigger from Actions tab
   - Creates release PR
   - Includes checklist

8. **Rollback Production**
   - Emergency rollback
   - Creates incident issue
   - One-click operation

---

## 🔧 Configuration Files

### Created Files

- ✅ `vercel.json` - Vercel config
- ✅ `.env.production.example` - Prod template
- ✅ `.env.staging.example` - Staging template
- ✅ `.env.preview.example` - Preview template
- ✅ `.github/workflows/*` - 8 workflows
- ✅ `.neon/database.yml` - DB config
- ✅ `sentry.*.config.ts` - Sentry configs
- ✅ `scripts/*.sh` - Deployment scripts

### Modified Files

- ✅ `package.json` - Added scripts and dependencies
- ✅ `.gitignore` - Already configured

---

## 🚀 Deployment Flow

### Standard Flow

```
1. Feature Development
   └─> Create feature branch
   └─> Make changes
   └─> Push to GitHub
   └─> CI runs automatically

2. Preview Testing
   └─> Create PR
   └─> Preview deployment created
   └─> Preview database created
   └─> Test on preview URL

3. Staging Testing
   └─> Merge to staging
   └─> Staging deployment automatic
   └─> Test on staging.kobonz.com
   └─> QA verification

4. Production Release
   └─> Run "Promote Staging" workflow
   └─> Review release PR
   └─> Merge to main
   └─> Production deployment automatic
   └─> Monitor in Sentry
```

---

## 🔍 Verification

### Check CI/CD Works

```bash
# 1. Check GitHub Actions
# Go to repository → Actions tab
# Should see workflows listed

# 2. Check Vercel integration
vercel ls

# 3. Check Neon branches
# Visit console.neon.tech
# Should see: main, staging, and any preview branches

# 4. Check Sentry (if configured)
# Visit sentry.io
# Should see project "kobonz-next"
```

### Run Health Checks

```bash
# After deployment
bash scripts/post-deploy.sh https://your-deployment-url.vercel.app

# Checks:
# ✓ Health endpoint
# ✓ Sitemap
# ✓ Robots.txt
# ✓ Critical pages
# ✓ API endpoints
```

---

## 🆘 Troubleshooting

### Workflow Fails

```bash
# Check workflow logs in GitHub Actions
# Common issues:

# 1. Missing secrets
# → Add all required secrets in GitHub settings

# 2. Vercel deployment fails
# → Check Vercel dashboard for build logs
# → Verify environment variables

# 3. Database connection fails
# → Check DATABASE_URL is correct
# → Verify Neon database is active
```

### Preview Database Not Created

```bash
# 1. Check Neon API credentials
echo $NEON_API_KEY
echo $NEON_PROJECT_ID

# 2. Check GitHub Actions logs for "Neon Preview Branch" workflow

# 3. Manually create if needed
npm run neon:branch:create preview-test staging
```

### Sentry Not Working

```bash
# 1. Verify DSN is set
echo $NEXT_PUBLIC_SENTRY_DSN

# 2. Check Sentry config files exist
ls -la sentry.*.config.ts

# 3. Test with an error
# Add to any page: throw new Error("Test")
```

---

## 📊 What You Get

### Automation
- ✅ CI/CD pipeline
- ✅ Automated testing
- ✅ Automated deployments
- ✅ Database branching

### Environments
- ✅ Production (kobonz.com)
- ✅ Staging (staging.kobonz.com)
- ✅ Preview (per-PR URLs)

### Monitoring
- ✅ Error tracking (Sentry)
- ✅ Performance monitoring
- ✅ Health checks
- ✅ Deployment tracking

### Safety
- ✅ Pre-deployment checks
- ✅ Rollback capability
- ✅ Database backups
- ✅ Preview testing

---

## 📚 Documentation

- **Complete Guide:** `PHASE_9_COMPLETE.md`
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **This File:** Quick installation

---

## ✅ Checklist

Before you're fully ready:

- [ ] Dependencies installed (`npm install`)
- [ ] Vercel project linked (`vercel link`)
- [ ] GitHub secrets configured
- [ ] Vercel env vars configured
- [ ] Neon branches created
- [ ] Sentry configured (optional)
- [ ] Test PR created and verified
- [ ] Staging deployment tested
- [ ] Health checks passing

---

## 🎊 You're Done!

Phase 9 is ready! You now have:

✅ **Automated CI/CD**  
✅ **Multi-environment deployments**  
✅ **Database branching**  
✅ **Error monitoring**  
✅ **Rollback capability**  

**Start deploying with confidence!** 🚀
