import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CommandPalette } from '@/components/modals/CommandPalette';
import { HelpModal } from '@/components/modals/HelpModal';
import { Navbar } from '@/components/navbar/Navbar';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Drawer } from '@/components/ui/Overlay';
import { Skeleton } from '@/components/ui/Skeleton';

function PageFallback() {
  return (
    <div role="status" aria-label="Loading page" className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-36 rounded-card" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-card" />
    </div>
  );
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useLocalStorage('meridian:sidebar-collapsed', false);
  const [mobileNav, setMobileNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { pathname } = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    setMobileNav(false);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      } else if (e.key.toLowerCase() === 'b' && isDesktop) {
        e.preventDefault();
        setCollapsed((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isDesktop, setCollapsed]);

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <a
        href="#main"
        className="sr-only z-[100] rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {isDesktop && (
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          onHelp={() => setHelpOpen(true)}
        />
      )}
      <Drawer
        open={mobileNav && !isDesktop}
        onClose={() => setMobileNav(false)}
        side="left"
        bare
        width="max-w-[280px]"
        title="Navigation"
      >
        <Sidebar mobile onNavigate={() => setMobileNav(false)} onHelp={() => setHelpOpen(true)} />
      </Drawer>

      <div ref={scrollRef} className="scroll-thin min-w-0 flex-1 overflow-y-auto">
        <Navbar
          showMenuButton={!isDesktop}
          onOpenMenu={() => setMobileNav(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onHelp={() => setHelpOpen(true)}
        />
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-6 outline-none sm:px-6 lg:px-8 lg:pt-8"
        >
          <Suspense fallback={<PageFallback />}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
