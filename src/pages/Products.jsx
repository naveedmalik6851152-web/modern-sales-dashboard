import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Download,
  LayoutGrid,
  List,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import { productsApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useFilteredTable } from '@/hooks/useFilteredTable';
import { useActions } from '@/context/ActionsContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useToast } from '@/context/ToastContext';
import { CATEGORIES } from '@/data/products';
import { downloadCSV } from '@/utils/csv';
import { formatCurrency, formatNumber } from '@/utils/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, IconButton } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { DataTable } from '@/components/tables/DataTable';
import { TableToolbar } from '@/components/tables/TableToolbar';
import { StatusBadge } from '@/components/ui/Badge';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { SegmentedControl } from '@/components/ui/Tabs';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];
const STOCK_OPTIONS = [
  { value: 'all', label: 'All stock levels' },
  { value: 'In stock', label: 'In stock' },
  { value: 'Low stock', label: 'Low stock' },
  { value: 'Out of stock', label: 'Out of stock' },
];

function ProductCard({ p, onEdit, onDelete }) {
  return (
    <div className="card group overflow-hidden">
      <div className="relative">
        <ProductThumb category={p.category} size="cover" className="w-full" />
        <div className="absolute right-2 top-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          <DropdownMenu
            label={`Actions for ${p.name}`}
            items={[
              { label: 'Edit product', icon: Pencil, onClick: () => onEdit(p) },
              { label: 'Delete product', icon: Trash2, danger: true, onClick: () => onDelete(p) },
            ]}
            trigger={({ props }) => (
              <IconButton
                label={`Actions for ${p.name}`}
                icon={MoreHorizontal}
                size="sm"
                variant="secondary"
                {...props}
              />
            )}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[13.5px] font-medium text-ink">{p.name}</p>
          <StatusBadge status={p.status} />
        </div>
        <p className="mt-0.5 text-xs text-ink-3">{p.category}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="tnum text-[15px] font-semibold text-ink">{formatCurrency(p.price)}</span>
          <span className="flex items-center gap-1 text-xs text-ink-2">
            <Star className="h-3.5 w-3.5 fill-current text-warning" aria-hidden />
            {p.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-ink-3">
          {formatNumber(p.sales)} sold · {formatNumber(p.stock)} in stock
        </p>
      </div>
    </div>
  );
}

export default function Products() {
  const [params] = useSearchParams();
  const toast = useToast();
  const confirm = useConfirm();
  const { addProduct, editProduct } = useActions();
  const { data, loading, error, reload } = useAsync(() => productsApi.list(), []);
  const [view, setView] = useState('grid');

  const { search, setSearch, filters, setFilter, filtered, clear } = useFilteredTable(data, {
    matcher: (p, q) => `${p.name} ${p.sku}`.toLowerCase().includes(q),
    filterMatchers: { category: (p, v) => p.category === v, status: (p, v) => p.status === v },
    initialFilters: { category: 'all', status: 'all' },
  });

  useEffect(() => {
    const q = params.get('q');
    if (q) setSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeProduct = async (row) => {
    const ok = await confirm({
      title: `Delete ${row.name}?`,
      description: 'This removes the product from your catalog. Past order history is unaffected.',
      confirmLabel: 'Delete product',
      tone: 'danger',
    });
    if (!ok) return;
    try {
      await productsApi.remove(row.id);
      toast.success('Product deleted', { description: row.name });
    } catch (err) {
      toast.error('Could not delete product', { description: err.message });
    }
  };

  const exportCsv = () => {
    downloadCSV('sales-dashboard-ig-products.csv', filtered, [
      { header: 'Name', value: (p) => p.name },
      { header: 'SKU', value: (p) => p.sku },
      { header: 'Category', value: (p) => p.category },
      { header: 'Price', value: (p) => p.price },
      { header: 'Stock', value: (p) => p.stock },
      { header: 'Sold', value: (p) => p.sales },
      { header: 'Rating', value: (p) => p.rating },
    ]);
    toast.success('Products exported', { description: 'sales-dashboard-ig-products.csv' });
  };

  const columns = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      width: '32%',
      render: (p) => (
        <div className="flex items-center gap-3">
          <ProductThumb category={p.category} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">{p.name}</p>
            <p className="truncate text-xs text-ink-3">{p.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (p) => <span className="text-ink-2">{p.category}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      align: 'right',
      render: (p) => <span className="tnum font-medium text-ink">{formatCurrency(p.price)}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      align: 'right',
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: 'sales',
      header: 'Sold',
      sortable: true,
      align: 'right',
      render: (p) => <span className="tnum text-ink-2">{formatNumber(p.sales)}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      align: 'right',
      render: (p) => (
        <span className="tnum inline-flex items-center gap-1 text-ink-2">
          <Star className="h-3.5 w-3.5 fill-current text-warning" aria-hidden />
          {p.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (p) => (
        <DropdownMenu
          label={`Actions for ${p.name}`}
          items={[
            { label: 'Edit product', icon: Pencil, onClick: () => editProduct(p) },
            {
              label: 'Delete product',
              icon: Trash2,
              danger: true,
              onClick: () => removeProduct(p),
            },
          ]}
          trigger={({ props }) => (
            <IconButton
              label={`Actions for ${p.name}`}
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
        title="Products"
        description="Your catalog, stock levels and performance."
        actions={
          <>
            <Button icon={Download} onClick={exportCsv} disabled={!filtered.length}>
              Export
            </Button>
            <Button variant="primary" icon={Plus} onClick={addProduct}>
              Add product
            </Button>
          </>
        }
      />

      <div className="card mb-6 p-4">
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search products…"
          filters={[
            {
              key: 'category',
              label: 'Category',
              value: filters.category,
              onChange: (v) => setFilter('category', v),
              options: CATEGORY_OPTIONS,
            },
            {
              key: 'status',
              label: 'Stock',
              value: filters.status,
              onChange: (v) => setFilter('status', v),
              options: STOCK_OPTIONS,
            },
          ]}
          onClear={clear}
          resultCount={filtered.length}
          actions={
            <SegmentedControl
              ariaLabel="View"
              value={view}
              onChange={setView}
              options={[
                { value: 'grid', label: 'Grid', icon: LayoutGrid, ariaLabel: 'Grid view' },
                { value: 'list', label: 'List', icon: List, ariaLabel: 'List view' },
              ]}
            />
          }
        />
      </div>

      {view === 'list' ? (
        <DataTable
          columns={columns}
          rows={filtered}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyIcon={Package}
          emptyTitle="No matching products"
          emptyDescription={
            search ? `No results for "${search}".` : 'Add your first product to get started.'
          }
          defaultSort={{ key: 'sales', dir: 'desc' }}
        />
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <CardSkeleton key={i} lines={2} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No matching products"
          description={
            search ? `No results for "${search}".` : 'Add your first product to get started.'
          }
          className="card"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} onEdit={editProduct} onDelete={removeProduct} />
          ))}
        </div>
      )}
    </>
  );
}
