import assert from "node:assert";
import { describe, test } from "node:test";

import money from "../../index";

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
  });
});
