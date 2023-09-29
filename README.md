# 💰 money-lib 💰

### _Simple TypeScript library to work with money_

[![NPM Version](https://img.shields.io/npm/v/money-lib)](https://www.npmjs.com/package/money-lib)

### Features

- Super simple
- Serialized `Money` type

```ts
type Money = {
  amount: Cents; // Integer representing cents
  currency: string; // Currency code (ISO 4217) or whatever you want
};
```

- Represents amount values as integers, in `Cents` to avoids floating point rounding errors.
- 0 dependencies
- Formatting, arithmetics, comparison, parsing, etc
- Works in browsers, node, react native (soon Deno, maybe already works)
- Default rounding method when converting from floats is Bankers Rounding (round half to even)

### Usage example

```ts
import money, { Money, Cents } from "money-lib";

const m = money()
  .debug() // money: { amount: 0, currency: 'EUR' }
  .add({ amount: 4499, currency: "EUR" })
  .subtract({ amount: 298, currency: "EUR" })
  .debug() // money: { amount: 4201, currency: 'EUR' }
  .multiply(5.56399)
  .divide(5.56399);

// format
console.log(m.format()); // €42,01

// unwrap (serialize) Money from chain
console.log(m.toJSON()); // { amount: 4201, currency: 'EUR' }

console.log(m.toCents()); // 4201
console.log(m.toFloat()); // 42.01
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
export type Cents = number;

export type Money = {
  amount: Cents; // Integer representing cents
  currency?: string; // Currency code (ISO 4217)
};

export type ChainedMoney = {
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
  fromInt: (amount: Cents, currency?: string) => ChainedMoney;

  /**
   * Init money from a float number (euros.cents), eg 42.99 (42 euros and 99 cents)
   * @example fromFloat(42.99, 'EUR') -> Money{amount: 4299, currency: "EUR"};
   */
  fromFloat: (amount: number, currency?: string) => ChainedMoney;

  /**
   * Parse money represented as a int string in cents, eg "150" (150 cents)
   * @example fromIntString("150", 'EUR') -> Money{amount: 150, currency: "EUR"};
   */
  fromIntString: (amount: string, currency?: string) => ChainedMoney;

  /**
   * Parse money represented as a float string, eg "100.45" (100 euros and 45 cents)
   * @example fromFloatString("100.45", 'EUR') -> Money{amount: 10045, currency: "EUR"};
   */
  fromFloatString: (amount: string, currency?: string) => ChainedMoney;

  // --- Comparison ---

  /**
   * Compare two Money objects
   * @example m1.compare(m2) -> 1
   */
  compare: (m: Money | ChainedMoney) => 1 | 0 | -1;

  /**
   * Check if two Money objects are equal
   * @example m1.equals(m2) -> false
   */
  equals: (m: Money | ChainedMoney) => boolean;

  /**
   * Check if a Money object is greater than another
   * @example m1.greaterThan(m1) -> true
   */
  greaterThan: (m: Money | ChainedMoney) => boolean;

  /**
   * Check if a Money object is greater than or equal to another
   * @example greaterThanOrEqual(m1, m2) -> true
   */
  greaterThanOrEqual: (m: Money | ChainedMoney) => boolean;

  /**
   * Check if a Money object is less than another
   * @example lessThan(m1, m2) -> false
   */
  lessThan: (m: Money | ChainedMoney) => boolean;

  /**
   * Check if a Money object is less than or equal to another
   * @example lessThanOrEqual(m1, m2) -> true
   */
  lessThanOrEqual: (m: Money | ChainedMoney) => boolean;

  /**
   * Check if a Money object is zero
   * @example isZero(m) -> false
   */
  isZero: () => boolean;

  /**
   * Check if a Money object is positive
   * @example isPositive(m) -> true
   */
  isPositive: () => boolean;

  /**
   * Check if a Money object is negative
   * @example isNegative(m) -> false
   */
  isNegative: () => boolean;

  /**
   * Return the smallest of multiple Money objects
   * @example min(m1, m2, m3, ...) -> m2
   */
  min: (
    m1: Money | ChainedMoney,
    ...m: (Money | ChainedMoney)[]
  ) => ChainedMoney;

  /**
   * Return the largest of multiple Money objects
   * @example max(m1, m2, m3, ...) -> m3
   */
  max: (
    m1: Money | ChainedMoney,
    ...m: (Money | ChainedMoney)[]
  ) => ChainedMoney;

  // --- Validation ---

  /**
   * Check if a Money object is valid
   * @example isValid(m) -> true
   */
  isValid: () => boolean;

  // --- Transformation ---

  /**
   * Split a Money object into a whole and cents part
   * @example split(m) -> { whole: 1, cents: 50 }
   */
  split: () => {
    whole: number;
    cents: number;
  };

  // --- Arithmetic ---

  /**
   * Add two Money objects
   * TODO: add support for multiple arguments to return sum of all (add(m1, m2, m3, ...)
   * @example m1.add(m2) -> m3
   */
  add: (m: Money | ChainedMoney) => ChainedMoney;

  /**
   * Subtract two Money objects
   * TODO: add support for multiple arguments to return diff of all (subtract(m1, m2, m3, ...)
   * @example m1.subtract(m2) -> m3
   */
  subtract: (m: Money | ChainedMoney) => ChainedMoney;

  /**
   * Multiply a Money object by a number
   * TODO(maybe): multiply money by money, eg m1.multiply(m2)
   * @example m.multiply(2) -> m2
   */
  multiply: (multiplier: number, round?: (n: number) => number) => ChainedMoney;

  /**
   * Divide a Money object by a number
   * TODO(maybe): divide money by money, eg m1.divide(m2)
   * @example m.divide(2) -> m2
   */
  divide: (divider: number, round?: (n: number) => number) => ChainedMoney;

  /**
   * Return the absolute value of a Money object
   * @example money({amount: -100}) -> Money{amount: 100}
   */
  abs: () => ChainedMoney;

  // --- Formatting ---

  /**
   * Format a Money object as a string
   * @example format(m, { locale: "en-US", cents: true, withPlusSign: false, trailingZeros: true }) -> "€1.00"
   */
  format: (ops?: {
    locale?: string;
    /**
     * default: true; if false, 00 cents will be omitted
     */
    cents?: boolean;
    /**
     * default: true; if false, 1.50 will be formatted as 1.5
     */
    trailingZeros?: boolean;
    /**
     * default: false; if true, positive numbers will be prefixed with a plus sign
     */
    withPlusSign?: boolean;
  }) => string;

  /**
   * Format a Money object as an object containing the whole, cents, currencySymbol, decimalSeparator and sign
   * @example formatParts(m, "en-US") -> { whole: "1", wholeFormatted: "1", cents: "00", currencySymbol: "€", decimalSeparator: ".", sign: "" }
   */
  formatParts: (locale?: string) => {
    whole: string;
    wholeFormatted: string;
    cents: string;
    currencySymbol: string;
    decimalSeparator: string;
    sign: "+" | "-" | "";
  };

  // --- Parsing ---

  /**
   * Parse a string into a Money object
   * @example parse("€1.00", "EUR", "en-US", ".") -> Money{amount: 100, currency: "EUR"}
   */
  parse: (
    s: string,
    currency: string,
    locale?: string,
    decimalSeparator?: "." | ","
  ) => ChainedMoney;

  // --- Debug ---

  /**
   * Log a Money object to the console
   * @example debug("money:") -> "money: Money{amount: 100, currency: "EUR"}"
   */
  debug: (prefix?: string) => ChainedMoney;

  // --- Serialization ---

  /**
   * Return the Money object
   * @example toJSON() -> Money{amount: 100, currency: "EUR"}
   */
  toJSON: () => Money;

  // --- Conversion ---

  /**
   * Return the Money object as an int
   * @example money({amount: 10000}).toInt() -> 10000
   */
  toInt: () => Cents;

  /**
   * Return the Money object as an int (alias for toInt)
   * @example money({amount: 10000}).toString() -> "100.00"
   */
  toCents: () => Cents;

  /**
   * Return the Money object as a float
   * @example money({amount: 10000}).toFloat() -> 100.00
   */
  toFloat: () => number;

  /**
   * Return the Money object as a string
   * @example money({amount: 10000}).toString() -> "10000"
   */
  toString: () => string;

  /**
   * Return the Money object as a string (alias for toString)
   * @example money({amount: 10000}).toIntString() -> "10000"
   */
  toIntString: () => string;

  /**
   * Return the Money object as a string (alias for toString)
   * @example money({amount: 10000}).toCentsString() -> "10000"
   */
  toCentsString: () => string;

  /**
   * Return the Money object as a string
   * @example money({amount: 10000}).toFloatString() -> "100.00"
   */
  toFloatString: () => string;
};
```

#### More Examples:

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
````

### TODO

- big numbers
- support fractions with more than 2 digits eg 1.9999 euros (currently rounds to 2 decimals) (eg for stock prices etc)
