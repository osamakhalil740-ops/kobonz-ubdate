# 🚀 Phase 7 Installation Guide

**Quick setup guide for Phase 7: SEO, Performance & Security**

---

## ⚡ Quick Start (2 minutes)

Phase 7 requires **NO** installation steps! All features are ready to use immediately.

### ✅ What's Already Working

- ✅ SEO (sitemap, robots.txt, metadata)
- ✅ Performance (caching, image optimization)
- ✅ Security (rate limiting, validation, headers)
- ✅ GDPR (cookie consent, data export)
- ✅ Monitoring (health checks, error tracking)

---

## 📋 Optional Integrations

### 1. Add Cookie Consent Banner

**In `app/layout.tsx`:**

```tsx
import { CookieConsent } from "@/components/gdpr/cookie-consent"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
```

### 2. Add Structured Data to Pages

**Example for coupon page:**

```tsx
import { generateCouponSchema } from "@/lib/seo"
import { StructuredData } from "@/components/seo/structured-data"

export default async function CouponPage({ params }) {
  const coupon = await getCoupon(params.id)
  
  const schema = generateCouponSchema({
    id: coupon.id,
    title: coupon.title,
    description: coupon.description,
    storeName: coupon.store.name,
    validThrough: coupon.endDate,
  })

  return (
    <>
      <StructuredData data={schema} />
      <div>{/* Your page content */}</div>
    </>
  )
}
```

### 3. Add Data Management to Settings

**In settings page:**

```tsx
import { DataDeletion } from "@/components/gdpr/data-deletion"

export default function SettingsPage() {
  return (
    <div>
      <h1>Account Settings</h1>
      <DataDeletion />
    </div>
  )
}
```

---

## 🧪 Verification

### Test SEO Features

```bash
# Check sitemap
curl http://localhost:3001/sitemap.xml

# Check robots.txt
curl http://localhost:3001/robots.txt

# View page source and verify meta tags
# Open any page and view source (Ctrl+U)
```

### Test Performance

```bash
# Run Lighthouse audit
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Run audit
```

### Test Security

```bash
# Check security headers
curl -I http://localhost:3001

# Test rate limiting (make 100+ requests)
for i in {1..100}; do curl http://localhost:3001/api/some-endpoint; done
```

### Test GDPR

1. Open your app in incognito mode
2. Cookie banner should appear
3. Test preferences customization
4. Navigate to settings and test data export/deletion

### Test Monitoring

```bash
# Check health endpoint
curl http://localhost:3001/api/health
```

---

## 📊 Performance Optimization Tips

### 1. Enable Caching

Caching is automatic, but you can warm the cache:

```typescript
import { warmCache } from "@/lib/cache"

// Call on app startup or via cron
await warmCache()
```

### 2. Use Optimized Images

```tsx
import { OptimizedImage } from "@/components/ui/optimized-image"

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
/>
```

### 3. Apply Rate Limiting

```typescript
import { withRateLimit, RateLimits } from "@/lib/rate-limit"

export const POST = withRateLimit(
  async (request) => {
    // Handler
  },
  RateLimits.write
)
```

---

## 🔒 Security Best Practices

### 1. Validate All Inputs

```typescript
import { validateBody, createCouponSchema } from "@/lib/validation"

export async function POST(request: Request) {
  const validation = await validateBody(request, createCouponSchema)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }
  // Use validation.data
}
```

### 2. Use Security Utilities

```typescript
import { sanitizeHtml, isValidEmail } from "@/lib/security"

const cleanInput = sanitizeHtml(userInput)
const validEmail = isValidEmail(email)
```

---

## 📈 Monitoring Setup

### View Performance Metrics

```typescript
import { performanceMonitor } from "@/lib/monitoring"

// Get summary
const summary = performanceMonitor.getSummary()
console.log(summary)
```

### Track Errors

```typescript
import { errorTracker } from "@/lib/monitoring"

// Log error
errorTracker.log(
  new Error("Something went wrong"),
  "high",
  { userId: "123" }
)

// Get recent errors
const errors = errorTracker.getErrors()
```

---

## 🌐 Production Deployment

### Environment Variables (Optional)

All features work with existing variables. No new variables needed!

### Pre-Deployment Checklist

- [ ] Test sitemap: `/sitemap.xml`
- [ ] Test robots.txt: `/robots.txt`
- [ ] Run Lighthouse audit (aim for 90+)
- [ ] Test cookie consent banner
- [ ] Verify security headers
- [ ] Test rate limiting
- [ ] Check health endpoint: `/api/health`

### Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start

# Or deploy to Vercel
vercel --prod
```

---

## 🆘 Troubleshooting

### Sitemap not generating?
- Check that coupons/stores exist in database
- Verify Prisma client is working
- Check console for errors

### Cookie banner not showing?
- Check browser localStorage (clear if testing)
- Verify component is imported in layout
- Check console for errors

### Rate limiting not working?
- Verify Redis is connected (UPSTASH_REDIS_REST_URL)
- Check console for rate limit errors
- Rate limiter fails open (allows requests if Redis fails)

### Images not optimizing?
- Use `OptimizedImage` component or Next.js `Image`
- Verify image URLs are accessible
- Check next.config.js image configuration

---

## 📚 Additional Resources

- **Full Documentation:** `PHASE_7_COMPLETE.md`
- **Quick Reference:** `README_PHASE_7.md`
- **Code Examples:** See documentation files

---

## ✅ You're Done!

Phase 7 is ready to use with **zero configuration required**. All features are production-ready and backward compatible.

**Start using:**
- ✅ SEO optimizations (automatic)
- ✅ Performance caching (automatic)
- ✅ Security features (automatic)
- ✅ GDPR components (optional UI integration)
- ✅ Monitoring tools (available)

No database migrations, no new dependencies, no breaking changes!
