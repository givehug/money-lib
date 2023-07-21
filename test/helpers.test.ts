import assert from "node:assert";
import { describe, test } from "node:test";

import { formatIntegerPart } from "../lib/money.js";

describe("helpers", () => {
  describe("formatIntegerPart", () => {
    test("browser", () => {
      assert.deepEqual(formatIntegerPart(10042, "NL"), "10.042");
      assert.deepEqual(formatIntegerPart(-10042, "NL"), "-10.042");
      assert.deepEqual(formatIntegerPart(10042, "IE"), "10,042");
    });

    test("react-native", () => {
      assert.deepEqual(formatIntegerPart(10042, "NL"), "10.042");
      assert.deepEqual(formatIntegerPart(-10042, "NL"), "-10.042");
      assert.deepEqual(formatIntegerPart(10042, "IE"), "10,042");
    });

    test("node", () => {
      assert.deepEqual(formatIntegerPart(10042, "NL"), "10.042");
      assert.deepEqual(formatIntegerPart(-10042, "NL"), "-10.042");
      assert.deepEqual(formatIntegerPart(10042, "IE"), "10,042");
    });
  });
});
