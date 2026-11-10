'use client'

/**
 * Orders Data Grid — src/features/orders/OrdersDataGrid.tsx
 *
 * Built with MUI X Data Grid.
 * Displays production orders with manufacturing stage progress chips,
 * priority indicators, and delivery dates.
 */

import { useState } from 'react'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import type { Order, OrderStatus, Priority } from '@/types/order'

interface OrdersDataGridProps {
  orders: Order[]
  onStatusChange: (id: string, newStatus: OrderStatus) => void
  onDelete: (id: string) => void
}

// Color map for production stages
const statusColors: Record<
  OrderStatus,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  PENDING: 'default',
  CONFIRMED: 'info',
  CUTTING: 'primary',
  STITCHING: 'secondary',
  FINISHING: 'warning',
  QUALITY_CHECK: 'warning',
  READY_FOR_DISPATCH: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
}

const priorityColors: Record<Priority, 'default' | 'info' | 'warning' | 'error'> = {
  LOW: 'default',
  NORMAL: 'info',
  HIGH: 'warning',
  URGENT: 'error',
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  CAD: 'CA$',
  AUD: 'A$',
}

const allStages: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'CUTTING',
  'STITCHING',
  'FINISHING',
  'QUALITY_CHECK',
  'READY_FOR_DISPATCH',
  'DELIVERED',
  'CANCELLED',
]

export default function OrdersDataGrid({
  orders,
  onStatusChange,
  onDelete,
}: OrdersDataGridProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | {
    el: HTMLElement
    orderId: string
  }>(null)

  const handleOpenStatusMenu = (event: React.MouseEvent<HTMLElement>, orderId: string) => {
    setMenuAnchor({ el: event.currentTarget, orderId })
  }

  const handleCloseStatusMenu = () => {
    setMenuAnchor(null)
  }

  const handleSelectStatus = (status: OrderStatus) => {
    if (menuAnchor) {
      onStatusChange(menuAnchor.orderId, status)
    }
    handleCloseStatusMenu()
  }

  const columns: GridColDef[] = [
    {
      field: 'orderNumber',
      headerName: 'Order #',
      width: 140,
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Typography variant="body2" fontWeight={700} color="primary.main">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'customer',
      headerName: 'Customer / Buyer',
      width: 180,
      valueGetter: (_value, row: Order) => row.customer?.name || 'Unknown',
    },
    {
      field: 'status',
      headerName: 'Production Stage',
      width: 170,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const status = params.value as OrderStatus
        return (
          <Tooltip title="Click to advance manufacturing stage">
            <Chip
              label={status.replace(/_/g, ' ')}
              color={statusColors[status] || 'default'}
              size="small"
              onClick={(e) => handleOpenStatusMenu(e, params.row.id)}
              icon={<EditOutlinedIcon sx={{ fontSize: '14px !important' }} />}
              sx={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.72rem' }}
            />
          </Tooltip>
        )
      },
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const priority = params.value as Priority
        return (
          <Chip
            label={priority}
            color={priorityColors[priority] || 'default'}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        )
      },
    },
    {
      field: 'totalQuantity',
      headerName: 'Total Qty',
      width: 110,
      type: 'number',
      valueFormatter: (value: number) =>
        `${Number(value || 0).toLocaleString()} pcs`,
    },
    {
      field: 'totalAmount',
      headerName: 'Order Value',
      width: 140,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const symbol = currencySymbols[params.row.currency || 'USD'] || '$'
        const amount = Number(params.value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        return (
          <Typography variant="body2" fontWeight={600}>
            {symbol}
            {amount}
          </Typography>
        )
      },
    },
    {
      field: 'targetDeliveryDate',
      headerName: 'Target Delivery',
      width: 140,
      valueFormatter: (value: string | null) =>
        value ? new Date(value).toLocaleDateString() : 'Not Set',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 90,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Tooltip title="Delete Order">
          <IconButton
            size="small"
            color="default"
            onClick={() => onDelete(params.row.id)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  if (orders.length === 0) {
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
        <AssignmentOutlinedIcon
          sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}
        />
        <Typography variant="h6" color="text.secondary">
          No manufacturing orders placed
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Click &quot;+ New Order&quot; above to create your first production batch.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
      <DataGrid
        rows={orders}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          '& .MuiDataGrid-cell': {
            fontSize: '0.85rem',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'background.default',
            fontWeight: 700,
          },
        }}
      />

      {/* Production stage selection popover */}
      <Menu
        anchorEl={menuAnchor?.el}
        open={Boolean(menuAnchor)}
        onClose={handleCloseStatusMenu}
      >
        {allStages.map((stage) => (
          <MenuItem
            key={stage}
            onClick={() => handleSelectStatus(stage)}
            sx={{ fontSize: '0.85rem', gap: 1 }}
          >
            <Chip
              label={stage.replace(/_/g, ' ')}
              color={statusColors[stage]}
              size="small"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
