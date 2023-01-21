import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

import * as money from "../../index.ts";

Deno.test("unchained", async (t) => {
  await t.step("should do arithm and format money", () => {
    const accountBalance = { amount: 12345699, currency: "EUR" };
    const debitTransaction = money.fromFloat(1.99, "EUR");
    const balanceAfterDebit = money.subtract(accountBalance, debitTransaction);
    const interestRate = 0.12;
    const finalBalance = money.add(
      balanceAfterDebit,
      money.multiply(balanceAfterDebit, interestRate)
    );
    const m = money.format(finalBalance);

    assertEquals(m, "€138.269,60");
  });
});
