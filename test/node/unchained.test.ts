import assert from "node:assert";
import { describe, test } from "node:test";

import * as money from "../../index";

describe("unchained", () => {
  describe("basic use cases", () => {
    test("arithmetics and money formatting", () => {
      const accountBalance = { amount: 12345699, currency: "EUR" };
      const debitTransaction = money.fromFloat(1.99, "EUR");
      const balanceAfterDebit = money.subtract(
        accountBalance,
        debitTransaction
      );
      const interestRate = 0.12;
      const finalBalance = money.add(
        balanceAfterDebit,
        money.multiply(balanceAfterDebit, interestRate)
      );
      const m = money.format(finalBalance);

      assert.strictEqual(m, "€138.269,60");
    });
  });

  describe("initialization", () => {});

  describe("serialization", () => {});

  describe("arithmetics", () => {});

  describe("comparison", () => {});

  describe("formatting", () => {});

  describe("validation", () => {});

  describe("transformation", () => {});

  describe("parsings", () => {
    test("EUR", () => {
      const expected = {
        currency: "EUR",
        amount: 1050099,
      };
      assert.deepEqual(money.parse("10.500,99", "EUR"), expected);
      assert.deepEqual(money.parse("10500,99", "EUR"), expected);
      assert.deepEqual(money.parse("10_500 , 99", "EUR"), expected);
      assert.notDeepEqual(money.parse("10500.99", "EUR"), expected);
    });

    test("USD", () => {
      const expected = {
        currency: "USD",
        amount: 1050099,
      };
      assert.deepEqual(money.parse("10,500.99", "USD"), expected);
      assert.deepEqual(money.parse("10500.99", "USD"), expected);
      assert.deepEqual(money.parse("10_500 . 99", "USD"), expected);
      assert.notDeepEqual(money.parse("10.500,99", "USD"), expected);
    });

    test("explicit decimal separator", () => {
      const expected = {
        currency: "EUR",
        amount: 1050099,
      };
      assert.deepEqual(money.parse("10,500.99", "EUR", "."), expected);
      assert.deepEqual(money.parse("10500.99", "EUR", "."), expected);
      assert.deepEqual(money.parse("10_500 . 99", "EUR", "."), expected);
      assert.notDeepEqual(money.parse("10.500,99", "EUR", "."), expected);
    });
  });
});
