import assert from "node:assert";
import { describe, test } from "bun:test";

import { setup } from "../lib/v2";

describe("v2", () => {
  const { money } = setup({
    currencies: [
      {
        code: "EUR" as const,
        symbol: "€" as const,
      },
      {
        code: "USD" as const,
        symbol: "$" as const,
      },
      {
        code: "BTC" as const,
        symbol: "₿" as const,
      },
    ],
    defaultCurrency: "EUR" as const,
    defaultRoundingMethod: "bankers",
  });

  test("different initializers", () => {
    money(100);
    money(100, "EUR");
    money(100, "eur");
    money("€100", "EUR");
    money("€100");
    money("$100.99");
    money("€ 100");
    money("100eur");
    money("100.50 eur");
    money("100EUR");
    money("$100");
    money("100usd");
    money("100USD");
    money("100 btc");

    // money("200uah"); // should not compile
  });

  describe("basic use cased", () => {
    test("should do arithm and format money", () => {
      const m = money(0)
        .add({ amount: 4499, currency: "EUR" })
        .subtract({ amount: 299, currency: "EUR" })
        .multiply(5.56399)
        .divide(5.56399)
        .format();

      assert.strictEqual(m, "€42,00");
    });

    test("should do arithm and format money with default currency", () => {
      const m = money(0)
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
        Bun.deepEquals(money(0).zero().toJSON(), { currency: "EUR", amount: 0 })
      );
    });

    test("fromInt", () => {
      assert.ok(
        Bun.deepEquals(money(0).fromInt(10042).toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
    });

    test("fromFloat", () => {
      assert.ok(
        Bun.deepEquals(money(0).fromFloat(100.42).toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloat(100).toJSON(), {
          currency: "EUR",
          amount: 10000,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloat(0.025).toJSON(), {
          currency: "EUR",
          amount: 2, // bankers rounding applied
        })
      );
    });

    test("fromFloatString", () => {
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("100.42").toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("100").toJSON(), {
          currency: "EUR",
          amount: 10000,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("100.42").toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("0").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("1").toJSON(), {
          currency: "EUR",
          amount: 100,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("0.01").toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("0.001").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("-100.42").toJSON(), {
          currency: "EUR",
          amount: -10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("-1").toJSON(), {
          currency: "EUR",
          amount: -100,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("-0.01").toJSON(), {
          currency: "EUR",
          amount: -1,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("-0").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromFloatString("x").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(
          money(0).fromFloatString("216.6666666666666667").toJSON(),
          {
            currency: "EUR",
            amount: 21667,
          }
        )
      );
    });

    test("fromIntString", () => {
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("10042").toJSON(), {
          currency: "EUR",
          amount: 10042,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("100").toJSON(), {
          currency: "EUR",
          amount: 100,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("100.42").toJSON(), {
          currency: "EUR",
          amount: 100,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("0").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("1").toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("0.01").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("0.001").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("-100.42").toJSON(), {
          currency: "EUR",
          amount: -100,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("-1").toJSON(), {
          currency: "EUR",
          amount: -1,
        })
      );
      assert.equal(money(0).fromIntString("-0.01").toJSON().amount, 0);
      assert.equal(money(0).fromIntString("-0").toJSON().amount, 0);
      assert.ok(
        Bun.deepEquals(money(0).fromIntString("x").toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
    });
  });

  describe("serialization", () => {
    test("toInt", () => {
      assert.equal(money(100.42).toInt(), 10042);
    });

    test("toFloat", () => {
      assert.equal(money(100.42).toFloat(), 100.42);
    });

    test("toString", () => {
      assert.equal(money(100.42).toString(), "10042");
      assert.equal(money(0).toString(), "0");
      assert.equal(money(0.01).toString(), "1");
    });

    test("toFloatString", () => {
      assert.equal(money(100.42).toFloatString(), "100.42");
      assert.equal(money(0.01).toFloatString(), "0.01");
      assert.equal(money(0).toFloatString(), "0.00");
    });
  });

  describe("floatToInt intToFloat", () => {
    test("floatToInt", () => {
      assert.equal(money(0).fromFloat(100.42).toInt(), 10042);
    });

    test("intToFloat", () => {
      assert.equal(money(0).fromInt(10042).toFloat(), 100.42);
    });
  });

  describe("arithmetics", () => {
    test("add", () => {
      assert.ok(
        Bun.deepEquals(money(100.42).add(money(100.42)).toJSON(), {
          currency: "EUR",
          amount: 20084,
        })
      );
    });

    test("add many ", () => {
      assert.ok(
        Bun.deepEquals(money("0.01").add(money(0.02), { amount: 3 }).toJSON(), {
          currency: "EUR",
          amount: 6,
        })
      );
    });

    test("subtract", () => {
      assert.ok(
        Bun.deepEquals(money("100.42").subtract(money(100.42)).toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(
          money("1").subtract({ currency: "EUR", amount: 50 }).toJSON(),
          { currency: "EUR", amount: 50 }
        )
      );
    });

    test("subtract many", () => {
      assert.ok(
        Bun.deepEquals(
          money("0.06")
            .subtract({ amount: 3 }, money(0.02), money(0.01))
            .toJSON(),
          { currency: "EUR", amount: 0 }
        )
      );
    });

    test("multiply", () => {
      assert.ok(
        Bun.deepEquals(money(100.42).multiply(2).toJSON(), {
          currency: "EUR",
          amount: 20084,
        })
      );
    });

    test("divide", () => {
      assert.ok(
        Bun.deepEquals(money(100.42).divide(2).toJSON(), {
          currency: "EUR",
          amount: 5021,
        })
      );
      assert.ok(
        Bun.deepEquals(money(70.44).divide(100).toJSON(), {
          currency: "EUR",
          amount: 70,
        })
      );
    });

    test("abs", () => {
      assert.equal(money(100.42).abs().format(), "€100,42");
      assert.equal(money(-100.42).abs().format(), "€100,42");
    });
  });

  describe("comparison", () => {
    test("equal", () => {
      assert.strictEqual(
        money(100.42).equals({
          currency: "EUR",
          amount: 10042,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).equals({
          currency: "EUR",
          amount: 10043,
        }),
        false
      );
      assert.strictEqual(money(100.42).isNegative(), false);
      assert.strictEqual(money(-100.42).isNegative(), true);
    });

    test("lessThan", () => {
      assert.strictEqual(
        money(100.42).lessThan({
          currency: "EUR",
          amount: 10043,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).lessThan({
          currency: "EUR",
          amount: 10041,
        }),
        false
      );
      assert.strictEqual(
        money(100.42).lessThan({
          currency: "EUR",
          amount: 10042,
        }),
        false
      );
    });

    test("lessThanOrEqual", () => {
      assert.strictEqual(
        money(100.42).lessThanOrEqual({
          currency: "EUR",
          amount: 10042,
        }),
        true
      );
      assert.strictEqual(
        money(100.41).lessThanOrEqual({
          currency: "EUR",
          amount: 10043,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).lessThanOrEqual({
          currency: "EUR",
          amount: 10041,
        }),
        false
      );
    });

    test("greaterThan", () => {
      assert.strictEqual(
        money(100.42).greaterThan({
          currency: "EUR",
          amount: 10042,
        }),
        false
      );
      assert.strictEqual(
        money(100.42).greaterThan({
          currency: "EUR",
          amount: 10041,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).greaterThan({
          currency: "EUR",
          amount: 10043,
        }),
        false
      );
    });

    test("greaterThanOrEqual", () => {
      assert.strictEqual(
        money(100.42).greaterThanOrEqual({
          currency: "EUR",
          amount: 10042,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).greaterThanOrEqual({
          currency: "EUR",
          amount: 10041,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).greaterThanOrEqual({
          currency: "EUR",
          amount: 10043,
        }),
        false
      );
    });

    test("compare", () => {
      assert.strictEqual(
        money(100.42).compare({
          currency: "EUR",
          amount: 10042,
        }),
        0
      );
      assert.strictEqual(
        money(100.42).compare({
          currency: "EUR",
          amount: 10041,
        }),
        1
      );
      assert.strictEqual(
        money(100.42).compare({
          currency: "EUR",
          amount: 10043,
        }),
        -1
      );
    });

    test("min", () => {
      const m1 = money(0.01);
      const m2 = money(0);
      const m3 = money(0.02);
      const m4 = money(-0.01);

      assert.ok(
        Bun.deepEquals(money(0).min(m1, m2, m3, m4).toJSON(), {
          currency: "EUR",
          amount: -1,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).min(m1, m2, m3, { amount: -2 }, m4).toJSON(), {
          currency: "EUR",
          amount: -2,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).min(m1, m2).toJSON(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).min(m1).toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
    });

    test("max", () => {
      const m1 = money(0.01);
      const m2 = money(0);
      const m3 = money(0.02);
      const m4 = money(-0.01);

      assert.ok(
        Bun.deepEquals(money(0).max(m1, m2, m3, m4).toJSON(), {
          currency: "EUR",
          amount: 2,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).max(m1, m2, m3, { amount: 3 }, m4).toJSON(), {
          currency: "EUR",
          amount: 3,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).max(m1, m2).toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).max(m1).toJSON(), {
          currency: "EUR",
          amount: 1,
        })
      );
    });
  });

  describe("formatting", () => {
    test("format", () => {
      assert.equal(money(0).format(), "€0,00");
      assert.equal(money(0.05).format(), "€0,05");
      assert.equal(money(0.5).format(), "€0,50");
      assert.equal(money(1000.42).format(), "€1.000,42");
      assert.equal(
        money(1000.42).format({
          cents: false,
        }),
        "€1.000,42"
      );
      assert.equal(
        money(1000).format({
          cents: false,
        }),
        "€1.000"
      );
      assert.equal(
        money(0.5).format({
          cents: false,
        }),
        "€0,50"
      );
      assert.equal(
        money(0).format({
          cents: false,
        }),
        "€0"
      );
      assert.equal(
        money(0).format({
          cents: true,
        }),
        "€0,00"
      );
      // assert.equal(
      //   money(0).format({
      //     locale: "IE",
      //   }),
      //   "€1,000.42"
      // );
      assert.equal(money(0).fromFloat(0.01).format(), "€0,01");
    });

    test("format negative amount", () => {
      assert.ok(Bun.deepEquals(money(-1000.42).format(), "-€1.000,42"));
    });

    test("formatParts", () => {
      assert.ok(
        Bun.deepEquals(money(1000555.42).formatParts(), {
          cents: "42",
          currencySymbol: "€",
          decimalSeparator: ",",
          whole: "1000555",
          wholeFormatted: "1.000.555",
          sign: "+",
        })
      );

      assert.ok(
        Bun.deepEquals(money(-1000555.42).formatParts(), {
          cents: "42",
          currencySymbol: "€",
          decimalSeparator: ",",
          whole: "1000555",
          wholeFormatted: "1.000.555",
          sign: "-",
        })
      );
    });

    test("format BTC", () => {
      assert.equal(money("0 BTC").format(), "₿0,00000000");
      assert.equal(money("0.00000005 BTC").format(), "₿0,00000005");
      assert.equal(money("0.0000005 BTC").format(), "₿0,00000050");
      assert.equal(money("0.00000500 BTC").format({}), "₿0,00000500");
      assert.equal(
        money("0.000005 BTC").format({ trailingZeros: false }),
        "₿0,000005"
      );
      assert.equal(money("1 BTC").format(), "₿1,00000000");
      assert.equal(money(" 1 BTC").format({ cents: false }), "₿1");
      assert.equal(money("₿199").format({ cents: false }), "₿199");
      assert.equal(money("1999.00000005 BTC").format(), "₿1.999,00000005");
      assert.equal(money("1999.00000005 BTC").format(), "₿1.999,00000005");
    });

    test("format withPlusSign", () => {
      assert.equal(money("1 EUR").format(), "€1,00");
      assert.equal(money("1 EUR").format({ withPlusSign: true }), "+€1,00");
      assert.equal(money("0 EUR").format({ withPlusSign: true }), "€0,00");
      assert.equal(money("-1 EUR").format({ withPlusSign: true }), "-€1,00");
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
        Bun.deepEquals(money(0).parse("10.500,99", "EUR").toJSON(), expected)
      );
      assert.ok(
        Bun.deepEquals(money(0).parse("10500,99", "EUR").toJSON(), expected)
      );
      assert.ok(
        Bun.deepEquals(money(0).parse("10_500 , 99", "EUR").toJSON(), expected)
      );
      assert.notDeepEqual(money(0).parse("10500.99", "EUR").toJSON(), expected);
    });

    test("explicit decimal separator", () => {
      const expected = {
        currency: "EUR",
        amount: 1050099,
      };
      assert.ok(
        Bun.deepEquals(
          money(0).parse("10,500.99", "EUR", undefined, ".").toJSON(),
          expected
        )
      );
      assert.ok(
        Bun.deepEquals(
          money(0).parse("10500.99", "EUR", undefined, ".").toJSON(),
          expected
        )
      );
      assert.ok(
        Bun.deepEquals(
          money(0).parse("10_500 . 99", "EUR", undefined, ".").toJSON(),
          expected
        )
      );
      assert.notDeepEqual(
        money(0).parse("10.500,99", "EUR", undefined, ".").toJSON(),
        expected
      );
    });
  });
});
