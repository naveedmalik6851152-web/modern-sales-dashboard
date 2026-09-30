import { BookOpen, ExternalLink, LifeBuoy, Mail } from 'lucide-react';
import { Modal } from '@/components/ui/Overlay';
import { Button } from '@/components/ui/Button';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const MOD = isMac ? '⌘' : 'Ctrl';

const SHORTCUTS = [
  { keys: `${MOD} K`, label: 'Open search and navigation' },
  { keys: `${MOD} B`, label: 'Collapse or expand the sidebar' },
  { keys: 'Esc', label: 'Close dialogs, menus and drawers' },
  { keys: '↑ ↓ Enter', label: 'Move through and choose search results' },
];

const RESOURCES = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Guides for reports, filters and exports.',
    href: 'https://example.com/docs',
  },
  {
    icon: LifeBuoy,
    title: 'Help center',
    description: 'Answers to common billing and account questions.',
    href: 'https://example.com/help',
  },
];

export function HelpModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Help & support"
      description="Shortcuts, docs and a way to reach the team."
      size="md"
      footer={
        <Button as="a" href="mailto:support@meridian.io" variant="primary" icon={Mail}>
          Email support
        </Button>
      }
    >
      <div className="space-y-6 p-6">
        <section aria-labelledby="help-shortcuts">
          <h3 id="help-shortcuts" className="mb-2 text-[13px] font-semibold text-ink">
            Keyboard shortcuts
          </h3>
          <ul className="divide-y divide-line rounded-xl border border-line">
            {SHORTCUTS.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <span className="text-[13px] text-ink-2">{s.label}</span>
                <kbd className="rounded-md border border-line bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink">
                  {s.keys}
                </kbd>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="help-resources">
          <h3 id="help-resources" className="mb-2 text-[13px] font-semibold text-ink">
            Resources
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {RESOURCES.map((r) => (
              <a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-line p-3.5 transition-colors hover:border-line-strong hover:bg-surface-2"
              >
                <r.icon className="mt-0.5 h-[18px] w-[18px] text-accent" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                    {r.title}
                    <ExternalLink className="h-3 w-3 text-ink-3" aria-hidden />
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-ink-2">
                    {r.description}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
}
