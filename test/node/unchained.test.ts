import assert from "node:assert";
import { describe, test } from "node:test";

import * as money from "../../index";

describe("unchained", () => {
  describe("basic use cased", () => {
    test("should do arithm and format money", () => {
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
});
