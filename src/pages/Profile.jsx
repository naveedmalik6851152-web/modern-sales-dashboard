import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Settings as SettingsIcon } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { BarSeriesChart } from '@/components/charts/BarSeriesChart';
import { formatRelative } from '@/utils/format';

export default function Profile() {
  const { data: user, loading } = useCurrentUser();

  if (loading || !user) {
    return (
      <>
        <PageHeader title="Profile" />
        <ChartSkeleton height={400} className="card" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Profile"
        description="A quick summary of your account and recent activity."
        actions={
          <Button as={Link} to="/settings" icon={SettingsIcon}>
            Edit in settings
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center p-6 text-center">
            <Avatar
              name={user.name}
              size="xl"
              colorIndex={user.avatarColorIndex}
              src={user.avatarImage}
            />
            <h2 className="mt-4 text-lg font-semibold text-ink">{user.name}</h2>
            <p className="text-[13px] text-ink-2">
              {user.role} · {user.company}
            </p>
            <p className="mt-4 text-[13px] leading-5 text-ink-2">{user.bio}</p>
            <div className="mt-5 w-full space-y-2 border-t border-line pt-5 text-left text-[13px]">
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-2.5 text-ink-2 hover:text-ink"
              >
                <Mail className="h-4 w-4 text-ink-3" aria-hidden />
                {user.email}
              </a>
              <a
                href={`tel:${user.phone}`}
                className="flex items-center gap-2.5 text-ink-2 hover:text-ink"
              >
                <Phone className="h-4 w-4 text-ink-3" aria-hidden />
                {user.phone}
              </a>
              <p className="flex items-center gap-2.5 text-ink-2">
                <MapPin className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                {user.location}
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {user.stats.map((s) => (
              <Card key={s.label} className="p-4">
                <p className="tnum text-xl font-semibold tracking-tight text-ink">{s.value}</p>
                <p className="mt-1 text-xs text-ink-3">{s.label}</p>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader title="Weekly activity" description="Actions taken across the workspace" />
            <BarSeriesChart
              data={user.weeklyActivity.map((d) => ({ label: d.day, actions: d.actions }))}
              dataKey="actions"
              name="Actions"
              formatValue={(v) => `${v} actions`}
              formatTick={(v) => v}
              color="var(--c2)"
              height={200}
            />
          </Card>

          <Card>
            <CardHeader title="Recent activity" />
            <ul className="divide-y divide-line px-5 pb-2 pt-1">
              {user.recentActivity.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 py-3 text-[13px]">
                  <span className="text-ink">{a.text}</span>
                  <span className="shrink-0 text-xs text-ink-3">{formatRelative(a.at)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
