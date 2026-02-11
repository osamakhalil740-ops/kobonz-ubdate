import { prisma } from "./prisma"
import { NotificationType, NotificationPriority, Prisma } from "@prisma/client"

/**
 * Phase 6: Notification Service
 * In-app and email notifications
 */

// ============================================
// NOTIFICATION SERVICE
// ============================================

export const notificationService = {
  /**
   * Create a notification
   */
  async create(data: {
    userId: string
    type: NotificationType
    title: string
    message: string
    priority?: NotificationPriority
    metadata?: Prisma.JsonValue
    expiresAt?: Date
  }) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority || NotificationPriority.NORMAL,
        metadata: data.metadata,
        expiresAt: data.expiresAt,
      },
    })
  },

  /**
   * Create multiple notifications (bulk)
   */
  async createMany(notifications: Array<{
    userId: string
    type: NotificationType
    title: string
    message: string
    priority?: NotificationPriority
    metadata?: Prisma.JsonValue
  }>) {
    return await prisma.notification.createMany({
      data: notifications.map(n => ({
        ...n,
        priority: n.priority || NotificationPriority.NORMAL,
      })),
    })
  },

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean
      limit?: number
      offset?: number
      type?: NotificationType
    }
  ) {
    const where: Prisma.NotificationWhereInput = {
      userId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    }

    if (options?.unreadOnly) {
      where.isRead = false
    }

    if (options?.type) {
      where.type = options.type
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: [
          { priority: "desc" },
          { createdAt: "desc" },
        ],
        take: options?.limit || 20,
        skip: options?.offset || 0,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId,
          isRead: false,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } },
          ],
        },
      }),
    ])

    return {
      notifications,
      total,
      unreadCount,
      hasMore: (options?.offset || 0) + notifications.length < total,
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns this notification
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })
  },

  /**
   * Delete notification
   */
  async delete(notificationId: string, userId: string) {
    return await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns this notification
      },
    })
  },

  /**
   * Delete all read notifications
   */
  async deleteAllRead(userId: string) {
    return await prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true,
      },
    })
  },

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
    })
  },

  /**
   * Clean up expired notifications (scheduled task)
   */
  async cleanupExpired() {
    return await prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
  },

  // ============================================
  // NOTIFICATION HELPERS (Common Use Cases)
  // ============================================

  /**
   * Notify admins about new coupon pending approval
   */
  async notifyAdminsNewCoupon(couponId: string, couponTitle: string) {
    // Get all admins
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN"] },
        isActive: true,
      },
      select: { id: true },
    })

    if (admins.length === 0) return

    await this.createMany(
      admins.map(admin => ({
        userId: admin.id,
        type: NotificationType.NEW_COUPON_PENDING,
        title: "New Coupon Pending Approval",
        message: `A new coupon "${couponTitle}" is awaiting approval.`,
        priority: NotificationPriority.HIGH,
        metadata: { couponId },
      }))
    )
  },

  /**
   * Notify store owner about coupon approval
   */
  async notifyStoreOwnerCouponApproved(userId: string, couponId: string, couponTitle: string) {
    await this.create({
      userId,
      type: NotificationType.COUPON_APPROVED,
      title: "Coupon Approved! 🎉",
      message: `Your coupon "${couponTitle}" has been approved and is now live on the marketplace.`,
      priority: NotificationPriority.NORMAL,
      metadata: { couponId },
    })
  },

  /**
   * Notify store owner about coupon rejection
   */
  async notifyStoreOwnerCouponRejected(
    userId: string,
    couponId: string,
    couponTitle: string,
    reason?: string
  ) {
    await this.create({
      userId,
      type: NotificationType.COUPON_REJECTED,
      title: "Coupon Rejected",
      message: reason
        ? `Your coupon "${couponTitle}" was rejected. Reason: ${reason}`
        : `Your coupon "${couponTitle}" was rejected. Please contact support for details.`,
      priority: NotificationPriority.NORMAL,
      metadata: { couponId, reason },
    })
  },

  /**
   * Notify affiliate about new commission
   */
  async notifyAffiliateNewCommission(
    userId: string,
    amount: number,
    couponTitle: string,
    couponId: string
  ) {
    await this.create({
      userId,
      type: NotificationType.NEW_COMMISSION,
      title: "New Commission Earned! 💰",
      message: `You earned $${amount.toFixed(2)} commission from "${couponTitle}".`,
      priority: NotificationPriority.NORMAL,
      metadata: { amount, couponId },
    })
  },

  /**
   * Notify affiliate when commission is ready for payout
   */
  async notifyAffiliateCommissionReady(userId: string, amount: number) {
    await this.create({
      userId,
      type: NotificationType.COMMISSION_READY,
      title: "Commission Ready for Payout",
      message: `You have $${amount.toFixed(2)} available for payout. Request your payout now!`,
      priority: NotificationPriority.HIGH,
      metadata: { amount },
    })
  },

  /**
   * Notify user about coupon expiring soon
   */
  async notifyStoreOwnerCouponExpiring(
    userId: string,
    couponId: string,
    couponTitle: string,
    daysLeft: number
  ) {
    await this.create({
      userId,
      type: NotificationType.COUPON_EXPIRING_SOON,
      title: "Coupon Expiring Soon",
      message: `Your coupon "${couponTitle}" expires in ${daysLeft} days.`,
      priority: NotificationPriority.NORMAL,
      metadata: { couponId, daysLeft },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expire in 7 days
    })
  },

  /**
   * Notify store owner about low coupon stock
   */
  async notifyStoreOwnerLowStock(
    userId: string,
    couponId: string,
    couponTitle: string,
    usesLeft: number
  ) {
    await this.create({
      userId,
      type: NotificationType.LOW_COUPON_STOCK,
      title: "Low Coupon Stock",
      message: `Your coupon "${couponTitle}" has only ${usesLeft} uses remaining.`,
      priority: NotificationPriority.NORMAL,
      metadata: { couponId, usesLeft },
    })
  },

  /**
   * Send welcome notification
   */
  async notifyWelcome(userId: string, userName: string) {
    await this.create({
      userId,
      type: NotificationType.WELCOME,
      title: `Welcome to Kobonz, ${userName}! 🎉`,
      message: "Thank you for joining! You've received 100 credits as a welcome bonus. Start exploring amazing deals!",
      priority: NotificationPriority.NORMAL,
    })
  },

  /**
   * Notify user about successful redemption
   */
  async notifyCouponRedeemed(userId: string, couponTitle: string, rewardPoints: number) {
    await this.create({
      userId,
      type: NotificationType.COUPON_REDEEMED,
      title: "Coupon Redeemed Successfully! 🎊",
      message: `You redeemed "${couponTitle}" and earned ${rewardPoints} reward points.`,
      priority: NotificationPriority.NORMAL,
      metadata: { rewardPoints },
    })
  },

  /**
   * Notify admins about payout request
   */
  async notifyAdminsPayoutRequest(
    payoutRequestId: string,
    affiliateName: string,
    amount: number
  ) {
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN"] },
        isActive: true,
      },
      select: { id: true },
    })

    if (admins.length === 0) return

    await this.createMany(
      admins.map(admin => ({
        userId: admin.id,
        type: NotificationType.PAYOUT_REQUEST,
        title: "New Payout Request",
        message: `${affiliateName} requested a payout of $${amount.toFixed(2)}.`,
        priority: NotificationPriority.HIGH,
        metadata: { payoutRequestId, amount },
      }))
    )
  },

  /**
   * Notify affiliate about payout approval
   */
  async notifyAffiliatePayoutApproved(userId: string, amount: number) {
    await this.create({
      userId,
      type: NotificationType.PAYOUT_APPROVED,
      title: "Payout Approved! 🎉",
      message: `Your payout request of $${amount.toFixed(2)} has been approved and is being processed.`,
      priority: NotificationPriority.HIGH,
      metadata: { amount },
    })
  },

  /**
   * Notify affiliate about payout completion
   */
  async notifyAffiliatePayoutCompleted(userId: string, amount: number) {
    await this.create({
      userId,
      type: NotificationType.PAYOUT_COMPLETED,
      title: "Payout Completed! 💸",
      message: `Your payout of $${amount.toFixed(2)} has been completed. Check your payment method.`,
      priority: NotificationPriority.HIGH,
      metadata: { amount },
    })
  },

  /**
   * Broadcast system announcement to all users
   */
  async broadcastAnnouncement(
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.NORMAL,
    targetRoles?: string[]
  ) {
    const where: Prisma.UserWhereInput = { isActive: true }
    
    if (targetRoles && targetRoles.length > 0) {
      where.role = { in: targetRoles as any }
    }

    const users = await prisma.user.findMany({
      where,
      select: { id: true },
    })

    if (users.length === 0) return

    // Batch create in chunks of 1000 to avoid overwhelming the DB
    const chunkSize = 1000
    for (let i = 0; i < users.length; i += chunkSize) {
      const chunk = users.slice(i, i + chunkSize)
      await this.createMany(
        chunk.map(user => ({
          userId: user.id,
          type: NotificationType.SYSTEM_ANNOUNCEMENT,
          title,
          message,
          priority,
        }))
      )
    }

    return { sent: users.length }
  },
}
