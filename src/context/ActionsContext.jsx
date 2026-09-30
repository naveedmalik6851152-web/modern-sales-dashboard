import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateOrderModal } from '@/components/modals/CreateOrderModal';
import { CustomerFormModal } from '@/components/modals/CustomerFormModal';
import { ProductFormModal } from '@/components/modals/ProductFormModal';

const ActionsContext = createContext(null);

/** Global "create / edit" flows so any page (or the navbar) can open the same modals. */
export function ActionsProvider({ children }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ open: false, value: null });
  const [product, setProduct] = useState({ open: false, value: null });
  const [orderOpen, setOrderOpen] = useState(false);

  const actions = useMemo(
    () => ({
      addCustomer: () => setCustomer({ open: true, value: null }),
      editCustomer: (value) => setCustomer({ open: true, value }),
      addProduct: () => setProduct({ open: true, value: null }),
      editProduct: (value) => setProduct({ open: true, value }),
      createOrder: () => setOrderOpen(true),
      generateReport: (type = 'sales') => navigate(`/reports?generate=${type}`),
    }),
    [navigate],
  );

  const closeCustomer = useCallback(() => setCustomer((s) => ({ ...s, open: false })), []);
  const closeProduct = useCallback(() => setProduct((s) => ({ ...s, open: false })), []);
  const closeOrder = useCallback(() => setOrderOpen(false), []);

  return (
    <ActionsContext.Provider value={actions}>
      {children}
      <CustomerFormModal open={customer.open} customer={customer.value} onClose={closeCustomer} />
      <ProductFormModal open={product.open} product={product.value} onClose={closeProduct} />
      <CreateOrderModal open={orderOpen} onClose={closeOrder} />
    </ActionsContext.Provider>
  );
}

export function useActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error('useActions must be used within ActionsProvider');
  return ctx;
}
