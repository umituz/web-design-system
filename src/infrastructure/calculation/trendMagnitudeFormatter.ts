/**
 * Trend Magnitude Formatter
 * @description Formats signed percentage deltas as "+12.3%" / "-4.5%" / "0.0%"
 */

const PERCENT_FRACTION_DIGITS = 1;
const SIGN_THRESHOLD = 0;
const POSITIVE_SIGN = '+';
const NEGATIVE_SIGN = '-';

export const formatTrendMagnitude = (value: number, fractionDigits: number = PERCENT_FRACTION_DIGITS): string => {
  if (Number.isNaN(value)) return '0%';
  const sign = value > SIGN_THRESHOLD ? POSITIVE_SIGN : value < SIGN_THRESHOLD ? NEGATIVE_SIGN : '';
  return `${sign}${Math.abs(value).toFixed(fractionDigits)}%`;
};
