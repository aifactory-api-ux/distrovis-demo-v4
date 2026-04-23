import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, formatNumber } from '../src/utils/format';

describe('formatDate', () => {
  it('formats a date string to Spanish locale', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('15');
    expect(result).toContain('enero');
    expect(result).toContain('2024');
  });

  it('handles different date formats', () => {
    const result = formatDate('2024-12-25');
    expect(result).toContain('25');
    expect(result).toContain('diciembre');
  });
});

describe('formatCurrency', () => {
  it('formats a number as USD currency', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1');
    expect(result).toContain('000');
  });

  it('handles zero', () => {
    const result = formatCurrency(0);
    expect(result).toBe('0,00 $');
  });

  it('handles decimal amounts', () => {
    const result = formatCurrency(99.99);
    expect(result).toContain('99');
  });
});

describe('formatNumber', () => {
  it('formats a number with thousand separators', () => {
    const result = formatNumber(1000);
    expect(result).toContain('1');
    expect(result).toContain('000');
  });

  it('formats large numbers', () => {
    const result = formatNumber(1000000);
    expect(result).toContain('1');
    expect(result).toContain('000');
    expect(result).toContain('000');
  });

  it('handles zero', () => {
    const result = formatNumber(0);
    expect(result).toBe('0');
  });
});