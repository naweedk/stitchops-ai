"use client";

/**
 * StitchOps AI — Manufacturing Management Dashboard
 * src/app/page.tsx
 *
 * Full-stack interactive dashboard:
 * - Orders Board powered by MUI X Data Grid
 * - Customer Directory with buyer profiles
 * - Production stage status management
 * - Live connection to NestJS REST API
 */

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
// import BackendStatus from '@/components/BackendStatus'
import OrdersDataGrid from "@/features/orders/OrdersDataGrid";
import CreateOrderDialog from "@/features/orders/CreateOrderDialog";
import CustomerList from "@/features/customers/CustomerList";
import CreateCustomerDialog from "@/features/customers/CreateCustomerDialog";
import { customerApi, orderApi } from "@/lib/api";
import type { Customer } from "@/types/customer";
import type { Order, OrderStatus } from "@/types/order";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog visibility states
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        const [customersData, ordersData] = await Promise.all([
          customerApi.list().catch(() => []),
          orderApi.list().catch(() => []),
        ]);
        if (!ignore) {
          setCustomers(customersData);
          setOrders(ordersData);
        }
      } catch (err) {
        if (!ignore) {
          setError((err as Error).message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Handle stage status transition
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      const updated = await orderApi.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: updated.status } : o,
        ),
      );
    } catch (err) {
      alert(`Could not update status: ${(err as Error).message}`);
    }
  };

  // Handle customer deletion
  const handleDeleteCustomer = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this customer? All associated orders will be removed.",
      )
    ) {
      return;
    }
    try {
      await customerApi.delete(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setOrders((prev) => prev.filter((o) => o.customerId !== id));
    } catch (err) {
      alert(`Could not delete customer: ${(err as Error).message}`);
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this production order?")) {
      return;
    }
    try {
      await orderApi.delete(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      alert(`Could not delete order: ${(err as Error).message}`);
    }
  };

  // Quick stats calculation
  const totalPiecesInProduction = orders
    .filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status))
    .reduce((sum, o) => sum + (o.totalQuantity || 0), 0);

  const activeOrdersCount = orders.filter(
    (o) => !["DELIVERED", "CANCELLED"].includes(o.status),
  ).length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      {/* ----------------------------------------------------------------------
       * Top App Bar
       * --------------------------------------------------------------------- */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PrecisionManufacturingOutlinedIcon
                sx={{ fontSize: 36, color: "primary.main" }}
              />
              <Box>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  StitchOps AI
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Smart Manufacturing Management Platform
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              flexWrap="wrap"
            >
              {/* <BackendStatus /> */}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIsCustomerDialogOpen(true)}
              >
                New Customer
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsOrderDialogOpen(true)}
              >
                New Order
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ----------------------------------------------------------------------
       * Main Content
       * --------------------------------------------------------------------- */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* Quick Metrics Bar */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                TOTAL REGISTERED BUYERS
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                {customers.length}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                ACTIVE PRODUCTION ORDERS
              </Typography>
              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
                sx={{ mt: 0.5 }}
              >
                {activeOrdersCount}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                GARMENT PIECES ON FLOOR
              </Typography>
              <Typography
                variant="h4"
                fontWeight={700}
                color="secondary.main"
                sx={{ mt: 0.5 }}
              >
                {totalPiecesInProduction.toLocaleString()} pcs
              </Typography>
            </Paper>
          </Box>

          {/* Section Tabs */}
          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(_e, v) => setActiveTab(v)}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  },
                }}
              >
                <Tab
                  icon={<AssignmentOutlinedIcon />}
                  iconPosition="start"
                  label={`Orders Board (${orders.length})`}
                />
                <Tab
                  icon={<PeopleAltOutlinedIcon />}
                  iconPosition="start"
                  label={`Customers Directory (${customers.length})`}
                />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              {isLoading ? (
                <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : activeTab === 0 ? (
                <OrdersDataGrid
                  orders={orders}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteOrder}
                />
              ) : (
                <CustomerList
                  customers={customers}
                  onDelete={handleDeleteCustomer}
                />
              )}
            </Box>
          </Paper>
        </Stack>
      </Container>

      {/* Create Dialogs */}
      <CreateCustomerDialog
        open={isCustomerDialogOpen}
        onClose={() => setIsCustomerDialogOpen(false)}
        onSuccess={(newCustomer) => {
          setCustomers((prev) => [newCustomer, ...prev]);
        }}
      />

      <CreateOrderDialog
        open={isOrderDialogOpen}
        customers={customers}
        onClose={() => setIsOrderDialogOpen(false)}
        onSuccess={(newOrder) => {
          setOrders((prev) => [newOrder, ...prev]);
          // Update order count for customer
          setCustomers((prev) =>
            prev.map((c) =>
              c.id === newOrder.customerId
                ? {
                    ...c,
                    _count: { orders: (c._count?.orders ?? 0) + 1 },
                  }
                : c,
            ),
          );
        }}
      />
    </Box>
  );
}
