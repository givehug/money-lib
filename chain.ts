import {
  zero,
  fromInt,
  fromFloat,
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
} from "./money";

import type { Money } from "./money";

type ChainedMoney = { toJSON: () => Money };

// Helper wrapper to allow chaining
const moneyChain = (money: Money | ChainedMoney = zero()) => {
  // unwrap Money from chain, or init with zero value
  const _m: Money = isValid(money) ? money : money.toJSON();

  return {
    zero: () => moneyChain(zero()),

    fromInt: (amount: number, currency?: string) =>
      moneyChain(fromInt(amount, currency)),

    fromFloat: (amount: number, currency?: string) =>
      moneyChain(fromFloat(amount, currency)),

    toInt: () => toInt(_m),

    toFloat: () => toFloat(_m),

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

    format: (locale?: string) => format(_m, locale),

    formatParts: (locale?: string) => formatParts(_m, locale),

    parse,

    debug: (prefix = "money:") => {
      console.log(prefix, _m);
      return moneyChain(_m);
    },

    toJSON: () => _m,
  };
};

export default moneyChain;
