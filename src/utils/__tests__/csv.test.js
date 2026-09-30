import { describe, expect, it } from 'vitest';
import { toCSV } from '../csv';

describe('toCSV', () => {
  it('escapes commas and quotes', () => {
    const csv = toCSV(
      [{ name: 'Acme, Inc.', note: 'Says "hello"' }],
      [
        { header: 'Name', value: (r) => r.name },
        { header: 'Note', value: (r) => r.note },
      ],
    );
    expect(csv).toBe('Name,Note\r\n"Acme, Inc.","Says ""hello"""');
  });
});
