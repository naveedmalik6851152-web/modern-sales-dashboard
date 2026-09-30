import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useInbox } from '@/context/InboxContext';
import { IconButton } from '@/components/ui/Button';
import { Popover } from '@/components/ui/Popover';
import { EmptyState } from '@/components/ui/States';
import { TypeIcon } from '@/components/cards/TypeIcon';
import { cn } from '@/utils/cn';
import { formatRelative } from '@/utils/format';

export function NotificationsPopover() {
  const { notifications, unreadNotifications, setRead, markAllRead } = useInbox();
  const recent = notifications.slice(0, 5);

  return (
    <Popover
      label="Notifications"
      panelClassName="w-[min(380px,calc(100vw-1.5rem))]"
      trigger={({ props }) => (
        <IconButton
          label={
            unreadNotifications ? `Notifications, ${unreadNotifications} unread` : 'Notifications'
          }
          icon={Bell}
          {...props}
          badge={
            unreadNotifications > 0 && (
              <span className="tnum absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-2xs font-semibold text-accent-fg ring-2 ring-canvas">
                {unreadNotifications}
              </span>
            )
          }
        />
      )}
    >
      {({ close }) => (
        <div>
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-sm font-semibold text-ink">Notifications</h2>
            <button
              type="button"
              onClick={markAllRead}
              disabled={!unreadNotifications}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-strong transition-opacity hover:underline disabled:pointer-events-none disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden />
              Mark all read
            </button>
          </div>
          <div className="border-t border-line">
            {recent.length === 0 ? (
              <EmptyState
                compact
                icon={Bell}
                title="You’re all caught up"
                description="New activity will show up here."
              />
            ) : (
              <ul className="scroll-thin max-h-[360px] divide-y divide-line overflow-y-auto">
                {recent.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => setRead(n.id, true)}
                      className={cn(
                        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-sunken',
                        !n.read && 'bg-accent-soft/40',
                      )}
                    >
                      <TypeIcon type={n.type} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-ink">
                          {n.title}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-[13px] leading-5 text-ink-2">
                          {n.body}
                        </span>
                        <span className="mt-1 block text-xs text-ink-3">
                          {formatRelative(n.at)}
                        </span>
                      </span>
                      {!n.read && (
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
                          aria-label="Unread"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-t border-line p-2">
            <Link
              to="/notifications"
              onClick={close}
              className="block rounded-lg px-3 py-2 text-center text-[13px] font-medium text-ink transition-colors hover:bg-sunken"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </Popover>
  );
}
