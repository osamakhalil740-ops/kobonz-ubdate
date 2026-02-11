# 🚀 Vercel Deployment Checklist - Kobonz Next.js App

## ⚙️ Vercel Project Settings

### 1. Framework Preset
```
Framework Preset: Next.js
```

### 2. Root Directory
```
Root Directory: next-app
```
**Important:** Your Next.js app is inside the `next-app/` folder, NOT at the repository root.

### 3. Build Command
```
Build Command: prisma generate && next build
```
**Why:** Prisma Client must be generated before Next.js builds, as it's imported throughout the app.

### 4. Output Directory
```
Output Directory: (leave default - .next)
```
No need to change this - Next.js automatically uses `.next`.

### 5. Install Command
```
Install Command: npm install
```
Default is fine - no custom install needed.

---

## 🔐 Environment Variables (REQUIRED)

### Priority 1: Build-Time Variables (REQUIRED for build)

These **MUST** be set before deployment or the build will fail:

```bash
# Database - REQUIRED FOR BUILD
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/kobonz?sslmode=require

# NextAuth Secret - REQUIRED FOR BUILD  
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# App URL - REQUIRED FOR BUILD
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app

# Redis - REQUIRED FOR BUILD (session caching)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

**How to generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Priority 2: Runtime Variables (needed after build)

These are needed for the app to function properly at runtime:

```bash
# Email Service (Resend) - for email verification, password reset
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Google OAuth (if using Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Priority 3: Optional Variables

```bash
# Node Environment (auto-set by Vercel, but can override)
NODE_ENV=production

# Neon Direct URL (for migrations - optional in production)
DIRECT_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/kobonz?sslmode=require

# JWT Configuration (has defaults, but recommended to set)
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=30d

# BullMQ Redis (optional - for background jobs)
# Note: This is different from Upstash Redis above
# If not set, background job queues will be disabled
REDIS_URL=redis://default:password@xxx.upstash.io:6379

# Sentry (Error Monitoring - optional but recommended)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=kobonz-next

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Build optimization (optional)
SKIP_ENV_VALIDATION=1
```

---

## 🗄️ Database Setup (Neon PostgreSQL)

### Step 1: Get Database Connection String

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project or use existing
3. Copy the connection string (it looks like):
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/kobonz?sslmode=require
   ```

### Step 2: Run Migrations

**IMPORTANT:** You MUST run migrations before first deployment.

```bash
# Option A: Run locally first (recommended)
cd next-app
DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy

# Option B: Use Neon SQL Editor
# Copy and run the migrations from: next-app/prisma/migrations_phase5.sql
```

### Step 3: Verify Schema
```bash
DATABASE_URL="your-neon-connection-string" npx prisma db pull
```

### ⚠️ Critical: Neon Settings

- **Connection Pooling:** Use direct connection string (not pooled) for migrations
- **SSL Mode:** Always use `?sslmode=require` at the end of connection string
- **Compute Auto-suspend:** Set to "Never" for production (or at least 5 minutes)

---

## 📦 Redis Setup (Upstash)

### Primary Redis (Upstash - for sessions, REQUIRED)

1. Go to [Upstash Console](https://console.upstash.com)
2. Create a new Redis database (select region close to your Neon DB)
3. Copy the REST API credentials:
   - `UPSTASH_REDIS_REST_URL` = REST URL
   - `UPSTASH_REDIS_REST_TOKEN` = REST Token

### Secondary Redis (BullMQ - for background jobs, OPTIONAL)

If you want background jobs (earnings processing, email queues):

1. Create another Redis database in Upstash
2. Copy the connection string (starts with `redis://`)
3. Set as `REDIS_URL`

**Note:** If you don't set `REDIS_URL`, the app will work but background jobs will be disabled.

---

## 📧 Email Setup (Resend)

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create API Key
3. Add and verify your domain
4. Set environment variables:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

**Required for:**
- Email verification
- Password reset
- Notifications

---

## 🔍 Error Monitoring (Sentry - Optional but Recommended)

1. Go to [Sentry.io](https://sentry.io)
2. Create new project (select Next.js)
3. Copy DSN and auth token
4. Add to environment variables

**Benefits:**
- Real-time error tracking
- Performance monitoring
- Session replay
- User feedback

---

## ⚡ Runtime Configuration

### Node.js Runtime
```
Runtime: Node.js 18.x (default)
```
**Do NOT use Edge Runtime** - Prisma requires Node.js runtime.

### Serverless Function Regions
```
Region: iad1 (US East - same as Neon recommended region)
```
This is set in `vercel.json` - matches your database region for best performance.

### Serverless Function Timeout
```
Timeout: 10s (default)
```
Increase to 60s if you have long-running API routes.

---

## 📋 Pre-Deployment Checklist

### Before First Deploy:

- [ ] **Repository pushed to GitHub**
  ```bash
  git push origin main
  ```

- [ ] **Database migrations run**
  ```bash
  DATABASE_URL="..." npx prisma migrate deploy
  ```

- [ ] **All REQUIRED environment variables set in Vercel**
  - DATABASE_URL
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL
  - NEXT_PUBLIC_APP_URL
  - UPSTASH_REDIS_REST_URL
  - UPSTASH_REDIS_REST_TOKEN

- [ ] **Domain configured (if using custom domain)**
  - Add domain in Vercel
  - Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL

- [ ] **SSL Certificate active**
  - Vercel handles this automatically

### Build Settings Verification:

- [ ] Root Directory: `next-app`
- [ ] Build Command: `prisma generate && next build`
- [ ] Framework: Next.js
- [ ] Node Version: 18.x

---

## 🚀 Deployment Steps

### Method 1: Vercel Dashboard (Recommended for first deploy)

1. **Import Repository**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import Git Repository: `https://github.com/osamakhalil740-ops/kobonz-ubdate.git`

2. **Configure Project**
   - Framework Preset: `Next.js`
   - Root Directory: `next-app`
   - Build Command: `prisma generate && next build`

3. **Add Environment Variables**
   - Copy all required variables from Priority 1 section above
   - Use "Environment Variables" section in Vercel settings
   - Paste each variable one by one

4. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes for build
   - Check deployment logs

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd next-app
vercel link

# Set environment variables (one by one)
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
# ... add all required variables

# Deploy
vercel --prod
```

---

## ✅ Post-Deployment Verification

### 1. Health Check
```bash
curl https://your-domain.vercel.app/api/health
# Should return: {"status": "ok", "timestamp": "..."}
```

### 2. Database Connection
Check logs in Vercel dashboard for Prisma connection errors.

### 3. Test Critical Routes
- [ ] Homepage: `https://your-domain.vercel.app/`
- [ ] Marketplace: `https://your-domain.vercel.app/marketplace`
- [ ] Login: `https://your-domain.vercel.app/auth/login`
- [ ] API: `https://your-domain.vercel.app/api/public/categories`

### 4. Test Authentication
- [ ] Register new account
- [ ] Check email verification (if Resend configured)
- [ ] Login
- [ ] Access dashboard

### 5. Monitor Errors
- Check Vercel logs
- Check Sentry dashboard (if configured)

---

## 🔧 Common Issues & Solutions

### Issue 1: "PrismaClient is unable to run in this browser environment"
**Solution:** Make sure you're NOT using Edge Runtime. Check that:
- No `export const runtime = 'edge'` in API routes
- No `export const config = { runtime: 'edge' }` in pages

### Issue 2: "Environment variable DATABASE_URL not found"
**Solution:** 
- Verify environment variable is set in Vercel dashboard
- Redeploy after adding variables
- Check variable name spelling (case-sensitive)

### Issue 3: "Module not found: Can't resolve '@prisma/client'"
**Solution:** Build command must include `prisma generate`:
```bash
prisma generate && next build
```

### Issue 4: Build fails with Prisma errors
**Solution:**
- Ensure DATABASE_URL is available at build time
- Check database is accessible from Vercel's region
- Verify Neon database is not paused

### Issue 5: NextAuth session not working
**Solution:**
- Verify NEXTAUTH_URL matches your actual domain
- Check NEXTAUTH_SECRET is set (minimum 32 characters)
- Ensure cookies are allowed in browser

### Issue 6: Redis connection fails
**Solution:**
- Use Upstash REST API URLs (not standard Redis URLs)
- Verify tokens are correct
- Check Upstash database is active

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Production:** Push to `main` branch
- **Preview:** Push to any other branch or create PR

### GitHub Integration Settings (from vercel.json):
- ✅ Auto-deploy on push to `main`
- ✅ Preview deployments for PRs
- ✅ Auto-cancel outdated deployments

---

## 📊 Monitoring & Maintenance

### Daily Checks:
- [ ] Vercel deployment status
- [ ] Error rate in Sentry
- [ ] Database usage in Neon

### Weekly Checks:
- [ ] Review Vercel analytics
- [ ] Check serverless function metrics
- [ ] Review error logs

### Monthly Checks:
- [ ] Database backup verification
- [ ] SSL certificate renewal (auto)
- [ ] Dependency updates

---

## 🆘 Emergency Rollback

If deployment fails or has critical issues:

```bash
# Option 1: Vercel Dashboard
# Go to Deployments > Previous deployment > Promote to Production

# Option 2: Vercel CLI
vercel rollback
```

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma on Vercel:** https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Neon + Vercel:** https://neon.tech/docs/guides/vercel

---

## ✨ Production Optimizations (Already Configured)

Your app already includes these production optimizations:

✅ **Image Optimization** - Next.js Image component with AVIF/WebP
✅ **Security Headers** - HSTS, CSP, X-Frame-Options, etc.
✅ **Console Removal** - Automatic console.log removal in production
✅ **Compression** - Gzip/Brotli enabled
✅ **Cache Headers** - Static assets cached for 1 year
✅ **Code Splitting** - Automatic by Next.js
✅ **Bundle Analysis** - Run `npm run analyze` to check

---

## 🎯 Summary: Quick Start

**Minimum required to deploy:**

1. Set Root Directory: `next-app`
2. Set Build Command: `prisma generate && next build`
3. Add 6 environment variables:
   - DATABASE_URL (from Neon)
   - NEXTAUTH_SECRET (generate with openssl)
   - NEXTAUTH_URL (your Vercel domain)
   - NEXT_PUBLIC_APP_URL (your Vercel domain)
   - UPSTASH_REDIS_REST_URL (from Upstash)
   - UPSTASH_REDIS_REST_TOKEN (from Upstash)
4. Run database migrations
5. Click Deploy

**Total time:** ~15 minutes for first deployment

---

**Last Updated:** 2024-02-11
**App Version:** Phase 9 Complete
**Deployment Target:** Vercel (Recommended)
