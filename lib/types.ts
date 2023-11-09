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
  add: (
    m1: Money | ChainedMoney,
    ...m: (Money | ChainedMoney)[]
  ) => ChainedMoney;

  /**
   * Subtract two Money objects
   * TODO: add support for multiple arguments to return diff of all (subtract(m1, m2, m3, ...)
   * @example m1.subtract(m2) -> m3
   */
  subtract: (
    m1: Money | ChainedMoney,
    ...m: (Money | ChainedMoney)[]
  ) => ChainedMoney;

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
     * - true: always show cents (default)
     * - "no": never show cents
     * - false | "ifAny": show cents only if they are not zero
     */
    cents?: boolean | "no" | "ifAny";
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
