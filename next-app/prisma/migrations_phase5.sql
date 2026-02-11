-- Phase 5: Affiliate System - Additional Models
-- Add these to your schema.prisma after the existing models

-- Payout Request Model
model PayoutRequest {
  id          String   @id @default(cuid())
  
  // Affiliate information
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Payout details
  amount      Float
  status      PayoutStatus @default(PENDING)
  method      String?  // PayPal, Bank Transfer, etc.
  
  // Contact/account info
  payoutEmail String
  payoutNotes String?  @db.Text
  
  // Admin response
  adminNotes  String?  @db.Text
  processedBy String?  // Admin user ID
  processedAt DateTime?
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("payout_requests")
}

enum PayoutStatus {
  PENDING
  APPROVED
  PROCESSING
  COMPLETED
  REJECTED
}

-- Affiliate Earning Model (detailed earnings log)
model AffiliateEarning {
  id            String   @id @default(cuid())
  
  // Affiliate information
  affiliateId   String
  affiliate     User     @relation(fields: [affiliateId], references: [id], onDelete: Cascade)
  
  // Source information
  couponId      String
  coupon        Coupon   @relation(fields: [couponId], references: [id], onDelete: Cascade)
  
  redemptionId  String   @unique
  redemption    Redemption @relation(fields: [redemptionId], references: [id], onDelete: Cascade)
  
  // Earning details
  commission    Float
  status        EarningStatus @default(PENDING)
  
  // Payment tracking
  payoutRequestId String?
  paidAt          DateTime?
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([affiliateId])
  @@index([couponId])
  @@index([status])
  @@index([createdAt])
  @@map("affiliate_earnings")
}

enum EarningStatus {
  PENDING       // Waiting for confirmation (30 days)
  AVAILABLE     // Ready for payout
  PAID          // Already paid out
  CANCELLED     // Refund/cancellation
}

-- Add to existing Redemption model
-- redemption    AffiliateEarning?

-- Add to existing Coupon model
-- affiliateEarnings AffiliateEarning[]
