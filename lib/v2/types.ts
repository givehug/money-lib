import { Cents, Money } from "../types";

export const symbolChain = Symbol("moneyChainV2");

export type ConfigV2<CC extends string, CS extends string> = {
  currencies: Array<{
    code: CC;
    symbol: CS;
    scale: number;
  }>;
  defaultCurrency: CC;
  defaultRoundingMethod: "bankers" | "up" | "down" | "round";
};

export type MoneyV2<
  CurrencyCode extends string,
  CurrencySymbol extends string
> =
  | Money
  | number
  | `${number}`
  | `${CurrencySymbol}${number}`
  | `${CurrencySymbol} ${number}`
  | `${number}${Lowercase<CurrencyCode>}`
  | `${number} ${Lowercase<CurrencyCode>}`
  | `${number}${CurrencyCode}`
  | `${number} ${CurrencyCode}`;

type MC<CC extends string, CS extends string> =
  | MoneyV2<CC, CS>
  | ChainedMoneyV2<CC, CS>;

export type ChainedMoneyV2<CC extends string, CS extends string> = {
  // --- Comparison ---

  /**
   * Compare
   */
  cmp: (m: MC<CC, CS>) => 1 | 0 | -1;

  /**
   * Equal
   */
  eq: (m: MC<CC, CS>) => boolean;

  /**
   * Greater than
   */
  gt: (m: MC<CC, CS>) => boolean;

  /**
   * Greater than or equal
   */
  gte: (m: MC<CC, CS>) => boolean;

  /**
   * Less than
   */
  lt: (m: MC<CC, CS>) => boolean;

  /**
   * Less than or equal
   */
  lte: (m: MC<CC, CS>) => boolean;

  /**
   * Check if a Money is zero
   */
  is0: () => boolean;

  /**
   * Check if a Money is positive
   */
  isPos: () => boolean;

  /**
   * Check if a Money is negative
   */
  isNeg: () => boolean;

  /**
   * Get min from multiple Money inputs
   */
  min: (m1: MC<CC, CS>, ...m: MC<CC, CS>[]) => ChainedMoneyV2<CC, CS>;

  /**
   * Get max from multiple Money inputs
   */
  max: (m1: MC<CC, CS>, ...m: MC<CC, CS>[]) => ChainedMoneyV2<CC, CS>;

  // --- Validation ---

  /**
   * Check if a Money is valid
   */
  validate: () => boolean;

  // --- Transformation ---

  /**
   * Split Money into a whole and cents part
   * @example split(m) -> { whole: 1, cents: 50 }
   */
  split: () => {
    base: number;
    cents: number;
  };

  // --- Arithmetic ---

  /**
   * Add multiple Money inputs
   */
  add: (m1: MC<CC, CS>, ...m: MC<CC, CS>[]) => ChainedMoneyV2<CC, CS>;

  /**
   * Subtract multiple Money inputs
   */
  sub: (m1: MC<CC, CS>, ...m: MC<CC, CS>[]) => ChainedMoneyV2<CC, CS>;

  /**
   * Multiply Money by a number
   */
  mul: (
    multiplier: number,
    round?: (n: number) => number
  ) => ChainedMoneyV2<CC, CS>;

  /**
   * Divide Money by a number
   */
  div: (
    divider: number,
    round?: (n: number) => number
  ) => ChainedMoneyV2<CC, CS>;

  /**
   * Return the absolute value of a Money
   */
  abs: () => ChainedMoneyV2<CC, CS>;

  // --- Formatting ---

  /**
   * Format Money
   */
  fmt: (ops?: {
    locale?: string;
    /**
     * default: true; if false, 00 cents will be omitted
     */
    cents?: boolean;
    /**
     * default: true; if false, 1.50 will be formatted as 1.5
     */
    trailingZeros?: boolean;
    /**
     * default: false; if true, positive numbers will be prefixed with a plus sign
     */
    withPlusSign?: boolean;
  }) => string;

  /**
   * Advanced Money formatter
   */
  fmts: (locale?: string) => {
    whole: string;
    wholeFormatted: string;
    cents: string;
    currencySymbol: string;
    decimalSeparator: string;
    sign: "+" | "-" | "";
  };

  // --- Parsing ---

  /**
   * Parse a string into a Money object
   */
  parse: (
    s: string,
    currency: string,
    locale?: string,
    decimalSeparator?: "." | ","
  ) => ChainedMoneyV2<CC, CS>;

  // --- Debug ---

  /**
   * Log a Money object to the console
   */
  debug: (prefix?: string) => ChainedMoneyV2<CC, CS>;

  // --- Serialization ---

  /**
   * Return the Money object
   */
  json: () => Money;

  // --- Conversion ---

  /**
   * Return the Money object as an int
   */
  int: () => Cents;

  /**
   * Return the Money object as an int (alias for toInt)
   */
  cents: () => Cents;

  /**
   * Return the Money object as a float
   */
  float: () => number;
  number: () => number;

  /**
   * Return the Money object as a string
   */
  centStr: () => string;

  /**
   * Return the Money object as a string
   */
  string: () => string;

  [symbolChain]: true;
};
