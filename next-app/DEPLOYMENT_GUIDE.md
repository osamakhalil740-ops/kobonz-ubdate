# 🚀 Kobonz Deployment Guide

**Complete guide for deploying Kobonz to production**

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with repository
- ✅ Vercel account
- ✅ Neon database account
- ✅ Upstash Redis account
- ✅ Resend email account
- ✅ (Optional) Sentry account

---

## 🎯 Quick Start (5 Steps)

### Step 1: Fork/Clone Repository

```bash
git clone https://github.com/your-org/kobonz.git
cd kobonz/next-app
npm install
```

### Step 2: Setup Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Note your Vercel Organization ID and Project ID
# You'll need these for GitHub Actions
```

### Step 3: Setup Neon Database

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project: "Kobonz"
3. Create branches:
   - `main` (automatically created)
   - `staging` (branch from main)
4. Get API key from Settings → API Keys
5. Copy connection strings

### Step 4: Configure Environment Variables

**In Vercel Dashboard:**

1. Go to your project → Settings → Environment Variables
2. Add for **Production**:
   ```
   DATABASE_URL=<neon-main-connection-string>
   DIRECT_URL=<neon-main-direct-connection-string>
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   NEXTAUTH_URL=https://your-domain.com
   UPSTASH_REDIS_REST_URL=<your-redis-url>
   UPSTASH_REDIS_REST_TOKEN=<your-redis-token>
   RESEND_API_KEY=<your-resend-key>
   RESEND_FROM_EMAIL=noreply@your-domain.com
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

3. Add for **Preview** (same values but with preview URLs)
4. Add for **Staging** (same as production but staging URLs/DB)

### Step 5: Setup GitHub Actions

1. Go to GitHub repository → Settings → Secrets
2. Add repository secrets:
   ```
   VERCEL_TOKEN=<from-vercel.com/account/tokens>
   VERCEL_ORG_ID=<from-vercel-link-output>
   VERCEL_PROJECT_ID=<from-vercel-link-output>
   NEON_API_KEY=<from-neon-api-keys>
   NEON_PROJECT_ID=<from-neon-project-settings>
   ```

3. (Optional) Add Sentry secrets:
   ```
   SENTRY_AUTH_TOKEN=<from-sentry>
   SENTRY_ORG=<your-org>
   SENTRY_PROJECT=kobonz-next
   ```

---

## 🌿 Database Setup

### Initial Migration

```bash
# Set your production database URL
export DATABASE_URL="your-production-database-url"

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or create migration
npm run db:migrate
```

### Create Database Branches

```bash
# Set Neon credentials
export NEON_API_KEY="your-api-key"
export NEON_PROJECT_ID="your-project-id"

# Create staging branch
npm run neon:branch:create staging main

# Create development branch
npm run neon:branch:create develop main
```

---

## 🔐 Security Setup

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate additional secrets if needed
openssl rand -hex 32
```

### Configure Sentry (Optional)

1. Create account at [sentry.io](https://sentry.io)
2. Create new project: "kobonz-next"
3. Get DSN from project settings
4. Add to environment variables
5. Configure `.sentryclirc`:
   ```ini
   [defaults]
   org=your-sentry-org
   project=kobonz-next

   [auth]
   token=your-sentry-auth-token
   ```

---

## 🚀 Deployment Process

### Deploy to Staging

```bash
# Push to staging branch
git checkout staging
git merge develop
git push origin staging

# → Automatic deployment to staging.kobonz.com
# → CI/CD runs automatically
# → Health checks performed
```

### Deploy to Production

**Option 1: Via GitHub Actions (Recommended)**

1. Go to GitHub Actions
2. Run "Promote Staging to Production"
3. Review and merge the created PR
4. Production deployment triggers automatically

**Option 2: Manual Merge**

```bash
# Merge staging to main
git checkout main
git merge staging
git push origin main

# → Automatic production deployment
```

**Option 3: Manual Deployment**

```bash
# Deploy directly with Vercel CLI
npm run deploy:production
```

---

## 🧪 Testing Before Production

### Pre-Deployment Checklist

```bash
# Run all checks
bash scripts/deploy-check.sh

# This checks:
# ✓ Node version
# ✓ Dependencies
# ✓ Environment variables
# ✓ TypeScript compilation
# ✓ Linting
# ✓ Prisma schema
# ✓ Build
# ✓ Security audit
```

### Test on Staging

1. Deploy to staging
2. Run smoke tests:
   ```bash
   bash scripts/post-deploy.sh https://staging.kobonz.com
   ```
3. Manual testing:
   - Test critical user flows
   - Test authentication
   - Test coupon creation
   - Test redemption
   - Check analytics
4. Monitor Sentry for errors

---

## 📊 Monitoring Setup

### Health Checks

```bash
# Production
curl https://kobonz.com/api/health

