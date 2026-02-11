"use client"

/**
 * Phase 7: Structured Data Components
 * Client components for embedding JSON-LD structured data
 */

export function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  )
}
