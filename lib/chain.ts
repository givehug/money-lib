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
} from "./money";

import type { ChainedMoney, ChainedMoneyV2, Cents, Money } from "./types";

// unwrap Money from chain, or init with zero value
const unwrap = (m: Money | ChainedMoney): Money => {
  return isValid(m) ? m : m.toJSON();
};

// Helper wrapper to allow chaining
const moneyChain = (money: Money | ChainedMoney = zero()): ChainedMoney => {
  const _m = unwrap(money);
  _m.currency = _m.currency || config.defaultCurrency;

  return {
    // Not in V2
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

// unwrap Money from chain, or init with zero value
const unwrapV2 = (m: Money | ChainedMoneyV2): Money => {
  return isValid(m) ? m : m.json();
};

// Helper wrapper to allow chaining
export const moneyChainV2 = (
  money: Money | ChainedMoneyV2 = zero()
): ChainedMoneyV2 => {
  const _m = unwrapV2(money);
  _m.currency = _m.currency || config.defaultCurrency;

  return {
    int: () => toInt(_m),

    cents: () => toInt(_m),
    float: () => toFloat(_m),
    number: () => toFloat(_m),

    string: () => toFloatString(_m),
    centStr: () => toString(_m),

    cmp: (m: Money | ChainedMoneyV2) => compare(_m, unwrapV2(m)),

    eq: (m: Money | ChainedMoneyV2) => equals(_m, unwrapV2(m)),

    gt: (m: Money | ChainedMoneyV2) => greaterThan(_m, unwrapV2(m)),

    gte: (m: Money | ChainedMoneyV2) => greaterThanOrEqual(_m, unwrapV2(m)),

    lt: (m: Money | ChainedMoneyV2) => lessThan(_m, unwrapV2(m)),

    lte: (m: Money | ChainedMoneyV2) => lessThanOrEqual(_m, unwrapV2(m)),

    is0: () => isZero(_m),

    isPos: () => isPositive(_m),

    isNeg: () => isNegative(_m),

    min: (m1: Money | ChainedMoneyV2, ...m: (Money | ChainedMoneyV2)[]) =>
      moneyChainV2(min(unwrapV2(m1), ...m.map(unwrapV2))),

    max: (m1: Money | ChainedMoneyV2, ...m: (Money | ChainedMoneyV2)[]) =>
      moneyChainV2(max(unwrapV2(m1), ...m.map(unwrapV2))),

    validate: () => isValid(_m),

    split: () => split(_m),

    add: (m1: Money | ChainedMoneyV2, ...m: (Money | ChainedMoneyV2)[]) =>
      moneyChainV2(add(_m, unwrapV2(m1), ...m.map(unwrapV2))),

    sub: (m1: Money | ChainedMoneyV2, ...m: (Money | ChainedMoneyV2)[]) =>
      moneyChainV2(subtract(_m, unwrapV2(m1), ...m.map(unwrapV2))),

    mul: (multiplier: number, round = Math.round) =>
      moneyChainV2(multiply(_m, multiplier, round)),

    div: (divider: number, round = Math.round) =>
      moneyChainV2(divide(_m, divider, round)),

    abs: () => moneyChainV2(abs(_m)),

    fmt: (ops?: {
      locale?: string;
      cents?: boolean;
      withPlusSign?: boolean;
      trailingZeros?: boolean;
    }) => format(_m, ops),

    fmts: (locale?: string) => formatParts(_m, locale),

    parse: (
      s: string,
      currency: string,
      locale?: string,
      decimalSeparator?: "." | ","
    ) => moneyChainV2(parse(s, currency, locale, decimalSeparator)),

    debug: (prefix = "money:") => {
      console.log(prefix, _m);
      return moneyChainV2(_m);
    },

    json: () => _m,
  };
};

export default moneyChain;
