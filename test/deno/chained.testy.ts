import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

import money from "../../index.ts";

Deno.test("chained", async (t) => {
  await t.step("should do arithm and format money", () => {
    const m = money()
      .add({ amount: 4499, currency: "EUR" })
      .subtract({ amount: 299, currency: "EUR" })
      .multiply(5.56399)
      .divide(5.56399)
      .format();

    assertEquals(m, "€42,00");
  });
});
