import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Settings, Trash2 } from 'lucide-react';
import { useInbox } from '@/context/InboxContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, IconButton } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/States';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import { TypeIcon } from '@/components/cards/TypeIcon';
import { cn } from '@/utils/cn';
import { formatRelative } from '@/utils/format';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'order', label: 'Orders' },
  { value: 'payment', label: 'Payments' },
  { value: 'security', label: 'Security' },
];

export default function Notifications() {
  const { notifications, ready, setRead, markAllRead, dismissNotification, unreadNotifications } =
    useInbox();
  const [tab, setTab] = useState('all');

  const filtered = notifications.filter((n) =>
    tab === 'all' ? true : tab === 'unread' ? !n.read : n.type === tab,
  );

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Order, payment and account activity."
        actions={
          <>
            <IconButton
              as={Link}
              to="/settings?tab=notifications"
              label="Notification settings"
              icon={Settings}
            />
            <Button icon={CheckCheck} onClick={markAllRead} disabled={!unreadNotifications}>
              Mark all as read
            </Button>
          </>
        }
      />

      <div className="card overflow-hidden">
        <Tabs
          ariaLabel="Filter notifications"
          value={tab}
          onChange={setTab}
          className="px-3"
          items={TABS.map((t) => ({
            ...t,
            count: t.value === 'unread' ? unreadNotifications : undefined,
          }))}
        />
        {!ready ? (
          <RowsSkeleton rows={7} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications here"
            description="You're all caught up in this category."
          />
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((n) => (
              <li
                key={n.id}
                className={cn(
                  'group flex items-start gap-3.5 px-5 py-4',
                  !n.read && 'bg-accent-soft/30',
                )}
              >
                <TypeIcon type={n.type} />
                <button
                  type="button"
                  onClick={() => setRead(n.id, !n.read)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-[13.5px] font-medium leading-5 text-ink">{n.title}</p>
                  <p className="mt-0.5 text-[13px] leading-5 text-ink-2">{n.body}</p>
                  <p className="mt-1 text-xs text-ink-3">{formatRelative(n.at)}</p>
                </button>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                  {!n.read && (
                    <IconButton
                      label="Mark as read"
                      icon={CheckCheck}
                      size="sm"
                      onClick={() => setRead(n.id, true)}
                    />
                  )}
                  <IconButton
                    label="Dismiss"
                    icon={Trash2}
                    size="sm"
                    onClick={() => dismissNotification(n.id)}
                  />
                </div>
                {!n.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
