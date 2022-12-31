# WIP

## SIMPLE _lib to work with_ Money

### Features

- Inspired by go-money, js-money, and common sense (not dinero.js), apparently also originally inspired by Martin Fowlers' pattern
- Simple, easy to contribute, all documentation is here (this is os library, not a f\*\*\* startup)
- Works with plain serialized `Money` type which only stores information about its `amount` value and `currency` and can be used in your app as you wish, eg in redux state
- Represents monetary values as integers, in cents. This avoids floating point rounding errors.
- Typed, functional (chaining is supported only until the release of pipe operator)
- Provides parsing and formatting
- Provides methods for basic arithmetics
- Throws only during setup if config is invalid
- Works in different environments (browsers, node, deno, react-native, etc)

### Money type

```ts
type Money = {
  amount: number; // Integer representing cents
  currency: string; // Currency code (ISO 4217) or whatever you want
};
```

### Usage

**_standalone funcs_**:

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

console.log(money.format(finalBalance));

// €138.269,60
```

**_chaining_**:

```ts
import money, { Money } from "money-lib";

const m = money()
  .debug()
  .add({ amount: 4499, currency: "EUR" })
  .subtract({ amount: 299, currency: "EUR" })
  .debug()
  .multiply(5.56399)
  .divide(5.56399)
  .format();

console.log(m);

// money: { amount: 0, currency: 'EUR' }
// money: { amount: 4200, currency: 'EUR' }
// €42,00

// unwrap (serialize) Money from chain
const m2: Money = m.toJSON();

console.log(2);

// { amount: 4200, currency: 'EUR' }
```

### API

#### Create

**`fromInt: (amount: number, currency?: string) => Money`**

```js
money.fromInt(4299, 'EUR') -> {
    amount: 4299,
    currency: "EUR",
};
```

**`fromFloat: (amount: number, currency?: string) => Money`**

```js
money.fromFloat(42.99, 'EUR') -> {
    amount: 4299,
    currency: "EUR",
};

// number is always ceiled to 2 fractional digits
money.fromFloat(42.999, 'EUR') -> {
   amount: 4299,
   currency: "EUR",
};

money.fromFloat(4299.9, 'EUR') -> {
    amount: 4290,
    currency: "EUR",
};
```

#### Parse

**`parse: (s: string) => Money`**

```js
money.parse("€123.555,99") -> {
    amount: 12355599,
    currency: "EUR",
};

// default currency
money.parse("123.555,99") -> {
    amount: 12355599,
    currency: "EUR",
};

// comma decimal separator
money.parse("€123555,99") -> {
    amount: 12355599,
    currency: "EUR",
};

// dot decimal separator
money.parse("€123555.99") -> {
    amount: 12355599,
    currency: "EUR",
};

// no fraction digits
money.parse("4299") -> {
    amount: 429900,
    currency: "EUR",
};

// 1 fraction digit
money.parse("€123555.1") -> {
    amount: 12355510,
    currency: "EUR",
};

// more than 2 fraction digits
money.parse("€123555.999") -> {
    amount: 12355599,
    currency: "EUR",
};

// invalid input
money.parse("€123555.99") -> {
    amount: 0,
    currency: "EUR",
};
```

#### Format

**`format: (m: Money) => string`**

```js
money.format({
    amount: 12355599,
    currency: 'EUR',
}) -> "€123.555,99"
```

**`formatParts: (m: Money) => FormattedParts`**

```js
money.formatParts({
    amount: 12355599,
    currency: 'EUR',
}) -> {
    whole: '123555',
    wholeFormatted: '123.555',
    cents: '99',
    currencySymbol: '€',
    decimalSeparator: ',',
}
```

#### Arithmetics

**`add: (a: Money, b: Money) => Money`**
**`subtract: (a: Money, b: Money) => Money`**
**`multiply: (m: Money, multiplier: number) => Money`**
**`divide: (m: Money, divider: number) => Money`**

#### Misc

**`split: (m: Money) => { whole: number, fraction: number }`**

```js
money.split({
    amount: 4599,
    currency: 'EUR',
}) -> {
    whole: 45,
    fraction: 99,
}
```

#### Setup custom config

**`config: (c: Config) => void`**

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

## TODO

**`toInt: (m: Money) => number`**
**`toFloat: (m: Money) => number`**
**`greaterThen`**
**`equals`**
**`lessThen`**
**`...`** check type definitions
