import { describe, test, expect } from "bun:test";

import { setupMoney, money } from "../index";
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

    // with cents
    money("100cents");
    money("100 cents");
    money("€100cents");
    money("€ 100 cents ");
    money("100 EUR cents");
    money("100EURcents");
    money("100 cents EUR");
    money("100 cents", "EUR");

    const m = money("100 eur").add("€57.99").sub(7.99).mul(5.56399);

    expect(m.fmt()).toBe("€834,60");
    expect(m.float()).toBe(834.6);
    expect(m.cents()).toBe(83460);

    expect(money().fmt()).toBe("€0,00");
    expect(money({ cents: 50, currency: "EUR" }).fmt()).toBe("€0,50");
    expect(money({ decimal: 5.45, currency: "EUR" }).fmt()).toBe("€5,45");

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

      expect(m).toBe("€42,00");
    });

    test("should do arithm and fmt money with default currency", () => {
      const m = money(0)
        .add({ amount: 4499 })
        .sub({ amount: 299 })
        .mul(5.56399)
        .div(5.56399)
        .fmt();

      expect(m).toBe("€42,00");
    });
  });

  describe("serialization", () => {
    test("int", () => {
      expect(money(100.42).cents()).toBe(10042);
    });

    test("float / number", () => {
      expect(money(100.42).float()).toBe(100.42);
      expect(money(100.42).number()).toBe(100.42);
    });

    test("centsStr", () => {
      expect(money(100.42).centStr()).toBe("10042");
      expect(money(0).centStr()).toBe("0");
      expect(money(0.01).centStr()).toBe("1");
    });

    test("string", () => {
      expect(money(100.42).string()).toBe("100.42");
      expect(money(0.01).string()).toBe("0.01");
      expect(money(0).string()).toBe("0.00");
    });
  });

  describe("floatToInt intToFloat", () => {
    test("floatToInt", () => {
      expect(money(100.42).int()).toBe(10042);
    });

    test("intToFloat", () => {
      expect(money("100.42").float()).toBe(100.42);
    });
  });

  describe("arithmetics", () => {
    test("add", () => {
      expect(
        Bun.deepEquals(money(100.42).add(100.42).json(), {
          currency: "EUR",
          amount: 20084,
        })
      );
    });

    test("add many", () => {
      const foo = money(0.01);
      const bar = money("0.01eur");
      expect(
        money("0.01")
          .add("0.02", { amount: 3 }, foo, "0.02", money("0.01"), money(0.01))
          .number()
      ).toBe(0.11);
    });

    test("sub", () => {
      expect(
        Bun.deepEquals(money("100.42").sub(100.42).json(), {
          currency: "EUR",
          amount: 0,
        })
      );
      expect(
        Bun.deepEquals(money("1").sub({ currency: "EUR", amount: 50 }).json(), {
          currency: "EUR",
          amount: 50,
        })
      );
    });

    test("sub many", () => {
      expect(
        Bun.deepEquals(
          money("0.06").sub({ amount: 3 }, 0.02, money(0.01)).json(),
          { currency: "EUR", amount: 0 }
        )
      );
    });

    test("mul", () => {
      expect(
        Bun.deepEquals(money(100.42).mul(2).json(), {
          currency: "EUR",
          amount: 20084,
        })
      );
    });

    test("div", () => {
      expect(
        Bun.deepEquals(money(100.42).div(2).json(), {
          currency: "EUR",
          amount: 5021,
        })
      );
      expect(
        Bun.deepEquals(money(70.44).div(100).json(), {
          currency: "EUR",
          amount: 70,
        })
      );
    });

    test("abs", () => {
      expect(money(100.42).abs().fmt()).toBe("€100,42");
      expect(money(-100.42).abs().fmt()).toBe("€100,42");
    });
  });

  describe("comparison", () => {
    test("equal", () => {
      expect(
        money(100.42).eq({
          currency: "EUR",
          amount: 10042,
        })
      ).toBe(true);
      expect(
        money(100.42).eq({
          currency: "EUR",
          amount: 10043,
        })
      ).toBe(false);
      expect(money(100.42).isNeg()).toBe(false);
      expect(money(-100.42).isNeg()).toBe(true);
    });

    test("lt", () => {
      expect(
        money(100.42).lt({
          currency: "EUR",
          amount: 10043,
        })
      ).toBe(true);
      expect(
        money(100.42).lt({
          currency: "EUR",
          amount: 10041,
        })
      ).toBe(false);
      expect(
        money(100.42).lt({
          currency: "EUR",
          amount: 10042,
        })
      ).toBe(false);
    });

    test("lte", () => {
      expect(
        money(100.42).lte({
          currency: "EUR",
          amount: 10042,
        })
      ).toBe(true);
      expect(
        money(100.41).lte({
          currency: "EUR",
          amount: 10043,
        })
      ).toBe(true);
      expect(
        money(100.42).lte({
          currency: "EUR",
          amount: 10041,
        })
      ).toBe(false);
    });

    test("gt", () => {
      expect(
        money(100.42).gt({
          currency: "EUR",
          amount: 10042,
        })
      ).toBe(false);
      expect(
        money(100.42).gt({
          currency: "EUR",
          amount: 10041,
        })
      ).toBe(true);
      expect(
        money(100.42).gt({
          currency: "EUR",
          amount: 10043,
        })
      ).toBe(false);
    });

    test("gte", () => {
      expect(
        money(100.42).gte({
          currency: "EUR",
          amount: 10042,
        })
      ).toBe(true);
      expect(
        money(100.42).gte({
          currency: "EUR",
          amount: 10041,
        })
      ).toBe(true);
      expect(
        money(100.42).gte({
          currency: "EUR",
          amount: 10043,
        })
      ).toBe(false);
    });

    test("cmp", () => {
      expect(
        money(100.42).cmp({
          currency: "EUR",
          amount: 10042,
        })
      ).toBe(0);
      expect(money(100.42).cmp(money(100.41))).toBe(1);
      expect(
        money(100.42).cmp({
          currency: "EUR",
          amount: 10043,
        })
      ).toBe(-1);
    });

    test("min", () => {
      const m1 = money(0.01);
      const m2 = money(0);
      const m3 = money(0.02);
      const m4 = money(-0.01);

      expect(
        Bun.deepEquals(money(0).min(m1, m2, m3, m4).json(), {
          currency: "EUR",
          amount: -1,
        })
      ).toBeTrue();
      expect(
        Bun.deepEquals(money(0).min(m1, m2, m3, { amount: -2 }, m4).json(), {
          currency: "EUR",
          amount: -2,
        })
      ).toBeTrue();
      expect(
        Bun.deepEquals(money(0).min(m1, m2).json(), {
          currency: "EUR",
          amount: 0,
        })
      ).toBeTrue();
      expect(
        Bun.deepEquals(money(0).min(m1).json(), {
          currency: "EUR",
          amount: 1,
        })
      ).toBeTrue();
    });

    test("max", () => {
      const m1 = money(0.01);
      const m2 = money(0);
      const m3 = money(0.02);
      const m4 = money(-0.01);

      expect(
        Bun.deepEquals(money(0).max(m1, m2, m3, m4).json(), {
          currency: "EUR",
          amount: 2,
        })
      ).toBeTrue();
      expect(
        Bun.deepEquals(money(0).max(m1, m2, m3, { amount: 3 }, m4).json(), {
          currency: "EUR",
          amount: 3,
        })
      ).toBeTrue();
      expect(
        Bun.deepEquals(money(0).max(m1, m2).json(), {
          currency: "EUR",
          amount: 1,
        })
      ).toBeTrue();
      expect(
        Bun.deepEquals(money(0).max(m1).json(), {
          currency: "EUR",
          amount: 1,
        })
      ).toBeTrue();
    });
  });

  describe("formatting", () => {
    test("fmt", () => {
      expect(money(0).fmt()).toBe("€0,00");
      expect(money(0.05).fmt()).toBe("€0,05");
      expect(money(0.5).fmt()).toBe("€0,50");
      expect(money(1000.42).fmt()).toBe("€1.000,42");
      expect(
        money(1000.42).fmt({
          cents: false,
        })
      ).toBe("€1.000,42");
      expect(
        money(1000).fmt({
          cents: false,
        })
      ).toBe("€1.000");
      expect(
        money(0.5).fmt({
          cents: false,
        })
      ).toBe("€0,50");
      expect(
        money(0).fmt({
          cents: false,
        })
      ).toBe("€0");
      expect(
        money(0).fmt({
          cents: true,
        })
      ).toBe("€0,00");
      // expect(
      //   money(0).fmt({
      //     locale: "IE",
      //   }),
      //   "€1,000.42"
      // );
      expect(money(0.01).fmt()).toBe("€0,01");
    });

    test("fmt negative amount", () => {
      expect(Bun.deepEquals(money(-1000.42).fmt(), "-€1.000,42"));
    });

    test("fmts", () => {
      expect(
        Bun.deepEquals(money(1000555.42).fmts(), {
          cents: "42",
          currencySymbol: "€",
          decimalSeparator: ",",
          base: "1000555",
          baseFormatted: "1.000.555",
          sign: "+",
        })
      );

      expect(
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
      expect(money("0 BTC").fmt()).toBe("₿0,00000000");
      expect(money("0.00000005 BTC").fmt()).toBe("₿0,00000005");
      expect(money("0.0000005 BTC").fmt()).toBe("₿0,00000050");
      expect(money("0.00000500 BTC").fmt({})).toBe("₿0,00000500");
      expect(money("0.000005 BTC").fmt({ trailingZeros: false })).toBe(
        "₿0,000005"
      );
      expect(money("1 BTC").fmt()).toBe("₿1,00000000");
      expect(money(" 1 BTC").fmt({ cents: false })).toBe("₿1");
      expect(money("₿199").fmt({ cents: false })).toBe("₿199");
      expect(money("1999.00000005 BTC").fmt()).toBe("₿1.999,00000005");
      expect(money("1999.00000005 BTC").fmt()).toBe("₿1.999,00000005");
    });

    test("fmt withPlusSign", () => {
      expect(money("1 EUR").fmt()).toBe("€1,00");
      expect(money("1 EUR").fmt({ withPlusSign: true })).toBe("+€1,00");
      expect(money("0 EUR").fmt({ withPlusSign: true })).toBe("€0,00");
      expect(money("-1 EUR").fmt({ withPlusSign: true })).toBe("-€1,00");
    });
  });

  describe("validation", () => {});

  describe("transformation", () => {});

  describe("parsings", () => {
    test("works the same as initializer but with wider string type", () => {
      expect(money().parse("€100").fmt()).toBe("€100,00");
      expect(money().parse("100.45", "EUR").fmt()).toBe("€100,45");
      expect(money().parse("100", "EUR").fmt()).toBe("€100,00");
      expect(money().parse("100 eur").fmt()).toBe("€100,00");
      expect(money().parse("€ 100").fmt()).toBe("€100,00");
      expect(money().parse("100,45").fmt()).toBe("€100,45"); // comma treated as decimal separator
      expect(money(0).parse("10.500,99", "EUR").fmt()).toBe("€10,50"); // thousand separators are ignored
      expect(money(0).parse("10500.99", "EUR").fmt()).toBe("€10.500,99");
    });

    test("parses to 0 as fallback", () => {
      expect(money().parse("xxx").fmt()).toBe("€0,00");
      expect(money().parse("foo", "USD").fmt()).toBe("$0,00");
      expect(money().parse("").fmt()).toBe("€0,00");
    });

    test("EUR", () => {
      const expected = {
        currency: "EUR",
        amount: 1050099,
      };
      expect(
        Bun.deepEquals(money(0).parse("10500,99", "EUR").json(), expected)
      );
      expect(
        Bun.deepEquals(money(0).parse("10_500 , 99", "EUR").json(), expected)
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
      // expect(moneyCustom("-10.61pund").fmt(), "-€10,61000");

      setupMoney(defaultConfig);
    });
  });
});
