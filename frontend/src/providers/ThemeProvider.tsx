'use client'

/**
 * AppThemeProvider — src/providers/ThemeProvider.tsx
 *
 * This is a CLIENT COMPONENT ("use client" at the top).
 *
 * WHY CLIENT COMPONENT?
 * This component uses:
 *   1. `useState` — React hook (server components cannot use hooks)
 *   2. `useServerInsertedHTML` — Next.js hook for injecting HTML during SSR
 * Both of these require a client context.
 *
 * WHAT DOES THIS FILE DO?
 * It solves two separate problems:
 *
 * Problem 1 — MUI ThemeProvider:
 *   MUI components need a ThemeProvider ancestor to know which colors,
 *   fonts, and spacing to use. Without it, they fall back to defaults.
 *
 * Problem 2 — Emotion SSR (the tricky part):
 *   Emotion generates CSS at RUNTIME from JavaScript. In a browser this is
 *   fine — the CSS is injected into <style> tags on the fly. But on the
 *   SERVER, Next.js streams HTML to the browser. If the CSS isn't included
 *   in the initial HTML, the user sees a flash of unstyled content (FOUC).
 *
 *   The fix: we intercept Emotion's style generation, collect all the CSS
 *   that was used while rendering, and inject it into the HTML stream using
 *   `useServerInsertedHTML` BEFORE the browser receives the component HTML.
 *
 * ARCHITECTURE DIAGRAM:
 *
 *   layout.tsx (Server Component)
 *       └── <AppThemeProvider> (Client Component — this file)
 *               ├── [Emotion cache setup]
 *               ├── [useServerInsertedHTML — injects <style> tags]
 *               ├── <CacheProvider> — makes the cache available to all MUI components
 *               │       └── <MuiThemeProvider theme={theme}>
 *               │               └── <CssBaseline />  (CSS reset)
 *               │               └── {children}       (rest of the app — can be Server Components!)
 *               └── ...
 *
 * KEY INSIGHT:
 * Even though AppThemeProvider is a Client Component, its CHILDREN can still
 * be Server Components. The "use client" boundary doesn't infect children —
 * it only marks THIS component as client-side rendered.
 */

import { useState } from 'react'
import createCache from '@emotion/cache'
import type { EmotionCache } from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/theme'

interface AppThemeProviderProps {
  children: React.ReactNode
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  /**
   * Emotion Cache Setup
   *
   * We use useState with an initializer function (the function form of useState).
   * This ensures the cache is created only ONCE per component lifecycle,
   * not on every re-render.
   *
   * The cache:
   * - Has key: 'mui' — this appears as data-emotion="mui ..." in generated <style> tags
   * - Has compat: true — required for the insertion tracking to work correctly
   * - Has a monkey-patched insert() — we intercept every style insertion to track names
   */
  const [{ cache, flush }] = useState<{
    cache: EmotionCache
    flush: () => string[]
  }>(() => {
    const cache = createCache({ key: 'mui' })
    // compat mode is required for useServerInsertedHTML style extraction
    cache.compat = true

    // Track which style names have been inserted
    const prevInsert = cache.insert.bind(cache)
    let inserted: string[] = []

    // Intercept every style insertion
    cache.insert = function insert(selector, serialized, sheet, shouldCache) {
      // If this style hasn't been seen before, record its name
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(selector, serialized, sheet, shouldCache)
    }

    // flush() returns all names collected since the last flush, then resets
    const flush = (): string[] => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }

    return { cache, flush }
  })

  /**
   * Server Style Injection
   *
   * `useServerInsertedHTML` is a Next.js hook that runs during server rendering.
   * Our callback is called at the right point in the HTML stream, allowing us
   * to inject <style> tags before the browser receives the component HTML.
   *
   * Without this, users would see unstyled MUI components for a brief moment
   * on the first load (a "flash of unstyled content").
   *
   * This hook is a no-op on the client side — hydration handles styles there.
   */
  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) return null

    // Gather all the CSS strings for the names we collected
    let styles = ''
    for (const name of names) {
      styles += cache.inserted[name]
    }

    // Inject as a <style> tag with Emotion's data attribute
    // The data-emotion attribute tells Emotion which styles are already injected
    // so it doesn't double-inject them on the client
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        // dangerouslySetInnerHTML is safe here — we control the content (Emotion-generated CSS)
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  return (
    // CacheProvider makes our custom cache available to all MUI components in the tree
    <CacheProvider value={cache}>
      {/*
       * MuiThemeProvider distributes the theme to every MUI component.
       * Any component using MUI colors, typography, spacing, or breakpoints
       * reads from this theme.
       */}
      <MuiThemeProvider theme={theme}>
        {/*
         * CssBaseline is MUI's CSS reset.
         * It normalizes browser default styles (margin, padding, box-sizing, etc.)
         * and applies the theme's background color to <body>.
         * Always place it here — once, inside the theme, before children.
         */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  )
}
