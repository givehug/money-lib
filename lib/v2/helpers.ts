import * as money from "../core";
import type { Money } from "../types";
import type { ChainedMoneyV2, MoneyV2 } from "./types";
import { symbolChain } from "./types";
import { config } from "../config";

export const isMoneyChain = <CC extends string, CS extends string>(
  m: any
): m is ChainedMoneyV2<CC, CS> => {
  return typeof m === "object" && m !== null && symbolChain in m;
};

export const parseMoneyInput = <CC extends string, CS extends string>(
  input?: MoneyV2<CC, CS> | ChainedMoneyV2<CC, CS>
): Money => {
  if (input === undefined || input === null) {
    return { amount: 0, currency: config.defaultCurrency };
  }

  if (typeof input === "object" && "cents" in input && "currency" in input) {
    return money.fromInt(input.cents, input.currency);
  }

  if (typeof input === "object" && "decimal" in input && "currency" in input) {
    return money.fromFloat(input.decimal, input.currency);
  }

  if (typeof input === "number") {
    return money.fromFloat(input, config.defaultCurrency);
  }

  if (isMoneyChain<CC, CS>(input)) {
    return input.json();
  }

  if (money.isValid(input)) {
    return input;
  }

  let stringInput = input.trim().toLocaleUpperCase();

  const hasCents = stringInput.includes("CENTS");

  stringInput = stringInput.replace("CENTS", "");

  const amount =
    parseFloat(
      stringInput
        .replace(/,/g, ".") // treat comma as decimal separator
        .replace(/[^-0-9.]/g, "") // remove non-number related
    ) || 0;

  const currencies = Object.values(config.currencies);

  const currency =
    currencies.find((c) => stringInput.startsWith(c.symbol)) ||
    currencies.find((c) => stringInput.endsWith(c.code));

  const from = hasCents ? money.fromInt : money.fromFloat;

  return from(amount, currency?.code ?? config.defaultCurrency);
};
