/**
 * Root Layout — src/app/layout.tsx
 *
 * SERVER COMPONENT — no "use client" directive.
 * This file runs only on the server. It can be async, fetch data,
 * and render Client Components — but cannot use hooks or browser APIs.
 *
 * PROVIDER STRUCTURE:
 * This layout imports AppThemeProvider (a Client Component).
 * That is intentional — Server Components CAN render Client Components.
 * The key is that children passed to Client Components remain Server Components
 * unless they themselves declare "use client".
 *
 *   RootLayout (Server)
 *     └── AppThemeProvider (Client) ← handles Emotion SSR + MUI theme
 *           └── {children}          ← each page, still a Server Component
 */

import type { Metadata } from 'next'
import AppThemeProvider from '@/providers/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'StitchOps AI',
    // Child pages use this template: "Orders | StitchOps AI"
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
      <body>
        {/*
         * AppThemeProvider is a Client Component that:
         *   1. Sets up the Emotion cache for SSR style injection
         *   2. Provides MUI ThemeProvider with our custom theme
         *   3. Renders CssBaseline (MUI's CSS reset)
         *
         * Everything inside this provider has access to MUI theming
         * and Emotion styles — including Server Component children.
         */}
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  )
}
