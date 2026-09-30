import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, MoreHorizontal, Plus, ShoppingBag, XCircle } from 'lucide-react';
import { ordersApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useFilteredTable } from '@/hooks/useFilteredTable';
import { useActions } from '@/context/ActionsContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useToast } from '@/context/ToastContext';
import { ORDER_STATUSES, PAYMENT_STATUSES, productSummary } from '@/data/orders';
import { downloadCSV } from '@/utils/csv';
import { buildPdf } from '@/utils/pdf';
import { downloadBlob } from '@/utils/csv';
import { formatCurrency, formatDate } from '@/utils/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, IconButton } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { DataTable } from '@/components/tables/DataTable';
import { TableToolbar } from '@/components/tables/TableToolbar';
import { StatusBadge } from '@/components/ui/Badge';
import { Drawer } from '@/components/ui/Overlay';
import { OrderDrawer } from './orders/OrderDrawer';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  ...ORDER_STATUSES.map((s) => ({ value: s, label: s })),
];
const PAYMENT_OPTIONS = [
  { value: 'all', label: 'All payments' },
  ...PAYMENT_STATUSES.map((s) => ({ value: s, label: s })),
];

export default function Orders() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const confirm = useConfirm();
  const { createOrder } = useActions();
  const { data, loading, error, reload } = useAsync(() => ordersApi.list(), []);
  const [openId, setOpenId] = useState(params.get('open'));

  useEffect(() => {
    const id = params.get('open');
    if (id) setOpenId(id);
  }, [params]);

  const { search, setSearch, filters, setFilter, filtered, clear } = useFilteredTable(data, {
    matcher: (o, q) => `${o.id} ${o.customerName} ${o.customerEmail}`.toLowerCase().includes(q),
    filterMatchers: { status: (o, v) => o.status === v, payment: (o, v) => o.payment === v },
    initialFilters: { status: 'all', payment: 'all' },
  });

  const active = useMemo(() => (data ? data.find((o) => o.id === openId) : null), [data, openId]);

  const openDrawer = (row) => {
    setOpenId(row.id);
    setParams({ open: row.id }, { replace: true });
  };
  const closeDrawer = () => {
    setOpenId(null);
    setParams({}, { replace: true });
  };

  const cancelOrder = async (row) => {
    const ok = await confirm({
      title: `Cancel ${row.id}?`,
      description: 'The customer will be notified that their order was cancelled.',
      confirmLabel: 'Cancel order',
      tone: 'danger',
    });
    if (!ok) return;
    try {
      await ordersApi.updateStatus(row.id, 'Cancelled');
      toast.success('Order cancelled', { description: row.id });
    } catch (err) {
      toast.error('Could not cancel order', { description: err.message });
    }
  };

  const exportCsv = () => {
    downloadCSV('sales-dashboard-ig-orders.csv', filtered, [
      { header: 'Order', value: (o) => o.id },
      { header: 'Customer', value: (o) => o.customerName },
      { header: 'Date', value: (o) => formatDate(o.date) },
      { header: 'Items', value: (o) => o.itemCount },
      { header: 'Amount', value: (o) => o.amount },
      { header: 'Status', value: (o) => o.status },
      { header: 'Payment', value: (o) => o.payment },
    ]);
    toast.success('Orders exported', { description: 'sales-dashboard-ig-orders.csv' });
  };

  const exportPdf = () => {
    const pdf = buildPdf({
      title: 'Orders',
      subtitle: `${filtered.length} orders · Generated ${formatDate(new Date())}`,
      columns: [
        { header: 'Order', value: (o) => o.id, width: 0.8 },
        { header: 'Customer', value: (o) => o.customerName, width: 1.3 },
        { header: 'Date', value: (o) => formatDate(o.date), width: 0.9 },
        { header: 'Amount', value: (o) => formatCurrency(o.amount, { cents: true }), width: 0.8 },
        { header: 'Status', value: (o) => o.status, width: 0.8 },
      ],
      rows: filtered,
    });
    downloadBlob('sales-dashboard-ig-orders.pdf', pdf);
    toast.success('Orders exported', { description: 'sales-dashboard-ig-orders.pdf' });
  };

  const columns = [
    {
      key: 'id',
      header: 'Order',
      sortable: true,
      render: (o) => <span className="font-medium text-ink">{o.id}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (o) => (
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-ink">{o.customerName}</p>
          <p className="truncate text-xs text-ink-3">{productSummary(o)}</p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (o) => <span className="text-ink-2">{formatDate(o.date)}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      align: 'right',
      render: (o) => (
        <span className="tnum font-medium text-ink">
          {formatCurrency(o.amount, { cents: true })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (o) => <StatusBadge status={o.status} />,
    },
    {
      key: 'payment',
      header: 'Payment',
      sortable: true,
      render: (o) => <StatusBadge status={o.payment} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (o) => (
        <DropdownMenu
          label={`Actions for ${o.id}`}
          items={[
            { label: 'View details', icon: ShoppingBag, onClick: () => openDrawer(o) },
            ...(o.status === 'Pending'
              ? [
                  {
                    label: 'Cancel order',
                    icon: XCircle,
                    danger: true,
                    onClick: () => cancelOrder(o),
                  },
                ]
              : []),
          ]}
          trigger={({ props }) => (
            <IconButton
              label={`Actions for ${o.id}`}
              icon={MoreHorizontal}
              size="sm"
              {...props}
              onClick={(e) => {
                e.stopPropagation();
                props.onClick(e);
              }}
            />
          )}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every order placed in your store, with live status."
        actions={
          <>
            <DropdownMenu
              label="Export"
              items={[
                { label: 'Export as CSV', onClick: exportCsv },
                { label: 'Export as PDF', onClick: exportPdf },
              ]}
              trigger={({ props }) => (
                <Button icon={Download} disabled={!filtered.length} {...props}>
                  Export
                </Button>
              )}
            />
            <Button variant="primary" icon={Plus} onClick={createOrder}>
              Create order
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        error={error}
        onRetry={reload}
        onRowClick={openDrawer}
        emptyIcon={ShoppingBag}
        emptyTitle={
          search || filters.status !== 'all' || filters.payment !== 'all'
            ? 'No matching orders'
            : 'No orders yet'
        }
        emptyDescription={
          search
            ? `No results for "${search}".`
            : 'Orders will appear here once customers start buying.'
        }
        defaultSort={{ key: 'date', dir: 'desc' }}
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search orders…"
            filters={[
              {
                key: 'status',
                label: 'Status',
                value: filters.status,
                onChange: (v) => setFilter('status', v),
                options: STATUS_OPTIONS,
              },
              {
                key: 'payment',
                label: 'Payment',
                value: filters.payment,
                onChange: (v) => setFilter('payment', v),
                options: PAYMENT_OPTIONS,
              },
            ]}
            onClear={clear}
            resultCount={filtered.length}
          />
        }
      />

      <Drawer open={!!openId} onClose={closeDrawer} bare width="max-w-[480px]">
        {active && <OrderDrawer order={active} onClose={closeDrawer} />}
      </Drawer>
    </>
  );
}
