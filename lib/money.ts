import { config, getCurrency, getDefaultRounder, getLocale } from "./config";

export type Cents = number;

export type Money = {
  amount: Cents; // Integer representing cents
  currency?: string; // Currency code (ISO 4217)
};

// ------ Initialization ------ //

export const zero = (currency = config.defaultCurrency) => {
  return { amount: 0, currency };
};

export const fromInt = (
  amount: Cents,
  currency = config.defaultCurrency
): Money => {
  return { amount, currency };
};

export const fromFloat = (
  amount: number,
  currency = config.defaultCurrency,
  round = getDefaultRounder()
): Money => {
  const scale = getCurrencyScale(zero(currency));

  return {
    amount: round(amount * scale, 0),
    currency,
  };
};

export const fromIntString = (
  amount: string,
  currency = config.defaultCurrency
): Money => {
  const parsed = parseInt(amount, 10);
  return fromInt(Number.isNaN(parsed) || parsed === 0 ? 0 : parsed, currency);
};

export const fromFloatString = (
  amount: string,
  currency = config.defaultCurrency,
  round = getDefaultRounder()
): Money => {
  const parsed = parseFloat(amount);
  return fromFloat(
    Number.isNaN(parsed) || parsed === 0 ? 0 : parsed,
    currency,
    round
  );
};

// ------ Serialization ------ //

export const toInt = (m: Money): Cents => {
  return m.amount;
};

export const toFloat = (m: Money): number => {
  const scale = getCurrencyScale(m);
  const { whole, cents } = split(m);

  return whole + cents / scale;
};

export const toString = (m: Money): string => {
  return `${m.amount}`;
};

export const toFloatString = (m: Money): string => {
  const scale = getCurrencyScale(m);
  const { whole, cents } = split(m);

  return `${whole}.${cents.toString().padStart(Math.log10(scale), "0")}`;
};

// ------ Arithmetics ------ //

export const add = (a: Money, b: Money): Money => {
  return fromInt(a.amount + b.amount, a.currency);
};

export const subtract = (a: Money, b: Money): Money => {
  return fromInt(a.amount - b.amount, a.currency);
};

export const multiply = (
  m: Money,
  multiplier: number, // | Money
  round = getDefaultRounder()
): Money => {
  return fromInt(round(m.amount * multiplier, 0), m.currency);
};

export const divide = (
  m: Money,
  divider: number, // | Money
  round = getDefaultRounder()
): Money => {
  return fromInt(round(m.amount / divider, 0), m.currency);
};

export const abs = (m: Money): Money => {
  return {
    ...m,
    amount: Math.abs(m.amount),
  };
};

// ------ Comparison ------ //

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

export const min = (m1: Money, ...m: Money[]): Money => {
  return [m1, ...m].reduce((acc, curr) => (lessThan(acc, curr) ? acc : curr));
};

export const max = (m1: Money, ...m: Money[]): Money => {
  return [m1, ...m].reduce((acc, curr) =>
    greaterThan(acc, curr) ? acc : curr
  );
};

// ------ Validation ------ //

export const isValid = (m: any): m is Money => {
  return Boolean(
    typeof m === "object" &&
      (m.amount || m.amount === 0) &&
      (typeof m.currency === "undefined" ||
        (typeof m.currency === "string" &&
          m.currency.length > 0 &&
          !!getCurrency(m.currency)))
  );
};

// ------ Transformation ------ //

export const split = (m: Money): { whole: number; cents: number } => {
  const scale = getCurrencyScale(m);
  const whole = Math.trunc(m.amount / scale);
  const cents = m.amount - whole * scale;

  return { whole, cents };
};

// ------ Formatting ------ //

export const format = (
  m: Money,
  ops?: {
    cents?: boolean; // default: true; if false, 00 cents will be omitted
    locale?: string;
    trailingZeros?: boolean; // default: true; if false, 1.50 will be formatted as 1.5
    withPlusSign?: boolean; // default: false; if true, positive numbers will be prefixed with a plus sign
  }
): string => {
  const { cents, locale, trailingZeros, withPlusSign } = {
    cents: ops?.cents ?? true,
    locale: ops?.locale ?? config.defaultLocale,
    trailingZeros: ops?.trailingZeros ?? true,
    withPlusSign: ops?.withPlusSign ?? false,
  };
  const parts = formatParts(m, locale);
  const signSymbol = parts.sign === "-" ? "-" : "";

  let formatted = "";

  if (!cents && parts.cents === "0".repeat(getCurrency(m.currency).precision)) {
    formatted = `${signSymbol}${parts.currencySymbol}${parts.wholeFormatted}`;
  } else {
    formatted = `${signSymbol}${parts.currencySymbol}${parts.wholeFormatted}${parts.decimalSeparator}${parts.cents}`;
  }

  if (!trailingZeros) {
    formatted = formatted.replace(/0+$/, "");
  }

  if (withPlusSign && parts.sign === "+") {
    formatted = `+${formatted}`;
  }

  return formatted;
};

export const formatIntegerPart = (
  integerPart: number,
  locale = config.defaultLocale
) => {
  return new Intl.NumberFormat(locale).format(integerPart);
};

export const formatParts = (
  m: Money,
  locale = config.defaultLocale
): {
  whole: string;
  wholeFormatted: string;
  cents: string;
  currencySymbol: string;
  decimalSeparator: string;
  sign: "+" | "-" | "";
} => {
  const { symbol, precision } = getCurrency(m.currency);
  const { decimalSeparator } = getLocale(locale);
  const { whole, cents } = split(m);
  const absWhole = Math.abs(whole);
  const wholeFormatted = formatIntegerPart(absWhole, locale);
  const sign = getAmountSign(m);

  return {
    whole: `${absWhole}`,
    wholeFormatted,
    cents: `${Math.abs(cents)}`.padStart(precision, "0"),
    currencySymbol: symbol,
    decimalSeparator,
    sign,
  };
};

// ------ Parsing ------ //

export const parse = (
  s: string,
  currency: string,
  locale = config.defaultLocale,
  decimalSeparator?: "." | ","
): Money => {
  const _decimalSeparator =
    decimalSeparator ?? getLocale(locale).decimalSeparator;
  const amountFloatString = {
    ",": () =>
      s
        .replace(/[^0-9.,]/g, "")
        .replace(/\./g, "")
        .replace(/\,/g, "."),
    ".": () => s.replace(/[^0-9.,]/g, "").replace(/\,/g, ""),
  }[_decimalSeparator]();
  const parsedFloat = parseFloat(amountFloatString);
  const amountFloat = Number.isNaN(parsedFloat) ? 0 : parsedFloat;

  return fromFloat(amountFloat, currency);
};

// ------ Helper methods ------ //

const getCurrencyScale = (m: Money): number => {
  return 10 ** getCurrency(m.currency).precision;
};

const getAmountSign = (m: Money) => {
  if (m.amount > 0) {
    return "+";
  }
  if (m.amount < 0) {
    return "-";
  }
  return "";
};
