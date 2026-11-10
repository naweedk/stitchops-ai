import type { NextConfig } from 'next'

/**
 * Next.js configuration
 *
 * Next.js config is TypeScript-first in Next.js 15+.
 * The NextConfig type gives us full autocomplete and validation.
 *
 * We keep this minimal intentionally — only add options you understand and need.
 * Undocumented or unnecessary options can silently break builds.
 */
const nextConfig: NextConfig = {
  /**
   * React Strict Mode
   *
   * In development, React renders each component twice to help detect
   * side effects, stale closures, and deprecated lifecycle usage.
   * This has ZERO effect in production — it is a development-only safety net.
   * Always keep this enabled.
   */
  reactStrictMode: true,
}

export default nextConfig
