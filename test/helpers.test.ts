import { describe, test, expect } from "bun:test";

import { formatIntegerPart } from "../lib/core.js";
import { roundBank } from "../lib/helpers.js";
import { parseMoneyInput } from "../lib/v2/helpers.js";

describe("helpers", () => {
  describe("formatIntegerPart", () => {
    test("browser", () => {
      expect(formatIntegerPart(10042, "NL")).toBe("10.042");
      expect(formatIntegerPart(-10042, "NL")).toBe("-10.042");
      expect(formatIntegerPart(10042, "IE")).toBe("10,042");
    });

    test("react-native", () => {
      expect(formatIntegerPart(10042, "NL")).toBe("10.042");
      expect(formatIntegerPart(-10042, "NL")).toBe("-10.042");
      expect(formatIntegerPart(10042, "IE")).toBe("10,042");
    });

    test("node", () => {
      expect(formatIntegerPart(10042, "NL")).toBe("10.042");
      expect(formatIntegerPart(-10042, "NL")).toBe("-10.042");
      expect(formatIntegerPart(10042, "IE")).toBe("10,042");
    });
  });

  test("roundBank", () => {
    // Test cases with non-halfway values
    expect(roundBank(4.2)).toBe(4);
    expect(roundBank(5.8)).toBe(6);
    expect(roundBank(6.3)).toBe(6);
    expect(roundBank(7.7)).toBe(8);

    // Test cases with halfway values
    expect(roundBank(4.5)).toBe(4);
    expect(roundBank(5.5)).toBe(6);
    expect(roundBank(6.5)).toBe(6);
    expect(roundBank(7.5)).toBe(8);

    // Additional test cases
    expect(roundBank(3.5)).toBe(4); // Edge case: Odd halfway value rounds up
    expect(roundBank(4.499999999)).toBe(4); // Test against floating point precision
    expect(roundBank(8)).toBe(8); // Integer value remains the same
    expect(roundBank(3)).toBe(3); // Integer value remains the same

    // Test cases with custom decimal places
    expect(roundBank(3.146, 2)).toBe(3.15);
    expect(roundBank(7.199, 1)).toBe(7.2);
    expect(roundBank(8.555, 2)).toBe(8.56);

    // Test cases with negative decimal places
    expect(roundBank(12345.6789, -1)).toBe(12350);
    expect(roundBank(12345.6789, -2)).toBe(12300);
    expect(roundBank(12345.6789, -3)).toBe(12000);
  });

  test("parseMoneyInput", () => {
    expect(parseMoneyInput()).toEqual({
      amount: 0,
      currency: "EUR",
    });

    expect(parseMoneyInput(null)).toEqual({
      amount: 0,
      currency: "EUR",
    });

    expect(parseMoneyInput(0)).toEqual({
      amount: 0,
      currency: "EUR",
    });

    expect(parseMoneyInput("10.42")).toEqual({
      amount: 1042,
      currency: "EUR",
    });

    expect(parseMoneyInput("1042 cents ")).toEqual({
      amount: 1042,
      currency: "EUR",
    });

    expect(parseMoneyInput("€ 10.42")).toEqual({
      amount: 1042,
      currency: "EUR",
    });

    expect(parseMoneyInput("$10cents")).toEqual({
      amount: 10,
      currency: "USD",
    });

    expect(parseMoneyInput("10.42 EUR")).toEqual({
      amount: 1042,
      currency: "EUR",
    });

    expect(parseMoneyInput("1042 EUR cents")).toEqual({
      amount: 1042,
      currency: "EUR",
    });

    expect(parseMoneyInput("1042 cents EUR")).toEqual({
      amount: 1042,
      currency: "EUR",
    });

    expect(parseMoneyInput("1042 cents eur")).toEqual({
      amount: 1042,
      currency: "EUR",
    });

    expect(parseMoneyInput(`${1042}cents`)).toEqual({
      amount: 1042,
      currency: "EUR",
    });
  });
});
