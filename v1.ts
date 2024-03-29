export type { Money, Cents } from "./lib/types";

import { default as money } from "./lib/v1/chain";

export default money;

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
} from "./lib/core";

export { setConfig } from "./lib/config";
