# 🚀 Phase 6 Installation Guide

**Quick setup guide for Phase 6: Analytics & Notifications**

---

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd next-app
npm install
```

### 2. Update Database

```bash
# Development (recommended)
npm run db:push

# Production (creates migration files)
npm run db:migrate
```

This adds:
- ✅ `notifications` table
- ✅ `analytics_summaries` table
- ✅ 3 new enums (NotificationType, NotificationPriority, AnalyticsPeriod)

### 3. Verify Setup

```bash
npm run dev
```

✅ **You're done!** Analytics and notifications are now active.

---

## 🎯 What Works Immediately

### ✅ Real-Time Analytics
- Track coupon/store views, clicks, copies
- Uses existing Upstash Redis (no extra setup needed)

### ✅ In-App Notifications
- Create and manage notifications via API
- Uses PostgreSQL (already configured)

### ✅ Email Notifications
- Send transactional emails with RTL support
- Uses existing Resend configuration

---

## 🔧 Optional: Background Aggregation

**Only needed if you want automated hourly/daily/weekly/monthly analytics summaries.**

### Setup Redis (Optional)

#### Option 1: Local Redis
```bash
# Install Redis locally
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

#### Option 2: Cloud Redis
Use Railway, Render, or Upstash (standard, not REST API)

### Configure Environment

Add to `.env.local`:
```env
REDIS_URL="redis://localhost:6379"
# or cloud Redis URL
```

### Start Background Worker

```bash
npm run worker
```

**For production:**
```bash
pm2 start scripts/worker.js --name kobonz-worker
```

---

## 📊 Usage Examples

### Track Analytics (Auto)

```tsx
import { AnalyticsTracker } from "@/components/notifications/analytics-tracker"

<AnalyticsTracker type="coupon" resourceId={couponId}>
  <CouponCard coupon={coupon} />
</AnalyticsTracker>
```

### Add Notification Bell

```tsx
import { NotificationBell } from "@/components/notifications/notification-bell"

// In your header/navbar
<NotificationBell />
```

### Send Notification (Server)

```tsx
import { notificationService } from "@/lib/notifications"

await notificationService.notifyStoreOwnerCouponApproved(
  userId,
  couponId,
  couponTitle
)
```

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Database updated (`npm run db:push`)
- [ ] Dev server running (`npm run dev`)
- [ ] Check browser console for errors
- [ ] Test notification creation (POST `/api/notifications`)
- [ ] Test analytics tracking (POST `/api/analytics/track`)

---

## 🆘 Troubleshooting

### "Module not found: bullmq"
```bash
npm install bullmq ioredis date-fns
```

### "Table 'notifications' doesn't exist"
```bash
npm run db:push
```

### Background worker not starting
- This is **optional** - the system works without it
- Check if `REDIS_URL` is set correctly
- Make sure Redis is running

---

## 📈 Database Changes Summary

**Before Phase 6:** 15 models, 9 enums  
**After Phase 6:** 17 models (+2), 12 enums (+3)

**New Models:**
1. `Notification` - In-app notifications
2. `AnalyticsSummary` - Aggregated analytics

**New Enums:**
1. `NotificationType` - 20+ notification types
2. `NotificationPriority` - LOW, NORMAL, HIGH, URGENT
3. `AnalyticsPeriod` - HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY

**Modified Models:**
- `User` - Added 2 new relations (non-breaking)

---

## 🎊 You're Ready!

Phase 6 is successfully installed. See `PHASE_6_COMPLETE.md` for detailed documentation.
