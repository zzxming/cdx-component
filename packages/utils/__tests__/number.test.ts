import { describe, expect, it } from 'vitest';
import { getDecimalLength, getIntegerLength, toFixed, toStringNumber } from '..';

describe('test function about number', () => {
  describe('getIntegerLength', () => {
    it('should return the correct length of integer part', () => {
      expect(getIntegerLength(Number('abc'))).toBe(0);
      expect(getIntegerLength(12_345)).toBe(5);
      expect(getIntegerLength(-12_345)).toBe(5);
      expect(getIntegerLength(999_999)).toBe(6);
      expect(getIntegerLength(123.456e6)).toBe(9);
      expect(getIntegerLength(123.456e-6)).toBe(1);
      expect(getIntegerLength(123.456)).toBe(3);
      expect(getIntegerLength(-123.456)).toBe(3);
    });

    it('should handle special cases', () => {
      expect(getIntegerLength(123.456e20)).toBe(23);
      expect(getIntegerLength(123.456e-20)).toBe(1);
      expect(getIntegerLength(1_234_567_890_123_456_789)).toBe(19);
      expect(getIntegerLength(0)).toBe(1);
      expect(getIntegerLength(Number.MAX_SAFE_INTEGER)).toBe(16);
      expect(getIntegerLength(Number.MIN_SAFE_INTEGER)).toBe(16);
    });
  });

  describe('getDecimalLength', () => {
    it('should return the correct number of decimal places for decimal numbers', () => {
      expect(getDecimalLength('123.456e-2')).toBe(5);
      expect(getDecimalLength(123.456e-12)).toBe(15);
      expect(getDecimalLength(123)).toBe(0);
      expect(getDecimalLength(-123)).toBe(0);
      expect(getDecimalLength(123.456)).toBe(3);
      expect(getDecimalLength(0.001)).toBe(3);
      expect(getDecimalLength('0.007')).toBe(3);
      expect(getDecimalLength('-0.004')).toBe(3);
      expect(getDecimalLength(12e-3)).toBe(3);
      expect(getDecimalLength(-12e-3)).toBe(3);
      expect(getDecimalLength('3.14E2')).toBe(0);
    });

    it('should return 0 for integer values', () => {
      expect(getDecimalLength('.123')).toBe(3);
      expect(getDecimalLength('abc')).toBe(0);
      expect(getDecimalLength(123)).toBe(0);
      expect(getDecimalLength('456')).toBe(0);
      expect(getDecimalLength(0)).toBe(0);
      expect(getDecimalLength('0')).toBe(0);
    });

    // Exceeding numerical accuracy
    it('should handle special cases', () => {
      expect(getDecimalLength(1_234_567_890_123_456_789.123_456)).toBe(0);
      expect(getDecimalLength(1.234_567_890_123_456_789_123_456)).toBe(16);
    });
  });

  describe('toStringNumber', () => {
    it('should convert a number to a string without scientific notation', () => {
      expect(toStringNumber(12_345)).toBe('12345');
      expect(toStringNumber(-123.45)).toBe('-123.45');
      expect(toStringNumber(123_456_789.012_345_67)).toBe('123456789.01234567');
      expect(toStringNumber(-0.000_000_1)).toBe('-0.0000001');
    });

    it('should handle numbers with scientific notation', () => {
      expect(toStringNumber(12_345.6789e10)).toBe('123456789000000');
      expect(toStringNumber(9.876_543_21e+9)).toBe('9876543210');
      expect(toStringNumber(123e4)).toBe('1230000');
      expect(toStringNumber(1.234e-2)).toBe('0.01234');
      expect(toStringNumber(-1.23e5)).toBe('-123000');
      expect(toStringNumber(-123.456e+3)).toBe('-123456');
    });

    it('should handle special cases', () => {
      expect(toStringNumber(Infinity)).toBe('Infinity');
      expect(toStringNumber(0)).toBe('0');
      expect(toStringNumber(-0)).toBe('0');
      expect(toStringNumber(Number.MAX_VALUE)).toBe('179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
      expect(toStringNumber(Number.MIN_VALUE)).toBe('0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005');
    });
  });

  describe('toFixed', () => {
    it('should round numbers to a fixed number of decimals', () => {
      expect(toFixed(123, 2)).toBe(`123.00`);
      expect(toFixed(-123, 2)).toBe(`-123.00`);
      expect(toFixed(123.45, 2)).toBe(`123.45`);
      expect(toFixed(-123.45, 2)).toBe(`-123.45`);
      expect(toFixed(123.45, 2)).toBe(`123.45`);
      expect(toFixed(-123.456_78, 2)).toBe(`-123.46`);
      expect(toFixed(123.496, 2)).toBe(`123.50`);
      expect(toFixed(-123.496, 2)).toBe(`-123.50`);
      expect(toFixed(123.456_78, 2)).toBe(`123.46`);
      expect(toFixed(-123.456_78, 2)).toBe(`-123.46`);
      expect(toFixed(123.996, 2)).toBe(`124.00`);
      expect(toFixed(-123.996, 2)).toBe(`-124.00`);
    });

    it('should throw an error for negative decimalCount', () => {
      expect(() => toFixed(123.456, -1)).toThrow('argument decimalCount must be a number greater than or equal to 0');
      expect(() => toFixed(123.456, Number('abc'))).toThrow('argument decimalCount must be a number greater than or equal to 0');
    });
  });
});
