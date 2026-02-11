import { Metadata } from "next"

/**
 * Phase 7: SEO Utilities
 * Helpers for generating metadata and structured data
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
const siteName = "Kobonz"
const siteDescription = "Discover exclusive deals, coupons, and discounts from top stores worldwide. Save money on your favorite brands with Kobonz."

// ============================================
// METADATA GENERATORS
// ============================================

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  path = "/",
  type = "website",
  noIndex = false,
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  path?: string
  type?: "website" | "article"
  noIndex?: boolean
}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const fullDescription = description || siteDescription
  const imageUrl = image || `${baseUrl}/og-image.png`
  const url = `${baseUrl}${path}`

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords?.join(", "),
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: noIndex ? "noindex,nofollow" : "index,follow",
    openGraph: {
      type,
      locale: "en_US",
      url,
      title: fullTitle,
      description: fullDescription,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [imageUrl],
      creator: "@kobonz",
    },
    alternates: {
      canonical: url,
    },
  }
}

// ============================================
// STRUCTURED DATA (JSON-LD)
// ============================================

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    description: siteDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/coupons?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: siteDescription,
    sameAs: [
      "https://twitter.com/kobonz",
      "https://facebook.com/kobonz",
      "https://instagram.com/kobonz",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@kobonz.com",
      availableLanguage: ["en", "ar"],
    },
  }
}

export function generateCouponSchema({
  id,
  title,
  description,
  code,
  discount,
  storeName,
  validFrom,
  validThrough,
  url,
}: {
  id: string
  title: string
  description: string
  code?: string
  discount?: string
  storeName: string
  validFrom?: Date
  validThrough?: Date
  url?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    "@id": `${baseUrl}/coupons/${id}`,
    name: title,
    description,
    priceSpecification: discount
      ? {
          "@type": "UnitPriceSpecification",
          price: 0,
          priceCurrency: "USD",
          valueAddedTaxIncluded: false,
        }
      : undefined,
    itemOffered: {
      "@type": "Product",
      name: title,
      description,
    },
    seller: {
      "@type": "Organization",
      name: storeName,
    },
    url: url || `${baseUrl}/coupons/${id}`,
    validFrom: validFrom?.toISOString(),
    validThrough: validThrough?.toISOString(),
    availability: "https://schema.org/InStock",
    offeredBy: {
      "@type": "Organization",
      name: siteName,
    },
  }
}

export function generateStoreSchema({
  id,
  name,
  description,
  website,
  logo,
  category,
  rating,
  reviewCount,
}: {
  id: string
  name: string
  description?: string
  website?: string
  logo?: string
  category?: string
  rating?: number
  reviewCount?: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${baseUrl}/stores/${id}`,
    name,
    description,
    url: `${baseUrl}/stores/${id}`,
    image: logo,
    logo,
    sameAs: website ? [website] : undefined,
    aggregateRating:
      rating && reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * JSON-LD Script Component
 * Usage: <JsonLd data={generateCouponSchema(...)} />
 */
export function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ============================================
// SEO KEYWORDS
// ============================================

export const defaultKeywords = [
  "coupons",
  "deals",
  "discounts",
  "promo codes",
  "vouchers",
  "savings",
  "offers",
  "kobonz",
  "online shopping",
  "cashback",
]

export const categoryKeywords: Record<string, string[]> = {
  fashion: ["fashion", "clothing", "apparel", "shoes", "accessories"],
  electronics: ["electronics", "gadgets", "tech", "computers", "phones"],
  food: ["food", "restaurants", "delivery", "dining", "meals"],
  travel: ["travel", "hotels", "flights", "vacation", "tourism"],
  beauty: ["beauty", "cosmetics", "skincare", "makeup", "wellness"],
  home: ["home", "furniture", "decor", "appliances", "garden"],
  sports: ["sports", "fitness", "gym", "outdoor", "equipment"],
  entertainment: ["entertainment", "movies", "games", "music", "events"],
}
