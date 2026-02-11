/**
 * Full-text search utilities for PostgreSQL
 */

/**
 * Prepare search query for PostgreSQL full-text search
 * Supports both English and Arabic text
 */
export function prepareSearchQuery(query: string): string {
  if (!query || query.trim() === "") return ""
  
  // Remove special characters but keep Arabic characters
  const cleaned = query
    .trim()
    .replace(/[^\w\s\u0600-\u06FF]/gi, " ") // Keep alphanumeric, spaces, and Arabic characters
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
  
  // Split into words and add wildcard for partial matching
  const words = cleaned.split(" ").filter(word => word.length > 0)
  
  if (words.length === 0) return ""
  
  // Create search terms with prefix matching
  const searchTerms = words.map(word => `${word}:*`).join(" & ")
  
  return searchTerms
}

/**
 * Create search text for indexing
 * Combines multiple fields into a single searchable text
 */
export function createSearchText(...fields: (string | null | undefined)[]): string {
  return fields
    .filter(field => field && field.trim() !== "")
    .join(" ")
    .toLowerCase()
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query || !text) return text
  
  const words = query.split(" ").filter(w => w.length > 0)
  let highlighted = text
  
  words.forEach(word => {
    const regex = new RegExp(`(${word})`, "gi")
    highlighted = highlighted.replace(regex, "<mark>$1</mark>")
  })
  
  return highlighted
}

/**
 * Check if text contains Arabic characters
 */
export function containsArabic(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF]/
  return arabicRegex.test(text)
}

/**
 * Normalize Arabic text for better search
 * Handles different forms of same character
 */
export function normalizeArabic(text: string): string {
  return text
    .replace(/[إأآا]/g, "ا") // Normalize alef variations
    .replace(/ى/g, "ي") // Normalize yeh
    .replace(/ة/g, "ه") // Normalize teh marbuta
    .replace(/[ًٌٍَُِّْ]/g, "") // Remove diacritics
}
