import { config, getCurrency, getLocale } from "./config";

export type Money = {
  amount: number; // Integer representing cents
  currency: string; // Currency code (ISO 4217)
};

// ------ Initialization ------ //

export const zero = (currency = config.defaultCurrency) => {
  return { amount: 0, currency };
};

export const fromInt = (
  amount: number,
  currency = config.defaultCurrency
): Money => {
  return { amount, currency };
};

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

// ------ Serialization ------ //

export const toInt = (m: Money): number => {
  return m.amount;
};

export const toFloat = (m: Money): number => {
  const scale = getCurrencyScale(m);
  const { whole, cents } = split(m);

  return whole + cents / scale;
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
  multiplier: number,
  round = Math.round
): Money => {
  return fromInt(round(m.amount * multiplier), m.currency);
};

export const divide = (
  m: Money,
  divider: number,
  round = Math.round
): Money => {
  return fromInt(round(m.amount / divider), m.currency);
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

// ------ Validation ------ //

export const isValid = (m: any): m is Money => {
  return Boolean(
    typeof m === "object" &&
      (m.amount || m.amount === 0) &&
      typeof m.currency === "string" &&
      m.currency.length > 0
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

export const format = (m: Money, locale = config.defaultLocale): string => {
  const parts = formatParts(m, locale);
  const signSymbol = parts.sign === "-" ? "-" : "";

  return `${signSymbol}${parts.currencySymbol}${parts.wholeFormatted}${parts.decimalSeparator}${parts.cents}`;
};

/**
 * Format integer part without leading zeros for negative amounts
 */
export const formatIntegerPart = (
  integerPart: number,
  locale = config.defaultLocale,
  platform = detectPlatform()
) => {
  const { decimalSeparator } = getLocale(locale);

  const formattedIntegerPart =
    platform === "react-native"
      ? integerPart
          .toFixed(0)
          .replace(
            /\B(?=(\d{3})+(?!\d))/g,
            decimalSeparator === "," ? "." : ","
          )
      : new Intl.NumberFormat(locale).format(integerPart);

  return formattedIntegerPart.replace(/^-/, "");
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
  const wholeFormatted = formatIntegerPart(whole, locale);
  const sign = getAmountSign(m);

  return {
    whole: `${whole}`,
    wholeFormatted,
    cents: `${Math.abs(cents)}`.padEnd(precision, "0"),
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
  const amountFloat = isNaN(parsedFloat) ? 0 : parsedFloat;

  return fromFloat(amountFloat, currency);
};

// ------ Helper methods ------ //

const getCurrencyScale = (m: Money): number => {
  return 10 ** getCurrency(m.currency).precision;
};

const detectPlatform = (): "browser" | "react-native" | "node" => {
  if (typeof document !== "undefined") {
    return "browser";
  }

  if (
    (typeof navigator !== "undefined" && navigator.product === "ReactNative") ||
    (typeof global !== "undefined" && "__reactNativeVersion__" in global)
  ) {
    return "react-native";
  }

  return "node";
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
