/**
 * Home Page — src/app/page.tsx
 *
 * This is the page rendered at the root URL: http://localhost:3000/
 *
 * KEY CONCEPT — Page vs Layout:
 * - layout.tsx:  Persistent shell that wraps content (nav, sidebar, theme, etc.)
 * - page.tsx:    The unique content for a specific URL
 *
 * Both are Server Components by default (no "use client" = server-only).
 *
 * This page will be replaced with a proper dashboard in a later milestone.
 * For now it serves as a "smoke test" — if this renders, Next.js is working.
 */

import type { Metadata } from 'next'

/**
 * Page-specific metadata
 * This overrides the layout's default title for this specific page.
 * Result: <title>StitchOps AI</title> (uses template from layout)
 */
export const metadata: Metadata = {
  title: 'Home',
}

export default function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>
        StitchOps AI
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#666', margin: 0 }}>
        Smart Manufacturing Management
      </p>
      <p
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          background: '#f0f4ff',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#3366cc',
        }}
      >
        ✅ Next.js is running — MUI theme arriving in Milestone 5
      </p>
    </main>
  )
}
