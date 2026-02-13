import { describe, test, expect } from "vitest";
import { encryptPayload, decryptPayload } from "../src";

const MASTER_KEY = Buffer.from("a".repeat(64), "hex");
const WRONG_KEY = Buffer.from("b".repeat(64), "hex");

describe("Crypto Package Tests", () => {
  test("encrypt → decrypt returns original payload", () => {
    const partyId = "party_201";
    const payload = { amount: 100, currency: "AED" };

    const encrypted = encryptPayload(MASTER_KEY, partyId, payload);
    const decrypted = decryptPayload(MASTER_KEY, encrypted);

    expect(decrypted).toEqual(payload);
  });

  test("tampered ciphertext fails", () => {
    const partyId = "party_202";
    const payload = { amount: 100 };
    const encrypted = encryptPayload(MASTER_KEY, partyId, payload);

    encrypted.payload_ct = encrypted.payload_ct.slice(0, -2) + "ff";

    expect(() => decryptPayload(MASTER_KEY, encrypted)).toThrow();
  });

  test("tampered tag fails", () => {
    const partyId = "party_203";
    const payload = { amount: 100 };
    const encrypted = encryptPayload(MASTER_KEY, partyId, payload);

    encrypted.payload_tag = encrypted.payload_tag.slice(0, -2) + "ff";

    expect(() => decryptPayload(MASTER_KEY, encrypted)).toThrow();
  });

  test("wrong master key fails", () => {
    const partyId = "party_204";
    const payload = { amount: 100 };
    const encrypted = encryptPayload(MASTER_KEY, partyId, payload);

    expect(() => decryptPayload(WRONG_KEY, encrypted)).toThrow();
  });

  test("wrong nonce length fails", () => {
    const partyId = "party_205";
    const payload = { amount: 100 };
    const encrypted = encryptPayload(MASTER_KEY, partyId, payload);

    encrypted.payload_nonce = "1234";

    expect(() => decryptPayload(MASTER_KEY, encrypted)).toThrow();
  });
});
