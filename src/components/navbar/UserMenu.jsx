import { CreditCard, HelpCircle, LogOut, Settings, UserCircle } from 'lucide-react';
import { useConfirm } from '@/context/ConfirmContext';
import { useToast } from '@/context/ToastContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Avatar } from '@/components/ui/Avatar';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { Skeleton } from '@/components/ui/Skeleton';
import { currentUser } from '@/data/user';

export function UserMenu({ onHelp }) {
  const { data } = useCurrentUser();
  const user = data ?? currentUser;
  const confirm = useConfirm();
  const toast = useToast();

  const signOut = async () => {
    const ok = await confirm({
      title: 'Sign out of Sales Dashboard IG?',
      description: 'This is a demo workspace, so no real session will be ended.',
      confirmLabel: 'Sign out',
    });
    if (ok)
      toast.info('Signed out (demo)', {
        description: 'Authentication is not connected in this build.',
      });
  };

  return (
    <DropdownMenu
      label="Account"
      width="w-64"
      header={
        <div className="flex items-center gap-3">
          <Avatar
            name={user.name}
            size="lg"
            colorIndex={user.avatarColorIndex}
            src={user.avatarImage}
          />
          <div className="min-w-0">
            {data ? (
              <>
                <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                <p className="truncate text-xs text-ink-3">{user.email}</p>
              </>
            ) : (
              <Skeleton className="h-8 w-32" />
            )}
          </div>
        </div>
      }
      items={[
        { label: 'Profile', icon: UserCircle, to: '/profile' },
        { label: 'Settings', icon: Settings, to: '/settings' },
        { label: 'Billing', icon: CreditCard, to: '/settings?tab=billing' },
        { label: 'Help & support', icon: HelpCircle, onClick: onHelp },
        { separator: true },
        { label: 'Sign out', icon: LogOut, danger: true, onClick: signOut },
      ]}
      trigger={({ props }) => (
        <button
          type="button"
          aria-label="Open account menu"
          className="flex items-center gap-2 rounded-full p-0.5 transition-shadow hover:shadow-[0_0_0_4px_rgb(var(--sunken))]"
          {...props}
        >
          <Avatar
            name={user.name}
            size="md"
            colorIndex={user.avatarColorIndex}
            src={user.avatarImage}
          />
        </button>
      )}
    />
  );
}
