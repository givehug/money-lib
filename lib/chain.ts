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

import type { ChainedMoney, Cents, Money } from "./types";

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
