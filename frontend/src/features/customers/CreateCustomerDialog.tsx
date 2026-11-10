'use client'

/**
 * Create Customer Dialog — src/features/customers/CreateCustomerDialog.tsx
 *
 * Implements form validation via React Hook Form and Zod with MUI v7 components.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { customerApi } from '@/lib/api'
import type { Customer } from '@/types/customer'

const customerSchema = z.object({
  name: z.string().min(2, 'Company/Brand name must be at least 2 characters'),
  contactPerson: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
  notes: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CreateCustomerDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: (customer: Customer) => void
}

export default function CreateCustomerDialog({
  open,
  onClose,
  onSuccess,
}: CreateCustomerDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      taxId: '',
      notes: '',
    },
  })

  const onSubmit = async (values: CustomerFormValues) => {
    setServerError(null)
    try {
      const created = await customerApi.create({
        name: values.name,
        contactPerson: values.contactPerson || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        city: values.city || undefined,
        address: values.address || undefined,
        taxId: values.taxId || undefined,
        notes: values.notes || undefined,
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>Add New Garment Customer</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {serverError && <Alert severity="error">{serverError}</Alert>}

            <TextField
              label="Brand / Company Name"
              required
              fullWidth
              {...register('name')}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              placeholder="e.g. Apex Apparel & Co."
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Contact Person"
                fullWidth
                {...register('contactPerson')}
                placeholder="e.g. Rajesh Sharma"
              />
              <TextField
                label="Phone Number"
                fullWidth
                {...register('phone')}
                placeholder="e.g. +91 98765 43210"
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Email Address"
                fullWidth
                type="email"
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                placeholder="orders@apexapparel.com"
              />
              <TextField
                label="City / Hub"
                fullWidth
                {...register('city')}
                placeholder="e.g. New Delhi"
              />
            </Stack>

            <TextField
              label="GSTIN / Tax ID"
              fullWidth
              {...register('taxId')}
              placeholder="e.g. 07AAAAA0000A1Z5"
            />

            <TextField
              label="Factory / Office Address"
              fullWidth
              multiline
              rows={2}
              {...register('address')}
              placeholder="Building number, street, industrial area"
            />

            <TextField
              label="Internal Notes"
              fullWidth
              multiline
              rows={2}
              {...register('notes')}
              placeholder="Packaging requirements, billing terms, etc."
            />
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
            {isSubmitting ? 'Saving...' : 'Save Customer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
