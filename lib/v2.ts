import { fromFloat, isValid } from "./money";
import type { ConfigV2, Money, MoneyV2 } from "./types";
import { moneyChainV2 } from "./chain";
import { setConfig } from "./config";

const parseMoney = <CurrencyCode extends string, CurrencySymbol extends string>(
  input: MoneyV2<CurrencyCode, CurrencySymbol>,
  config: ConfigV2
): Money => {
  if (isValid(input)) {
    return input;
  }

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

export const setupV2 = <
  C extends ConfigV2,
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

    return moneyChainV2({
      amount: parsedMoney.amount,
      currency: currency ?? parsedMoney.currency ?? config.defaultCurrency,
    });
  };

  return {
    money,
  };
};
