import {
  config,
  getCurrency,
  //  getLocale
} from "./config";

export type Money = {
  amount: number; // Integer representing cents
  currency: string; // Currency code (ISO 4217)
};

const getCurrencyScale = (m: Money): number => {
  return 10 ** getCurrency(m.currency).precision;
};

export const parse = (
  s: string,
  currency: string,
  decimalSeparator = getCurrency(currency).decimalSeparator
): Money => {
  const amountFloatString = {
    ",": () =>
      s
        .replace(/[^0-9.,]/g, "")
        .replace(/\./g, "")
        .replace(/\,/g, "."),
    ".": () => s.replace(/[^0-9.,]/g, "").replace(/\,/g, ""),
  }[decimalSeparator]();
  const amountFloat = parseFloat(amountFloatString);
  return fromFloat(amountFloat, currency);
};

export const zero = (currency = config.defaultCurrency) => {
  return { amount: 0, currency };
};

export const fromInt = (
  amount: number,
  currency = config.defaultCurrency
): Money => {
  return { amount, currency };
};

export const money = fromInt;

export const fromFloat = (
  amount: number,
  currency = config.defaultCurrency,
  round = Math.round
): Money => {
  const scale = getCurrencyScale(zero(currency));
  return {
    amount: round(amount * scale),
    currency,
  };
};

export const toInt = (m: Money): number => {
  return m.amount;
};

export const toFloat = (m: Money): number => {
  const scale = getCurrencyScale(m);
  const { whole, cents } = split(m);
  return whole + cents / scale;
};

export const add = (a: Money, b: Money): Money => {
  return money(a.amount + b.amount, a.currency);
};

export const subtract = (a: Money, b: Money): Money => {
  return money(a.amount - b.amount, a.currency);
};

export const multiply = (
  m: Money,
  multiplier: number,
  round = Math.round
): Money => {
  return money(round(m.amount * multiplier), m.currency);
};

export const divide = (
  m: Money,
  divider: number,
  round = Math.round
): Money => {
  return money(round(m.amount / divider), m.currency);
};

export const compare = (a: Money, b: Money): -1 | 0 | 1 => {
  if (a.amount === b.amount) {
    return 0;
  }
  return a.amount > b.amount ? 1 : -1;
};

export const equals = (a: Money, b: Money): boolean => {
  return compare(a, b) === 0;
};

export const greaterThan = (a: Money, b: Money): boolean => {
  return compare(a, b) === 1;
};

export const greaterThanOrEqual = (a: Money, b: Money): boolean => {
  return compare(a, b) >= 0;
};

export const lessThan = (a: Money, b: Money): boolean => {
  return compare(a, b) === -1;
};

export const lessThanOrEqual = (a: Money, b: Money): boolean => {
  return compare(a, b) <= 0;
};

export const isZero = (m: Money): boolean => {
  return m.amount === 0;
};

export const isPositive = (m: Money): boolean => {
  return m.amount > 0;
};

export const isNegative = (m: Money): boolean => {
  return m.amount < 0;
};

export const isValid = (m: any): m is Money => {
  // TODO: check m.amount boundaries
  return Boolean(
    typeof m === "object" &&
      (m.amount || m.amount === 0) &&
      typeof m.currency === "string" &&
      m.currency.length > 0
  );
};

export const split = (m: Money): { whole: number; cents: number } => {
  const scale = getCurrencyScale(m);
  const whole = Math.trunc(m.amount / scale);
  const cents = m.amount - whole * scale;
  return { whole, cents };
};

export const formatParts = (
  m: Money,
  locale = config.defaultLocale // TODO: should formatting be based on currency or locale?
): {
  whole: string;
  wholeFormatted: string;
  cents: string;
  currencySymbol: string;
  decimalSeparator: string;
} => {
  const { symbol, precision } = getCurrency(m.currency);
  //   const { decimalSeparator } = getLocale(locale);
  const decimalSeparator = new Intl.NumberFormat(locale).format(0.1).charAt(1);
  const { whole, cents } = split(m);
  const scale = getCurrencyScale(m);
  return {
    whole: `${whole}`,
    // wholeFormatted: `${whole}`.replace(
    //   /\B(?=(\d{3})+(?!\d))/g,
    //   decimalSeparator === "." ? "," : "."
    // ),
    // TODO: what about ReactNAtive?
    wholeFormatted: new Intl.NumberFormat(locale).format(whole),
    cents: `${cents}`.padEnd(precision, "0"),
    currencySymbol: symbol,
    decimalSeparator,
  };
};

export const format = (m: Money, locale = config.defaultLocale): string => {
  const parts = formatParts(m, locale);
  return `${parts.currencySymbol}${parts.wholeFormatted}${parts.decimalSeparator}${parts.cents}`;
};
