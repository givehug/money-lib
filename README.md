# 💰 money-lib 💰

### TypeScript library to work with money

[![NPM Version](https://img.shields.io/npm/v/money-lib)](https://www.npmjs.com/package/money-lib)

_This is V2 API. V1 docs are [here](docs/README_V1.md). You can still use deprecated V1 as before by importing `money-lib/v1`._

<br/>

<p>
  <img src="https://github.com/givehug/money-lib/assets/10002142/fcd90cf7-dfb3-4210-8a74-b27349a55d6b" width="550" >
</p>
<br/>

Simple API

<p>
  <img src="https://github.com/givehug/money-lib/assets/10002142/b3077cd0-721f-44a1-b70f-3ab23265c8a7" width="550" >
</p>
<br/>

Type safe

<p>
  <img src="https://github.com/givehug/money-lib/assets/10002142/ddeb293b-a528-4b95-9806-d0da50a3f551" width="550" >
</p>
<br/>

Correct rounding (Banker's by default)

<p>
  <img src="https://github.com/givehug/money-lib/assets/10002142/cefe7de3-a6db-464b-9f2a-a98622f6467a" width="550" >
</p>
<br/>

Parsing a string

<p>
  <img src="https://github.com/givehug/money-lib/assets/10002142/bc333675-b6fb-4350-870a-84abafcd1e1e" width="550" >
</p>
<br/>

Custom currencies

<p>
  <img src="https://github.com/givehug/money-lib/assets/10002142/100ee765-f4bb-4920-a99d-566e9f4c90e1" width="550" >
</p>
<br/>

Standalone utils

<p>
  <img src="https://github.com/givehug/money-lib/assets/10002142/9817cd71-7c0d-44cd-aef4-ffb34b44b2a7" width="550" >
</p>
<br/>

### API

```ts
// Compare
cmp: (m) => 1 | 0 | -1;

// Equal
eq: (m) => boolean;

// Greater than
gt: (m) => boolean;

// Greater than or equal
gte: (m) => boolean;

// Less than
lt: (m) => boolean;

// Less than or equal
lte: (m) => boolean;

// Check if a Money is zero
is0: () => boolean;

// Check if a Money is positive
isPos: () => boolean;

// Check if a Money is negative
isNeg: () => boolean;

// Get min from multiple Money inputs
min: (...m) => m;

// Get max from multiple Money inputs
max: (...m) => m;

// Check if a Money is valid
validate: () => boolean;

// Split Money into a base and cents part
split: () => {
  base: number;
  cents: number;
};

// Add multiple Money inputs
add: (...m) => m;

// Subtract multiple Money inputs
sub: (...m) => m;

// Multiply Money by a number
mul: (multiplier: number, round?: (n: number) => number) => m;

// Divide Money by a number
div: (divider: number, round?: (n: number) => number) => m;

// Return the absolute value of a Money
abs: () => m;

// Format Money
fmt: (ops?: {
  locale?: string;
  cents?: boolean;
  trailingZeros?: boolean;
  withPlusSign?: boolean;
}) => string;

// Advanced Money formatter
fmts: (locale?: string) => {
  base: string;
  baseFormatted: string;
  cents: string;
  currencySymbol: string;
  decimalSeparator: string;
  sign: "+" | "-" | "";
};

// Parse a string into a Money object
parse: (
  s: string,
  currency: string,
  locale?: string,
  decimalSeparator?: "." | ","
) => m;

// Log a Money object to the console
debug: (prefix?: string) => m;

// Return the Money object
json: () => Money;

// Return the Money object as an int
int: () => Cents;

// Return the Money object as an int (alias for toInt)
cents: () => Cents;

// Return the Money object as a float
number: () => number;

// Return the Money object as a float (alias for number())
float: () => number;

// Return the Money object as a string
centStr: () => string;

// Return the Money object as a string
string: () => string;
```

### TODO

- big numbers
- support fractions with more than 2 digits eg 1.9999 euros (currently rounds to 2 decimals) (eg for stock prices etc)
