import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { IconButton } from '@/components/ui/Button';

function ThemeIcon({ dark }) {
  return (
    <span className="relative inline-flex h-[18px] w-[18px] items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ y: 12, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -12, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.16 }}
          className="inline-flex"
        >
          {dark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function ThemeSwitcher() {
  const { resolved, toggleTheme } = useTheme();
  const dark = resolved === 'dark';
  return (
    <IconButton label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
      <ThemeIcon dark={dark} />
    </IconButton>
  );
}
