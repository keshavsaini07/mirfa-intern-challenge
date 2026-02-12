import crypto from "crypto";
import { TxnSecureRecordType } from "./types";
import { DecryptionError } from "./utils/crypto.error";
import { assertHex, assertLength } from "./utils/crypto.validator";

export function decryptPayload(
  masterKey: Buffer,
  record: TxnSecureRecordType,
): any {
  /* Validate fields */
  assertHex(record.payload_nonce, "payload_nonce");
  assertHex(record.payload_tag, "payload_tag");
  assertHex(record.payload_ct, "payload_ct");

  assertHex(record.dek_wrap_nonce, "dek_wrap_nonce");
  assertHex(record.dek_wrap_tag, "dek_wrap_tag");
  assertHex(record.dek_wrapped, "dek_wrapped");

  /* Convert to Buffers */
  const payloadNonce = Buffer.from(record.payload_nonce, "hex");
  const payloadTag = Buffer.from(record.payload_tag, "hex");
  const payloadCiphertext = Buffer.from(record.payload_ct, "hex");

  const wrapNonce = Buffer.from(record.dek_wrap_nonce, "hex");
  const wrapTag = Buffer.from(record.dek_wrap_tag, "hex");
  const wrappedDek = Buffer.from(record.dek_wrapped, "hex");

  /* Validate lengths */

  assertLength(payloadNonce, 12, "payload_nonce");
  assertLength(payloadTag, 16, "payload_tag");

  assertLength(wrapNonce, 12, "dek_wrap_nonce");
  assertLength(wrapTag, 16, "dek_wrap_tag");

  // Unwrap DEK
  //   const unwrap = crypto.createDecipheriv(
  //     "aes-256-gcm",
  //     masterKey,
  //     Buffer.from(record.dek_wrap_nonce, "hex"),
  //   );

  //   unwrap.setAuthTag(Buffer.from(record.dek_wrap_tag, "hex"));

  //   const dek = Buffer.concat([
  //     unwrap.update(Buffer.from(record.dek_wrapped, "hex")),
  //     unwrap.final(),
  //   ]);

  let dek: Buffer;

  try {
    const unwrap = crypto.createDecipheriv("aes-256-gcm", masterKey, wrapNonce);

    unwrap.setAuthTag(wrapTag);

    dek = Buffer.concat([unwrap.update(wrappedDek), unwrap.final()]);
  } catch {
    throw new DecryptionError();
  }

  try {
    const decipher = crypto.createDecipheriv("aes-256-gcm", dek, payloadNonce);

    decipher.setAuthTag(payloadTag);

    const decrypted = Buffer.concat([
      decipher.update(payloadCiphertext),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString());
  } catch {
    throw new DecryptionError();
  }
}

//  // Decrypt payload
//   const decipher = crypto.createDecipheriv(
//     "aes-256-gcm",
//     dek,
//     Buffer.from(record.payload_nonce, "hex"),
//   );

//   decipher.setAuthTag(Buffer.from(record.payload_tag, "hex"));

//   try {
//     const decrypted = Buffer.concat([
//       decipher.update(Buffer.from(record.payload_ct, "hex")),
//       decipher.final(),
//     ]);

//     return JSON.parse(decrypted.toString());
//   } catch {
//     throw new DecryptionError();
//   }
