/**
 * ESLint Flat Config — eslint.config.mjs
 *
 * This is the modern ESLint configuration format introduced in ESLint 9.
 * It replaces the legacy .eslintrc.json / .eslintrc.js files.
 *
 * KEY CONCEPTS:
 *
 * 1. Flat Config = an array of configuration objects.
 *    Each object can apply to specific files and define rules, plugins, etc.
 *    They are merged in order — later entries override earlier ones for the same rule.
 *
 * 2. .mjs extension = ES Module syntax (import/export).
 *    Required here because we use `import` statements.
 *
 * 3. eslint-config-next exports a native Linter.Config[] array (flat config).
 *    We simply spread it into our config array — no compatibility shim needed.
 *    This was verified by inspecting the package's dist/index.d.ts.
 *
 * 4. next/core-web-vitals:
 *    - Extends the base Next.js ESLint config
 *    - Adds stricter rules around Core Web Vitals (performance metrics)
 *    - Flags patterns that hurt LCP, FID, CLS scores (e.g. misusing <Image>)
 *    - Recommended for all production Next.js apps
 *
 * ESLint version: 9.39.5
 * Reason for 9.x: eslint-plugin-import, eslint-plugin-jsx-a11y, and
 * eslint-plugin-react (bundled inside eslint-config-next) declare peer deps
 * up to ESLint ^9. Upgrading to ESLint 10 produces peer warnings.
 * We pin 9.39.5 and revisit when eslint-config-next updates its bundled plugins.
 */

// createRequire is needed to import CommonJS modules (eslint-config-next uses CJS)
// from an ES Module context (.mjs file)
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

/** @type {import('eslint').Linter.Config[]} */
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals')

const eslintConfig = [
  // Spread the Next.js core-web-vitals flat config array.
  // This includes:
  //   - Next.js specific rules (@next/eslint-plugin-next)
  //   - React rules (eslint-plugin-react)
  //   - React Hooks rules (eslint-plugin-react-hooks)
  //   - Import rules (eslint-plugin-import)
  //   - Accessibility rules (eslint-plugin-jsx-a11y)
  //   - TypeScript rules (typescript-eslint)
  //   - Core Web Vitals performance rules
  ...nextCoreWebVitals,

  // Project-level overrides — applied after the base config
  {
    rules: {
      // --- TypeScript ---

      // Warn (not error) when TypeScript infers a type as `any`
      // We catch explicit `any` usages through tsconfig strict mode
      '@typescript-eslint/no-explicit-any': 'warn',

      // Error on unused variables EXCEPT those prefixed with underscore.
      // Convention: prefix with _ to intentionally mark a variable as unused
      // e.g. function handler(_req, res) { ... }
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // --- React ---

      // Not needed in React 17+ — the JSX transform handles this automatically.
      // Next.js configures the JSX transform, so we don't need explicit React imports.
      'react/react-in-jsx-scope': 'off',

      // Allow prop spreading when intentional
      'react/jsx-props-no-spreading': 'off',
    },
  },
]

export default eslintConfig
