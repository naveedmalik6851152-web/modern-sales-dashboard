import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useInbox } from '@/context/InboxContext';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';
import { NAV_GROUPS } from './nav';

function NavItem({ item, collapsed, count, onNavigate, layoutKey }) {
  const Icon = item.icon;
  return (
    <Tooltip content={item.label} side="right" disabled={!collapsed} className="flex w-full">
      <NavLink
        to={item.to}
        end={item.to === '/'}
        onClick={onNavigate}
        aria-label={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          cn(
            'relative flex h-10 w-full items-center gap-3 rounded-control px-3 text-[13.5px] font-medium transition-colors',
            isActive ? 'text-accent-strong' : 'text-ink-2 hover:bg-sunken hover:text-ink',
            collapsed && 'justify-center px-0',
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId={layoutKey}
                className="absolute inset-0 rounded-control bg-accent-soft"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <Icon className="relative h-[18px] w-[18px] shrink-0" aria-hidden />
            {!collapsed && <span className="relative flex-1 truncate">{item.label}</span>}
            {count > 0 &&
              (collapsed ? (
                <span
                  className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface"
                  aria-label={`${count} unread`}
                />
              ) : (
                <span className="tnum relative rounded-full bg-accent px-1.5 text-2xs font-semibold leading-4 text-accent-fg">
                  {count}
                  <span className="sr-only"> unread</span>
                </span>
              ))}
          </>
        )}
      </NavLink>
    </Tooltip>
  );
}

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onHelp,
  mobile = false,
  onNavigate,
}) {
  const { unreadMessages, unreadNotifications } = useInbox();
  const counts = { messages: unreadMessages, notifications: unreadNotifications };
  const isCollapsed = collapsed && !mobile;

  return (
    <aside
      aria-label="Primary"
      className={cn(
        'flex h-full shrink-0 flex-col bg-surface',
        !mobile && 'border-r border-line transition-[width] duration-200 ease-out',
        !mobile && (isCollapsed ? 'w-[72px]' : 'w-[248px]'),
        mobile && 'w-full',
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-2.5 px-5',
          isCollapsed && 'justify-center px-0',
        )}
      >
        <Logo />
        {!isCollapsed && <span className="font-display text-[17px] text-ink">Sales Dashboard IG</span>}
      </div>

      <nav className="scroll-thin flex-1 space-y-5 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {isCollapsed ? (
              <div className="mx-3 mb-2 border-t border-line first:hidden" />
            ) : (
              <p className="mb-1.5 px-3 text-xs font-medium text-ink-3">{group.label}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavItem
                    item={item}
                    collapsed={isCollapsed}
                    count={item.badge ? counts[item.badge] : 0}
                    onNavigate={onNavigate}
                    layoutKey={mobile ? 'nav-active-mobile' : 'nav-active'}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-2 shrink-0 space-y-1 border-t border-line p-3">
        <Tooltip
          content="Help & support"
          side="right"
          disabled={!isCollapsed}
          className="flex w-full"
        >
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              onHelp();
            }}
            aria-label={isCollapsed ? 'Help and support' : undefined}
            className={cn(
              'flex h-10 w-full items-center gap-3 rounded-control px-3 text-[13.5px] font-medium text-ink-2 transition-colors hover:bg-sunken hover:text-ink',
              isCollapsed && 'justify-center px-0',
            )}
          >
            <HelpCircle className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {!isCollapsed && <span>Help &amp; support</span>}
          </button>
        </Tooltip>
        {!mobile && (
          <Tooltip
            content="Expand sidebar"
            side="right"
            disabled={!isCollapsed}
            className="flex w-full"
          >
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isCollapsed}
              className={cn(
                'flex h-10 w-full items-center gap-3 rounded-control px-3 text-[13.5px] font-medium text-ink-2 transition-colors hover:bg-sunken hover:text-ink',
                isCollapsed && 'justify-center px-0',
              )}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-[18px] w-[18px]" aria-hidden />
              ) : (
                <PanelLeftClose className="h-[18px] w-[18px]" aria-hidden />
              )}
              {!isCollapsed && <span>Collapse</span>}
            </button>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}
