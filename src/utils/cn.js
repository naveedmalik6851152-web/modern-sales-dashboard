import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['2xs'] }],
      shadow: [{ shadow: ['card', 'pop', 'lift'] }],
      rounded: [{ rounded: ['card', 'control'] }],
    },
  },
});

/** Merge conditional class names and resolve Tailwind conflicts. */
export const cn = (...inputs) => twMerge(clsx(inputs));
