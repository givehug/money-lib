import assert from "node:assert";
import { describe, test, expect } from "bun:test";

import { setupMoney, money } from "../v2";
import { defaultConfig } from "../lib/config";

describe("v2", () => {
  test("different initializers", () => {
    // Any of these works:
    money(100);
    money("€100", "EUR");
    money("$100.99");
    money("€ 100");
    money("100eur");
    money("100 btc");

    const m = money("100 eur").add("€57.99").sub(7.99).mul(5.56399);

    expect(m.fmt()).toBe("€834,60");
    expect(m.float()).toBe(834.6);
    expect(m.cents()).toBe(83460);

    // must not compile:
    // money("🎃 15");
    // money("15 spooky");
    // money("200uah");
  });

  describe("basic use cased", () => {
    test("should do arithm and fmt money", () => {
      const m = money(0)
        .add({ amount: 4499, currency: "EUR" })
        .sub({ amount: 299, currency: "EUR" })
        .mul(5.56399)
        .div(5.56399)
        .fmt();

      assert.strictEqual(m, "€42,00");
    });

    test("should do arithm and fmt money with default currency", () => {
      const m = money(0)
        .add({ amount: 4499 })
        .sub({ amount: 299 })
        .mul(5.56399)
        .div(5.56399)
        .fmt();

      assert.strictEqual(m, "€42,00");
    });
  });

  describe("serialization", () => {
    test("int", () => {
      assert.equal(money(100.42).cents(), 10042);
    });

    test("float / number", () => {
      assert.equal(money(100.42).float(), 100.42);
      assert.equal(money(100.42).number(), 100.42);
    });

    test("centsStr", () => {
      assert.equal(money(100.42).centStr(), "10042");
      assert.equal(money(0).centStr(), "0");
      assert.equal(money(0.01).centStr(), "1");
    });

    test("string", () => {
      assert.equal(money(100.42).string(), "100.42");
      assert.equal(money(0.01).string(), "0.01");
      assert.equal(money(0).string(), "0.00");
    });
  });

  describe("floatToInt intToFloat", () => {
    test("floatToInt", () => {
      assert.equal(money(100.42).int(), 10042);
    });

    test("intToFloat", () => {
      assert.equal(money("100.42").float(), 100.42);
    });
  });

  describe("arithmetics", () => {
    test("add", () => {
      assert.ok(
        Bun.deepEquals(money(100.42).add(100.42).json(), {
          currency: "EUR",
          amount: 20084,
        })
      );
    });

    test("add many", () => {
      const foo = money(0.01);
      const bar = money("0.01eur");
      assert.equal(
        money("0.01")
          .add("0.02", { amount: 3 }, foo, "0.02", money("0.01"), money(0.01))
          .number(),
        0.11
      );
    });

    test("sub", () => {
      assert.ok(
        Bun.deepEquals(money("100.42").sub(100.42).json(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money("1").sub({ currency: "EUR", amount: 50 }).json(), {
          currency: "EUR",
          amount: 50,
        })
      );
    });

    test("sub many", () => {
      assert.ok(
        Bun.deepEquals(
          money("0.06").sub({ amount: 3 }, 0.02, money(0.01)).json(),
          { currency: "EUR", amount: 0 }
        )
      );
    });

    test("mul", () => {
      assert.ok(
        Bun.deepEquals(money(100.42).mul(2).json(), {
          currency: "EUR",
          amount: 20084,
        })
      );
    });

    test("div", () => {
      assert.ok(
        Bun.deepEquals(money(100.42).div(2).json(), {
          currency: "EUR",
          amount: 5021,
        })
      );
      assert.ok(
        Bun.deepEquals(money(70.44).div(100).json(), {
          currency: "EUR",
          amount: 70,
        })
      );
    });

    test("abs", () => {
      assert.equal(money(100.42).abs().fmt(), "€100,42");
      assert.equal(money(-100.42).abs().fmt(), "€100,42");
    });
  });

  describe("comparison", () => {
    test("equal", () => {
      assert.strictEqual(
        money(100.42).eq({
          currency: "EUR",
          amount: 10042,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).eq({
          currency: "EUR",
          amount: 10043,
        }),
        false
      );
      assert.strictEqual(money(100.42).isNeg(), false);
      assert.strictEqual(money(-100.42).isNeg(), true);
    });

    test("lt", () => {
      assert.strictEqual(
        money(100.42).lt({
          currency: "EUR",
          amount: 10043,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).lt({
          currency: "EUR",
          amount: 10041,
        }),
        false
      );
      assert.strictEqual(
        money(100.42).lt({
          currency: "EUR",
          amount: 10042,
        }),
        false
      );
    });

    test("lte", () => {
      assert.strictEqual(
        money(100.42).lte({
          currency: "EUR",
          amount: 10042,
        }),
        true
      );
      assert.strictEqual(
        money(100.41).lte({
          currency: "EUR",
          amount: 10043,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).lte({
          currency: "EUR",
          amount: 10041,
        }),
        false
      );
    });

    test("gt", () => {
      assert.strictEqual(
        money(100.42).gt({
          currency: "EUR",
          amount: 10042,
        }),
        false
      );
      assert.strictEqual(
        money(100.42).gt({
          currency: "EUR",
          amount: 10041,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).gt({
          currency: "EUR",
          amount: 10043,
        }),
        false
      );
    });

    test("gte", () => {
      assert.strictEqual(
        money(100.42).gte({
          currency: "EUR",
          amount: 10042,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).gte({
          currency: "EUR",
          amount: 10041,
        }),
        true
      );
      assert.strictEqual(
        money(100.42).gte({
          currency: "EUR",
          amount: 10043,
        }),
        false
      );
    });

    test("cmp", () => {
      assert.strictEqual(
        money(100.42).cmp({
          currency: "EUR",
          amount: 10042,
        }),
        0
      );
      assert.strictEqual(money(100.42).cmp(money(100.41)), 1);
      assert.strictEqual(
        money(100.42).cmp({
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
        Bun.deepEquals(money(0).min(m1, m2, m3, m4).json(), {
          currency: "EUR",
          amount: -1,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).min(m1, m2, m3, { amount: -2 }, m4).json(), {
          currency: "EUR",
          amount: -2,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).min(m1, m2).json(), {
          currency: "EUR",
          amount: 0,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).min(m1).json(), {
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
        Bun.deepEquals(money(0).max(m1, m2, m3, m4).json(), {
          currency: "EUR",
          amount: 2,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).max(m1, m2, m3, { amount: 3 }, m4).json(), {
          currency: "EUR",
          amount: 3,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).max(m1, m2).json(), {
          currency: "EUR",
          amount: 1,
        })
      );
      assert.ok(
        Bun.deepEquals(money(0).max(m1).json(), {
          currency: "EUR",
          amount: 1,
        })
      );
    });
  });

  describe("fmtting", () => {
    test("fmt", () => {
      assert.equal(money(0).fmt(), "€0,00");
      assert.equal(money(0.05).fmt(), "€0,05");
      assert.equal(money(0.5).fmt(), "€0,50");
      assert.equal(money(1000.42).fmt(), "€1.000,42");
      assert.equal(
        money(1000.42).fmt({
          cents: false,
        }),
        "€1.000,42"
      );
      assert.equal(
        money(1000).fmt({
          cents: false,
        }),
        "€1.000"
      );
      assert.equal(
        money(0.5).fmt({
          cents: false,
        }),
        "€0,50"
      );
      assert.equal(
        money(0).fmt({
          cents: false,
        }),
        "€0"
      );
      assert.equal(
        money(0).fmt({
          cents: true,
        }),
        "€0,00"
      );
      // assert.equal(
      //   money(0).fmt({
      //     locale: "IE",
      //   }),
      //   "€1,000.42"
      // );
      assert.equal(money(0.01).fmt(), "€0,01");
    });

    test("fmt negative amount", () => {
      assert.ok(Bun.deepEquals(money(-1000.42).fmt(), "-€1.000,42"));
    });

    test("fmts", () => {
      assert.ok(
        Bun.deepEquals(money(1000555.42).fmts(), {
          cents: "42",
          currencySymbol: "€",
          decimalSeparator: ",",
          base: "1000555",
          baseFormatted: "1.000.555",
          sign: "+",
        })
      );

      assert.ok(
        Bun.deepEquals(money(-1000555.42).fmts(), {
          cents: "42",
          currencySymbol: "€",
          decimalSeparator: ",",
          base: "1000555",
          baseFormatted: "1.000.555",
          sign: "-",
        })
      );
    });

    test("fmt BTC", () => {
      assert.equal(money("0 BTC").fmt(), "₿0,00000000");
      assert.equal(money("0.00000005 BTC").fmt(), "₿0,00000005");
      assert.equal(money("0.0000005 BTC").fmt(), "₿0,00000050");
      assert.equal(money("0.00000500 BTC").fmt({}), "₿0,00000500");
      assert.equal(
        money("0.000005 BTC").fmt({ trailingZeros: false }),
        "₿0,000005"
      );
      assert.equal(money("1 BTC").fmt(), "₿1,00000000");
      assert.equal(money(" 1 BTC").fmt({ cents: false }), "₿1");
      assert.equal(money("₿199").fmt({ cents: false }), "₿199");
      assert.equal(money("1999.00000005 BTC").fmt(), "₿1.999,00000005");
      assert.equal(money("1999.00000005 BTC").fmt(), "₿1.999,00000005");
    });

    test("fmt withPlusSign", () => {
      assert.equal(money("1 EUR").fmt(), "€1,00");
      assert.equal(money("1 EUR").fmt({ withPlusSign: true }), "+€1,00");
      assert.equal(money("0 EUR").fmt({ withPlusSign: true }), "€0,00");
      assert.equal(money("-1 EUR").fmt({ withPlusSign: true }), "-€1,00");
    });
  });

  describe("validation", () => {});

  describe("transfmtion", () => {});

  describe("parsings", () => {
    test("EUR", () => {
      const expected = {
        currency: "EUR",
        amount: 1050099,
      };
      assert.ok(
        Bun.deepEquals(money(0).parse("10.500,99", "EUR").json(), expected)
      );
      assert.ok(
        Bun.deepEquals(money(0).parse("10500,99", "EUR").json(), expected)
      );
      assert.ok(
        Bun.deepEquals(money(0).parse("10_500 , 99", "EUR").json(), expected)
      );
      assert.notDeepEqual(money(0).parse("10500.99", "EUR").json(), expected);
    });

    test("explicit decimal separator", () => {
      const expected = {
        currency: "EUR",
        amount: 1050099,
      };
      assert.ok(
        Bun.deepEquals(
          money(0).parse("10,500.99", "EUR", undefined, ".").json(),
          expected
        )
      );
      assert.ok(
        Bun.deepEquals(
          money(0).parse("10500.99", "EUR", undefined, ".").json(),
          expected
        )
      );
      assert.ok(
        Bun.deepEquals(
          money(0).parse("10_500 . 99", "EUR", undefined, ".").json(),
          expected
        )
      );
      assert.notDeepEqual(
        money(0).parse("10.500,99", "EUR", undefined, ".").json(),
        expected
      );
    });
  });

  describe("custom config", () => {
    test("custom config", () => {
      const { money: moneyCustom } = setupMoney({
        currencies: [
          {
            code: "EUR" as const,
            symbol: "€" as const,
            scale: 2,
          },
          {
            code: "BTC" as const,
            symbol: "₿" as const,
            scale: 8,
          },
          {
            code: "SPOOKY" as const,
            symbol: "🎃" as const,
            scale: 5,
          },
        ],
        defaultCurrency: "EUR" as const,
        defaultRoundingMethod: "bankers",
      });

      expect(moneyCustom("-10.61eur").fmt()).toBe("-€10,61");
      expect(moneyCustom("🎃 -10.61").fmt()).toBe("-🎃10,61000");
      expect(moneyCustom("0.15 spooky").fmt({ trailingZeros: false })).toBe(
        "🎃0,15"
      );

      // must not compile
      // assert.equal(moneyCustom("-10.61pund").fmt(), "-€10,61000");

      setupMoney(defaultConfig);
    });
  });
});
