import { lazy } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { ConfirmProvider } from '@/context/ConfirmContext';
import { DateRangeProvider } from '@/context/DateRangeContext';
import { InboxProvider } from '@/context/InboxContext';
import { ActionsProvider } from '@/context/ActionsContext';
import AppLayout from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import NotFound from '@/pages/NotFound';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Customers = lazy(() => import('@/pages/Customers'));
const Orders = lazy(() => import('@/pages/Orders'));
const Products = lazy(() => import('@/pages/Products'));
const Reports = lazy(() => import('@/pages/Reports'));
const Messages = lazy(() => import('@/pages/Messages'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));

/** App-wide context providers, wrapping every route (Inbox/Actions rely on routing and toasts). */
function RootProviders() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <DateRangeProvider>
            <InboxProvider>
              <ActionsProvider>
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </ActionsProvider>
            </InboxProvider>
          </DateRangeProvider>
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RootProviders />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'analytics', element: <Analytics /> },
          { path: 'customers', element: <Customers /> },
          { path: 'customers/:id', element: <Customers /> },
          { path: 'orders', element: <Orders /> },
          { path: 'products', element: <Products /> },
          { path: 'reports', element: <Reports /> },
          { path: 'messages', element: <Messages /> },
          { path: 'notifications', element: <Notifications /> },
          { path: 'settings', element: <Settings /> },
          { path: 'profile', element: <Profile /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
