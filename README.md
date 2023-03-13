# money-lib

### _Simple TypeScript library to work with money_

### Features

- Works with simple serialized `Money` type which describes monetary `amount` value and `currency` code
  (can be used in your app as you wish, eg in redux state)
- Represents amount values as integers, in cents. This avoids floating point rounding errors.
- Provides initialization, serialization, parsing, formatting, arithmetics, comparison, etc
- Soon will work everywhere (browsers, node, deno, react-native, etc)
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

**_standalone functions_**:

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

### API

#### Initialization:

**`zero = (currency = config.defaultCurrency) => Money`**

**`fromInt: (amount: number, currency?: string) => Money`**

<details>
  <summary>Example</summary>

```js
fromInt(4299, 'EUR') -> Money{amount: 4299, currency: "EUR"};
```

</details>
<br/>

**`fromFloat: (amount: number, currency?: string) => Money`**

<details>
  <summary>Example</summary>

```js
fromFloat(42.99, 'EUR') -> Money{amount: 4299, currency: "EUR"};
fromFloat(42.999, 'EUR') -> Money{amount: 4299, currency: "EUR"};
fromFloat(42.9, 'EUR') -> Money{amount: 4290, currency: "EUR"};
```

</details>
<br/>

#### Conversion to number:

**`toInt: (m: Money) => number`**

**`toFloat: (m: Money) => number`**

<br/>

#### Arithmetics:

**`add: (a: Money, b: Money) => Money`**

**`subtract: (a: Money, b: Money) => Money`**

**`multiply: (m: Money, multiplier: number) => Money`**

**`divide: (m: Money, divider: number) => Money`**

<br/>

#### Comparison:

**`compare: (a: Money, b: Money) => -1 | 0 | 1`**

**`equals: (a: Money, b: Money) => boolean`**

**`greaterThan: (a: Money, b: Money) => boolean`**

**`greaterThanOrEqual: (a: Money, b: Money) => boolean`**

**`lessThan: (a: Money, b: Money) => boolean`**

**`lessThanOrEqual: (a: Money, b: Money) => boolean`**

**`isZero: (m: Money) => boolean`**

**`isPositive: (m: Money) => boolean`**

**`isNegative: (m: Money) => boolean`**

<br/>

#### Validation:

**`isValid: (m: Money) => m is Money`**

<br/>

#### Parsing:

**`parse: (s: string) => Money`**

<details>
  <summary>Example</summary>

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

#### Formatting:

**`format: (m: Money) => string`**

<details>
  <summary>Example</summary>

```js
format({amount: 12355599, currency: 'EUR'}) -> "€123.555,99"
```

</details>
<br/>

**`formatParts: (m: Money) => FormattedParts`**

<details>
  <summary>Example</summary>

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

#### Transformation:

**`split: (m: Money) => { whole: number, fraction: number }`**

<details>
  <summary>Example</summary>

```js
split({amount: 4599, currency: 'EUR'}) -> {whole: 45, fraction: 99}
```

</details>
<br/>

#### Setup config and currencies:

**`config: (c: Config) => void`**

<details>
  <summary>Example</summary>

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

### TODO:

- Deno and ReactNative support
