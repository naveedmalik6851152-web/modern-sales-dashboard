import { Link } from 'react-router-dom';
import { MessageSquare, Menu, Search } from 'lucide-react';
import { useInbox } from '@/context/InboxContext';
import { IconButton } from '@/components/ui/Button';
import { DateRangeSelector } from './DateRangeSelector';
import { NotificationsPopover } from './NotificationsPopover';
import { ThemeSwitcher } from './ThemeSwitcher';
import { UserMenu } from './UserMenu';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export function Navbar({ onOpenMenu, onOpenSearch, onHelp, showMenuButton }) {
  const { unreadMessages } = useInbox();
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        {showMenuButton && (
          <IconButton label="Open navigation" icon={Menu} onClick={onOpenMenu} className="-ml-2" />
        )}

        <button
          type="button"
          onClick={onOpenSearch}
          className="group flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-control border border-line bg-surface px-3 text-left text-sm text-ink-3 shadow-card transition-colors hover:border-line-strong sm:max-w-[380px] sm:flex-none sm:basis-[380px]"
          aria-label="Search"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1 truncate">Search customers, orders, products</span>
          <kbd className="hidden shrink-0 rounded-md border border-line bg-surface-2 px-1.5 text-xs font-medium text-ink-3 md:inline">
            {isMac ? '⌘' : 'Ctrl'} K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <DateRangeSelector className="hidden xl:inline-flex" />
          <IconButton
            as={Link}
            label="Messages"
            icon={MessageSquare}
            to="/messages"
            badge={
              unreadMessages > 0 && (
                <span className="tnum absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-2xs font-semibold text-accent-fg ring-2 ring-canvas">
                  {unreadMessages}
                </span>
              )
            }
          />
          <NotificationsPopover />
          <ThemeSwitcher />
          <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden />
          <UserMenu onHelp={onHelp} />
        </div>
      </div>
    </div>
  );
}
