import crypto from "crypto";
import { TxnSecureRecordType } from "./types";
import { generateDek, generateId } from "./utils";

export function encryptPayload(
  masterKey: Buffer,
  partyId: string,
  payload: Record<string, unknown>,
): TxnSecureRecordType {
  // generate DEK
  const dek = generateDek();

  // get MK from env
  //   const masterKey = getMasterKey();

  // Encrypt payload with DEK
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", dek, iv);

  const plaintext = Buffer.from(JSON.stringify(payload));
  // generate ciphertext
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  // generate auth tag
  const tag = cipher.getAuthTag();

  // Wrap DEK using master key
  const wrapIv = crypto.randomBytes(12);
  const wrapCipher = crypto.createCipheriv("aes-256-gcm", masterKey, wrapIv);

  const wrappedDek = Buffer.concat([
    wrapCipher.update(dek),
    wrapCipher.final(),
  ]);

  const wrapTag = wrapCipher.getAuthTag();

  return {
    id: generateId(),
    partyId,
    createdAt: new Date().toISOString(),

    payload_nonce: iv.toString("hex"),
    payload_ct: ciphertext.toString("hex"),
    payload_tag: tag.toString("hex"),

    dek_wrap_nonce: wrapIv.toString("hex"),
    dek_wrapped: wrappedDek.toString("hex"),
    dek_wrap_tag: wrapTag.toString("hex"),

    alg: "AES-256-GCM",
    mk_version: 1,
  };
}