# Staging
curl https://staging.kobonz.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": 1707638400000,
  "checks": {
    "database": true,
    "redis": true
  }
}
```

### Setup Sentry Alerts

1. Go to Sentry project → Alerts
2. Create alert for:
   - Error rate > 1% (notify immediately)
   - New issue (notify after 5 occurrences)
   - Performance degradation
3. Configure notification channels (email, Slack)

### Setup Vercel Monitoring

1. Go to Vercel project → Analytics
2. Enable Web Analytics
3. Configure alerts for:
   - Deployment failures
   - Function errors
   - High response times

---

## 🔄 Rollback Procedure

### Quick Rollback

```bash
# Via GitHub Actions
1. Go to Actions → "Rollback Production"
2. Click "Run workflow"
3. Enter reason: "Critical bug in payment flow"
4. Click "Run workflow"

# → Previous deployment promoted
# → Incident issue created
# → Sentry notified
```

### Manual Rollback

```bash
# Install Vercel CLI if not already
npm install -g vercel

# List recent deployments
vercel ls --prod

# Promote previous deployment
vercel promote <deployment-url> --prod
```

---

## 🔧 Common Issues & Solutions

### Issue: Build Fails

**Solution:**
```bash
# Check build locally
npm run build

# Check environment variables
vercel env ls

# Check logs
vercel logs <deployment-url>
```

### Issue: Database Connection Fails

**Solution:**
```bash
# Verify DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
npx prisma db push --skip-generate

# Check Neon database status
# Visit console.neon.tech
```

### Issue: Preview Database Not Created

**Solution:**
```bash
# Check GitHub Actions logs
# Verify NEON_API_KEY and NEON_PROJECT_ID secrets

# Manually create preview branch
export NEON_API_KEY="your-key"
export NEON_PROJECT_ID="your-project"
npm run neon:branch:create preview-pr-123 staging
```

### Issue: Sentry Not Receiving Events

**Solution:**
```bash
# Verify DSN is set
echo $NEXT_PUBLIC_SENTRY_DSN

# Check Sentry CLI config
cat .sentryclirc

# Test Sentry manually
# Add to a page: throw new Error("Test error")
```

---

## 📈 Performance Optimization

### Enable Caching

```bash
# Cache warming after deployment
curl -X POST https://kobonz.com/api/cache/warm
```

### Configure CDN

1. Go to Vercel project settings
2. Enable Edge Network (automatic)
3. Configure custom domain
4. Enable HTTPS (automatic)

### Optimize Database

```bash
# Create database backup
npm run backup:database

# Optimize queries (if needed)
# Check slow query logs in Neon dashboard

# Enable connection pooling (already enabled in config)
```

---

## 🌐 Custom Domain Setup

### Add Custom Domain

1. Go to Vercel project → Settings → Domains
2. Add your domain: `kobonz.com`
3. Add staging subdomain: `staging.kobonz.com`
4. Configure DNS records (Vercel provides instructions)
5. Wait for SSL certificate (automatic)

### DNS Configuration

Add these records to your domain:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: staging
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

---

## 🔒 Security Hardening

### Enable Security Headers

Already configured in `next.config.js`:
- ✅ HSTS
- ✅ CSP
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options

### Configure Rate Limiting

Already configured via Redis:
- ✅ API endpoints
- ✅ Authentication routes
- ✅ Public endpoints

### Enable 2FA

1. GitHub: Enable 2FA
2. Vercel: Enable 2FA
3. Neon: Enable 2FA
4. Sentry: Enable 2FA

---

## 📦 Backup Strategy

### Automated Backups

Neon provides:
- ✅ Point-in-time recovery
- ✅ Automatic daily backups
- ✅ 7-day retention (free tier)

### Manual Backup

```bash
# Create backup before critical operations
npm run backup:database

# Backup is saved to backups/ directory
# Or creates Neon branch for restore
```

---

## 🎯 Launch Checklist

### Before Launch

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Staging fully tested
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Monitoring and alerts set up
- [ ] Backup strategy in place
- [ ] Error tracking configured
- [ ] Performance optimized
- [ ] Security headers verified

### Launch Day

- [ ] Deploy to production
- [ ] Run post-deployment checks
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify critical user flows
- [ ] Monitor database performance
- [ ] Check analytics
- [ ] Announce launch! 🎉

### Post-Launch

- [ ] Monitor for 24 hours
- [ ] Review Sentry errors
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Document any issues
- [ ] Plan next iteration

---

## 📞 Support

### Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Neon Docs:** [neon.tech/docs](https://neon.tech/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Sentry Docs:** [docs.sentry.io](https://docs.sentry.io)

### Getting Help

- **GitHub Issues:** Create issue in repository
- **Vercel Support:** support@vercel.com
- **Neon Support:** support@neon.tech

---

## 🎊 You're Ready!

Your Kobonz platform is now configured for production deployment with:

✅ Automated CI/CD  
✅ Multi-environment setup  
✅ Database branching  
✅ Error monitoring  
✅ Rollback capability  
✅ Security hardening  

**Deploy with confidence!** 🚀
