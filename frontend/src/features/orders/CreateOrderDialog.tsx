'use client'

/**
 * Create Order Dialog — src/features/orders/CreateOrderDialog.tsx
 *
 * Implements complex nested form handling using React Hook Form's `useFieldArray`
 * with Zod schema validation and MUI v7 components.
 */

import { useState } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { orderApi } from '@/lib/api'
import type { Customer } from '@/types/customer'
import type { Order } from '@/types/order'

const orderItemSchema = z.object({
  styleName: z.string().min(1, 'Style name is required'),
  sku: z.string().optional(),
  color: z.string().min(1, 'Color is required'),
  size: z.string().min(1, 'Size is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Price must be non-negative'),
})

const orderSchema = z.object({
  customerId: z.string().min(1, 'Please select a customer'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  currency: z.string(),
  targetDeliveryDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        const selected = new Date(val)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return selected >= today
      },
      { message: 'Target delivery date cannot be in the past' },
    ),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least 1 line item'),
})

type OrderFormValues = z.infer<typeof orderSchema>

interface CreateOrderDialogProps {
  open: boolean
  customers: Customer[]
  onClose: () => void
  onSuccess: (order: Order) => void
}

const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', 'Free']

const currencies = [
  { code: 'USD', symbol: '$', label: 'USD ($) — US Dollar' },
  { code: 'INR', symbol: '₹', label: 'INR (₹) — Indian Rupee' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) — Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) — British Pound' },
  { code: 'AED', symbol: 'AED ', label: 'AED (AED) — UAE Dirham' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$) — Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$) — Australian Dollar' },
]

export default function CreateOrderDialog({
  open,
  customers,
  onClose,
  onSuccess,
}: CreateOrderDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  // Minimum allowed date is today (YYYY-MM-DD)
  const todayString = new Date().toISOString().split('T')[0]

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: '',
      priority: 'NORMAL',
      currency: 'USD',
      targetDeliveryDate: '',
      notes: '',
      items: [
        {
          styleName: 'Cotton Polo Shirt',
          sku: 'POLO-001',
          color: 'Navy Blue',
          size: 'L',
          quantity: 100,
          unitPrice: 15.0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  // Watch items and selected currency to calculate live totals in the UI
  const watchedItems = useWatch({ control, name: 'items' }) || []
  const selectedCurrencyCode = useWatch({ control, name: 'currency' }) || 'USD'
  const activeCurrencySymbol =
    currencies.find((c) => c.code === selectedCurrencyCode)?.symbol || '$'
  const liveTotalQuantity = watchedItems.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0),
    0,
  )
  const liveTotalAmount = watchedItems.reduce(
    (sum, item) =>
      sum + (Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0),
    0,
  )

  const onSubmit = async (values: OrderFormValues) => {
    setServerError(null)
    try {
      const created = await orderApi.create({
        customerId: values.customerId,
        priority: values.priority,
        currency: values.currency,
        targetDeliveryDate: values.targetDeliveryDate
          ? new Date(values.targetDeliveryDate).toISOString()
          : undefined,
        notes: values.notes || undefined,
        items: values.items.map((item) => ({
          styleName: item.styleName,
          sku: item.sku || undefined,
          color: item.color,
          size: item.size,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      })
      reset()
      onSuccess(created)
      onClose()
    } catch (err) {
      setServerError((err as Error).message)
    }
  }

  const handleClose = () => {
    reset()
    setServerError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={700}>Book Garment Production Order</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            {serverError && <Alert severity="error">{serverError}</Alert>}

            {/* General Order Information */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Customer / Buyer"
                required
                fullWidth
                {...register('customerId')}
                error={Boolean(errors.customerId)}
                helperText={errors.customerId?.message}
                defaultValue=""
              >
                {customers.length === 0 ? (
                  <MenuItem disabled value="">
                    No customers available — add a customer first
                  </MenuItem>
                ) : (
                  customers.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name} {c.city ? `(${c.city})` : ''}
                    </MenuItem>
                  ))
                )}
              </TextField>

              <TextField
                select
                label="Billing Currency"
                fullWidth
                {...register('currency')}
                defaultValue="USD"
              >
                {currencies.map((curr) => (
                  <MenuItem key={curr.code} value={curr.code}>
                    {curr.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Production Priority"
                fullWidth
                {...register('priority')}
                defaultValue="NORMAL"
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="NORMAL">Normal</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent (Express)</MenuItem>
              </TextField>

              <TextField
                label="Target Delivery Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: todayString }}
                {...register('targetDeliveryDate')}
                error={Boolean(errors.targetDeliveryDate)}
                helperText={
                  errors.targetDeliveryDate?.message ||
                  'Must be today or a future date'
                }
              />
            </Stack>

            <Divider>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                GARMENT SIZE & COLOR BREAKDOWN
              </Typography>
            </Divider>

            {/* Dynamic Line Items */}
            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.default',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      Item #{index + 1}
                    </Typography>
                    {fields.length > 1 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => remove(index)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>

                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label="Style Name"
                        required
                        fullWidth
                        {...register(`items.${index}.styleName` as const)}
                        placeholder="e.g. Slim-Fit Cotton Shirt"
                      />
                      <TextField
                        label="SKU / Pattern #"
                        fullWidth
                        {...register(`items.${index}.sku` as const)}
                        placeholder="e.g. SHT-SLIM-01"
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label="Color"
                        required
                        fullWidth
                        {...register(`items.${index}.color` as const)}
                        placeholder="e.g. Navy Blue"
                      />

                      <TextField
                        select
                        label="Size"
                        required
                        fullWidth
                        defaultValue="L"
                        {...register(`items.${index}.size` as const)}
                      >
                        {standardSizes.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Quantity (pcs)"
                        type="number"
                        required
                        fullWidth
                        {...register(`items.${index}.quantity` as const, {
                          valueAsNumber: true,
                        })}
                        inputProps={{ min: 1 }}
                      />

                      <TextField
                        label={`Unit Price (${activeCurrencySymbol})`}
                        type="number"
                        required
                        fullWidth
                        {...register(`items.${index}.unitPrice` as const, {
                          valueAsNumber: true,
                        })}
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                  append({
                    styleName: '',
                    sku: '',
                    color: '',
                    size: 'M',
                    quantity: 50,
                    unitPrice: 12.0,
                  })
                }
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Garment Line Item
              </Button>
            </Stack>

            <TextField
              label="Production & Cutting Instructions"
              multiline
              rows={2}
              fullWidth
              {...register('notes')}
              placeholder="Special trimming, stitching thread gauge, or packing requirements"
            />

            {/* Real-time Order Summary */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2">
                Total Pieces: <strong>{liveTotalQuantity.toLocaleString()} pcs</strong>
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                Est. Total Value: {activeCurrencySymbol}
                {liveTotalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? 'Booking Order...' : 'Confirm & Book Order'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
