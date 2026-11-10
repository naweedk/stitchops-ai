'use client'

/**
 * Customer List View — src/features/customers/CustomerList.tsx
 *
 * Renders buyer accounts in a clean responsive grid with contact details and order counts.
 */

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import BusinessIcon from '@mui/icons-material/Business'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import type { Customer } from '@/types/customer'

interface CustomerListProps {
  customers: Customer[]
  onDelete: (id: string) => void
}

export default function CustomerList({
  customers,
  onDelete,
}: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
        <Typography variant="h6" color="text.secondary">
          No customer accounts found
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Add your first garment buyer or retail client to start booking production orders.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 2.5,
      }}
    >
      {customers.map((customer) => (
        <Card
          key={customer.id}
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 2,
            transition: 'border-color 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          <CardContent sx={{ pb: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
            >
              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                {customer.name}
              </Typography>
              <Tooltip title="Delete customer">
                <IconButton
                  size="small"
                  color="default"
                  onClick={() => onDelete(customer.id)}
                  sx={{ mt: -0.5, mr: -0.5 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>

            <Stack spacing={1} sx={{ mt: 2 }}>
              {customer.contactPerson && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonOutlineIcon
                    fontSize="inherit"
                    sx={{ color: 'text.secondary', fontSize: 16 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {customer.contactPerson}
                  </Typography>
                </Stack>
              )}

              {customer.phone && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneOutlinedIcon
                    fontSize="inherit"
                    sx={{ color: 'text.secondary', fontSize: 16 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {customer.phone}
                  </Typography>
                </Stack>
              )}

              {customer.city && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnOutlinedIcon
                    fontSize="inherit"
                    sx={{ color: 'text.secondary', fontSize: 16 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {customer.city}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </CardContent>

          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: 'background.default',
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Chip
              label={`${customer._count?.orders ?? 0} Orders`}
              size="small"
              color={
                (customer._count?.orders ?? 0) > 0 ? 'primary' : 'default'
              }
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
            />
            {customer.taxId && (
              <Typography variant="caption" color="text.disabled">
                Tax ID: {customer.taxId}
              </Typography>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  )
}
