import test from "node:test";
import assert from "node:assert/strict";
import {
  createSessionToken,
  verifyAdminCredentials,
  verifySessionToken,
} from "../api/admin-auth.js";

test("accepts the configured admin credentials", () => {
  assert.equal(verifyAdminCredentials("adminrosic", "hongtamrosicglobal79"), true);
});

test("rejects an invalid password", () => {
  assert.equal(verifyAdminCredentials("adminrosic", "wrong-password"), false);
});

test("session token is signed and expires", () => {
  const now = Date.now();
  const token = createSessionToken(now);
  assert.equal(verifySessionToken(token, now + 1_000), true);
  assert.equal(verifySessionToken(`${token}x`, now + 1_000), false);
  assert.equal(verifySessionToken(token, now + 9 * 60 * 60 * 1_000), false);
});
