import * as money from "./money";
import {
  symbolChain,
  type ChainedMoneyV2,
  type ConfigV2,
  type Money,
  type MoneyV2,
} from "./types";

import { setConfig, config as defaultConfig } from "./config";

const isMoneyChain = (m: any): m is ChainedMoneyV2<any, any> => {
  return Boolean(m && m[symbolChain]);
};

const makeMoneyParser =
  <CC extends string, CS extends string>(config: ConfigV2<CC, CS>) =>
  (input: MoneyV2<CC, CS> | ChainedMoneyV2<CC, CS>): Money => {
    if (isMoneyChain(input)) {
      return input.json();
    }

    if (money.isValid(input)) {
      return input;
    }

    if (typeof input === "number") {
      return money.fromFloat(input, config.defaultCurrency);
    }

    const stringInput = input.trim().toLocaleUpperCase();

    const amount = parseFloat(stringInput.replace(/[^-0-9.]/g, "")) || 0;

    const currency =
      config.currencies.find((c) => stringInput.startsWith(c.symbol)) ||
      config.currencies.find((c) => stringInput.endsWith(c.code));

    return money.fromFloat(amount, currency?.code ?? config.defaultCurrency);
  };

export const moneyChain =
  <CC extends string, CS extends string>(config: ConfigV2<CC, CS>) =>
  (
    input: MoneyV2<CC, CS> | ChainedMoneyV2<CC, CS>,
    currency?: CC | Lowercase<CC>
  ): ChainedMoneyV2<CC, CS> => {
    const nextChain = moneyChain(config);

    const parseMoney = makeMoneyParser(config);

    const _m = parseMoney(input);

    _m.currency =
      currency ||
      _m.currency ||
      config.defaultCurrency ||
      defaultConfig.defaultCurrency;

    const _chain: ChainedMoneyV2<CC, CS> = {
      int: () => money.toInt(_m),
      cents: () => money.toInt(_m),
      float: () => money.toFloat(_m),
      number: () => money.toFloat(_m),

      string: () => money.toFloatString(_m),
      centStr: () => money.toString(_m),

      cmp: (m) => money.compare(_m, parseMoney(m)),

      eq: (m) => money.equals(_m, parseMoney(m)),

      gt: (m) => money.greaterThan(_m, parseMoney(m)),

      gte: (m) => money.greaterThanOrEqual(_m, parseMoney(m)),

      lt: (m) => money.lessThan(_m, parseMoney(m)),

      lte: (m) => money.lessThanOrEqual(_m, parseMoney(m)),

      is0: () => money.isZero(_m),

      isPos: () => money.isPositive(_m),

      isNeg: () => money.isNegative(_m),

      min: (m1, ...m) =>
        nextChain(money.min(parseMoney(m1), ...m.map(parseMoney))),

      max: (m1, ...m) =>
        nextChain(money.max(parseMoney(m1), ...m.map(parseMoney))),

      validate: () => money.isValid(_m),

      split: () => money.split(_m),

      add: (m1, ...m) =>
        nextChain(money.add(_m, parseMoney(m1), ...m.map(parseMoney))),

      sub: (m1, ...m) =>
        nextChain(money.subtract(_m, parseMoney(m1), ...m.map(parseMoney))),

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

export const setup = <CC extends string, CS extends string>(
  config?: ConfigV2<CC, CS>
) => {
  config ??= {
    defaultCurrency: defaultConfig.defaultCurrency as CC,
    defaultRoundingMethod: defaultConfig.defaultRoundingMethod,
    currencies: Object.values(defaultConfig.currencies).map((c) => ({
      code: c.code as CC,
      symbol: c.symbol as CS,
      scale: c.precision,
    })),
  };

  setConfig({
    defaultCurrency: config.defaultCurrency,
    defaultRoundingMethod: config.defaultRoundingMethod,
    currencies: Object.fromEntries(
      config.currencies.map((c) => [
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
    money: moneyChain(config),
  };
};
