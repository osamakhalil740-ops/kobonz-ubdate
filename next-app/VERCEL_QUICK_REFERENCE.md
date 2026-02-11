# ⚡ Vercel Deployment - Quick Reference Card

## 🎯 Essential Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `next-app` |
| **Build Command** | `prisma generate && next build` |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` (default) |
| **Node.js Version** | 18.x |
| **Runtime** | Node.js (NOT Edge) |

---

## 🔐 Required Environment Variables (Priority Order)

### 🔴 Critical (Build will fail without these)

```bash
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/kobonz?sslmode=require
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

### 🟡 Important (Runtime features won't work)

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
GOOGLE_CLIENT_ID=your-google-client-id  # If using Google OAuth
GOOGLE_CLIENT_SECRET=your-google-client-secret  # If using Google OAuth
```

### 🟢 Optional (Enhanced features)

```bash
DIRECT_URL=postgresql://...  # For migrations
JWT_SECRET=<openssl rand -base64 32>
REDIS_URL=redis://...  # For background jobs
NEXT_PUBLIC_SENTRY_DSN=https://...  # Error monitoring
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=...
SENTRY_PROJECT=...
```

---

## 📋 Pre-Deployment Checklist

- [ ] Database migrations run: `DATABASE_URL="..." npx prisma migrate deploy`
- [ ] All 6 critical environment variables set in Vercel
- [ ] Repository pushed to GitHub
- [ ] Root directory set to `next-app`
- [ ] Build command set to `prisma generate && next build`

---

## 🚀 Deploy Now (3 Steps)

### Step 1: Import to Vercel
```
1. Go to: https://vercel.com/new
2. Import: https://github.com/osamakhalil740-ops/kobonz-ubdate.git
3. Framework: Next.js
4. Root Directory: next-app
```

### Step 2: Configure Build
```
Build Command: prisma generate && next build
Output Directory: (leave default)
Install Command: (leave default)
```

### Step 3: Add Environment Variables
```
Copy all 6 critical variables from above
Paste into Environment Variables section
Deploy!
```

---

## ✅ Post-Deployment Tests

```bash
# Health check
curl https://your-domain.vercel.app/api/health

# Test homepage
curl -I https://your-domain.vercel.app/

# Test API
curl https://your-domain.vercel.app/api/public/categories
```

---

## 🆘 Quick Fixes

**Build fails with Prisma error?**
→ Check DATABASE_URL is set and build command includes `prisma generate`

**"Can't resolve @prisma/client"?**
→ Build command must be: `prisma generate && next build`

**NextAuth not working?**
→ Verify NEXTAUTH_URL matches your actual domain (including https://)

**Redis errors?**
→ Use Upstash REST URLs, not standard Redis connection strings

**Environment variable not found?**
→ Redeploy after adding variables (they don't apply to running deployments)

---

## 📞 Get Services

- **Neon Database:** https://console.neon.tech (Free tier available)
- **Upstash Redis:** https://console.upstash.com (Free tier available)
- **Resend Email:** https://resend.com/api-keys (Free tier: 100 emails/day)
- **Sentry Monitoring:** https://sentry.io (Free tier available)

---

## 🎯 Total Time: ~15 minutes

**Deployment URL after success:**
`https://kobonz-ubdate.vercel.app` (or your custom domain)
