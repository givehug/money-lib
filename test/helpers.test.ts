import assert from "node:assert";
import { describe, test, expect } from "bun:test";

import { formatIntegerPart } from "../lib/core.js";
import { roundBank } from "../lib/helpers.js";
import { parseMoneyInput } from "../lib/v2/helpers.js";

describe("helpers", () => {
  describe("formatIntegerPart", () => {
    test("browser", () => {
      assert.equal(formatIntegerPart(10042, "NL"), "10.042");
      assert.equal(formatIntegerPart(-10042, "NL"), "-10.042");
      assert.equal(formatIntegerPart(10042, "IE"), "10,042");
    });

    test("react-native", () => {
      assert.equal(formatIntegerPart(10042, "NL"), "10.042");
      assert.equal(formatIntegerPart(-10042, "NL"), "-10.042");
      assert.equal(formatIntegerPart(10042, "IE"), "10,042");
    });

    test("node", () => {
      assert.equal(formatIntegerPart(10042, "NL"), "10.042");
      assert.equal(formatIntegerPart(-10042, "NL"), "-10.042");
      assert.equal(formatIntegerPart(10042, "IE"), "10,042");
    });
  });

  test("roundBank", () => {
    // Test cases with non-halfway values
    assert.strictEqual(roundBank(4.2), 4);
    assert.strictEqual(roundBank(5.8), 6);
    assert.strictEqual(roundBank(6.3), 6);
    assert.strictEqual(roundBank(7.7), 8);

    // Test cases with halfway values
    assert.strictEqual(roundBank(4.5), 4);
    assert.strictEqual(roundBank(5.5), 6);
    assert.strictEqual(roundBank(6.5), 6);
    assert.strictEqual(roundBank(7.5), 8);

    // Additional test cases
    assert.strictEqual(roundBank(3.5), 4); // Edge case: Odd halfway value rounds up
    assert.strictEqual(roundBank(4.499999999), 4); // Test against floating point precision
    assert.strictEqual(roundBank(8), 8); // Integer value remains the same
    assert.strictEqual(roundBank(3), 3); // Integer value remains the same

    // Test cases with custom decimal places
    assert.strictEqual(roundBank(3.146, 2), 3.15);
    assert.strictEqual(roundBank(7.199, 1), 7.2);
    assert.strictEqual(roundBank(8.555, 2), 8.56);

    // Test cases with negative decimal places
    assert.strictEqual(roundBank(12345.6789, -1), 12350);
    assert.strictEqual(roundBank(12345.6789, -2), 12300);
    assert.strictEqual(roundBank(12345.6789, -3), 12000);
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

    expect(parseMoneyInput(`${1042}cents`)).toEqual({
      amount: 1042,
      currency: "EUR",
    });
  });
});
