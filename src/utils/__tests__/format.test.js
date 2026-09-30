import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDelta, formatRelative, initials, slugify } from '../format';

describe('format utils', () => {
  it('formats currency without decimals by default', () => {
    expect(formatCurrency(1234)).toBe('$1,234');
  });

  it('formats a positive delta with a leading plus', () => {
    expect(formatDelta(4.2)).toBe('+4.2%');
  });

  it('formats a negative delta with a minus sign', () => {
    expect(formatDelta(-3)).toBe('−3.0%');
  });

  it('derives initials from a full name', () => {
    expect(initials('Naveed Ahmed')).toBe('NA');
  });

  it('slugifies text', () => {
    expect(slugify('Studio Lume')).toBe('studio-lume');
  });

  it('formats very recent times as "Just now"', () => {
    expect(formatRelative(new Date(), Date.now())).toBe('Just now');
  });
});
