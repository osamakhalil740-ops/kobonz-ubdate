#!/usr/bin/env node

/**
 * Phase 6: Background Worker Process
 * 
 * Run this as a separate process in production:
 * node scripts/worker.js
 * 
 * This worker handles:
 * - Analytics aggregation (hourly, daily, weekly, monthly)
 * - Email notifications
 */

import { initializeQueues, shutdownQueues } from "../lib/queue"

async function main() {
  console.log("🚀 Starting Phase 6 background worker...")

  try {
    const workers = await initializeQueues()

    if (!workers) {
      console.log("⚠️  Worker disabled - REDIS_URL not configured")
      console.log("💡 This is optional for development. Set REDIS_URL to enable.")
      process.exit(0)
    }

    console.log("✅ Background workers started successfully")
    console.log("📊 Analytics aggregation scheduled")
    console.log("📧 Email notification worker running")
    console.log("\n👉 Press Ctrl+C to stop")

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n\n⏳ Shutting down gracefully...")
      await shutdownQueues()
      console.log("✅ Workers stopped")
      process.exit(0)
    })

    process.on("SIGTERM", async () => {
      console.log("\n\n⏳ Shutting down gracefully...")
      await shutdownQueues()
      console.log("✅ Workers stopped")
      process.exit(0)
    })
  } catch (error) {
    console.error("❌ Failed to start workers:", error)
    process.exit(1)
  }
}

main()
