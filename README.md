# 💰 money-lib 💰

### _Simple TypeScript library to work with money_

[![NPM Version](https://img.shields.io/npm/v/money-lib)](https://www.npmjs.com/package/money-lib)

### Features

- Works with simple serialized `Money` type which describes monetary `amount` value and `currency` code
  (can be used in your app as you wish, eg in redux state)
- Represents amount values as integers, in cents. This avoids floating point rounding errors.
- Zero dependencies
- Provides initialization, serialization, parsing, formatting, arithmetics, comparison, etc
- Works in browsers, node, react native (soon Deno, maybe already works)
- Inspired by [go-money](https://github.com/Rhymond/go-money) and [js-money](https://github.com/davidkalosi/js-money)

### _Money_ type

```ts
type Money = {
  amount: number; // Integer representing cents
  currency: string; // Currency code (ISO 4217) or whatever you want
};
```

### Usage

**_chained_**:

```ts
import money, { Money } from "money-lib";

const m = money()
  .debug() // money: { amount: 0, currency: 'EUR' }
  .add({ amount: 4499, currency: "EUR" })
  .subtract({ amount: 299, currency: "EUR" })
  .debug() // money: { amount: 4200, currency: 'EUR' }
  .multiply(5.56399)
  .divide(5.56399)
  .format();

console.log(m); // €42,00

// unwrap (serialize) Money from chain
const m2: Money = m.toJSON();

console.log(m2); // { amount: 4200, currency: 'EUR' }
```

<details>
  <summary>or as standalone functions</summary>

```ts
import * as money from "money-lib";

const accountBalance = { amount: 12345699, currency: "EUR" };
const debitTransaction = money.fromFloat(1.99, "EUR");
const balanceAfterDebit = money.subtract(accountBalance, debitTransaction);
const interestRate = 0.12;
const finalBalance = money.add(
  balanceAfterDebit,
  money.multiply(balanceAfterDebit, interestRate)
);

console.log(money.format(finalBalance)); // €138.269,60
```

</details>
<br/>

### API

```ts
type ChainedMoney = {
  // --- Initialization ---

  /**
   * Init money with zero value
   * @example zero() -> Money{amount: 0, currency: "EUR"};
   */
  zero: () => ChainedMoney;

  /**
   * Init money from a int number (cents), eg 42 (42 cents)
   * @example fromInt(42, 'EUR') -> Money{amount: 42, currency: "EUR"};
   */
  fromInt: (amount: number, currency?: string) => ChainedMoney;

  /**
   * Init money from a float number (euros.cents), eg 42.99 (42 euros and 99 cents)
   * @example fromFloat(42.99, 'EUR') -> Money{amount: 4299, currency: "EUR"};
   */
  fromFloat: (amount: number, currency?: string) => ChainedMoney;

  /**
   * Parse money represented as a int string in cents, eg "150" (150 cents)
   */
  fromIntString: (amount: string, currency?: string) => ChainedMoney;

  /**
   * Parse money represented as a float string, eg "100.45" (100 euros and 45 cents)
   */
  fromFloatString: (amount: string, currency?: string) => ChainedMoney;

  // --- Conversion to number ---

  toInt: () => number;
  toFloat: () => number;

  // --- Comparison ---
  compare: (m: Money | ChainedMoney) => number;
  equals: (m: Money | ChainedMoney) => boolean;
  greaterThan: (m: Money | ChainedMoney) => boolean;
  greaterThanOrEqual: (m: Money | ChainedMoney) => boolean;
  lessThan: (m: Money | ChainedMoney) => boolean;
  lessThanOrEqual: (m: Money | ChainedMoney) => boolean;
  isZero: () => boolean;
  isPositive: () => boolean;
  isNegative: () => boolean;

  // --- Validation ---
  isValid: () => boolean;

  // --- Transformation ---
  split: () => {
    whole: number;
    cents: number;
  };

  // --- Arithmetic ---
  add: (m: Money | ChainedMoney) => ChainedMoney;
  subtract: (m: Money | ChainedMoney) => ChainedMoney;
  multiply: (multiplier: number, round?: (n: number) => number) => ChainedMoney;
  divide: (divider: number, round?: (n: number) => number) => ChainedMoney;

  // --- Formatting ---
  format: (ops?: { cents?: boolean; locale?: string }) => string;
  formatParts: (locale?: string) => {
    whole: string;
    wholeFormatted: string;
    cents: string;
    currencySymbol: string;
    decimalSeparator: string;
  };

  // --- Parsing ---
  parse: (
    s: string,
    currency: string,
    locale?: string,
    decimalSeparator?: "." | ","
  ) => ChainedMoney;

  // --- Debug ---
  debug: (prefix?: string) => ChainedMoney;

  // --- Serialization ---
  toJSON: () => Money;
};
```

#### Examples:

<details>
  <summary>fromInt</summary>

```js
fromInt(4299, 'EUR') -> Money{amount: 4299, currency: "EUR"};
```

</details>
<br/>

<details>
  <summary>fromFloat</summary>

```js
fromFloat(42.99, 'EUR') -> Money{amount: 4299, currency: "EUR"};
fromFloat(42.999, 'EUR') -> Money{amount: 4299, currency: "EUR"};
fromFloat(42.9, 'EUR') -> Money{amount: 4290, currency: "EUR"};
```

</details>
<br/>

<details>
  <summary>parse</summary>

```js
parse("€123.555,99") -> Money{amount: 12355599, currency: "EUR"};

// default currency
parse("123.555,99") -> Money{amount: 12355599, currency: "EUR"};

// comma decimal separator
parse("€123555,99") -> Money{amount: 12355599, currency: "EUR"};

// dot decimal separator
parse("€123555.99") -> Money{amount: 12355599, currency: "EUR"};

// no fraction digits
parse("4299") -> Money{amount: 429900, currency: "EUR"};

// 1 fraction digit
parse("€123555.1") -> Money{amount: 12355510, currency: "EUR"};

// more than 2 fraction digits
parse("€123555.999") -> Money{amount: 12355599, currency: "EUR"};

// invalid input
parse("€123555.99") -> Money{amount: 0, currency: "EUR"};
```

</details>
<br/>

<details>
  <summary>format</summary>

```js
format({amount: 12355599, currency: 'EUR'}) -> "€123.555,99"
```

</details>
<br/>

<details>
  <summary>formatParts</summary>

```js
formatParts({amount: 12355599, currency: 'EUR'}) -> {
  whole: '123555',
  wholeFormatted: '123.555',
  cents: '99',
  currencySymbol: '€',
  decimalSeparator: ',',
}
```

</details>
<br/>

<details>
  <summary>split</summary>

```js
split({amount: 4599, currency: 'EUR'}) -> {whole: 45, fraction: 99}
```

</details>
<br/>

<details>
  <summary>config</summary>

```ts
type Config = {
  defaultCurrency?: string;
  currencies?: Array<{
    code: "EUR";
    symbol: "€";
    decimalSeparator: "." | ",";
  }>;
};

money.config({
  defaultCurrency: "EUR",
  currencies: [
    {
      code: "EUR",
      symbol: "€",
      decimalSeparator: ",",
    },
    {
      code: "USD",
      symbol: "$",
      decimalSeparator: ".",
    },
  ],
});
```

</details>
