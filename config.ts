type Config = {
  currencies: Record<string, Currency>;
  defaultCurrency: string;
  // locales: Record<string, Locale>;
  defaultLocale?: string;
};

type Currency = {
  precision: number;
  code: string;
  symbol: string;
};

// type Locale = {
//   countryCode: string;
//   decimalSeparator: "." | ",";
// };

export const config: Config = {
  defaultCurrency: "EUR",
  defaultLocale: "NL",
  currencies: {
    EUR: {
      code: "EUR",
      symbol: "€",
      precision: 2,
    },
  },
  // locales: {
  //   IE: {
  //     countryCode: "IE",
  //     decimalSeparator: ",",
  //   },
  //   NL: {
  //     countryCode: "NL",
  //     decimalSeparator: ".",
  //   },
  // },
};

// export const getLocale = (locale = config.defaultLocale) =>
//   config.locales[locale];

export const getCurrency = (currency = config.defaultCurrency) =>
  config.currencies[currency];

const validate = (c: Config): void => {
  if (!c) {
    throw new Error("money lib config invalid");
  }
};

export const setConfig = (c: Partial<Config>): void => {
  validate(Object.assign(config, c));
};
