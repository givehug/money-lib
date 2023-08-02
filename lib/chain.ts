import { config } from "./config";
import {
  zero,
  fromInt,
  fromFloat,
  fromFloatString,
  fromIntString,
  toInt,
  toFloat,
  add,
  subtract,
  multiply,
  divide,
  compare,
  equals,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  isZero,
  isPositive,
  isNegative,
  isValid,
  split,
  format,
  formatParts,
  parse,
  toString,
  toFloatString,
  min,
  max,
} from "./money";

import type { Cents, Money } from "./money";

type ChainedMoney = {
  // --- Initialization ---

  /**
   * Init money with zero value
   * @example zero() -> Money{amount: 0, currency: "EUR"};
   */
  zero: () => ChainedMoney;

  /**
   * Init money from a int number (cents), eg 42 (42 cents)
   * @example fromInt(42, 'EUR') -> Money{amount: 42, currency: "EUR"};
   */
  fromInt: (amount: Cents, currency?: string) => ChainedMoney;

  /**
   * Init money from a float number (euros.cents), eg 42.99 (42 euros and 99 cents)
   * @example fromFloat(42.99, 'EUR') -> Money{amount: 4299, currency: "EUR"};
   */
  fromFloat: (amount: number, currency?: string) => ChainedMoney;

  /**
   * Parse money represented as a int string in cents, eg "150" (150 cents)
   */
  fromIntString: (amount: string, currency?: string) => ChainedMoney;

  /**
   * Parse money represented as a float string, eg "100.45" (100 euros and 45 cents)
   */
  fromFloatString: (amount: string, currency?: string) => ChainedMoney;

  // --- Comparison ---
  compare: (m: Money | ChainedMoney) => number;
  equals: (m: Money | ChainedMoney) => boolean;
  greaterThan: (m: Money | ChainedMoney) => boolean;
  greaterThanOrEqual: (m: Money | ChainedMoney) => boolean;
  lessThan: (m: Money | ChainedMoney) => boolean;
  lessThanOrEqual: (m: Money | ChainedMoney) => boolean;
  isZero: () => boolean;
  isPositive: () => boolean;
  isNegative: () => boolean;
  min: (
    m1: Money | ChainedMoney,
    ...m: (Money | ChainedMoney)[]
  ) => ChainedMoney;
  max: (
    m1: Money | ChainedMoney,
    ...m: (Money | ChainedMoney)[]
  ) => ChainedMoney;

  // --- Validation ---
  isValid: () => boolean;

  // --- Transformation ---
  split: () => {
    whole: number;
    cents: number;
  };

  // --- Arithmetic ---
  add: (m: Money | ChainedMoney) => ChainedMoney;
  subtract: (m: Money | ChainedMoney) => ChainedMoney;
  multiply: (multiplier: number, round?: (n: number) => number) => ChainedMoney;
  divide: (divider: number, round?: (n: number) => number) => ChainedMoney;

  // --- Formatting ---
  format: (ops?: {
    cents?: boolean;
    locale?: string;
    trailingZeros?: boolean;
  }) => string;
  formatParts: (locale?: string) => {
    whole: string;
    wholeFormatted: string;
    cents: string;
    currencySymbol: string;
    decimalSeparator: string;
    sign: "+" | "-" | "";
  };

  // --- Parsing ---
  parse: (
    s: string,
    currency: string,
    locale?: string,
    decimalSeparator?: "." | ","
  ) => ChainedMoney;

  // --- Debug ---
  debug: (prefix?: string) => ChainedMoney;

  // --- Serialization ---
  toJSON: () => Money;
  toInt: () => Cents;
  toCents: () => Cents;
  toFloat: () => number;
  toString: () => string;
  toIntString: () => string;
  toCentsString: () => string;
  toFloatString: () => string;
};

// Helper wrapper to allow chaining
const moneyChain = (money: Money | ChainedMoney = zero()): ChainedMoney => {
  // unwrap Money from chain, or init with zero value
  const _m: Money = isValid(money) ? money : money.toJSON();
  _m.currency = _m.currency || config.defaultCurrency;

  return {
    zero: () => moneyChain(zero()),

    fromInt: (amount: Cents, currency?: string) =>
      moneyChain(fromInt(amount, currency)),

    fromFloat: (amount: number, currency?: string) =>
      moneyChain(fromFloat(amount, currency)),

    fromIntString: (amount: string, currency?: string) =>
      moneyChain(fromIntString(amount, currency)),

    fromFloatString: (amount: string, currency?: string) =>
      moneyChain(fromFloatString(amount, currency)),

    toInt: () => toInt(_m),
    toCents: () => toInt(_m),
    toFloat: () => toFloat(_m),

    toString: () => toString(_m),
    toIntString: () => toString(_m),
    toCentsString: () => toString(_m),
    toFloatString: () => toFloatString(_m),

    compare: (m: Money | ChainedMoney) => compare(_m, moneyChain(m).toJSON()),

    equals: (m: Money | ChainedMoney) => equals(_m, moneyChain(m).toJSON()),

    greaterThan: (m: Money | ChainedMoney) =>
      greaterThan(_m, moneyChain(m).toJSON()),

    greaterThanOrEqual: (m: Money | ChainedMoney) =>
      greaterThanOrEqual(_m, moneyChain(m).toJSON()),

    lessThan: (m: Money | ChainedMoney) => lessThan(_m, moneyChain(m).toJSON()),

    lessThanOrEqual: (m: Money | ChainedMoney) =>
      lessThanOrEqual(_m, moneyChain(m).toJSON()),

    isZero: () => isZero(_m),

    isPositive: () => isPositive(_m),

    isNegative: () => isNegative(_m),

    min: (m1: Money | ChainedMoney, ...m: (Money | ChainedMoney)[]) =>
      moneyChain(
        min(moneyChain(m1).toJSON(), ...m.map((m) => moneyChain(m).toJSON()))
      ),

    max: (m1: Money | ChainedMoney, ...m: (Money | ChainedMoney)[]) =>
      moneyChain(
        max(moneyChain(m1).toJSON(), ...m.map((m) => moneyChain(m).toJSON()))
      ),

    isValid: () => isValid(_m),

    split: () => split(_m),

    add: (m: Money | ChainedMoney) =>
      moneyChain(add(_m, moneyChain(m).toJSON())),

    subtract: (m: Money | ChainedMoney) =>
      moneyChain(subtract(_m, moneyChain(m).toJSON())),

    multiply: (multiplier: number, round = Math.round) =>
      moneyChain(multiply(_m, multiplier, round)),

    divide: (divider: number, round = Math.round) =>
      moneyChain(divide(_m, divider, round)),

    format: (ops?: { cents?: boolean; locale?: string }) => format(_m, ops),

    formatParts: (locale?: string) => formatParts(_m, locale),

    parse: (
      s: string,
      currency: string,
      locale?: string,
      decimalSeparator?: "." | ","
    ) => moneyChain(parse(s, currency, locale, decimalSeparator)),

    debug: (prefix = "money:") => {
      console.log(prefix, _m);
      return moneyChain(_m);
    },

    toJSON: () => _m,
  };
};

export default moneyChain;
