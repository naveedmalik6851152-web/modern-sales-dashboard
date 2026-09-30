import {
  BarChart3,
  Bell,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  UserCircle,
  Users,
} from 'lucide-react';

export const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard },
      { label: 'Analytics', to: '/analytics', icon: BarChart3 },
      { label: 'Customers', to: '/customers', icon: Users },
      { label: 'Orders', to: '/orders', icon: ShoppingBag },
      { label: 'Products', to: '/products', icon: Package },
      { label: 'Reports', to: '/reports', icon: FileText },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { label: 'Messages', to: '/messages', icon: MessageSquare, badge: 'messages' },
      { label: 'Notifications', to: '/notifications', icon: Bell, badge: 'notifications' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', to: '/settings', icon: Settings },
      { label: 'Profile', to: '/profile', icon: UserCircle },
    ],
  },
];
