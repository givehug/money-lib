import {
  fromInt,
  format,
  add,
  subtract,
  multiply,
  divide,
  isValid,
  fromFloat,
  zero,
  parse,
} from "./money";

import type { Money } from "./money";

type ChainedMoney = { toJSON: () => Money };

// Helper wrapper to allow chaining
// TODO: can we make it simpler (do we need to)?
const moneyChain = (money: Money | ChainedMoney = zero()) => {
  // unwrap Money from chains, or init with zero value
  const _m: Money = isValid(money) ? money : money.toJSON();

  return {
    fromInt: (amount: number, currency?: string) =>
      moneyChain(fromInt(amount, currency)),

    fromFloat: (amount: number, currency?: string) =>
      moneyChain(fromFloat(amount, currency)),

    add: (m: Money | ChainedMoney) =>
      moneyChain(add(_m, moneyChain(m).toJSON())),

    subtract: (m: Money | ChainedMoney) =>
      moneyChain(subtract(_m, moneyChain(m).toJSON())),

    multiply: (multiplier: number, round = Math.round) =>
      moneyChain(multiply(_m, multiplier, round)),

    divide: (divider: number, round = Math.round) =>
      moneyChain(divide(_m, divider, round)),

    format: (locale?: string) => format(_m, locale),

    parse,

    debug: (prefix = "money:") => {
      console.log(prefix, _m);
      return moneyChain(_m);
    },

    toJSON: () => _m,
  };
};

export default moneyChain;
