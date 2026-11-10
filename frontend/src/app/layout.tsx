/**
 * Root Layout — src/app/layout.tsx
 *
 * This is the top-level layout that wraps every page in the application.
 *
 * KEY CONCEPT — Server Component:
 * This file has NO "use client" directive at the top.
 * That means it is a React Server Component (RSC) — it runs only on the server,
 * never in the browser. The HTML it generates is sent directly to the client.
 *
 * Server Components:
 * - Cannot use useState, useEffect, or other React hooks
 * - Cannot use browser APIs (window, document, localStorage)
 * - CAN be async — they can fetch data directly without useEffect
 * - CAN import and render Client Components
 *
 * This layout will be updated in Milestone 5 to wrap the app in
 * MUI ThemeProvider and Emotion cache.
 */

import type { Metadata } from 'next'
import './globals.css'

/**
 * Page metadata
 *
 * Next.js reads this exported object to set <title> and <meta> tags.
 * Each page or layout can export its own metadata — they merge together.
 */
export const metadata: Metadata = {
  title: {
    default: 'StitchOps AI',
    // Template used by child pages: "Page Name | StitchOps AI"
    template: '%s | StitchOps AI',
  },
  description: 'Smart AI-powered manufacturing management for garment businesses',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      {/*
       * <body> will gain MUI's CssBaseline in Milestone 5.
       * For now, our globals.css handles the base reset.
       */}
      <body>{children}</body>
    </html>
  )
}
