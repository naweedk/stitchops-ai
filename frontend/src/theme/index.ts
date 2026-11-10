/**
 * MUI Theme Configuration — src/theme/index.ts
 *
 * This is the central design system for StitchOps AI.
 * Everything visual — colors, typography, spacing, component defaults —
 * is controlled from here. Change it once, update everywhere.
 *
 * HOW MUI THEMING WORKS:
 * createTheme() produces a theme object that is passed to <ThemeProvider>.
 * Every MUI component reads from this theme — their colors, fonts, spacing,
 * border radii, hover states, etc., all come from here.
 *
 * You can extend the theme later with:
 * - Mode switching (light/dark)
 * - Custom color tokens
 * - Responsive typography
 * - Component-level style overrides
 */

import { createTheme, type ThemeOptions } from '@mui/material/styles'

/**
 * Base theme options.
 *
 * We separate ThemeOptions from the theme object so this config can be
 * reused when building dark mode or tenant-specific themes later.
 */
const themeOptions: ThemeOptions = {
  // -------------------------------------------------------------------------
  // Palette — color system
  // -------------------------------------------------------------------------
  palette: {
    primary: {
      // Deep blue — conveys professionalism, trust, and reliability.
      // Used for primary actions (buttons, links, active nav items).
      main: '#1565C0',
      light: '#5E92F3',
      dark: '#003C8F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      // Deep orange — manufacturing accent, warmth, energy.
      // Used for highlights, badges, secondary actions.
      main: '#E65100',
      light: '#FF833A',
      dark: '#AC1900',
      contrastText: '#FFFFFF',
    },
    background: {
      // Slight off-white — softer on the eyes than pure #FFFFFF for dashboards
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    success: {
      // Green — order completed, in stock, on-time delivery
      main: '#2E7D32',
    },
    warning: {
      // Amber — delivery at risk, low inventory, partial completion
      main: '#ED6C02',
    },
    error: {
      // Red — overdue orders, critical alerts, out of stock
      main: '#D32F2F',
    },
  },

  // -------------------------------------------------------------------------
  // Typography — font system
  // -------------------------------------------------------------------------
  typography: {
    // Roboto is MUI's default and ships with the library — no extra font install needed.
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Make headings bold by default
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },

  // -------------------------------------------------------------------------
  // Shape — border radius
  // -------------------------------------------------------------------------
  shape: {
    // 8px gives a modern, slightly rounded look without feeling too "bubbly".
    // All MUI components (cards, buttons, inputs) use this by default.
    borderRadius: 8,
  },

  // -------------------------------------------------------------------------
  // Component defaults — override MUI defaults globally
  // -------------------------------------------------------------------------
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // MUI defaults to ALL CAPS for buttons — this disables that.
          // "Save Order" reads better than "SAVE ORDER".
          textTransform: 'none',
          // Slightly more padding than MUI default for better click targets
          paddingLeft: '20px',
          paddingRight: '20px',
        },
      },
      defaultProps: {
        // All buttons use 'contained' variant by default unless specified
        disableElevation: true,
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          // Subtle shadow — lighter than MUI's default elevation:1
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        // 'outlined' is cleaner for data-heavy forms
        variant: 'outlined',
        size: 'small',
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          // Header cells match the primary color — clear visual hierarchy
          fontWeight: 600,
        },
      },
    },

    MuiChip: {
      defaultProps: {
        size: 'small',
      },
    },
  },
}

const theme = createTheme(themeOptions)

export default theme
