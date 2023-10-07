import * as money from "../core";
import type { Money } from "../types";
import type { ChainedMoneyV2, ConfigV2, MoneyV2 } from "./types";
import { symbolChain } from "./types";
import { setConfig, config } from "../config";
import { parseMoneyInput } from "./helpers";

export const moneyChain = <CC extends string, CS extends string>(
  input: MoneyV2<CC, CS> | ChainedMoneyV2<CC, CS>,
  currency?: CC | Lowercase<CC>
): ChainedMoneyV2<CC, CS> => {
  const nextChain = moneyChain<CC, CS>;
  const parse = parseMoneyInput<CC, CS>;

  const _m = parse(input);
  _m.currency = currency || _m.currency || config.defaultCurrency;

  const _chain: ChainedMoneyV2<CC, CS> = {
    int: () => money.toInt(_m),
    cents: () => money.toInt(_m),
    float: () => money.toFloat(_m),
    number: () => money.toFloat(_m),

    string: () => money.toFloatString(_m),
    centStr: () => money.toString(_m),

    cmp: (m) => money.compare(_m, parse(m)),

    eq: (m) => money.equals(_m, parse(m)),

    gt: (m) => money.greaterThan(_m, parse(m)),

    gte: (m) => money.greaterThanOrEqual(_m, parse(m)),

    lt: (m) => money.lessThan(_m, parse(m)),

    lte: (m) => money.lessThanOrEqual(_m, parse(m)),

    is0: () => money.isZero(_m),

    isPos: () => money.isPositive(_m),

    isNeg: () => money.isNegative(_m),

    min: (m1, ...m) => nextChain(money.min(parse(m1), ...m.map(parse))),

    max: (m1, ...m) => nextChain(money.max(parse(m1), ...m.map(parse))),

    validate: () => money.isValid(_m),

    split: () => {
      const split = money.split(_m);
      return {
        base: split.whole,
        cents: split.cents,
      };
    },

    add: (m1, ...m) => nextChain(money.add(_m, parse(m1), ...m.map(parse))),

    sub: (m1, ...m) =>
      nextChain(money.subtract(_m, parse(m1), ...m.map(parse))),

    mul: (multiplier: number, round = Math.round) =>
      nextChain(money.multiply(_m, multiplier, round)),

    div: (divider: number, round = Math.round) =>
      nextChain(money.divide(_m, divider, round)),

    abs: () => nextChain(money.abs(_m)),

    fmt: (ops?: {
      locale?: string;
      cents?: boolean;
      withPlusSign?: boolean;
      trailingZeros?: boolean;
    }) => money.format(_m, ops),

    fmts: (locale?: string) => money.formatParts(_m, locale),

    parse: (
      s: string,
      currency: string,
      locale?: string,
      decimalSeparator?: "." | ","
    ) => nextChain(money.parse(s, currency, locale, decimalSeparator)),

    debug: (prefix = "money:") => {
      console.log(prefix, _m);
      return nextChain(_m);
    },

    json: () => _m,

    [symbolChain]: true,
  };

  return _chain;
};

export const setupMoney = <CC extends string, CS extends string>(
  cfg: ConfigV2<CC, CS>
) => {
  setConfig({
    defaultCurrency: cfg.defaultCurrency,
    defaultRoundingMethod: cfg.defaultRoundingMethod,
    currencies: Object.fromEntries(
      cfg.currencies.map((c) => [
        c.code,
        {
          code: c.code,
          symbol: c.symbol,
          precision: c.scale,
        },
      ])
    ),
  });

  return {
    money: moneyChain<CC, CS>,
  };
};
