import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usersApi } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/context/ToastContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { ProfileTab } from './settings/ProfileTab';
import { AccountTab } from './settings/AccountTab';
import { SecurityTab } from './settings/SecurityTab';
import { NotificationsTab } from './settings/NotificationsTab';
import { AppearanceTab } from './settings/AppearanceTab';
import { BillingTab } from './settings/BillingTab';
import { IntegrationsTab } from './settings/IntegrationsTab';

const TABS = [
  { value: 'profile', label: 'Profile' },
  { value: 'account', label: 'Account' },
  { value: 'security', label: 'Security' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'appearance', label: 'Appearance' },
  { value: 'billing', label: 'Billing' },
  { value: 'integrations', label: 'Integrations' },
];

export default function Settings() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'profile';
  const setTab = (value) => setParams(value === 'profile' ? {} : { tab: value }, { replace: true });

  const { data: user } = useCurrentUser();
  const { data: account, loading, error, reload } = useAsync(() => usersApi.getAccount(), []);

  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, account and preferences." />
      <div className="card mb-6 overflow-hidden">
        <Tabs
          ariaLabel="Settings sections"
          items={TABS}
          value={tab}
          onChange={setTab}
          className="px-3"
        />
      </div>

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading || !user || !ready ? (
        <ChartSkeleton height={360} className="card" />
      ) : (
        <>
          {tab === 'profile' && <ProfileTab user={user} />}
          {tab === 'account' && (
            <AccountTab
              account={account}
              onUpgrade={() => toast.info('Plan upgrades aren’t wired up in this demo')}
            />
          )}
          {tab === 'security' && <SecurityTab sessions={account.sessions} />}
          {tab === 'notifications' && <NotificationsTab prefs={account.notificationPrefs} />}
          {tab === 'appearance' && <AppearanceTab />}
          {tab === 'billing' && (
            <BillingTab
              account={account}
              onUpgrade={() => toast.info('Plan upgrades aren’t wired up in this demo')}
            />
          )}
          {tab === 'integrations' && <IntegrationsTab integrations={account.integrations} />}
        </>
      )}
    </>
  );
}
