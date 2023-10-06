import { roundBank } from "./helpers";

type Config = {
  currencies: Record<string, Currency>;
  defaultCurrency: string;
  locales: Record<string, Locale>;
  defaultLocale: string;
  defaultRoundingMethod: "bankers" | "up" | "down" | "round";
};

type Currency = {
  /**
   * Currency code - can be any string
   */
  code: string;
  /**
   * Symbol to be used when formatting, eg. €
   */
  symbol: string;
  /**
   * Scaling factor
   */
  precision: number;
};

type Locale = {
  countryCode: string;
  decimalSeparator: "." | ",";
};

export const defaultConfig = {
  currencies: [
    {
      code: "EUR" as const,
      symbol: "€" as const,
      scale: 2,
    },
    {
      code: "USD" as const,
      symbol: "$" as const,
      scale: 2,
    },
    {
      code: "BTC" as const,
      symbol: "₿" as const,
      scale: 8,
    },
  ],
  defaultCurrency: "EUR" as const,
  defaultRoundingMethod: "bankers" as const,
};

export const config: Config = {
  defaultCurrency: "EUR",
  defaultLocale: "NL",
  defaultRoundingMethod: "bankers",
  currencies: {
    EUR: {
      code: "EUR",
      symbol: "€",
      precision: 2,
    },
    USD: {
      code: "USD",
      symbol: "$",
      precision: 2,
    },
    BTC: {
      code: "BTC",
      symbol: "₿",
      precision: 8,
    },
  },
  locales: {
    IE: {
      countryCode: "IE",
      decimalSeparator: ".",
    },
    NL: {
      countryCode: "NL",
      decimalSeparator: ",",
    },
  },
};

export const getLocale = (locale = config.defaultLocale) => ({
  ...config.locales[locale],
});

export const getCurrency = (currency = config.defaultCurrency) => ({
  ...config.currencies[currency],
});

export const getDefaultRounder = () => {
  switch (config.defaultRoundingMethod) {
    case "bankers":
      return roundBank;
    case "up":
      return Math.ceil;
    case "down":
      return Math.floor;
    case "round":
      return Math.round;
    default:
      return roundBank;
  }
};

const validate = (c: Config): void => {
  if (!c) {
    throw new Error("money lib config invalid");
  }
};

export const setConfig = (c: Partial<Config>): void => {
  validate(Object.assign(config, c));
};
