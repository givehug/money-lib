import { config, setConfig } from "./config";
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
  abs,
} from "./core";

import type { ChainedMoney, Cents, Money } from "./types";

// unwrap Money from chain, or init with zero value
const unwrap = (m: Money | ChainedMoney): Money => {
  return isValid(m) ? m : m.toJSON();
};

/**
 * @deprecated Use V2
 * @example import { money } from "money-lib/dist/v2"
 */
const moneyChain = (money: Money | ChainedMoney = zero()): ChainedMoney => {
  const _m = unwrap(money);
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

    compare: (m: Money | ChainedMoney) => compare(_m, unwrap(m)),

    equals: (m: Money | ChainedMoney) => equals(_m, unwrap(m)),

    greaterThan: (m: Money | ChainedMoney) => greaterThan(_m, unwrap(m)),

    greaterThanOrEqual: (m: Money | ChainedMoney) =>
      greaterThanOrEqual(_m, unwrap(m)),

    lessThan: (m: Money | ChainedMoney) => lessThan(_m, unwrap(m)),

    lessThanOrEqual: (m: Money | ChainedMoney) =>
      lessThanOrEqual(_m, unwrap(m)),

    isZero: () => isZero(_m),

    isPositive: () => isPositive(_m),

    isNegative: () => isNegative(_m),

    min: (m1: Money | ChainedMoney, ...m: (Money | ChainedMoney)[]) =>
      moneyChain(min(unwrap(m1), ...m.map(unwrap))),

    max: (m1: Money | ChainedMoney, ...m: (Money | ChainedMoney)[]) =>
      moneyChain(max(unwrap(m1), ...m.map(unwrap))),

    isValid: () => isValid(_m),

    split: () => split(_m),

    add: (m1: Money | ChainedMoney, ...m: (Money | ChainedMoney)[]) =>
      moneyChain(add(_m, unwrap(m1), ...m.map(unwrap))),

    subtract: (m1: Money | ChainedMoney, ...m: (Money | ChainedMoney)[]) =>
      moneyChain(subtract(_m, unwrap(m1), ...m.map(unwrap))),

    multiply: (multiplier: number, round = Math.round) =>
      moneyChain(multiply(_m, multiplier, round)),

    divide: (divider: number, round = Math.round) =>
      moneyChain(divide(_m, divider, round)),

    abs: () => moneyChain(abs(_m)),

    format: (ops?: {
      locale?: string;
      cents?: boolean;
      withPlusSign?: boolean;
      trailingZeros?: boolean;
    }) => format(_m, ops),

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

moneyChain.config = setConfig;

export default moneyChain;
