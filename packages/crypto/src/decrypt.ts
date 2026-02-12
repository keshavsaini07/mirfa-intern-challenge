import crypto from "crypto";
import { TxnSecureRecordType } from "./types";
import { getMasterKey } from "./utils";

export function decryptPayload(record: TxnSecureRecordType): any {
  const masterKey = getMasterKey();

  // Unwrap DEK
  const unwrap = crypto.createDecipheriv(
    "aes-256-gcm",
    masterKey,
    Buffer.from(record.dek_wrap_nonce, "hex"),
  );

  unwrap.setAuthTag(Buffer.from(record.dek_wrap_tag, "hex"));

  const dek = Buffer.concat([
    unwrap.update(Buffer.from(record.dek_wrapped, "hex")),
    unwrap.final(),
  ]);

  // Decrypt payload
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    dek,
    Buffer.from(record.payload_nonce, "hex"),
  );

  decipher.setAuthTag(Buffer.from(record.payload_tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(record.payload_ct, "hex")),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString());
}
