import crypto from "crypto";

export function generateId() {
  return crypto.randomUUID();
}

export function generateDek() {
  return crypto.randomBytes(32); // 256-bit
}

// export function getMasterKey(): Buffer {
//   const key = process.env.MASTER_KEY;
//   if (!key) throw new Error("MASTER_KEY not set");
//   return Buffer.from(key, "hex");
// }
