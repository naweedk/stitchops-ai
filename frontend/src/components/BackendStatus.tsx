'use client'

/**
 * Backend Status Indicator — src/components/BackendStatus.tsx
 *
 * CLIENT COMPONENT ("use client").
 *
 * Why a Client Component?
 * - Uses React hooks: useState (to hold connection state) and useEffect (to trigger the fetch on mount).
 * - Demonstrates client-side communication between Next.js and the NestJS backend.
 *
 * Key Concepts for Learners:
 * - Reads NEXT_PUBLIC_API_URL from environment variables (defaults to http://localhost:4000/api).
 * - Uses standard fetch() with proper AbortController cleanup to prevent memory leaks.
 * - Handles loading, connected, and error states gracefully.
 */

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

interface HealthResponse {
  status: string
  service: string
}

type ConnectionState =
  | { status: 'loading' }
  | { status: 'connected'; data: HealthResponse }
  | { status: 'error'; message: string }

export default function BackendStatus() {
  const [state, setState] = useState<ConnectionState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

    async function checkHealth() {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data: HealthResponse = await response.json()
        setState({ status: 'connected', data })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setState({
            status: 'error',
            message: (err as Error).message || 'Connection refused',
          })
        }
      }
    }

    checkHealth()

    // Cleanup: abort in-flight request if component unmounts
    return () => controller.abort()
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        px: 2.5,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        Backend API Status:
      </Typography>

      {state.status === 'loading' && (
        <Chip
          icon={<CircularProgress size={12} color="inherit" />}
          label="Connecting to NestJS..."
          size="small"
          variant="outlined"
        />
      )}

      {state.status === 'connected' && (
        <Chip
          label={`Connected (${state.data.service}: ${state.data.status})`}
          size="small"
          color="success"
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
      )}

      {state.status === 'error' && (
        <Chip
          label={`Offline (${state.message})`}
          size="small"
          color="warning"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      )}
    </Box>
  )
}
