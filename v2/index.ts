export type { Money, Cents } from "../lib/types";

// import { config } from "../lib/config";
export { setupMoney } from "../lib/chainV2";
// import { moneyChain } from "../lib/chainV2";

// const money = setupV2(config); // setup with default config

export {
  // Initialization
  zero,
  fromInt,
  fromFloat,

  // Serialization
  toInt,
  toFloat,

  // Arithmetics
  add,
  subtract,
  multiply,
  divide,

  // Comparison
  compare,
  equals,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  isZero,
  isPositive,
  isNegative,

  // Validation
  isValid,

  // Transformation
  split,

  // Formatting
  format,
  formatParts,

  // Parsing
  parse,
} from "../lib/money";
