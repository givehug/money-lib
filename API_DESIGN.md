### Simplification

The purpose of the lib is a frequent use in money-rich apps. It will be changed to be more concise.

- 2 initialization options: `money` or `cents`
- argument is super generic, but type-safe depending on config currency setup

example

```ts
money("1.0005eur").fmt(); // €1,00
money("1500042.99").fmt(); // €1.500.042,99
money("1.0005eur").fmt({ cents: false }); // €1
money("1.0005eur").fmt({ precision: 7 }); // €1,0005000
money("1.0005eur").fmt({ precision: 7, trimZeros: true }); // €1,0005
money("1.0005eur").json(); // {value: '1.0005', currency: 'EUR'} or {base: 1, cents: 5000, scale: 7, currency: 'EUR'}
```

```ts
money("1"); // use default currency
money("1.55"); // use default currency
money("1 eur");
money("1 EUR");
money("1", "eur");
money("1.55", "EUR");
money("€1.55");
money("1.55 eur");
money(1.55); // use default currency
money(1.55, "eur");
cents(155, "eur"); // 1 eur 55 cents
cents("155", "eur"); // 1 eur 55 cents
money("€1.555,99"); // is it needed ? not for parsing form fields (number with dot separator)
```

- other methods simplified

```ts
.toInt() -> .int()
.toCents() -> .cents()
.toFloat() -> .float()
.toFloat() -> .number() ?
.toString() -> .centStr()
.toFloatString() -> .string()

.add() -> .add()
.subtract() -> .sub()
.multiply() -> .mul()
.divide() -> .div()
.abs() -> .abs()

.compare() -> .cmp()
.equals() -> .eq()
.greaterThen() -> .gt()
.greaterThanOrEqual() -> .gte()
.lessThen() -> .lt()
.lessThanOrEqual() -> .lte()
.isZero() -> ?
.isPositive() -> ?
.isNegative() -> ?
.min() -> .min()
.max() -> .max()

.isValid() -> ?

.split() -> .split() // not needed if json includes base and cents separately

.format() -> .fmt()
.formatParts() -> .fmts() // more options in result

.parse() -> // is it needed?
```

### Support for fractions less than 1 cent

```ts
money("0.001"); // 0.001
```

```ts
type Money = {
  value: "1.0009"; // described as string
  currency: Currency;
};

// OR

type Money = {
  base: number; // eg euros
  cents: number; // eg cents
  scale: number; // eg 4 -> 1.0009
};

// OR

type Money = {
  value: number; // eg 10009000
  scale: number; // eg 7 -> 1.0009
  currency: Currency;
};

type Currency = {
  scale: number; // eg 2 -> 1.00
  symbol: string; // eg €
  code: string; // eg EUR
  name: string; // eg Euro
};
```
