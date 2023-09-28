import assert from "node:assert";
import { describe, test } from "bun:test";

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

    test("should do arithm and format money with default currency", () => {
      const m = money()
        .add({ amount: 4499 })
        .subtract({ amount: 299 })
        .multiply(5.56399)
        .divide(5.56399)
        .format();

      assert.strictEqual(m, "€42,00");
    });
  });

  describe("initialization", () => {
    test("zero", () => {
      assert.ok(
        Bun.deepEquals(money().zero().toJSON(), { currency: "EUR", amount: 0 })
      );
    });

    test("fromInt", () => {
      assert.ok(
        Bun.deepEquals(money().fromInt(10042).toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
    });

    test("fromFloat", () => {
      assert.ok(
        Bun.deepEquals(money().fromFloat(100.42).toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloat(100).toJSON(), {
          currency: "EUR",
          amount: 10000,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloat(0.025).toJSON(), {
          currency: "EUR",
          amount: 2, // bankers rounding applied
        })
      );
    });

    test("fromFloatString", () => {
      assert.ok(
        Bun.deepEquals(money().fromFloatString("100.42").toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("100").toJSON(), {
          currency: "EUR",
          amount: 10000,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("100.42").toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("0").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("1").toJSON(), {
          currency: "EUR",
          amount: 100,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("0.01").toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("0.001").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("-100.42").toJSON(), {
          currency: "EUR",
          amount: -10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("-1").toJSON(), {
          currency: "EUR",
          amount: -100,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("-0.01").toJSON(), {
          currency: "EUR",
          amount: -1,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("-0").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromFloatString("x").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(
          money().fromFloatString("216.6666666666666667").toJSON(),
          {
            currency: "EUR",
            amount: 21667,
          }
        )
      );
    });

    test("fromIntString", () => {
      assert.ok(
        Bun.deepEquals(money().fromIntString("10042").toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromIntString("100").toJSON(), {
          currency: "EUR",
          amount: 100,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromIntString("100.42").toJSON(), {
          currency: "EUR",
          amount: 100,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromIntString("0").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromIntString("1").toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromIntString("0.01").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromIntString("0.001").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromIntString("-100.42").toJSON(), {
          currency: "EUR",
          amount: -100,
        })
      );
      assert.ok(
        Bun.deepEquals(money().fromIntString("-1").toJSON(), {
          currency: "EUR",
          amount: -1,
        })
      );
      assert.equal(money().fromIntString("-0.01").toJSON().amount, 0);
      assert.equal(money().fromIntString("-0").toJSON().amount, 0);
      assert.ok(
        Bun.deepEquals(money().fromIntString("x").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
    });
  });

  describe("serialization", () => {
    test("toInt", () => {
      assert.equal(money({ currency: "EUR", amount: 10042 }).toInt(), 10042);
    });

    test("toFloat", () => {
      assert.equal(money({ currency: "EUR", amount: 10042 }).toFloat(), 100.42);
    });

    test("toString", () => {
      assert.equal(
        money({ currency: "EUR", amount: 10042 }).toString(),
        "10042"
      );
      assert.equal(money({ currency: "EUR", amount: 0 }).toString(), "0");
      assert.equal(money({ currency: "EUR", amount: 1 }).toString(), "1");
    });

    test("toFloatString", () => {
      assert.equal(
        money({ currency: "EUR", amount: 10042 }).toFloatString(),
        "100.42"
      );
      assert.equal(
        money({ currency: "EUR", amount: 1 }).toFloatString(),
        "0.01"
      );
      assert.equal(
        money({ currency: "EUR", amount: 0 }).toFloatString(),
        "0.00"
      );
    });
  });

  describe("floatToInt intToFloat", () => {
    test("floatToInt", () => {
      assert.equal(money().fromFloat(100.42).toInt(), 10042);
    });

    test("intToFloat", () => {
      assert.equal(money().fromInt(10042).toFloat(), 100.42);
    });
  });

  describe("arithmetics", () => {
    test("add", () => {
      assert.ok(
        Bun.deepEquals(
          money({ currency: "EUR", amount: 10042 })
            .add({ currency: "EUR", amount: 10042 })
            .toJSON(),
          { currency: "EUR", amount: 20084 }
        )
      );
    });

    test("add many ", () => {
      assert.ok(
        Bun.deepEquals(
          money({ amount: 1 }).add({ amount: 2 }, { amount: 3 }).toJSON(),
          { currency: "EUR", amount: 6 }
        )
      );
    });

    test("subtract", () => {
      assert.ok(
        Bun.deepEquals(
          money({ currency: "EUR", amount: 10042 })
            .subtract({ currency: "EUR", amount: 10042 })
            .toJSON(),
          { currency: "EUR", amount: 0 }
        )
      );
      assert.ok(
        Bun.deepEquals(
          money({ currency: "EUR", amount: 100 })
            .subtract({ currency: "EUR", amount: 50 })
            .toJSON(),
          { currency: "EUR", amount: 50 }
        )
      );
    });

    test("subtract many", () => {
      assert.ok(
        Bun.deepEquals(
          money({ amount: 6 })
            .subtract({ amount: 3 }, { amount: 2 }, { amount: 1 })
            .toJSON(),
          { currency: "EUR", amount: 0 }
        )
      );
    });

    test("multiply", () => {
      assert.ok(
        Bun.deepEquals(
          money({ currency: "EUR", amount: 10042 }).multiply(2).toJSON(),
          { currency: "EUR", amount: 20084 }
        )
      );
    });

    test("divide", () => {
      assert.ok(
        Bun.deepEquals(
          money({ currency: "EUR", amount: 10042 }).divide(2).toJSON(),
          { currency: "EUR", amount: 5021 }
        )
      );
      assert.ok(
        Bun.deepEquals(
          money({ currency: "EUR", amount: 7044 }).divide(100).toJSON(),
          { currency: "EUR", amount: 70 }
        )
      );
    });

    test("abs", () => {
      assert.equal(
        money({ currency: "EUR", amount: 10042 }).abs().format(),
        "€100,42"
      );
      assert.equal(
        money({ currency: "EUR", amount: -10042 }).abs().format(),
        "€100,42"
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
      assert.strictEqual(
        money({ currency: "EUR", amount: 10042 }).isNegative(),
        false
      );
      assert.strictEqual(
        money({ currency: "EUR", amount: -10042 }).isNegative(),
        true
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

    test("min", () => {
      const m1 = money({ amount: 1 });
      const m2 = money({ amount: 0 });
      const m3 = money({ amount: 2 });
      const m4 = money({ amount: -1 });

      assert.ok(
        Bun.deepEquals(money().min(m1, m2, m3, m4).toJSON(), {
          currency: "EUR",
          amount: -1,
        })
      );
      assert.ok(
        Bun.deepEquals(money().min(m1, m2, m3, { amount: -2 }, m4).toJSON(), {
          currency: "EUR",
          amount: -2,
        })
      );
      assert.ok(
        Bun.deepEquals(money().min(m1, m2).toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money().min(m1).toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
    });

    test("max", () => {
      const m1 = money({ amount: 1 });
      const m2 = money({ amount: 0 });
      const m3 = money({ amount: 2 });
      const m4 = money({ amount: -1 });

      assert.ok(
        Bun.deepEquals(money().max(m1, m2, m3, m4).toJSON(), {
          currency: "EUR",
          amount: 2,
        })
      );
      assert.ok(
        Bun.deepEquals(money().max(m1, m2, m3, { amount: 3 }, m4).toJSON(), {
          currency: "EUR",
          amount: 3,
        })
      );
      assert.ok(
        Bun.deepEquals(money().max(m1, m2).toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
      assert.ok(
        Bun.deepEquals(money().max(m1).toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
    });
  });

  describe("formatting", () => {
    test("format", () => {
      assert.equal(money({ currency: "EUR", amount: 0 }).format(), "€0,00");
      assert.equal(money({ currency: "EUR", amount: 5 }).format(), "€0,05");
      assert.equal(money({ currency: "EUR", amount: 50 }).format(), "€0,50");
      assert.equal(
        money({ currency: "EUR", amount: 100042 }).format(),
        "€1.000,42"
      );
      assert.equal(
        money({ currency: "EUR", amount: 100042 }).format({
          cents: false,
        }),
        "€1.000,42"
      );
      assert.equal(
        money({ currency: "EUR", amount: 100000 }).format({
          cents: false,
        }),
        "€1.000"
      );
      assert.equal(
        money({ currency: "EUR", amount: 50 }).format({
          cents: false,
        }),
        "€0,50"
      );
      assert.equal(
        money({ currency: "EUR", amount: 0 }).format({
          cents: false,
        }),
        "€0"
      );
      assert.equal(
        money({ currency: "EUR", amount: 0 }).format({
          cents: true,
        }),
        "€0,00"
      );
      assert.equal(
        money({ currency: "EUR", amount: 100042 }).format({
          locale: "IE",
        }),
        "€1,000.42"
      );
      assert.equal(money().fromFloat(0.01).format(), "€0,01");
    });

    test("format negative amount", () => {
      assert.ok(
        Bun.deepEquals(
          money({ currency: "EUR", amount: -100042 }).format(),
          "-€1.000,42"
        )
      );
    });

    test("formatParts", () => {
      assert.ok(
        Bun.deepEquals(
          money({ currency: "EUR", amount: 100055542 }).formatParts(),
          {
            cents: "42",
            currencySymbol: "€",
            decimalSeparator: ",",
            whole: "1000555",
            wholeFormatted: "1.000.555",
            sign: "+",
          }
        )
      );

      assert.ok(
        Bun.deepEquals(
          money({ currency: "EUR", amount: -100055542 }).formatParts(),
          {
            cents: "42",
            currencySymbol: "€",
            decimalSeparator: ",",
            whole: "1000555",
            wholeFormatted: "1.000.555",
            sign: "-",
          }
        )
      );
    });

    test("format BTC", () => {
      assert.equal(
        money({ currency: "BTC", amount: 0 }).format(),
        "₿0,00000000"
      );
      assert.equal(
        money({ currency: "BTC", amount: 5 }).format(),
        "₿0,00000005"
      );
      assert.equal(
        money({ currency: "BTC", amount: 50 }).format(),
        "₿0,00000050"
      );
      assert.equal(
        money({ currency: "BTC", amount: 500 }).format({}),
        "₿0,00000500"
      );
      assert.equal(
        money({ currency: "BTC", amount: 500 }).format({
          trailingZeros: false,
        }),
        "₿0,000005"
      );
      assert.equal(
        money({ currency: "BTC", amount: 100000000 }).format(),
        "₿1,00000000"
      );
      assert.equal(
        money({ currency: "BTC", amount: 100000000 }).format({
          cents: false,
        }),
        "₿1"
      );
      assert.equal(
        money({ currency: "BTC", amount: 19900000000 }).format({
          cents: false,
        }),
        "₿199"
      );
      assert.equal(
        money({ currency: "BTC", amount: 199900000005 }).format(),
        "₿1.999,00000005"
      );
      assert.equal(
        money({ currency: "BTC", amount: 199900000005 }).format(),
        "₿1.999,00000005"
      );
    });

    test("format withPlusSign", () => {
      assert.equal(money({ currency: "EUR", amount: 100 }).format(), "€1,00");
      assert.equal(
        money({ currency: "EUR", amount: 100 }).format({ withPlusSign: true }),
        "+€1,00"
      );
      assert.equal(
        money({ currency: "EUR", amount: 0 }).format({ withPlusSign: true }),
        "€0,00"
      );
      assert.equal(
        money({ currency: "EUR", amount: -100 }).format({ withPlusSign: true }),
        "-€1,00"
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
      assert.ok(
        Bun.deepEquals(money().parse("10.500,99", "EUR").toJSON(), expected)
      );
      assert.ok(
        Bun.deepEquals(money().parse("10500,99", "EUR").toJSON(), expected)
      );
      assert.ok(
        Bun.deepEquals(money().parse("10_500 , 99", "EUR").toJSON(), expected)
      );
      assert.notDeepEqual(money().parse("10500.99", "EUR").toJSON(), expected);
    });

    test("explicit decimal separator", () => {
      const expected = {
        currency: "EUR",
        amount: 1050099,
      };
      assert.ok(
        Bun.deepEquals(
          money().parse("10,500.99", "EUR", undefined, ".").toJSON(),
          expected
        )
      );
      assert.ok(
        Bun.deepEquals(
          money().parse("10500.99", "EUR", undefined, ".").toJSON(),
          expected
        )
      );
      assert.ok(
        Bun.deepEquals(
          money().parse("10_500 . 99", "EUR", undefined, ".").toJSON(),
          expected
        )
      );
      assert.notDeepEqual(
        money().parse("10.500,99", "EUR", undefined, ".").toJSON(),
        expected
      );
    });
  });

  describe("config", () => {
    test("EUR", () => {
      money.config({
        defaultCurrency: "USD",
        defaultLocale: "IE",
      });
      assert.equal(money().format(), "$0.00");

      money.config({
        defaultCurrency: "EUR",
        defaultLocale: "NL",
      });
      assert.equal(money().format(), "€0,00");
    });
  });
});
