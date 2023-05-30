import assert from "node:assert";
import { describe, test } from "node:test";

import { formatIntegerPart } from "../lib/money.js";

describe("helpers", () => {
  describe("formatIntegerPart", () => {
    test("browser", () => {
      assert.deepEqual(formatIntegerPart(10042, "NL", "browser"), "10.042");
      assert.deepEqual(formatIntegerPart(-10042, "NL", "browser"), "10.042");
      assert.deepEqual(formatIntegerPart(10042, "IE", "browser"), "10,042");
    });

    test("react-native", () => {
      assert.deepEqual(formatIntegerPart(10042, "NL", "browser"), "10.042");
      assert.deepEqual(formatIntegerPart(-10042, "NL", "browser"), "10.042");
      assert.deepEqual(formatIntegerPart(10042, "IE", "browser"), "10,042");
    });

    test("nide", () => {
      assert.deepEqual(formatIntegerPart(10042, "NL", "browser"), "10.042");
      assert.deepEqual(formatIntegerPart(-10042, "NL", "browser"), "10.042");
      assert.deepEqual(formatIntegerPart(10042, "IE", "browser"), "10,042");
    });
  });
});
