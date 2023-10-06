import { fromFloat } from "./money";
import type { Money } from "./types";
import m from "..";

type Config = {
  currencies: Array<{
    code: string;
    symbol: string;
  }>;
  defaultCurrency: string;
  defaultRoundingMethod: "bankers" | "up" | "down" | "round";
};

type Input<CurrencyCode extends string, CurrencySymbol extends string> =
  | number
  | `${number}`
  | `${CurrencySymbol}${number}`
  | `${CurrencySymbol} ${number}`
  | `${number}${Lowercase<CurrencyCode>}`
  | `${number} ${Lowercase<CurrencyCode>}`
  | `${number}${CurrencyCode}`
  | `${number} ${CurrencyCode}`;

const parseMoney = <CurrencyCode extends string, CurrencySymbol extends string>(
  input: Input<CurrencyCode, CurrencySymbol>,
  config: Config
): Money => {
  if (typeof input === "number") {
    return fromFloat(input, config.defaultCurrency);
  }

  const stringInput = input.trim().toLocaleUpperCase();

  const amount = parseFloat(stringInput.replace(/[^-0-9.]/g, "")) || 0;

  const currency =
    config.currencies.find((c) => stringInput.startsWith(c.symbol)) ||
    config.currencies.find((c) => stringInput.endsWith(c.code));

  return fromFloat(amount, currency?.code ?? config.defaultCurrency);
};

export const setup = <
  C extends Config,
  CurrencyCode extends C["currencies"][number]["code"],
  CurrencySymbol extends C["currencies"][number]["symbol"]
>(
  config: C
) => {
  const money = (
    input:
      | number
      | `${number}`
      | `${CurrencySymbol}${number}`
      | `${CurrencySymbol} ${number}`
      | `${number}${Lowercase<CurrencyCode>}`
      | `${number} ${Lowercase<CurrencyCode>}`
      | `${number}${CurrencyCode}`
      | `${number} ${CurrencyCode}`,
    currency?: CurrencyCode | Lowercase<CurrencyCode>
  ) => {
    const parsedMoney = parseMoney(input, config);

    return m({
      amount: parsedMoney.amount,
      currency: currency ?? parsedMoney.currency ?? config.defaultCurrency,
    });
  };

  return {
    money,
  };
};
