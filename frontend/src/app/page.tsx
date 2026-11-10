/**
 * Home Page — src/app/page.tsx
 *
 * SERVER COMPONENT — no "use client".
 * Uses MUI components directly in a Server Component — this works because
 * MUI v7 is compatible with RSC. The Emotion styles are collected server-side
 * by our AppThemeProvider registry and injected into the HTML stream.
 *
 * This page demonstrates:
 * - MUI Typography, Box, Container, Stack, Paper, Chip, Divider
 * - Theme color usage via the `color` prop and `sx` prop
 * - Responsive layout with MUI's breakpoint system
 *
 * This is NOT the final dashboard — it is a visual smoke test to confirm
 * that MUI renders correctly with our theme and Emotion SSR setup.
 */

import type { Metadata } from 'next'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import BackendStatus from '@/components/BackendStatus'

export const metadata: Metadata = {
  title: 'Home',
}

// Feature cards shown on the homepage — represents what the platform will do
const features = [
  { label: 'Order Management', icon: '📋', desc: 'Track garment orders end-to-end' },
  { label: 'Worker Tracking', icon: '👷', desc: 'Monitor productivity and assignments' },
  { label: 'Inventory Control', icon: '📦', desc: 'Manage fabric and materials' },
  { label: 'Production Planning', icon: '🏭', desc: 'Plan capacity and schedules' },
  { label: 'AI Insights', icon: '🤖', desc: 'Gemini-powered business intelligence' },
  { label: 'Analytics', icon: '📊', desc: 'Reports and performance metrics' },
] as const

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        // bgcolor reads from theme.palette.background.default = '#F5F7FA'
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6, // py = paddingY, in MUI 1 unit = 8px, so py:6 = 48px
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">

          {/* ----------------------------------------------------------------
           * Header
           * --------------------------------------------------------------- */}
          <Stack spacing={1} alignItems="center" textAlign="center">
            <Chip
              label="Development Preview"
              color="secondary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                // color reads from theme.palette.primary.main = '#1565C0'
                color: 'primary.main',
                fontSize: { xs: '2rem', sm: '3rem' }, // responsive font size
              }}
            >
              StitchOps AI
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ color: 'text.secondary', fontWeight: 400 }}
            >
              Smart Manufacturing Management
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled', mt: 1 }}>
              AI-powered platform for garment manufacturing businesses
            </Typography>
          </Stack>

          <Divider sx={{ width: '100%' }} />

          {/* ----------------------------------------------------------------
           * Feature Cards
           * MUI Paper = white card with elevation/shadow
           * --------------------------------------------------------------- */}
          <Box
            sx={{
              display: 'grid',
              // Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
              width: '100%',
            }}
          >
            {features.map((feature) => (
              <Paper
                key={feature.label}
                elevation={0} // elevation:0 uses our custom boxShadow from theme
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  // border adds a subtle outline — cleaner than shadow alone
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2, // theme.shape.borderRadius * 2 = 16px
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Typography variant="h4" component="span" sx={{ lineHeight: 1 }}>
                  {feature.icon}
                </Typography>
                <Typography variant="subtitle1" fontWeight={600}>
                  {feature.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* ----------------------------------------------------------------
           * Status Banner & Backend Communication
           * --------------------------------------------------------------- */}
          <Paper
            elevation={0}
            sx={{
              px: 4,
              py: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 2,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              ✅ MUI v7 · Emotion SSR · Next.js 16 App Router · React 19 · TypeScript 5
            </Typography>
          </Paper>

          {/* Live Full-Stack Communication Indicator */}
          <BackendStatus />

        </Stack>
      </Container>
    </Box>
  )
}
