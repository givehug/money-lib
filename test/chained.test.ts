import assert from "node:assert";
import { describe, test } from "node:test";

import money from "../index";

describe("chained", () => {
  describe("basic use cased", () => {
    test("should do arithm and format money", () => {
      const m = money()
        .add({ amount: 4499, currency: "EUR" })
        .subtract({ amount: 299, currency: "EUR" })
        .multiply(5.56399)
        .divide(5.56399)
        .format();

      assert.strictEqual(m, "€42,00");
    });
  });

  describe("initialization", () => {
    test("zero", () => {
      assert.deepEqual(money().zero().toJSON(), { currency: "EUR", amount: 0 });
    });

    test("fromInt", () => {
      assert.deepEqual(money().fromInt(10042).toJSON(), {
        currency: "EUR",
        amount: 10042,
      });
    });

    test("fromFloat", () => {
      assert.deepEqual(money().fromFloat(100.42).toJSON(), {
        currency: "EUR",
        amount: 10042,
      });
      assert.deepEqual(money().fromFloat(100).toJSON(), {
        currency: "EUR",
        amount: 10000,
      });
    });
  });

  describe("serialization", () => {
    test("toInt", () => {
      assert.deepEqual(
        money({ currency: "EUR", amount: 10042 }).toInt(),
        10042
      );
    });

    test("toFloat", () => {
      assert.deepEqual(
        money({ currency: "EUR", amount: 10042 }).toFloat(),
        100.42
      );
    });
  });

  describe("arithmetics", () => {
    test("add", () => {
      assert.deepEqual(
        money({ currency: "EUR", amount: 10042 })
          .add({ currency: "EUR", amount: 10042 })
          .toJSON(),
        { currency: "EUR", amount: 20084 }
      );
    });

    test("subtract", () => {
      assert.deepEqual(
        money({ currency: "EUR", amount: 10042 })
          .subtract({ currency: "EUR", amount: 10042 })
          .toJSON(),
        { currency: "EUR", amount: 0 }
      );
    });

    test("multiply", () => {
      assert.deepEqual(
        money({ currency: "EUR", amount: 10042 }).multiply(2).toJSON(),
        { currency: "EUR", amount: 20084 }
      );
    });

    test("divide", () => {
      assert.deepEqual(
        money({ currency: "EUR", amount: 10042 }).divide(2).toJSON(),
        { currency: "EUR", amount: 5021 }
      );
    });
  });

  describe("comparison", () => {
    test("equal", () => {
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).equals({
          currency: "EUR",
          amount: 10042,
        }),
        true
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).equals({
          currency: "EUR",
          amount: 10043,
        }),
        false
      );
    });

    test("lessThan", () => {
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).lessThan({
          currency: "EUR",
          amount: 10043,
        }),
        true
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).lessThan({
          currency: "EUR",
          amount: 10041,
        }),
        false
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).lessThan({
          currency: "EUR",
          amount: 10042,
        }),
        false
      );
    });

    test("lessThanOrEqual", () => {
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).lessThanOrEqual({
          currency: "EUR",
          amount: 10042,
        }),
        true
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10041 }).lessThanOrEqual({
          currency: "EUR",
          amount: 10043,
        }),
        true
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).lessThanOrEqual({
          currency: "EUR",
          amount: 10041,
        }),
        false
      );
    });

    test("greaterThan", () => {
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).greaterThan({
          currency: "EUR",
          amount: 10042,
        }),
        false
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).greaterThan({
          currency: "EUR",
          amount: 10041,
        }),
        true
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).greaterThan({
          currency: "EUR",
          amount: 10043,
        }),
        false
      );
    });

    test("greaterThanOrEqual", () => {
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).greaterThanOrEqual({
          currency: "EUR",
          amount: 10042,
        }),
        true
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).greaterThanOrEqual({
          currency: "EUR",
          amount: 10041,
        }),
        true
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).greaterThanOrEqual({
          currency: "EUR",
          amount: 10043,
        }),
        false
      );
    });

    test("compare", () => {
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).compare({
          currency: "EUR",
          amount: 10042,
        }),
        0
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).compare({
          currency: "EUR",
          amount: 10041,
        }),
        1
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).compare({
          currency: "EUR",
          amount: 10043,
        }),
        -1
      );
    });
  });

  describe("formatting", () => {
    test("format", () => {
      assert.deepEqual(
        money({ currency: "EUR", amount: 100042 }).format(),
        "€1.000,42"
      );
    });

    test("format negative amount", () => {
      assert.deepEqual(
        money({ currency: "EUR", amount: -100042 }).format(),
        "€-1.000,42"
      );
    });

    test("formatParts", () => {
      assert.deepEqual(
        money({ currency: "EUR", amount: 100055542 }).formatParts(),
        {
          cents: "42",
          currencySymbol: "€",
          decimalSeparator: ",",
          whole: "1000555",
          wholeFormatted: "1.000.555",
        }
      );
    });
  });

  describe("validation", () => {});

  describe("transformation", () => {});

  describe("parsings", () => {
    test("EUR", () => {
      const expected = {
        currency: "EUR",
        amount: 1050099,
      };
      assert.deepEqual(money().parse("10.500,99", "EUR").toJSON(), expected);
      assert.deepEqual(money().parse("10500,99", "EUR").toJSON(), expected);
      assert.deepEqual(money().parse("10_500 , 99", "EUR").toJSON(), expected);
      assert.notDeepEqual(money().parse("10500.99", "EUR").toJSON(), expected);
    });

    test("explicit decimal separator", () => {
      const expected = {
        currency: "EUR",
        amount: 1050099,
      };
      assert.deepEqual(
        money().parse("10,500.99", "EUR", undefined, ".").toJSON(),
        expected
      );
      assert.deepEqual(
        money().parse("10500.99", "EUR", undefined, ".").toJSON(),
        expected
      );
      assert.deepEqual(
        money().parse("10_500 . 99", "EUR", undefined, ".").toJSON(),
        expected
      );
      assert.notDeepEqual(
        money().parse("10.500,99", "EUR", undefined, ".").toJSON(),
        expected
      );
    });
  });
});
