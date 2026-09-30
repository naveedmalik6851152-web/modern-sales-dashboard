import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, MoreHorizontal, Pencil, Plus, Trash2, UserRound, Users } from 'lucide-react';
import { customersApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useFilteredTable } from '@/hooks/useFilteredTable';
import { useActions } from '@/context/ActionsContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useToast } from '@/context/ToastContext';
import { COUNTRIES } from '@/data/customers';
import { downloadCSV } from '@/utils/csv';
import { formatCurrency, formatDate } from '@/utils/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, IconButton } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { DataTable } from '@/components/tables/DataTable';
import { TableToolbar } from '@/components/tables/TableToolbar';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { Drawer } from '@/components/ui/Overlay';
import { CustomerDrawer } from './customers/CustomerDrawer';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];
const TIER_OPTIONS = [
  { value: 'all', label: 'All segments' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Regular', label: 'Regular' },
  { value: 'New', label: 'New' },
];
const COUNTRY_OPTIONS = [
  { value: 'all', label: 'All countries' },
  ...COUNTRIES.map((c) => ({ value: c, label: c })),
];

export default function Customers() {
  const navigate = useNavigate();
  const params = useParams();
  const toast = useToast();
  const confirm = useConfirm();
  const { addCustomer, editCustomer } = useActions();
  const { data, loading, error, reload } = useAsync(() => customersApi.list(), []);
  const [openId, setOpenId] = useState(params.id ?? null);

  const { search, setSearch, filters, setFilter, filtered, clear } = useFilteredTable(data, {
    matcher: (c, q) => `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(q),
    filterMatchers: {
      status: (c, v) => c.status === v,
      tier: (c, v) => c.tier === v,
      country: (c, v) => c.country === v,
    },
    initialFilters: { status: 'all', tier: 'all', country: 'all' },
  });

  const listRow = useMemo(() => (data ? data.find((c) => c.id === openId) : null), [data, openId]);
  const { data: detail } = useAsync(
    () => (openId ? customersApi.get(openId) : Promise.resolve(null)),
    [openId],
  );
  // Show the list row immediately (drawer opens instantly), then merge in order history once it loads.
  const active = detail && detail.id === openId ? detail : listRow;

  const openDrawer = (row) => {
    setOpenId(row.id);
    navigate(`/customers/${row.id}`, { replace: true });
  };
  const closeDrawer = () => {
    setOpenId(null);
    navigate('/customers', { replace: true });
  };

  const removeCustomer = async (row) => {
    const ok = await confirm({
      title: `Delete ${row.name}?`,
      description: 'This removes the customer record. Existing orders are kept for reporting.',
      confirmLabel: 'Delete customer',
      tone: 'danger',
    });
    if (!ok) return;
    try {
      await customersApi.remove(row.id);
      toast.success('Customer deleted', { description: row.name });
      if (openId === row.id) closeDrawer();
    } catch (err) {
      toast.error('Could not delete customer', { description: err.message });
    }
  };

  const exportCsv = () => {
    downloadCSV('sales-dashboard-ig-customers.csv', filtered, [
      { header: 'Name', value: (c) => c.name },
      { header: 'Email', value: (c) => c.email },
      { header: 'Company', value: (c) => c.company },
      { header: 'Country', value: (c) => c.country },
      { header: 'Status', value: (c) => c.status },
      { header: 'Segment', value: (c) => c.tier },
      { header: 'Total spent', value: (c) => c.totalSpent },
      { header: 'Joined', value: (c) => formatDate(c.joinedAt) },
    ]);
    toast.success('Customers exported', { description: 'sales-dashboard-ig-customers.csv' });
  };

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      width: '26%',
      render: (c) => (
        <div className="flex items-center gap-3">
          <Avatar name={c.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">{c.name}</p>
            <p className="truncate text-xs text-ink-3">{c.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      sortable: true,
      render: (c) => <span className="text-ink-2">{c.company}</span>,
    },
    {
      key: 'country',
      header: 'Location',
      sortable: true,
      render: (c) => (
        <span className="text-ink-2">
          {c.city}, {c.country}
        </span>
      ),
    },
    {
      key: 'tier',
      header: 'Segment',
      sortable: true,
      render: (c) => <StatusBadge status={c.tier} />,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: 'totalSpent',
      header: 'Total spent',
      sortable: true,
      align: 'right',
      render: (c) => (
        <span className="tnum font-medium text-ink">{formatCurrency(c.totalSpent)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (c) => (
        <DropdownMenu
          label={`Actions for ${c.name}`}
          items={[
            { label: 'View details', icon: UserRound, onClick: () => openDrawer(c) },
            { label: 'Edit customer', icon: Pencil, onClick: () => editCustomer(c) },
            { separator: true },
            {
              label: 'Delete customer',
              icon: Trash2,
              danger: true,
              onClick: () => removeCustomer(c),
            },
          ]}
          trigger={({ props }) => (
            <IconButton
              label={`Actions for ${c.name}`}
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
        title="Customers"
        description="Everyone who has ever ordered from you, in one place."
        actions={
          <>
            <Button icon={Download} onClick={exportCsv} disabled={!filtered.length}>
              Export
            </Button>
            <Button variant="primary" icon={Plus} onClick={addCustomer}>
              Add customer
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
        emptyIcon={Users}
        emptyTitle={
          search || filters.status !== 'all' || filters.tier !== 'all' || filters.country !== 'all'
            ? 'No matching customers'
            : 'No customers yet'
        }
        emptyDescription={
          search ? `No results for "${search}".` : 'Add your first customer to get started.'
        }
        defaultSort={{ key: 'totalSpent', dir: 'desc' }}
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search customers…"
            filters={[
              {
                key: 'status',
                label: 'Status',
                value: filters.status,
                onChange: (v) => setFilter('status', v),
                options: STATUS_OPTIONS,
              },
              {
                key: 'tier',
                label: 'Segment',
                value: filters.tier,
                onChange: (v) => setFilter('tier', v),
                options: TIER_OPTIONS,
              },
              {
                key: 'country',
                label: 'Country',
                value: filters.country,
                onChange: (v) => setFilter('country', v),
                options: COUNTRY_OPTIONS,
              },
            ]}
            onClear={clear}
            resultCount={filtered.length}
          />
        }
      />

      <Drawer open={!!openId} onClose={closeDrawer} bare width="max-w-[480px]">
        {active && (
          <CustomerDrawer
            customer={active}
            onClose={closeDrawer}
            onEdit={() => editCustomer(active)}
            onDelete={() => removeCustomer(active)}
          />
        )}
      </Drawer>
    </>
  );
}
