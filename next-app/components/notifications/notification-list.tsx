"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Check, CheckCheck, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

/**
 * Phase 6: Notification List Component
 */

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  priority: string
  metadata?: any
  createdAt: string
}

interface NotificationListProps {
  onNotificationRead?: () => void
  onClose?: () => void
}

export function NotificationList({ onNotificationRead, onClose }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  async function fetchNotifications() {
    try {
      setLoading(true)
      const url = filter === "unread" 
        ? "/api/notifications?unreadOnly=true&limit=20"
        : "/api/notifications?limit=20"
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      })
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        )
        onNotificationRead?.()
      }
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  async function deleteNotification(id: string) {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id))
        onNotificationRead?.()
      }
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  async function markAllAsRead() {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" }),
      })
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        )
        onNotificationRead?.()
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "NEW_COMMISSION":
      case "COMMISSION_READY":
        return "💰"
      case "COUPON_APPROVED":
        return "🎉"
      case "COUPON_REJECTED":
        return "❌"
      case "PAYOUT_APPROVED":
      case "PAYOUT_COMPLETED":
        return "💸"
      case "WELCOME":
        return "👋"
      case "COUPON_REDEEMED":
        return "🎊"
      case "SYSTEM_ANNOUNCEMENT":
        return "📢"
      default:
        return "🔔"
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "URGENT":
        return "border-l-4 border-l-red-500"
      case "HIGH":
        return "border-l-4 border-l-orange-500"
      case "NORMAL":
        return "border-l-4 border-l-blue-500"
      default:
        return "border-l-4 border-l-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter(filter === "all" ? "unread" : "all")}
          >
            {filter === "all" ? "Unread" : "All"}
          </Button>
          {notifications.some(n => !n.isRead) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-3 px-4 py-3 hover:bg-muted/50 ${
                  !notification.isRead ? "bg-blue-50/50" : ""
                } ${getPriorityColor(notification.priority)}`}
              >
                <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <div className="flex gap-1">
                      {notification.metadata?.couponId && (
                        <Link
                          href={`/coupons/${notification.metadata.couponId}`}
                          onClick={onClose}
                        >
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="border-t px-4 py-2">
        <Link href="/notifications" onClick={onClose}>
          <Button variant="link" className="w-full text-xs">
            View all notifications
          </Button>
        </Link>
      </div>
    </div>
  )
}
